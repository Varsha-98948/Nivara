"use client";

import { ArrowLeft, MessageCircle, MapPin, Phone, Activity } from "lucide-react";
import { TriageResult } from "@/lib/types";
import { urgencyConfig } from "@/lib/utils";

interface TriageResultCardProps {
  result: TriageResult;
  onBack: () => void;
  onFindCare: () => void;
}

function Section({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--white)",
        border: "1px solid var(--mint-dark)",
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {icon && (
          <div
            style={{
              color: "var(--forest-mid)",
            }}
          >
            {icon}
          </div>
        )}
        <h3
          style={{
            fontWeight: 600,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--charcoal-light)",
          }}
        >
          {label}
        </h3>
      </div>
      <div
        style={{
          fontSize: 15,
          color: "var(--charcoal)",
          lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function BulletList({ text }: { text: string }) {
  const lines = text
    .split(/\n|•|-/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
      {lines.map((line, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--forest-light)",
              marginTop: 8,
              flexShrink: 0,
            }}
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TriageResultCard({
  result,
  onBack,
  onFindCare,
}: TriageResultCardProps) {
  const cfg = urgencyConfig(result.urgency);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ivory)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--mint-dark)",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "var(--shadow-sm)",
          flexShrink: 0,
        }}
      >
        <button
          id="triage-back-btn"
          onClick={onBack}
          style={{
            background: "transparent",
            border: "1px solid var(--mint-dark)",
            borderRadius: "var(--radius-xs)",
            padding: "7px 14px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--charcoal-mid)",
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
          <ArrowLeft size={14} />
          Back to chat
        </button>
        <div>
          <h1
            style={{
              fontFamily: "Lora, Georgia, serif",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--charcoal)",
              marginBottom: 2,
            }}
          >
            Your Triage Summary
          </h1>
          {result.status && (
            <p style={{ fontSize: 12, color: "var(--charcoal-light)", margin: 0 }}>
              {result.status}
            </p>
          )}
        </div>
      </header>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 20px 48px",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
          className="animate-fade-in-up"
        >
          {/* Urgency badge */}
          <div
            style={{
              background: cfg.bg,
              border: `2px solid ${cfg.border}`,
              borderRadius: "var(--radius)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div style={{ fontSize: 40, lineHeight: 1 }}>{cfg.icon}</div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: cfg.color,
                  marginBottom: 4,
                }}
              >
                Urgency Level
              </div>
              <div
                style={{
                  fontFamily: "Lora, Georgia, serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: cfg.color,
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {cfg.label}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--charcoal-mid)",
                  lineHeight: 1.5,
                }}
              >
                {cfg.description}
              </div>
            </div>
          </div>

          {/* Emergency call box */}
          {result.urgency === "emergency" && (
            <div
              style={{
                background: "var(--red-urgent)",
                borderRadius: "var(--radius)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Phone size={28} color="white" />
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "white",
                    marginBottom: 4,
                  }}
                >
                  Call Emergency Services Now
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                  Call 911 (US) or your local emergency number immediately.
                </div>
              </div>
            </div>
          )}

          {/* Symptoms reported */}
          {result.symptoms && (
            <Section label="Symptoms Reported" icon={<Activity size={16} />}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.symptoms
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s, i) => (
                    <span
                      key={i}
                      style={{
                        background: "var(--mint)",
                        border: "1px solid var(--mint-dark)",
                        borderRadius: 99,
                        padding: "4px 12px",
                        fontSize: 13,
                        color: "var(--forest-mid)",
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </span>
                  ))}
              </div>
            </Section>
          )}

          {/* What this might be */}
          {result.summary && (
            <Section label="Overview" icon={<MessageCircle size={16} />}>
              <p>{result.summary}</p>
            </Section>
          )}

          {/* Possible explanations */}
          {result.possible_explanations && (
            <Section label="Possible Explanations">
              <div
                style={{
                  background: "var(--ivory-dark)",
                  borderRadius: "var(--radius-xs)",
                  padding: "10px 14px",
                  marginBottom: 8,
                  fontSize: 12.5,
                  color: "var(--charcoal-light)",
                  lineHeight: 1.5,
                }}
              >
                These are <strong>possible explanations only</strong> — not a diagnosis.
                Only a qualified clinician can diagnose your condition.
              </div>
              <BulletList text={result.possible_explanations} />
            </Section>
          )}

          {/* Next step */}
          {result.nextStep && (
            <Section label="Recommended Next Step" icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="var(--forest-mid)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }>
              <p style={{ fontWeight: 500 }}>{result.nextStep}</p>
            </Section>
          )}

          {/* Self-care */}
          {result.selfCare && (
            <Section label="Self-Care Tips">
              <BulletList text={result.selfCare} />
            </Section>
          )}

          {/* Warning signs */}
          {result.warningSigns && (
            <div
              style={{
                background: "var(--amber-light)",
                border: "1px solid #e8c890",
                borderRadius: "var(--radius)",
                padding: "20px 24px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--amber)",
                  marginBottom: 12,
                }}
              >
                ⚠️ Warning Signs — Seek Care If You Notice:
              </h3>
              <div
                style={{
                  fontSize: 15,
                  color: "var(--charcoal)",
                  lineHeight: 1.7,
                }}
              >
                <BulletList text={result.warningSigns} />
              </div>
            </div>
          )}

          {/* Find care CTA */}
          <div
            style={{
              background: "var(--mint)",
              border: "1px solid var(--mint-dark)",
              borderRadius: "var(--radius)",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--forest)",
                  marginBottom: 4,
                }}
              >
                Find Healthcare Near You
              </div>
              <div style={{ fontSize: 14, color: "var(--charcoal-mid)" }}>
                Locate emergency rooms, urgent care, clinics, and pharmacies.
              </div>
            </div>
            <button
              id="find-care-btn"
              onClick={onFindCare}
              style={{
                background: "var(--forest)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 2px 8px rgba(30,77,53,0.2)",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--forest-mid)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--forest)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <MapPin size={15} />
              Find Care
            </button>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: 12.5,
              color: "var(--charcoal-light)",
              textAlign: "center",
              lineHeight: 1.6,
              padding: "0 12px",
            }}
          >
            This summary is generated by AI and is not a medical diagnosis. Always consult a
            qualified healthcare professional for medical advice, diagnosis, or treatment.
          </p>
        </div>
      </main>
    </div>
  );
}
