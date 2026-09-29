"use client";

import { useState } from "react";
import {
  Shield,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
  Sparkles,
  HeartPulse,
  Activity,
  CheckCircle2,
} from "lucide-react";
import NivaraLogo from "./NivaraLogo";
import { ThemeToggle } from "./ThemeProvider";

interface WelcomeScreenProps {
  onStart: (initialText?: string) => void;
}

const COMMON_CONCERNS = [
  "Throbbing headache & light sensitivity",
  "Sore throat with mild fever",
  "Persistent dry cough for 3 days",
  "Stomach ache after dinner",
];

const FEATURES = [
  {
    icon: MessageCircle,
    title: "Empathetic Symptom Dialogue",
    desc: "Describe what you're feeling in plain words or voice. Nivara listens and asks focused follow-up questions.",
    tag: "Voice & Text",
  },
  {
    icon: Shield,
    title: "Urgency Assessment",
    desc: "Understand whether you need 112 emergency care, a doctor visit within 24 hours, or home monitoring.",
    tag: "India Unified 112",
  },
  {
    icon: Clock,
    title: "Actionable Self-Care",
    desc: "Receive evidence-based comfort measures, watch-outs, and specific warning signs to track closely.",
    tag: "Clinical Logic",
  },
  {
    icon: MapPin,
    title: "Real Facility Navigation",
    desc: "Enter your 6-digit Indian PIN code to locate nearby hospitals, emergency units, and clinics.",
    tag: "Live Directory",
  },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--ivory)",
        color: "var(--charcoal)",
        transition: "background-color 0.25s ease",
      }}
    >
      {/* ── Top Navigation ── */}
      <header
        style={{
          borderBottom: "1px solid var(--mint-dark)",
          background: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-sm)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <NivaraLogo size={24} />

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--forest-mid)",
              fontWeight: 600,
              padding: "5px 12px",
              border: "1px solid var(--mint-dark)",
              borderRadius: 99,
              background: "var(--mint)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            className="hidden sm:inline-flex"
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--forest-light)",
                display: "inline-block",
              }}
            />
            <span>India Health Navigation</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16 md:py-24">
        <div
          className="animate-fade-in-up"
          style={{ maxWidth: 740, width: "100%", textAlign: "center" }}
        >
          {/* Living Health Companion Orb */}
          <div
            className="companion-orb mb-8"
            style={{ width: 140, height: 140, margin: "0 auto 28px" }}
          >
            <div
              className="companion-glow"
              style={{ width: 130, height: 130 }}
            />
            <div
              className="companion-ring"
              style={{ width: 120, height: 120 }}
            />
            <div
              style={{
                position: "absolute",
                width: 74,
                height: 74,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 8px 24px rgba(30, 77, 53, 0.35)",
                border: "2px solid var(--mint-dark)",
              }}
              className="animate-float"
            >
              <HeartPulse size={34} strokeWidth={2.2} />
            </div>

            {/* Orbiting Satellite Dots */}
            <div
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--amber)",
                boxShadow: "0 0 10px var(--amber)",
                animation: "orbit 8s linear infinite",
              }}
              title="Concern"
            />
            <div
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--forest-light)",
                boxShadow: "0 0 8px var(--forest-light)",
                animation: "orbit-reverse 12s linear infinite",
              }}
              title="Navigation"
            />
          </div>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-6"
            style={{
              background: "var(--mint)",
              border: "1px solid var(--mint-dark)",
              borderRadius: 99,
              padding: "6px 16px",
              fontSize: 12.5,
              color: "var(--forest-mid)",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            <Sparkles size={14} color="var(--forest-light)" />
            <span>Calm Health Intelligence & Care Triage</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display), Lora, Georgia, serif",
              fontSize: "clamp(2.1rem, 5.5vw, 3.5rem)",
              fontWeight: 600,
              color: "var(--charcoal)",
              lineHeight: 1.18,
              marginBottom: 20,
              letterSpacing: "-0.025em",
            }}
          >
            Understand your health.{" "}
            <span
              style={{
                color: "var(--forest-light)",
                background: "linear-gradient(135deg, var(--forest-mid), var(--forest-light))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Know what to do next.
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "clamp(1.02rem, 2vw, 1.15rem)",
              color: "var(--charcoal-mid)",
              lineHeight: 1.68,
              marginBottom: 36,
              maxWidth: 580,
              margin: "0 auto 36px",
            }}
          >
            Describe what you&apos;re experiencing. Nivara gathers the clinical
            picture, assesses urgency calmly, and directs you to the appropriate care in India.
          </p>

          {/* Primary CTA Button */}
          <div className="flex flex-col items-center justify-center gap-3 mb-10">
            <button
              id="start-with-nivara-btn"
              type="button"
              onClick={() => onStart()}
              className="interactive-tap"
              style={{
                background: "linear-gradient(135deg, var(--forest), var(--forest-mid))",
                color: "var(--white)",
                border: "1px solid var(--forest-light)",
                borderRadius: "var(--radius-sm)",
                padding: "16px 40px",
                fontSize: 16.5,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(30, 77, 53, 0.28)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 8px 26px rgba(30, 77, 53, 0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 20px rgba(30, 77, 53, 0.28)";
              }}
            >
              <span>Start Health Assessment</span>
              <ArrowRight size={17} strokeWidth={2.4} />
            </button>

            <span
              style={{
                fontSize: 12,
                color: "var(--charcoal-light)",
                letterSpacing: "0.01em",
              }}
            >
              Free · No account needed · India Unified Emergency 112 Ready
            </span>
          </div>

          {/* Quick Concern Starter Pills */}
          <div
            style={{
              padding: "18px 20px",
              background: "var(--white)",
              border: "1px solid var(--mint-dark)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-sm)",
              marginBottom: 44,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--charcoal-light)",
                marginBottom: 12,
              }}
            >
              Or start with a common health concern:
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {COMMON_CONCERNS.map((concern) => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => onStart(concern)}
                  className="interactive-tap"
                  style={{
                    background: "var(--mint)",
                    color: "var(--forest-mid)",
                    border: "1px solid var(--mint-dark)",
                    borderRadius: 99,
                    padding: "7px 14px",
                    fontSize: 12.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--forest)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--white)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--forest)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--mint)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--forest-mid)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--mint-dark)";
                  }}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          {/* ── 3-Step Visual Journey ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
              marginBottom: 48,
              textAlign: "left",
            }}
          >
            {[
              {
                step: "01",
                label: "Share Concern",
                desc: "Voice or text input with focused, single-question follow-ups.",
                icon: Activity,
              },
              {
                step: "02",
                label: "Assess Urgency",
                desc: "Emergency, Urgent, Moderate, or Low triage guidance.",
                icon: Shield,
              },
              {
                step: "03",
                label: "Navigate Care",
                desc: "Real hospital & clinic directory filtered by your Indian PIN code.",
                icon: MapPin,
              },
            ].map(({ step, label, desc, icon: StepIcon }, idx) => (
              <div
                key={step}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  background: hoveredStep === idx ? "var(--white)" : "var(--card-bg)",
                  border: `1px solid ${hoveredStep === idx ? "var(--forest-light)" : "var(--mint-dark)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "18px 18px",
                  boxShadow: hoveredStep === idx ? "var(--shadow-md)" : "var(--shadow-sm)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--forest-light)",
                      background: "var(--mint)",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    STEP {step}
                  </span>
                  <StepIcon size={16} color="var(--forest-mid)" />
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    color: "var(--charcoal)",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--charcoal-light)",
                    lineHeight: 1.5,
                  }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature Cards Grid ── */}
        <div
          className="animate-fade-in-up"
          style={{
            maxWidth: 820,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, desc, tag }) => (
            <div
              key={title}
              style={{
                background: "var(--white)",
                border: "1px solid var(--mint-dark)",
                borderRadius: "var(--radius)",
                padding: "22px 20px",
                boxShadow: "var(--shadow-sm)",
                transition: "box-shadow 0.2s, transform 0.2s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "var(--mint)",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--mint-dark)",
                    }}
                  >
                    <Icon size={20} color="var(--forest-mid)" strokeWidth={1.8} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--charcoal-light)",
                      background: "var(--ivory)",
                      border: "1px solid var(--mint-dark)",
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    {tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "var(--charcoal)",
                    marginBottom: 6,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--charcoal-light)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Medical Disclaimer ── */}
        <div
          className="animate-fade-in"
          style={{
            marginTop: 52,
            padding: "16px 22px",
            background: "var(--ivory-dark)",
            border: "1px solid var(--mint-dark)",
            borderRadius: "var(--radius-sm)",
            maxWidth: 680,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--charcoal-light)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            <strong style={{ color: "var(--charcoal-mid)" }}>Medical Safety Notice:</strong>{" "}
            Nivara is an automated health triage and navigation assistant designed for users in India.
            It does not diagnose medical conditions or prescribe treatments. If you are experiencing
            potentially life-threatening symptoms, call India&apos;s unified emergency number{" "}
            <strong style={{ color: "var(--red-urgent)" }}>112</strong> or go to your nearest
            hospital casualty immediately.
          </p>
        </div>
      </main>
    </div>
  );
}
