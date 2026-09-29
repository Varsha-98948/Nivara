export type UrgencyLevel =
  | "emergency"
  | "urgent"
  | "moderate"
  | "low"
  | "semi-urgent"
  | "routine"
  | null;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface TriageResult {
  /** Canonical urgency level */
  urgency: UrgencyLevel;
  /** One-line status label e.g. "Assessment Complete" */
  status: string;
  /** Short paragraph summary of the situation */
  summary: string;
  /** Comma-separated or array-stringified symptom list */
  symptoms?: string;
  /** Possible medical explanations (not diagnoses) */
  possible_explanations?: string;
  /** Recommended next action */
  nextStep: string;
  /** Self-care tips */
  selfCare?: string;
  /** Warning signs to watch for */
  warningSigns?: string;
}

export type AppView = "welcome" | "chat" | "triage" | "finder";
