import { Message, TriageResult, UrgencyLevel } from "./types";

// ---------------------------------------------------------------------------
// Parse the structured TRIAGE_ASSESSMENT JSON block from AI text
// ---------------------------------------------------------------------------
const TRIAGE_DELIMITER_RE = /```TRIAGE_ASSESSMENT\s*([\s\S]*?)```/i;

export function parseTriageBlock(content: string): TriageResult | null {
  const match = content.match(TRIAGE_DELIMITER_RE);
  if (!match) return null;

  try {
    const raw = JSON.parse(match[1].trim()) as Record<string, unknown>;

    const urgency = normaliseUrgency(String(raw.urgency ?? ""));

    return {
      status: String(raw.status ?? "Assessment Complete"),
      urgency,
      symptoms: String(raw.symptoms ?? ""),
      summary: String(raw.summary ?? ""),
      possible_explanations: String(raw.possible_explanations ?? ""),
      nextStep: String(raw.recommended_action ?? raw.nextStep ?? ""),
      selfCare: String(raw.self_care ?? raw.selfCare ?? ""),
      warningSigns: String(raw.warning_signs ?? raw.warningSigns ?? ""),
    };
  } catch {
    // JSON parse failed — fall through to legacy parser
    return null;
  }
}

/** Normalise whatever urgency string the model returns to our enum. */
function normaliseUrgency(raw: string): UrgencyLevel {
  const lower = raw.toLowerCase().trim();
  if (lower === "emergency") return "emergency";
  if (lower === "urgent") return "urgent";
  if (lower === "moderate" || lower === "semi-urgent") return "moderate";
  if (lower === "low" || lower === "routine") return "low";
  return null;
}

// ---------------------------------------------------------------------------
// Legacy markdown parser (fallback for older / malformed responses)
// ---------------------------------------------------------------------------
function extractSection(content: string, label: string): string {
  const regex = new RegExp(
    `\\*\\*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[:\\s]*\\*\\*([\\s\\S]*?)(?=\\*\\*|$)`,
    "i"
  );
  const m = content.match(regex);
  return m ? m[1].trim() : "";
}

function detectLegacyUrgency(text: string): UrgencyLevel {
  const lower = text.toLowerCase();
  if (
    lower.includes("emergency") ||
    lower.includes("call 911") ||
    lower.includes("go to the er") ||
    lower.includes("urgency level:** emergency")
  )
    return "emergency";
  if (
    lower.includes("urgency level:** urgent") ||
    lower.includes("see a doctor within 24") ||
    lower.includes("within 24 hours")
  )
    return "urgent";
  if (
    lower.includes("urgency level:** semi-urgent") ||
    lower.includes("within a few days") ||
    lower.includes("semi-urgent") ||
    lower.includes("moderate")
  )
    return "moderate";
  if (
    lower.includes("urgency level:** routine") ||
    lower.includes("self-care") ||
    lower.includes("monitor at home") ||
    lower.includes("urgency level:** low")
  )
    return "low";
  return null;
}

function parseLegacyMarkdown(content: string): TriageResult | null {
  const hasUrgencyHeader =
    content.toLowerCase().includes("urgency level:") ||
    content.toLowerCase().includes("**urgency");
  if (!hasUrgencyHeader) return null;

  const urgency = detectLegacyUrgency(content);

  return {
    status: "Assessment Complete",
    urgency,
    summary:
      extractSection(content, "What this might be") ||
      extractSection(content, "Summary") ||
      content.slice(0, 250),
    nextStep:
      extractSection(content, "Recommended next step") ||
      extractSection(content, "Recommended Next Step"),
    selfCare:
      extractSection(content, "Self-care tips") ||
      extractSection(content, "Self.Care"),
    warningSigns:
      extractSection(content, "Warning signs to watch for") ||
      extractSection(content, "Warning Signs"),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Try JSON block first, then fall back to markdown parsing. */
export function parseTriageResult(content: string): TriageResult | null {
  return parseTriageBlock(content) ?? parseLegacyMarkdown(content);
}

/** Scan message history (newest first) for the most recent triage result. */
export function hasTriage(messages: Message[]): TriageResult | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      const result = parseTriageResult(messages[i].content);
      if (result) return result;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Urgency → display config
// ---------------------------------------------------------------------------
export function urgencyConfig(level: UrgencyLevel) {
  switch (level) {
    case "emergency":
      return {
        label: "Emergency",
        color: "var(--red-urgent)",
        bg: "var(--red-light)",
        border: "#e8a0a0",
        icon: "🚨",
        description: "Seek emergency care immediately. Call 911 or go to the nearest ER.",
      };
    case "urgent":
      return {
        label: "Urgent",
        color: "#b06010",
        bg: "#fff3e0",
        border: "#f0c080",
        icon: "⚠️",
        description: "See a doctor or visit urgent care within 24 hours.",
      };
    case "moderate":
    case "semi-urgent":
      return {
        label: "Moderate",
        color: "var(--amber)",
        bg: "var(--amber-light)",
        border: "#e8c890",
        icon: "🕐",
        description: "Schedule an appointment with your doctor within a few days.",
      };
    case "low":
    case "routine":
      return {
        label: "Low",
        color: "var(--forest-mid)",
        bg: "var(--mint)",
        border: "var(--mint-dark)",
        icon: "✅",
        description: "Self-care is appropriate for now. Monitor your symptoms.",
      };
    default:
      return {
        label: "Assessing",
        color: "var(--charcoal-light)",
        bg: "var(--ivory-dark)",
        border: "#ccc",
        icon: "💬",
        description: "Gathering information to assess your situation.",
      };
  }
}

// ---------------------------------------------------------------------------
// Strip the raw JSON block from a message before display
// (so users see the human-readable text, not the JSON)
// ---------------------------------------------------------------------------
export function stripTriageBlock(content: string): string {
  return content.replace(TRIAGE_DELIMITER_RE, "").trim();
}
