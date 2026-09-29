"use client";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
  Stethoscope,
  Info,
  HeartPulse,
  RotateCcw,
} from "lucide-react";
import { TriageResult } from "@/lib/types";
import { urgencyConfig } from "@/lib/utils";

interface TriageResultCardProps {
  result: TriageResult;
  onBack: () => void;
  onFindCare: () => void;
  onNewAssessment: () => void;
}

/** Helper component for clean card sections */
function SectionCard({
  title,
  icon,
  children,
  badge,
  borderColor,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
  borderColor?: string;
}) {
  return (
    <div
      style={{
        background: "var(--white)",
        border: `1px solid ${borderColor || "var(--mint-dark)"}`,
        borderRadius: "var(--radius)",
        padding: "20px 24px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {icon && <div style={{ color: "var(--forest-mid)", display: "flex" }}>{icon}</div>}
          <h3
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 13.5,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--charcoal-mid)",
            }}
          >
            {title}
          </h3>
        </div>
        {badge && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--charcoal-light)",
              background: "var(--ivory)",
              border: "1px solid var(--mint-dark)",
              borderRadius: 99,
              padding: "2px 8px",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: 14.5, color: "var(--charcoal)", lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

/** Formats multiline or bullet text into a clean list */
function BulletList({
  text,
  bulletColor = "var(--forest-light)",
}: {
  text: string;
  bulletColor?: string;
}) {
  const lines = text
    .split(/\n|•|-(?=\s)/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
      {lines.map((line, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 8,
            lineHeight: 1.55,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: bulletColor,
              marginTop: 7,
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1 }}>{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TriageResultCard({
  result,
  onBack,
  onFindCare,
  onNewAssessment,
}: TriageResultCardProps) {
  const cfg = urgencyConfig(result.urgency);
  const isEmergency = result.urgency === "emergency";
  const isUrgent = result.urgency === "urgent";
  const isModerate = result.urgency === "moderate" || result.urgency === "semi-urgent";
  const isLow = result.urgency === "low" || result.urgency === "routine";

  // Parse symptoms into tags
  const symptomList = result.symptoms
    ? result.symptoms
        .split(/[,;\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.toLowerCase().includes("as described"))
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ivory)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top Header ── */}
      <header
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--mint-dark)",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-sm)",
          flexShrink: 0,
          zIndex: 10,
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
          Back to conversation
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }} className="hidden sm:block">
            <h1
              style={{
                fontFamily: "Lora, Georgia, serif",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--charcoal)",
                margin: 0,
              }}
            >
              Clinical Triage Summary
            </h1>
            <p style={{ fontSize: 11.5, color: "var(--charcoal-light)", margin: 0 }}>
              {result.status || "Assessment Complete"}
            </p>
          </div>

          <button
            id="triage-new-assessment-header-btn"
            onClick={onNewAssessment}
            title="Start a new symptom assessment"
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
            <span>New assessment</span>
          </button>
        </div>
      </header>

      {/* ── Main Content Stream ── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 20px 48px",
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
          {/* ── 1. Urgency Hero Header ── */}
          {isEmergency ? (
            /* Emergency Prominent Crimson Banner */
            <div
              style={{
                background: "linear-gradient(135deg, #b82c2c 0%, #941b1b 100%)",
                borderRadius: "var(--radius)",
                padding: "24px 28px",
                color: "var(--white)",
                boxShadow: "0 6px 20px rgba(184,44,44,0.28)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  🚨
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "rgba(255,255,255,0.85)",
                      marginBottom: 4,
                    }}
                  >
                    High Urgency Level
                  </div>
                  <div
                    style={{
                      fontFamily: "Lora, Georgia, serif",
                      fontSize: 26,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      marginBottom: 6,
                    }}
                  >
                    Emergency Medical Attention Required
                  </div>
                  <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.92)", lineHeight: 1.5 }}>
                    Your reported symptoms may indicate a time-sensitive medical emergency. Do not wait or rely on home remedies.
                  </div>
                </div>
              </div>

              {/* Direct Emergency Call Bar */}
              <div
                style={{
                  background: "rgba(0,0,0,0.22)",
                  borderRadius: "var(--radius-sm)",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Phone size={20} color="white" />
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>
                    Emergency Services: Call 911 Immediately
                  </span>
                </div>
                <a
                  href="tel:911"
                  style={{
                    background: "white",
                    color: "var(--red-urgent)",
                    borderRadius: "var(--radius-xs)",
                    padding: "7px 16px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  Call 911 Now
                </a>
              </div>
            </div>
          ) : (
            /* Calm & Clean Urgency Card (Urgent / Moderate / Low) */
            <div
              style={{
                background: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                borderRadius: "var(--radius)",
                padding: "22px 26px",
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "var(--white)",
                  border: `1px solid ${cfg.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                }}
              >
                {cfg.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: cfg.color,
                    marginBottom: 3,
                  }}
                >
                  Urgency Level
                </div>
                <div
                  style={{
                    fontFamily: "Lora, Georgia, serif",
                    fontSize: 24,
                    fontWeight: 700,
                    color: cfg.color,
                    lineHeight: 1.2,
                    marginBottom: 5,
                  }}
                >
                  {cfg.label} Priority
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "var(--charcoal)",
                    lineHeight: 1.5,
                  }}
                >
                  {cfg.description}
                </div>
              </div>
            </div>
          )}

          {/* ── 2. Most Prominent Next Step Card (recommended_action) ── */}
          {result.nextStep && (
            <div
              style={{
                background: isEmergency ? "var(--red-light)" : "var(--white)",
                border: `2px solid ${isEmergency ? "#e8a0a0" : isUrgent ? "#f0c080" : "var(--forest-light)"}`,
                borderRadius: "var(--radius)",
                padding: "22px 24px",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                {isEmergency ? (
                  <ShieldAlert size={20} color="var(--red-urgent)" />
                ) : isUrgent ? (
                  <Clock size={20} color="#b06010" />
                ) : (
                  <CheckCircle2 size={20} color="var(--forest)" />
                )}
                <h2
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: isEmergency
                      ? "var(--red-urgent)"
                      : isUrgent
                      ? "#b06010"
                      : "var(--forest)",
                  }}
                >
                  Recommended Next Step
                </h2>
              </div>

              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: 15.5,
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  lineHeight: 1.6,
                }}
              >
                {result.nextStep}
              </p>

              {/* Contextual guidance on when to seek care */}
              <div
                style={{
                  background: isEmergency
                    ? "rgba(184,44,44,0.06)"
                    : isUrgent
                    ? "rgba(176,96,16,0.06)"
                    : "var(--mint)",
                  borderRadius: "var(--radius-xs)",
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--charcoal-mid)",
                  lineHeight: 1.5,
                }}
              >
                {isEmergency
                  ? "Immediate emergency care takes priority over all other activities. Do not drive yourself if you are feeling faint, dizzy, or short of breath."
                  : isUrgent
                  ? "Schedule an appointment at an urgent care clinic or contact a healthcare provider within 24 hours for timely evaluation."
                  : isModerate
                  ? "If your symptoms do not improve within 48–72 hours, or if they worsen, consult a primary care doctor or local clinic."
                  : "Self-care and resting at home are appropriate. Contact a doctor if symptoms persist or new concerns arise."}
              </div>
            </div>
          )}

          {/* ── 3. What Nivara Understood (Summary & Symptoms) ── */}
          {(result.summary || symptomList.length > 0) && (
            <SectionCard
              title="What Nivara Understood"
              icon={<Activity size={17} />}
              badge="Reported context"
            >
              {result.summary && (
                <p style={{ margin: "0 0 12px", fontSize: 14.5, lineHeight: 1.65 }}>
                  {result.summary}
                </p>
              )}

              {/* Symptoms rendered as clean aesthetic tags */}
              {symptomList.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--charcoal-light)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Identified Symptoms:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {symptomList.map((s, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "var(--mint)",
                          border: "1px solid var(--mint-dark)",
                          borderRadius: 99,
                          padding: "4px 12px",
                          fontSize: 13,
                          color: "var(--forest)",
                          fontWeight: 500,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {/* ── 4. Possible Explanations (Clearly framed, NOT a diagnosis) ── */}
          {result.possible_explanations && (
            <SectionCard
              title="Possible Explanations"
              icon={<Stethoscope size={17} />}
              badge="Informational only"
            >
              <div
                style={{
                  background: "var(--ivory-dark)",
                  border: "1px solid var(--mint-dark)",
                  borderRadius: "var(--radius-xs)",
                  padding: "9px 13px",
                  marginBottom: 12,
                  fontSize: 12.5,
                  color: "var(--charcoal-mid)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  lineHeight: 1.5,
                }}
              >
                <Info size={15} style={{ flexShrink: 0, marginTop: 1.5 }} />
                <span>
                  These are <strong>potential medical possibilities</strong> based on common clinical presentations — not a diagnosis. A qualified healthcare professional must evaluate you for an accurate diagnosis.
                </span>
              </div>
              <BulletList text={result.possible_explanations} bulletColor="var(--forest-mid)" />
            </SectionCard>
          )}

          {/* ── 5. Warning Signs to Watch For (High visibility alert card) ── */}
          {result.warningSigns && (
            <div
              style={{
                background: "var(--amber-light)",
                border: "1.5px solid #e8c890",
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
                <AlertTriangle size={18} color="var(--amber)" />
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 13.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--amber)",
                  }}
                >
                  Warning Signs — Seek Prompt Care If You Experience:
                </h3>
              </div>
              <div style={{ fontSize: 14.5, color: "var(--charcoal)", lineHeight: 1.6 }}>
                <BulletList text={result.warningSigns} bulletColor="var(--amber)" />
              </div>
            </div>
          )}

          {/* ── 6. Self-Care Guidance (Only relevant if not an immediate emergency) ── */}
          {result.selfCare && !isEmergency && (
            <SectionCard
              title="At-Home Self-Care Guidance"
              icon={<HeartPulse size={17} />}
              badge="Supportive measures"
            >
              <div style={{ marginBottom: 6 }}>
                <BulletList text={result.selfCare} bulletColor="var(--forest-light)" />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--charcoal-light)",
                  marginTop: 10,
                  fontStyle: "italic",
                }}
              >
                Note: Self-care measures are intended to support comfort and recovery, not replace formal medical evaluation.
              </div>
            </SectionCard>
          )}

          {/* ── 7. Find Healthcare Near You CTA ── */}
          <div
            style={{
              background: "var(--mint)",
              border: "1.5px solid var(--mint-dark)",
              borderRadius: "var(--radius)",
              padding: "22px 26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ maxWidth: 420 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16.5,
                  color: "var(--forest)",
                  marginBottom: 4,
                }}
              >
                {isEmergency
                  ? "Locate Emergency Facilities Near You"
                  : isUrgent
                  ? "Find Urgent Care Centers & Walk-in Clinics"
                  : "Find Healthcare Providers & Clinics Near You"}
              </div>
              <div style={{ fontSize: 13.5, color: "var(--charcoal-mid)", lineHeight: 1.5 }}>
                {isEmergency
                  ? "View emergency departments and hospitals with 24/7 care."
                  : isUrgent
                  ? "Find walk-in urgent care centers with shorter wait times."
                  : "Browse verified local clinics, pharmacies, and primary care."}
              </div>
            </div>

            <button
              id="find-care-btn"
              onClick={onFindCare}
              style={{
                background: isEmergency ? "var(--red-urgent)" : "var(--forest)",
                color: "var(--white)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "12px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: isEmergency
                  ? "0 2px 8px rgba(184,44,44,0.3)"
                  : "0 2px 8px rgba(30,77,53,0.2)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              <MapPin size={16} />
              <span>{isEmergency ? "Find Emergency Rooms" : "Find Nearby Care"}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* ── 8. Start New Assessment Action ── */}
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--mint-dark)",
              borderRadius: "var(--radius)",
              padding: "18px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--charcoal)", marginBottom: 2 }}>
                Need to evaluate another symptom or check on someone else?
              </div>
              <div style={{ fontSize: 13, color: "var(--charcoal-light)" }}>
                Start a fresh consultation while keeping your session responsive.
              </div>
            </div>

            <button
              id="start-new-assessment-footer-btn"
              onClick={onNewAssessment}
              style={{
                background: "transparent",
                color: "var(--forest)",
                border: "1.5px solid var(--forest-light)",
                borderRadius: "var(--radius-xs)",
                padding: "9px 18px",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--mint)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <RotateCcw size={14} />
              <span>Start New Assessment</span>
            </button>
          </div>

          {/* ── 8. Medical Disclaimer ── */}
          <footer
            style={{
              padding: "12px 16px 0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--charcoal-light)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <strong>Medical Disclaimer:</strong> Nivara is an AI health triage and care navigation tool. It provides automated triage assessments for informational purposes and does not provide medical diagnoses, treatment plans, or prescriptions. In the event of a medical emergency, call 911 or visit your nearest emergency department immediately.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
