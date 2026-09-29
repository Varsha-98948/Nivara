"use client";

import { useRef, useEffect, useState } from "react";
import {
  Send,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Info,
  Mic,
  MicOff,
  User,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import NivaraLogo from "./NivaraLogo";
import { Message, TriageResult } from "@/lib/types";
import { urgencyConfig, stripTriageBlock } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: (text?: string) => void;
  onReset: () => void;
  onViewTriage: () => void;
  triageResult: TriageResult | null;
  error: string | null;
  onRetry: () => void;
  onClearError: () => void;
  canRetry: boolean;
  isFallback: boolean;
}

// ---------------------------------------------------------------------------
// Contextual suggestion chips
// ---------------------------------------------------------------------------
const QUICK_REPLIES = [
  "Mild",
  "Moderate",
  "Severe",
  "Yes",
  "No",
  "Not sure",
  "Getting worse",
  "Started today",
];

// ---------------------------------------------------------------------------
// MessageBubble — renders one chat message with calm typography & visual hierarchy
// ---------------------------------------------------------------------------
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  // Strip raw JSON block before displaying AI messages
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
          <strong key={j} style={{ fontWeight: 600 }}>
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
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              margin: "3px 0",
              paddingLeft: 4,
            }}
          >
            <span
              style={{
                color: isUser ? "var(--mint)" : "var(--forest)",
                fontSize: 13,
                marginTop: 2,
              }}
            >
              •
            </span>
            <span style={{ flex: 1 }}>{renderedParts}</span>
          </div>
        );
      }

      return (
        <p
          key={lineIdx}
          style={{
            margin: lineIdx === 0 ? "0 0 4px" : "4px 0",
            lineHeight: 1.65,
          }}
        >
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={isUser ? "animate-slide-right" : "animate-slide-left"}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 18,
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--mint)",
            border: "1.5px solid var(--mint-dark)",
            color: "var(--forest)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: 2,
            boxShadow: "0 1px 3px rgba(30,77,53,0.08)",
          }}
        >
          <HeartPulse size={16} strokeWidth={2.2} />
        </div>
      )}

      <div
        style={{
          maxWidth: isUser ? "78%" : "82%",
          padding: isUser ? "12px 18px" : "15px 20px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
          background: isUser ? "var(--forest)" : "var(--white)",
          color: isUser ? "var(--white)" : "var(--charcoal)",
          border: isUser ? "none" : "1px solid var(--mint-dark)",
          boxShadow: isUser
            ? "0 2px 8px rgba(30,77,53,0.18)"
            : "var(--shadow-sm)",
          wordBreak: "break-word",
          fontSize: 14.5,
        }}
      >
        {paragraphs.length > 0 ? (
          paragraphs.map((p, pIdx) => (
            <div
              key={pIdx}
              style={{ marginBottom: pIdx < paragraphs.length - 1 ? 10 : 0 }}
            >
              {renderFormattedText(p)}
            </div>
          ))
        ) : (
          <p style={{ margin: 0, opacity: 0.5 }}>—</p>
        )}
        <div
          style={{
            fontSize: 10.5,
            opacity: isUser ? 0.75 : 0.5,
            marginTop: 6,
            textAlign: isUser ? "right" : "left",
            letterSpacing: "0.02em",
          }}
        >
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--forest)",
            color: "var(--white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: 2,
            boxShadow: "0 2px 6px rgba(30,77,53,0.2)",
          }}
        >
          <User size={15} strokeWidth={2.2} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Polished Typing indicator (calm pulsing status)
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--mint)",
          border: "1.5px solid var(--mint-dark)",
          color: "var(--forest)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 1px 3px rgba(30,77,53,0.08)",
        }}
      >
        <HeartPulse size={16} strokeWidth={2.2} />
      </div>
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--mint-dark)",
          borderRadius: "4px 18px 18px 18px",
          padding: "13px 18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
        <span
          style={{
            fontSize: 12.5,
            color: "var(--charcoal-light)",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          Nivara is evaluating…
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick-start prompts shown on empty state
// ---------------------------------------------------------------------------
const STARTERS = [
  "I've had a headache since this morning",
  "My throat has been sore for 2 days",
  "I've had a fever since last night",
  "My chest feels tight when I breathe",
  "I have a persistent cough for a week",
  "My stomach has been hurting since yesterday",
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ChatInterface({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onReset,
  onViewTriage,
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

  // Auto-scroll to bottom on new messages / loading state change / triage result
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, triageResult]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) onSend();
    }
  };

  const urgency = triageResult ? urgencyConfig(triageResult.urgency) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--ivory)",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--mint-dark)",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: "var(--shadow-sm)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <NivaraLogo size={20} />
          {isFallback && (
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--amber)",
                background: "var(--amber-light)",
                border: "1px solid #e8c890",
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              Demo mode
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {triageResult && (
            <button
              id="view-triage-btn"
              onClick={onViewTriage}
              style={{
                background: urgency?.bg ?? "var(--mint)",
                color: urgency?.color ?? "var(--forest)",
                border: `1px solid ${urgency?.border ?? "var(--mint-dark)"}`,
                borderRadius: "var(--radius-xs)",
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "opacity 0.2s",
              }}
            >
              {urgency?.icon} View Summary
              <ChevronRight size={14} />
            </button>
          )}
          <button
            id="reset-chat-btn"
            onClick={onReset}
            title="Start a new session"
            style={{
              background: "transparent",
              border: "1px solid var(--mint-dark)",
              borderRadius: "var(--radius-xs)",
              padding: "7px 12px",
              cursor: "pointer",
              color: "var(--charcoal-mid)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--mint)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--forest)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal-mid)";
            }}
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">New session</span>
          </button>
        </div>
      </header>

      {/* ── Messages area ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px 12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ maxWidth: 740, width: "100%", margin: "0 auto" }}>
          {/* Empty state */}
          {messages.length === 0 && (
            <div
              className="animate-fade-in-up"
              style={{ textAlign: "center", paddingTop: 36, paddingBottom: 20 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--mint)",
                  border: "2px solid var(--mint-dark)",
                  color: "var(--forest)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 2px 8px rgba(30,77,53,0.1)",
                }}
              >
                <HeartPulse size={28} strokeWidth={2} />
              </div>
              <h2
                style={{
                  fontFamily: "Lora, Georgia, serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  marginBottom: 8,
                }}
              >
                Hi, I&apos;m Nivara
              </h2>
              <p
                style={{
                  color: "var(--charcoal-mid)",
                  fontSize: 15,
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 480,
                  margin: "0 auto 28px",
                }}
              >
                Tell me what you&apos;re experiencing. I&apos;ll ask a few focused
                questions, assess urgency, and guide you toward the right care.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onInputChange(s);
                      inputRef.current?.focus();
                    }}
                    style={{
                      background: "var(--white)",
                      border: "1px solid var(--mint-dark)",
                      borderRadius: "var(--radius-sm)",
                      padding: "9px 16px",
                      fontSize: 13.5,
                      color: "var(--forest-mid)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontWeight: 500,
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--mint)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--forest-light)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--white)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--mint-dark)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Error + retry */}
          {error && (
            <div
              className="animate-fade-in"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--red-light)",
                border: "1px solid #e8a0a0",
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                marginBottom: 14,
              }}
            >
              <AlertTriangle size={16} color="var(--red-urgent)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "var(--charcoal)",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {canRetry && (
                  <button
                    id="retry-btn"
                    onClick={onRetry}
                    style={{
                      background: "var(--forest)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-xs)",
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <RefreshCw size={13} />
                    Retry
                  </button>
                )}
                <button
                  onClick={onClearError}
                  style={{
                    background: "transparent",
                    border: "1px solid #e8a0a0",
                    borderRadius: "var(--radius-xs)",
                    padding: "6px 12px",
                    fontSize: 13,
                    color: "var(--charcoal-mid)",
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Completed assessment card in message stream */}
          {triageResult && !error && (
            <div
              id="completed-triage-card"
              className="animate-fade-in-up"
              onClick={onViewTriage}
              style={{
                marginTop: 18,
                marginBottom: 20,
                background: "var(--white)",
                border: `1.5px solid ${urgency?.border ?? "var(--mint-dark)"}`,
                borderRadius: "var(--radius)",
                padding: "18px 22px",
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: urgency?.bg ?? "var(--mint)",
                      color: urgency?.color ?? "var(--forest)",
                      border: `1px solid ${urgency?.border ?? "var(--mint-dark)"}`,
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: 12.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>{urgency?.icon}</span>
                    <span>{urgency?.label} Urgency</span>
                  </span>
                  <span style={{ fontSize: 13, color: "var(--charcoal-light)", fontWeight: 500 }}>
                    Assessment Ready
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--forest-mid)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  View Full Report <ChevronRight size={14} />
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: 14.5,
                  color: "var(--charcoal)",
                  lineHeight: 1.6,
                }}
              >
                {triageResult.summary ||
                  "Your symptoms have been evaluated based on health triage guidelines."}
              </p>

              <button
                id="view-full-assessment-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTriage();
                }}
                style={{
                  width: "100%",
                  background: "var(--forest)",
                  color: "var(--white)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "11px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 2px 6px rgba(30,77,53,0.2)",
                  transition: "background 0.15s ease",
                }}
              >
                <span>View Full Clinical Summary & Next Steps</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Persistent Urgency Banner (when assessment is active) ── */}
      {triageResult && urgency && urgency.label !== "Assessing" && (
        <div
          style={{
            background: urgency.bg,
            borderTop: `1px solid ${urgency.border}`,
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={14} color={urgency.color} />
            <span style={{ fontSize: 13, fontWeight: 600, color: urgency.color }}>
              {urgency.label}:
            </span>
            <span style={{ fontSize: 13, color: "var(--charcoal-mid)" }}>
              {urgency.description}
            </span>
          </div>
          <button
            onClick={onViewTriage}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: urgency.color,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            Details <ChevronRight size={13} />
          </button>
        </div>
      )}

      {/* ── Input Area ── */}
      <div
        style={{
          background: "var(--white)",
          borderTop: "1px solid var(--mint-dark)",
          padding: "12px 20px 14px",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {/* Contextual Quick Reply Chips */}
          {messages.length > 0 && !triageResult && !isLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 10,
                scrollbarWidth: "none",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--charcoal-light)",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginRight: 2,
                }}
              >
                Suggestions:
              </span>
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => onSend(reply)}
                  disabled={isLoading}
                  style={{
                    background: "var(--ivory)",
                    border: "1px solid var(--mint-dark)",
                    borderRadius: 99,
                    padding: "5px 12px",
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: "var(--forest)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--mint)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--forest-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--ivory)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--mint-dark)";
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Listening status indicator when microphone is active */}
          {isListening && (
            <div
              className="animate-fade-in"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--red-light)",
                border: "1px solid #e8a0a0",
                borderRadius: 99,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--red-urgent)",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--red-urgent)",
                  animation: "pulse-dot 1s ease infinite",
                }}
              />
              <span>Listening… speak your symptom</span>
            </div>
          )}

          {/* Input container */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              background: "var(--ivory-dark)",
              border: "1.5px solid var(--mint-dark)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 10px 8px 14px",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--forest-light)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 3px rgba(45,107,74,0.1)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--mint-dark)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
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
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: 14.5,
                color: "var(--charcoal)",
                lineHeight: 1.55,
                fontFamily: "inherit",
                maxHeight: 120,
                overflowY: "auto",
                opacity: isLoading ? 0.6 : 1,
                padding: "3px 0",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />

            {/* Voice microphone button (if browser supports Web Speech API) */}
            {speechSupported && (
              <button
                type="button"
                id="voice-input-btn"
                onClick={toggleListening}
                disabled={isLoading}
                title={isListening ? "Stop listening" : "Speak your message"}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-xs)",
                  background: isListening ? "var(--red-light)" : "transparent",
                  color: isListening ? "var(--red-urgent)" : "var(--charcoal-mid)",
                  border: isListening ? "1px solid #e8a0a0" : "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {isListening ? (
                  <MicOff size={17} strokeWidth={2.2} />
                ) : (
                  <Mic size={17} strokeWidth={2} />
                )}
              </button>
            )}

            {/* Send button */}
            <button
              id="send-message-btn"
              onClick={() => onSend()}
              disabled={!input.trim() || isLoading}
              title="Send message (Enter)"
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-xs)",
                background:
                  input.trim() && !isLoading
                    ? "var(--forest)"
                    : "var(--mint-dark)",
                color:
                  input.trim() && !isLoading
                    ? "var(--white)"
                    : "var(--charcoal-light)",
                border: "none",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
                boxShadow:
                  input.trim() && !isLoading
                    ? "0 2px 6px rgba(30,77,53,0.25)"
                    : "none",
              }}
            >
              <Send size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* Subtle disclaimer & shortcut hint */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              fontSize: 11.5,
              color: "var(--charcoal-light)",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            <span>Nivara is an AI health triage assistant, not a doctor.</span>
            <span>
              <kbd
                style={{
                  background: "var(--ivory-dark)",
                  border: "1px solid var(--mint-dark)",
                  padding: "1px 5px",
                  borderRadius: 4,
                  fontSize: 10.5,
                }}
              >
                Enter
              </kbd>{" "}
              to send ·{" "}
              <kbd
                style={{
                  background: "var(--ivory-dark)",
                  border: "1px solid var(--mint-dark)",
                  padding: "1px 5px",
                  borderRadius: 4,
                  fontSize: 10.5,
                }}
              >
                Shift+Enter
              </kbd>{" "}
              for newline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
