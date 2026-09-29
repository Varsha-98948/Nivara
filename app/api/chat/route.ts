import { NextRequest, NextResponse } from "next/server";

/** OpenRouter production model */
const OPENROUTER_MODEL = "openrouter/free";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ---------------------------------------------------------------------------
// System prompt — health triage assistant
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are Nivara, a calm, empathetic AI health triage and care-navigation assistant designed specifically for users in India. You are NOT a doctor and you NEVER diagnose.

## YOUR JOB
Help users understand their symptoms, assess urgency, and navigate to the right care in India.

## CONVERSATION BEHAVIOUR
- Greet warmly on the first message and acknowledge what the user described.
- Ask ONE concise follow-up question per turn. Never fire multiple questions at once.
- Focus questions on: severity (1–10), onset/duration, associated symptoms (fever, nausea, etc.), relevant history, medications, and whether anything makes it better or worse.
- After 3–5 exchanges, or sooner if the picture is clear, decide you have enough information and produce the final triage assessment.
- If the user explicitly asks for a summary or assessment at any point, provide it immediately.
- If symptoms suggest a potential medical emergency (sudden severe chest pain, stroke signs — face drooping, arm weakness, speech difficulty, difficulty breathing, signs of anaphylaxis, loss of consciousness, severe bleeding):
  * STOP questioning immediately. Do NOT delay emergency care by continuing a long conversational interview.
  * Clearly advise immediate professional emergency care: "If this may be an emergency, seek immediate medical attention. Call 112 or go to the nearest emergency department."
  * Embed TRIAGE_ASSESSMENT in the same response with urgency set to "emergency".

## SAFETY RULES (NON-NEGOTIABLE)
- Nivara is designed for users in India. NEVER recommend the US emergency number 911. Never invent an emergency number.
- Use India's unified emergency number 112 as the primary emergency number.
- Mention ambulance / emergency medical services (such as 108 / 102) where appropriate, without presenting uncertain regional availability as universal.
- Encourage going to the nearest emergency department or hospital casualty immediately when emergency care is warranted.
- Do not delay emergency care by continuing a long conversational interview.
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
- "emergency": life-threatening symptoms — call 112 or go to the nearest emergency department immediately
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
      "Hi, I'm Nivara — your health triage assistant. I'm currently running in **demo mode** (no AI key configured), so my responses are pre-scripted. To enable the full AI experience, add your OPENROUTER_API_KEY.\n\nThat said, I'd love to hear what you're experiencing. Can you describe your main symptom?",
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
      "Chest discomfort combined with difficulty breathing can sometimes indicate something that needs prompt attention. Are you experiencing pain, pressure, or tightness in the chest right now? Does it radiate to your arm, jaw, or neck? **If your symptoms feel severe, seek immediate medical attention. Call 112 or go to the nearest emergency department.**",
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
  "summary": "This is a demonstration response. In real usage, Nivara would analyse your specific symptoms and conversation history using OpenRouter AI to produce a personalised assessment. Based on what you described, a moderate-urgency evaluation is shown here as an example.",
  "possible_explanations": "• Demo explanation 1 — real AI would list plausible causes here\\n• Demo explanation 2 — based on your specific reported symptoms\\n• Demo explanation 3 — considering your described history",
  "recommended_action": "This is demo mode. Please add your OPENROUTER_API_KEY to .env.local to receive a real AI-powered assessment.",
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
// Server-side response sanitization
// Strip provider/model metadata that must never reach the user.
// ---------------------------------------------------------------------------
function sanitizeModelResponse(text: string): string {
  // Patterns that identify pure provider/model metadata lines.
  // Matched against each trimmed line individually — legitimate medical text
  // containing words like "safety", "safe", or "response" is never affected.
  const METADATA_LINE_PATTERNS: RegExp[] = [
    // "User Safety: safe", "Response Safety: safe", "Content Safety: low", etc.
    /^(?:User Safety|Response Safety|Content Safety|Safety Rating|Safety)\s*:\s*\S+\s*$/i,
    // Bare model self-identification line, e.g. a standalone "Nivara" prefix
    /^Nivara\s*$/i,
  ];

  const lines = text.split("\n");
  const filtered = lines.filter(
    (line) => !METADATA_LINE_PATTERNS.some((pat) => pat.test(line.trim()))
  );

  return filtered
    .join("\n")
    // Collapse excess blank lines created by removed metadata lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

  const apiKey = process.env.OPENROUTER_API_KEY;

  // --- Fallback mode (no API key) ---
  if (!apiKey) {
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const fallback = getFallbackResponse(history);
    return NextResponse.json({
      content: fallback,
      fallback: true,
    });
  }

  // Build full message thread with system prompt
  const openRouterMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const MAX_RETRIES = 2;
  let lastError: unknown;
  let lastStatus = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://nivara.health",
          "X-Title": "Nivara Health Assistant",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: openRouterMessages,
          temperature: 0.65,
          max_tokens: 1200,
        }),
      });

      lastStatus = response.status;

      if (!response.ok) {
        let errorDetail = "";
        try {
          const errData = await response.json();
          errorDetail = errData?.error?.message || response.statusText;
        } catch {
          errorDetail = response.statusText;
        }
        throw new Error(`OpenRouter HTTP ${response.status}: ${errorDetail}`);
      }

      const data = await response.json();
      const rawText = data.choices?.[0]?.message?.content;

      if (!rawText || typeof rawText !== "string") {
        throw new Error("Empty or unparseable response from AI provider");
      }

      const text = sanitizeModelResponse(rawText);

      // If sanitization consumed the entire message, something is wrong — use raw
      const finalText = text.length > 0 ? text : rawText.trim();

      return NextResponse.json({ content: finalText, fallback: false });

    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isRetryable =
        lastStatus === 429 ||
        lastStatus === 502 ||
        lastStatus === 503 ||
        lastStatus === 504 ||
        msg.includes("503") ||
        msg.includes("502") ||
        msg.includes("overload") ||
        msg.includes("rate limit") ||
        msg.includes("fetch failed");

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = 1500 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      // Non-retryable or retries exhausted
      break;
    }
  }

  // All attempts exhausted — classify error safely without leaking keys
  const errMsg = lastError instanceof Error ? lastError.message : String(lastError);

  if (lastStatus === 401 || lastStatus === 403 || errMsg.includes("401") || errMsg.includes("403")) {
    return NextResponse.json(
      { error: "Nivara's AI service could not authenticate. Please check that your API key is valid." },
      { status: 503 }
    );
  }

  if (lastStatus === 429 || errMsg.includes("429") || errMsg.includes("rate limit") || errMsg.includes("quota")) {
    return NextResponse.json(
      { error: "The AI service is over its usage limit right now. Please try again in a few minutes." },
      { status: 503 }
    );
  }

  // For temporary provider overload, provide safe guided fallback response
  if (
    lastStatus === 502 ||
    lastStatus === 503 ||
    lastStatus === 504 ||
    errMsg.includes("502") ||
    errMsg.includes("503") ||
    errMsg.includes("504") ||
    errMsg.includes("overload")
  ) {
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const fallbackText = getFallbackResponse(history);
    return NextResponse.json({
      content: `*(The live AI service is currently experiencing high demand. Nivara is temporarily providing guidance in demo/fallback mode.)*\n\n${fallbackText}`,
      fallback: true,
    });
  }

  return NextResponse.json(
    { error: "Nivara couldn't get a response right now. Please try again in a moment." },
    { status: 503 }
  );
}
