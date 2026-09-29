"use client";

import { useRef, useEffect, useState } from "react";
import {
  Send,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Mic,
  MicOff,
  MapPin,
  ArrowUp,
  FileText,
} from "lucide-react";
import NivaraLogo from "./NivaraLogo";
import { Message, TriageResult } from "@/lib/types";
import { urgencyConfig, stripTriageBlock, isAssessmentOnlyMessage } from "@/lib/utils";
import { ThemeToggle } from "./ThemeProvider";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text?: string) => void;
  onReset: () => void;
  onViewTriage: () => void;
  onFindCare?: () => void;
  triageResult: TriageResult | null;
  error: string | null;
  onRetry: () => void;
  onClearError: () => void;
  canRetry: boolean;
  isFallback: boolean;
}

const QUICK_REPLIES = [
  "Mild",
  "Moderate",
  "Severe",
  "Started today",
  "Getting worse",
  "Yes",
  "No",
];

const STARTERS = [
  "I've had a headache since morning",
  "My throat has been sore for 2 days",
  "I have stomach cramps after eating",
  "I've had a fever since last night",
];

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const displayContent = isUser ? msg.content : stripTriageBlock(msg.content);

  const paragraphs = displayContent
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      const isBullet =
        trimmed.startsWith("•") ||
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ");
      const content = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : line;

      const parts = content.split(/(\*\*[^*]+\*\*)/g);
      const renderedParts = parts.map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="font-semibold text-[var(--text-primary)]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        )
      );

      if (isBullet) {
        return (
          <div
            key={lineIdx}
            className="flex items-start gap-2 my-1 pl-1 text-[13.5px] leading-relaxed"
          >
            <span
              className="text-xs mt-1"
              style={{ color: isUser ? "var(--accent)" : "var(--accent)" }}
            >
              •
            </span>
            <span className="flex-1">{renderedParts}</span>
          </div>
        );
      }

      return (
        <p
          key={lineIdx}
          className="my-1.5 leading-relaxed text-[14px]"
          style={{
            color: isUser ? "var(--botanical-contrast)" : "var(--text-primary)",
          }}
        >
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end animate-slide-right" : "justify-start animate-slide-left"} mb-4`}
    >
      <div
        style={{
          maxWidth: isUser ? "80%" : "85%",
          backgroundColor: isUser ? "var(--botanical)" : "var(--surface)",
          color: isUser ? "var(--botanical-contrast)" : "var(--text-primary)",
          border: isUser ? "1px solid var(--botanical)" : "1px solid var(--border)",
          borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          padding: "12px 16px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {/* Label for assistant messages */}
        {!isUser && (
          <div
            className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
            style={{ color: "var(--accent)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span>Nivara</span>
          </div>
        )}

        {paragraphs.length > 0 ? (
          paragraphs.map((p, pIdx) => (
            <div key={pIdx}>
              {renderFormattedText(p)}
            </div>
          ))
        ) : (
          <p className="m-0 opacity-50">—</p>
        )}

        <div
          className="text-[10px] mt-1.5 font-mono text-right"
          style={{
            color: isUser ? "rgba(247, 245, 238, 0.6)" : "var(--text-muted)",
          }}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-lg border text-xs"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
          borderRadius: "12px 12px 12px 2px",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
        <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
          Nivara is synthesizing…
        </span>
      </div>
    </div>
  );
}

export default function ChatInterface({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onReset,
  onViewTriage,
  onFindCare,
  triageResult,
  error,
  onRetry,
  onClearError,
  canRetry,
  isFallback,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Speech Recognition state (browser-native, zero dependencies)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<{ stop: () => void; start: () => void } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as {
        SpeechRecognition?: new () => any;
        webkitSpeechRecognition?: new () => any;
      };
      if (win.SpeechRecognition || win.webkitSpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const win = window as unknown as {
        SpeechRecognition?: new () => any;
        webkitSpeechRecognition?: new () => any;
      };
      const RecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (!RecognitionClass) return;

      const recognition = new RecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: { results: ArrayLike<{ 0?: { transcript?: string } }> }) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0]?.transcript || "")
          .join("");
        if (transcript) {
          onInputChange(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, triageResult]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) onSend();
    }
  };

  const urgency = triageResult?.urgency ? urgencyConfig(triageResult.urgency) : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* ── Global Unified Header ── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="max-w-5xl mx-auto h-full px-5 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NivaraLogo size={22} />
            {isFallback && (
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded uppercase tracking-wider"
                style={{
                  backgroundColor: "var(--urgency-mod-bg)",
                  color: "var(--urgency-mod)",
                  border: "1px solid var(--urgency-mod-border)",
                }}
              >
                Demo Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {triageResult && (
              <button
                id="view-triage-btn"
                type="button"
                onClick={onViewTriage}
                className="interactive-tap inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md"
                style={{
                  backgroundColor: urgency?.bg ?? "var(--accent-soft)",
                  color: urgency?.color ?? "var(--accent)",
                  border: `1px solid ${urgency?.border ?? "var(--accent-border)"}`,
                }}
              >
                <FileText size={13} />
                <span>View Summary</span>
                <ChevronRight size={12} />
              </button>
            )}

            <button
              id="reset-chat-btn"
              type="button"
              onClick={onReset}
              title="Start a new symptom assessment"
              className="interactive-tap inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              }}
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">New assessment</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Chat Messages Stream (Aligned max-w-2xl) ── */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
        <div className="max-w-2xl mx-auto w-full">
          {/* Empty State / Conversation Starter */}
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-in-up">
              <div
                className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-3"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--accent)",
                }}
              >
                <NivaraLogo size={18} showWordmark={false} />
              </div>
              <h2 className="font-serif text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                How can Nivara help you today?
              </h2>
              <p className="text-xs max-w-md mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
                Describe any symptom, pain, or health question in plain words.
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSend(s)}
                    className="interactive-tap text-xs font-medium px-3 py-1.5 rounded-md"
                    style={{
                      backgroundColor: "var(--surface)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg) =>
            // Suppress the bubble entirely when an assistant message contains
            // ONLY a TRIAGE_ASSESSMENT (empty conversational text after strip)
            // or the known auto-generated assessment-completion filler sentence.
            msg.role === "assistant" && isAssessmentOnlyMessage(msg.content) ? null : (
              <MessageBubble key={msg.id} msg={msg} />
            )
          )}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error Banner */}
          {error && (
            <div
              className="flex items-center gap-3 p-3.5 mb-4 rounded-lg border text-xs"
              style={{
                backgroundColor: "var(--urgency-emg-bg)",
                borderColor: "var(--urgency-emg-border)",
                color: "var(--urgency-emg)",
              }}
            >
              <AlertTriangle size={15} className="shrink-0" />
              <span className="flex-1 leading-relaxed">{error}</span>
              {canRetry && (
                <button
                  id="retry-btn"
                  type="button"
                  onClick={onRetry}
                  className="interactive-tap font-semibold px-2.5 py-1 rounded border text-xs shrink-0"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--urgency-emg-border)",
                    color: "var(--urgency-emg)",
                  }}
                >
                  <RefreshCw size={12} className="inline mr-1" />
                  Retry
                </button>
              )}
              <button
                type="button"
                onClick={onClearError}
                className="opacity-70 hover:opacity-100 text-xs shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Completed Assessment Resolution Banner */}
          {triageResult && !error && (
            <div
              id="completed-triage-card"
              className="mt-6 mb-6 p-4 rounded-lg border shadow-sm animate-fade-in-up"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: urgency?.border ?? "var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: urgency?.bg ?? "var(--accent-soft)",
                    color: urgency?.color ?? "var(--accent)",
                  }}
                >
                  {urgency?.label ?? "Assessing"} Priority
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                  Clinical Evaluation Complete
                </span>
              </div>

              <div className="font-serif text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {triageResult.nextStep || "Recommended next step ready"}
              </div>

              <p className="text-xs leading-relaxed mb-3.5" style={{ color: "var(--text-secondary)" }}>
                {triageResult.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={onViewTriage}
                  className="interactive-tap inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md"
                  style={{
                    backgroundColor: "var(--botanical)",
                    color: "var(--botanical-contrast)",
                  }}
                >
                  <span>Open Assessment Guidance</span>
                  <ChevronRight size={13} />
                </button>

                {onFindCare && (
                  <button
                    type="button"
                    onClick={onFindCare}
                    className="interactive-tap inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    }}
                  >
                    <MapPin size={13} />
                    <span>Find Facilities by PIN</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Fixed Chat Input Container (Aligned max-w-2xl) ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg)",
          padding: "12px 20px 16px",
        }}
      >
        <div className="max-w-2xl mx-auto w-full">
          {/* Quick Contextual Replies */}
          {messages.length > 0 && !triageResult && !isLoading && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-1 scrollbar-none">
              <span
                className="text-[10.5px] uppercase font-bold tracking-wider mr-1 shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                Quick:
              </span>
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onSend(r)}
                  disabled={isLoading}
                  className="interactive-tap text-xs font-medium px-2.5 py-1 rounded-md shrink-0"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Voice listening indicator */}
          {isListening && (
            <div
              className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: "var(--accent-soft)",
                color: "var(--accent)",
                border: "1px solid var(--accent-border)",
              }}
            >
              <div className="flex items-center gap-0.5 h-3">
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
                <div className="voice-wave-bar" />
              </div>
              <span>Listening… speak your symptom</span>
            </div>
          )}

          {/* Input Box */}
          <div
            className="flex items-end gap-2 p-2 rounded-xl border shadow-xs"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isLoading
                  ? "Nivara is responding…"
                  : triageResult
                  ? "Ask any question about this assessment…"
                  : "Describe your symptoms (e.g. sharp headache since morning)…"
              }
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] leading-relaxed p-1.5"
              style={{
                color: "var(--text-primary)",
                maxHeight: 120,
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />

            {/* Voice Input Button */}
            {speechSupported && (
              <button
                type="button"
                id="voice-input-btn"
                onClick={toggleListening}
                disabled={isLoading}
                title={isListening ? "Stop listening" : "Speak your message"}
                className="interactive-tap w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isListening ? "var(--accent-soft)" : "transparent",
                  color: isListening ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {/* Send Button */}
            <button
              id="send-message-btn"
              type="button"
              onClick={() => onSend()}
              disabled={isLoading || !input.trim()}
              title="Send message (Enter)"
              className="interactive-tap w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: input.trim() && !isLoading ? "var(--botanical)" : "var(--bg-subtle)",
                color: input.trim() && !isLoading ? "var(--botanical-contrast)" : "var(--text-muted)",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              }}
            >
              <ArrowUp size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] mt-2 px-1" style={{ color: "var(--text-muted)" }}>
            <span>Shift + Enter for new line</span>
            <span>Emergency in India? Call <strong>112</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
