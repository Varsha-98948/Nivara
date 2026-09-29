import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/** Current production model — update here if Google deprecates again */
const GEMINI_MODEL = "gemini-3.8-flash";

// ---------------------------------------------------------------------------
// System prompt — health triage assistant
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are Nivara, a calm, empathetic AI health triage and care-navigation assistant. You are NOT a doctor and you NEVER diagnose.

## YOUR JOB
Help users understand their symptoms, assess urgency, and navigate to the right care.

## CONVERSATION BEHAVIOUR
- Greet warmly on the first message and acknowledge what the user described.
- Ask ONE concise follow-up question per turn. Never fire multiple questions at once.
- Focus questions on: severity (1–10), onset/duration, associated symptoms (fever, nausea, etc.), relevant history, medications, and whether anything makes it better or worse.
- After 3–5 exchanges, or sooner if the picture is clear, decide you have enough information and produce the final triage assessment.
- If the user explicitly asks for a summary or assessment at any point, provide it immediately.
- If symptoms suggest a medical emergency (sudden severe chest pain, stroke signs — face drooping, arm weakness, speech difficulty, difficulty breathing, signs of anaphylaxis, loss of consciousness, severe bleeding), STOP the questioning immediately, warn the user clearly, and embed TRIAGE_ASSESSMENT in the same response.

## SAFETY RULES (NON-NEGOTIABLE)
- Never claim a definitive diagnosis. Use: "Based on what you've described…", "Possible explanations may include…", "This may be consistent with…".
- Never say "you have [disease]".
- Never prescribe medications or dosages. You may mention generic over-the-counter categories (e.g., "a pain reliever") without naming specific drugs or doses.
- Never provide false reassurance. If symptoms could be serious, say so calmly.
- Always distinguish possible explanations from diagnosis.
- Always include: "Remember, Nivara does not replace a qualified healthcare professional."

## TRIAGE ASSESSMENT FORMAT
When you have enough information, include the following JSON block EXACTLY as shown, embedded in your message. Always wrap it between the exact delimiters. Continue with a short human-readable summary after the JSON block.

\`\`\`TRIAGE_ASSESSMENT
{
  "status": "Assessment Complete",
  "urgency": "low" | "moderate" | "urgent" | "emergency",
  "symptoms": "brief comma-separated list of reported symptoms",
  "summary": "2–3 sentence plain-language summary of what the user described and the overall picture",
  "possible_explanations": "2–4 possible explanations (not diagnoses), each on its own line starting with '•'",
  "recommended_action": "specific next step the user should take",
  "self_care": "practical self-care advice if urgency is low or moderate, otherwise omit or keep brief",
  "warning_signs": "bullet list of red-flag symptoms that should prompt immediate care"
}
\`\`\`

Urgency definitions:
- "emergency": life-threatening symptoms — call 911 / go to ER immediately
- "urgent": needs evaluation within 24 hours
- "moderate": should see a doctor within a few days
- "low": self-care appropriate; monitor at home

After the JSON block, add 1–2 warm closing sentences. For emergency urgency, lead with a clear urgent-care instruction before the JSON.`;

// ---------------------------------------------------------------------------
// Deterministic fallback (no API key)
// ---------------------------------------------------------------------------
const FALLBACK_TURNS: { keywords: string[]; response: string }[] = [
  {
    keywords: [],
    response:
      "Hi, I'm Nivara — your health triage assistant. I'm currently running in **demo mode** (no AI key configured), so my responses are pre-scripted. To enable the full AI experience, add your Gemini API key.\n\nThat said, I'd love to hear what you're experiencing. Can you describe your main symptom?",
  },
  {
    keywords: ["head", "headache", "migraine"],
    response:
      "I hear you — headaches can be really uncomfortable. On a scale of 1 to 10, how would you rate the pain right now? And did it come on gradually or suddenly?",
  },
  {
    keywords: ["throat", "sore", "swallow"],
    response:
      "A sore throat can have several causes. Do you have a fever along with it, or any white patches you can see in the back of your throat?",
  },
  {
    keywords: ["fever", "temperature", "hot"],
    response:
      "Thanks for mentioning that. How high is the fever — do you know the reading? And how long have you had it?",
  },
  {
    keywords: ["chest", "heart", "breath", "breathing"],
    response:
      "Chest discomfort combined with difficulty breathing can sometimes indicate something that needs prompt attention. Are you experiencing pain, pressure, or tightness in the chest right now? Does it radiate to your arm, jaw, or neck? **If your symptoms feel severe, please call 911 immediately.**",
  },
];

function getFallbackResponse(history: { role: string; content: string }[]): string {
  const lastUserMsg = [...history].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) return FALLBACK_TURNS[0].response;

  const lower = lastUserMsg.content.toLowerCase();

  // After 4+ user messages in demo mode, produce a fake triage assessment
  const userTurns = history.filter((m) => m.role === "user").length;
  if (userTurns >= 4) {
    return `Based on what you've described, I've gathered enough information to give you a general picture.

\`\`\`TRIAGE_ASSESSMENT
{
  "status": "Assessment Complete",
  "urgency": "moderate",
  "symptoms": "as described in conversation (demo mode)",
  "summary": "This is a demonstration response. In real usage, Nivara would analyse your specific symptoms and conversation history using Gemini AI to produce a personalised assessment. Based on what you described, a moderate-urgency evaluation is shown here as an example.",
  "possible_explanations": "• Demo explanation 1 — real AI would list plausible causes here\\n• Demo explanation 2 — based on your specific reported symptoms\\n• Demo explanation 3 — considering your described history",
  "recommended_action": "This is demo mode. Please add your GEMINI_API_KEY to .env.local to receive a real AI-powered assessment.",
  "self_care": "Stay hydrated, rest, and monitor your symptoms. Track any changes.",
  "warning_signs": "• Symptoms suddenly worsen\\n• You develop fever above 39°C / 102°F\\n• Chest pain or difficulty breathing\\n• Confusion or loss of consciousness"
}
\`\`\`

Remember, Nivara does not replace a qualified healthcare professional. **This is a demo response** — add your API key for real AI analysis.`;
  }

  for (const turn of FALLBACK_TURNS.slice(1)) {
    if (turn.keywords.some((kw) => lower.includes(kw))) {
      return turn.response;
    }
  }

  return "Thank you for sharing that. Can you tell me a bit more — when did this start, and has anything made it better or worse?";
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
interface IncomingMessage {
  role: string;
  content: string;
}

function validateMessages(messages: unknown): IncomingMessage[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Invalid messages array");
  }
  return messages.map((m, i) => {
    if (
      typeof m !== "object" ||
      m === null ||
      typeof (m as Record<string, unknown>).role !== "string" ||
      typeof (m as Record<string, unknown>).content !== "string"
    ) {
      throw new Error(`Invalid message at index ${i}`);
    }
    return m as IncomingMessage;
  });
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  let messages: IncomingMessage[];

  // --- Parse & validate body ---
  try {
    const body = await req.json();
    messages = validateMessages(body.messages);
  } catch {
    return NextResponse.json(
      { error: "Your message could not be processed. Please try again." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // --- Fallback mode (no API key) ---
  if (!apiKey) {
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const fallback = getFallbackResponse(history);
    return NextResponse.json({
      content: fallback,
      fallback: true,
    });
  }

  // --- Gemini call (with retry for transient 503 overload) ---
  console.log(`[Nivara] API key present: ${!!apiKey} | Key length: ${apiKey.length}`);
  console.log(`[Nivara] Using model: ${GEMINI_MODEL} | Messages in history: ${messages.length}`);

  const ai = new GoogleGenAI({ apiKey });

  // Build history (all messages except the last one)
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const MAX_RETRIES = 2;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const chat = ai.chats.create({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.65,
          maxOutputTokens: 1200,
        },
        history,
      });

      const response = await chat.sendMessage({
        message: lastMessage.content,
      });

      const text = response.text;

      if (!text || typeof text !== "string") {
        throw new Error("Empty or unparseable response from AI");
      }

      console.log(`[Nivara] Gemini responded OK (attempt ${attempt + 1}), length: ${text.length}`);
      return NextResponse.json({ content: text, fallback: false });

    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isOverloaded =
        msg.includes("503") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("overload") ||
        msg.includes("high demand");

      console.error(`[Nivara] Gemini attempt ${attempt + 1} failed:`, msg.slice(0, 300));

      if (isOverloaded && attempt < MAX_RETRIES) {
        // Exponential backoff: attempt 0 -> 1500ms, attempt 1 -> 3000ms
        const delay = 1500 * Math.pow(2, attempt);
        console.log(`[Nivara] Retrying in ${delay}ms (retry ${attempt + 1}/${MAX_RETRIES})…`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // Non-retryable or retries exhausted
      break;
    }
  }

  // All attempts exhausted — classify the error
  const errMsg = lastError instanceof Error ? lastError.message : String(lastError);
  console.error("[Nivara] All Gemini attempts failed. Final error:", errMsg.slice(0, 400));

  const is503OrOverloaded =
    errMsg.includes("503") ||
    errMsg.includes("overload") ||
    errMsg.includes("UNAVAILABLE") ||
    errMsg.includes("high demand");

  if (is503OrOverloaded) {
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const fallbackText = getFallbackResponse(history);
    console.log("[Nivara] Gemini 503/high-demand: returning safe fallback response.");
    return NextResponse.json({
      content: `*(The live AI service is currently experiencing high demand. Nivara is temporarily providing guidance in demo/fallback mode.)*\n\n${fallbackText}`,
      fallback: true,
    });
  }

  if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("401") || errMsg.includes("API key")) {
    return NextResponse.json(
      { error: "Nivara's AI service could not authenticate. Please check that your API key is valid." },
      { status: 503 }
    );
  }
  if (errMsg.includes("404") || errMsg.includes("no longer available") || errMsg.includes("NOT_FOUND")) {
    return NextResponse.json(
      { error: "The AI model is unavailable. Please contact support or try again later." },
      { status: 503 }
    );
  }
  if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
    return NextResponse.json(
      { error: "The AI service is over its usage limit right now. Please try again in a few minutes." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: "Nivara couldn't get a response right now. Please try again in a moment." },
    { status: 503 }
  );
}
