import { Message, TriageResult, UrgencyLevel } from "./types";

// ---------------------------------------------------------------------------
// Parse the structured TRIAGE_ASSESSMENT JSON block from AI text
// ---------------------------------------------------------------------------
export function parseTriageBlock(content: string): TriageResult | null {
  if (!content) return null;

  // 1. Try matching ```TRIAGE_ASSESSMENT ... ``` or ```json ... ``` or ``` ... ```
  const blockMatch =
    content.match(/```(?:TRIAGE_ASSESSMENT|json)?\s*([\s\S]*?)```/i) ||
    content.match(/TRIAGE_ASSESSMENT[:\s]*([\s\S]*?)(?=\n\n|$)/i);

  let jsonCandidate = blockMatch ? blockMatch[1].trim() : "";

  // 2. If no fenced block, search for an unfenced JSON object containing triage fields
  if (!jsonCandidate || !jsonCandidate.includes("{")) {
    const rawObjectMatch = content.match(/(\{[\s\S]*?"(?:status|urgency)"[\s\S]*?\})/i);
    if (rawObjectMatch) {
      jsonCandidate = rawObjectMatch[1].trim();
    }
  }

  if (jsonCandidate) {
    // Clean up potential leading/trailing non-JSON artifacts
    const start = jsonCandidate.indexOf("{");
    const end = jsonCandidate.lastIndexOf("}");
    if (start !== -1 && end > start) {
      jsonCandidate = jsonCandidate.slice(start, end + 1);
    }

    try {
      const raw = JSON.parse(jsonCandidate) as Record<string, unknown>;
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
    }
  }

  return null;
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
    lower.includes("call 112") ||
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
        color: "var(--urgency-emg)",
        bg: "var(--urgency-emg-bg)",
        border: "var(--urgency-emg-border)",
        icon: "🚨",
        description: "Seek emergency care immediately. Call 112 or go to the nearest emergency department.",
      };
    case "urgent":
      return {
        label: "Urgent",
        color: "var(--urgency-urgent)",
        bg: "var(--urgency-urgent-bg)",
        border: "var(--urgency-urgent-border)",
        icon: "⚠️",
        description: "See a doctor or visit urgent care within 24 hours.",
      };
    case "moderate":
    case "semi-urgent":
      return {
        label: "Moderate",
        color: "var(--urgency-mod)",
        bg: "var(--urgency-mod-bg)",
        border: "var(--urgency-mod-border)",
        icon: "🕐",
        description: "Schedule an appointment with your doctor within a few days.",
      };
    case "low":
    case "routine":
      return {
        label: "Low",
        color: "var(--urgency-low)",
        bg: "var(--urgency-low-bg)",
        border: "var(--urgency-low-border)",
        icon: "✅",
        description: "Self-care is appropriate for now. Monitor your symptoms.",
      };
    default:
      return {
        label: "Assessing",
        color: "var(--text-secondary)",
        bg: "var(--bg-subtle)",
        border: "var(--border)",
        icon: "💬",
        description: "Gathering information to assess your situation.",
      };
  }
}

/**
 * Remove all visible manifestations of the internal TRIAGE_ASSESSMENT JSON protocol,
 * including fenced blocks, raw JSON objects, markdown headers, and unclosed delimiters.
 */
export function stripTriageBlock(content: string): string {
  if (!content) return "";

  // --- Defensive: strip any provider/model safety metadata that slipped through ---
  // Uses line-by-line filter: only removes lines that are purely metadata labels.
  // Legitimate medical text containing "safety", "safe", "response" is unaffected.
  const META_PATTERNS: RegExp[] = [
    /^(?:User Safety|Response Safety|Content Safety|Safety Rating|Safety)\s*:\s*\S+\s*$/i,
    /^Nivara\s*$/i,
  ];
  const preFiltered = content
    .split("\n")
    .filter((line) => !META_PATTERNS.some((pat) => pat.test(line.trim())))
    .join("\n");

  let cleaned = preFiltered
    // Remove fenced TRIAGE_ASSESSMENT blocks (even unclosed)
    .replace(/```TRIAGE_ASSESSMENT[\s\S]*?(?:```|$)/gi, "")
    // Remove fenced json blocks containing triage fields
    .replace(/```json\s*\{[\s\S]*?"(?:urgency|status)"[\s\S]*?(?:```|$)/gi, "")
    // Remove any code block containing triage fields
    .replace(/```[\s\S]*?"(?:status|urgency)"\s*:[\s\S]*?(?:```|$)/gi, "")
    // Remove TRIAGE_ASSESSMENT prefixes followed by JSON
    .replace(/TRIAGE_ASSESSMENT\s*:\s*\{[\s\S]*?\}/gi, "")
    .replace(/TRIAGE_ASSESSMENT\s*\{[\s\S]*?\}/gi, "")
    // Remove any remaining TRIAGE_ASSESSMENT marker lines
    .replace(/^.*TRIAGE_ASSESSMENT.*$/gim, "")
    // Remove unfenced raw JSON objects containing triage assessment fields
    .replace(/\{\s*"(?:status|urgency)"[\s\S]*?"(?:recommended_action|warning_signs|self_care|possible_explanations|symptoms|summary)"[\s\S]*?\}/gi, "")
    .replace(/\{[\s\S]*?"status"\s*:\s*"Assessment Complete"[\s\S]*?\}/gi, "")
    // Clean up empty code fences
    .replace(/```\s*```/g, "")
    // Collapse excess blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // If the entire message was only the internal JSON block, return empty so
  // the caller can decide whether to render a bubble at all.
  if (!cleaned) {
    return "";
  }

  return cleaned;
}

/**
 * Returns true when the assistant content (after stripping the TRIAGE_ASSESSMENT block)
 * contains no meaningful conversational text for the user — i.e. it is either
 * empty or is only one of the known auto-generated assessment-completion fillers.
 *
 * Deliberately narrow: only matches exact known patterns, not any sentence
 * containing words like "assessment", "summary", or "care".
 */
export function isAssessmentOnlyMessage(rawContent: string): boolean {
  // Must contain a triage block to be considered an assessment message
  const hasTriage =
    /```TRIAGE_ASSESSMENT/i.test(rawContent) ||
    /"status"\s*:\s*"Assessment Complete"/i.test(rawContent);
  if (!hasTriage) return false;

  const stripped = stripTriageBlock(rawContent);

  // Empty after stripping → nothing meaningful to show
  if (!stripped) return true;

  // The one known auto-generated filler sentence (the old fallback text)
  const FILLER_PATTERNS = [
    /^I have completed your health triage assessment\.?\s*/i,
    /^Your health triage assessment (is|has been) complete\.?\s*/i,
    /^Assessment complete\.?\s*You can review/i,
  ];
  const strippedClean = stripped.trim();
  return FILLER_PATTERNS.some((p) => p.test(strippedClean) && strippedClean.replace(p, "").trim() === "");
}
