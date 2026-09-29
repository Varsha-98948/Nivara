"use client";

import { useRef, useEffect } from "react";
import {
  Send,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";
import NivaraLogo from "./NivaraLogo";
import { Message, TriageResult } from "@/lib/types";
import { urgencyConfig, stripTriageBlock } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
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
// MessageBubble — renders one chat message
// ---------------------------------------------------------------------------
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  // Strip the JSON block before displaying AI messages
  const displayContent = isUser ? msg.content : stripTriageBlock(msg.content);
  const lines = displayContent.split("\n").filter((l) => l.trim() !== "");

  const renderLine = (line: string, i: number) => {
    // Render **bold** inline
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p
        key={i}
        style={{
          margin: "3px 0",
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} style={{ fontWeight: 600 }}>
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  };

  return (
    <div
      className={isUser ? "animate-slide-right" : "animate-slide-left"}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--forest)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: 2,
            fontSize: 14,
          }}
        >
          💚
        </div>
      )}

      <div
        style={{
          maxWidth: "76%",
          padding: isUser ? "12px 16px" : "14px 18px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
          background: isUser ? "var(--forest)" : "var(--white)",
          color: isUser ? "var(--white)" : "var(--charcoal)",
          border: isUser ? "none" : "1px solid var(--mint-dark)",
          boxShadow: isUser
            ? "0 2px 8px rgba(30,77,53,0.2)"
            : "var(--shadow-sm)",
          wordBreak: "break-word",
        }}
      >
        {lines.length > 0 ? (
          lines.map((line, i) => renderLine(line, i))
        ) : (
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, opacity: 0.5 }}>
            —
          </p>
        )}
        <div
          style={{
            fontSize: 11,
            opacity: 0.55,
            marginTop: 6,
            textAlign: isUser ? "right" : "left",
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
            background: "var(--ivory-dark)",
            border: "1px solid var(--mint-dark)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: 2,
            fontSize: 15,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typing indicator (three bouncing dots)
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div
      className="animate-slide-left"
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: "var(--forest)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 14,
        }}
      >
        💚
      </div>
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--mint-dark)",
          borderRadius: "4px 16px 16px 16px",
          padding: "14px 18px",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
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

  // Auto-scroll to bottom on new messages / loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
              padding: "7px 10px",
              cursor: "pointer",
              color: "var(--charcoal-light)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--mint)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--forest)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--charcoal-light)";
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
          padding: "24px 20px 8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ maxWidth: 720, width: "100%", margin: "0 auto" }}>

          {/* Empty state */}
          {messages.length === 0 && (
            <div
              className="animate-fade-in-up"
              style={{ textAlign: "center", paddingTop: 32, paddingBottom: 16 }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>💚</div>
              <h2
                style={{
                  fontFamily: "Lora, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  marginBottom: 8,
                }}
              >
                Hi, I&apos;m Nivara
              </h2>
              <p
                style={{
                  color: "var(--charcoal-light)",
                  fontSize: 15,
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 480,
                  margin: "0 auto 28px",
                }}
              >
                Tell me what you&apos;re experiencing. I&apos;ll ask a few focused
                questions, then give you a clear picture of what it might be and what
                to do next.
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
                marginBottom: 12,
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

          {/* Assessment complete banner */}
          {triageResult && !error && (
            <div
              className="animate-fade-in"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: urgency?.bg ?? "var(--mint)",
                border: `1px solid ${urgency?.border ?? "var(--mint-dark)"}`,
                borderRadius: "var(--radius-sm)",
                padding: "12px 16px",
                marginBottom: 12,
                cursor: "pointer",
              }}
              onClick={onViewTriage}
            >
              <Info size={16} color={urgency?.color ?? "var(--forest-mid)"} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 13.5,
                    color: urgency?.color ?? "var(--forest-mid)",
                  }}
                >
                  {urgency?.icon} {triageResult.status} — {urgency?.label}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--charcoal-mid)",
                    marginLeft: 6,
                  }}
                >
                  Tap to view your full triage summary
                </span>
              </div>
              <ChevronRight size={15} color={urgency?.color ?? "var(--forest-mid)"} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Urgency banner (persistent) ── */}
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

      {/* ── Input area ── */}
      <div
        style={{
          background: "var(--white)",
          borderTop: "1px solid var(--mint-dark)",
          padding: "14px 20px",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              background: "var(--ivory-dark)",
              border: "1.5px solid var(--mint-dark)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 8px 8px 16px",
              transition: "border-color 0.2s",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--forest-light)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--mint-dark)";
            }}
          >
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                triageResult
                  ? "Ask a follow-up question…"
                  : "Describe your symptoms…"
              }
              rows={1}
              disabled={isLoading}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontSize: 15,
                color: "var(--charcoal)",
                lineHeight: 1.6,
                fontFamily: "inherit",
                maxHeight: 120,
                overflowY: "auto",
                opacity: isLoading ? 0.5 : 1,
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              id="send-message-btn"
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background:
                  input.trim() && !isLoading
                    ? "var(--forest)"
                    : "var(--mint-dark)",
                border: "none",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              <Send size={17} color="white" strokeWidth={2} />
            </button>
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 11.5,
              color: "var(--charcoal-light)",
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            Not a substitute for professional medical advice.{" "}
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
            for new line
          </p>
        </div>
      </div>
    </div>
  );
}
