"use client";

import { ArrowRight, CheckCircle2, ChevronRight, Compass, ShieldAlert, Sparkles } from "lucide-react";
import NivaraLogo from "./NivaraLogo";
import { ThemeToggle } from "./ThemeProvider";

interface WelcomeScreenProps {
  onStart: (initialText?: string) => void;
}

const QUICK_CONCERNS = [
  { label: "Headache", prompt: "I've had a persistent headache since this morning" },
  { label: "Fever", prompt: "I've developed a fever with body aches" },
  { label: "Stomach pain", prompt: "I have sharp stomach discomfort after eating" },
  { label: "Minor injury", prompt: "I twisted my ankle and it is swollen" },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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
          <NivaraLogo size={23} />

          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                color: "var(--text-secondary)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                }}
              />
              India Care Navigation
            </span>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Hero Composition ── */}
      <main className="flex-1 flex flex-col justify-center py-12 md:py-20">
        <div className="max-w-5xl mx-auto w-full px-5 sm:px-8">
          {/* Two-Column Editorial Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Focused Statement & Actions */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Subtle Category Eyebrow */}
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-5 px-2.5 py-1 rounded"
                style={{
                  color: "var(--accent)",
                  backgroundColor: "var(--accent-soft)",
                  border: "1px solid var(--accent-border)",
                }}
              >
                <span>Health Triage & Direction</span>
              </div>

              {/* Core Statement */}
              <h1
                className="font-serif tracking-tight leading-[1.14] mb-4"
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Understand your health.{" "}
                <span
                  style={{
                    color: "var(--accent)",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  Know what to do next.
                </span>
              </h1>

              {/* Concise Supporting Copy */}
              <p
                className="leading-relaxed mb-7 max-w-lg"
                style={{
                  fontSize: "clamp(1.02rem, 1.8vw, 1.12rem)",
                  color: "var(--text-secondary)",
                }}
              >
                Describe what you&apos;re experiencing. Nivara helps you make sense of it
                and decide what to do next.
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  id="start-with-nivara-btn"
                  type="button"
                  onClick={() => onStart()}
                  className="interactive-tap inline-flex items-center gap-2.5 text-sm font-semibold px-6 py-3.5 rounded-lg shadow-sm"
                  style={{
                    backgroundColor: "var(--botanical)",
                    color: "var(--botanical-contrast)",
                    border: "1px solid var(--botanical)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--botanical-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--botanical)";
                  }}
                >
                  <span>Start with Nivara</span>
                  <ArrowRight size={15} strokeWidth={2.2} />
                </button>

                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  No sign-up required · Unified 112 Ready
                </span>
              </div>

              {/* Integrated Quick Concerns */}
              <div className="pt-2 border-t border-[var(--border-subtle)] w-full">
                <div
                  className="text-[11.5px] uppercase tracking-wider font-semibold mb-2.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Try starting with:
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CONCERNS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => onStart(item.prompt)}
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
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Actual Product Interaction Trajectory */}
            <div className="lg:col-span-6">
              <div
                className="relative p-6 sm:p-7 rounded-xl border shadow-sm"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)] text-xs">
                  <div className="flex items-center gap-2 font-medium" style={{ color: "var(--text-muted)" }}>
                    <Compass size={13} style={{ color: "var(--accent)" }} />
                    <span>Nivara Clinical Trajectory</span>
                  </div>
                  <span
                    className="font-mono text-[11px] px-2 py-0.5 rounded"
                    style={{ backgroundColor: "var(--bg-subtle)", color: "var(--text-secondary)" }}
                  >
                    LIVE DEMO
                  </span>
                </div>

                {/* Trajectory Visual Journey composed of real interface pieces */}
                <div className="space-y-3 relative">
                  {/* Trajectory Guide Line */}
                  <div
                    className="absolute left-3.5 top-3 bottom-3 w-px"
                    style={{ backgroundColor: "var(--border)" }}
                  />

                  {/* Stage 1: User Concern */}
                  <div className="relative pl-8">
                    <div
                      className="absolute left-2.5 top-2.5 w-2 h-2 rounded-full -translate-x-1/2"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    <div
                      className="p-3 rounded-lg text-xs leading-relaxed"
                      style={{
                        backgroundColor: "var(--bg-subtle)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span className="font-semibold text-[11px] block uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                        01 · Reported Concern
                      </span>
                      &ldquo;Throbbing pain in my right temple since morning, gets worse in bright light.&rdquo;
                    </div>
                  </div>

                  {/* Stage 2: Clarifying Follow-Up */}
                  <div className="relative pl-8">
                    <div
                      className="absolute left-2.5 top-2.5 w-2 h-2 rounded-full -translate-x-1/2"
                      style={{ backgroundColor: "var(--text-muted)" }}
                    />
                    <div
                      className="p-3 rounded-lg text-xs leading-relaxed border"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span className="font-semibold text-[11px] block uppercase tracking-wider mb-1" style={{ color: "var(--accent)" }}>
                        02 · Focused Follow-Up
                      </span>
                      &ldquo;Do you have any fever, stiff neck, or nausea accompanying the headache?&rdquo;
                    </div>
                  </div>

                  {/* Stage 3: Clear Direction & Care Resolution */}
                  <div className="relative pl-8">
                    <div
                      className="absolute left-2.5 top-2.5 w-2 h-2 rounded-full -translate-x-1/2"
                      style={{ backgroundColor: "var(--urgency-mod)" }}
                    />
                    <div
                      className="p-3.5 rounded-lg border text-xs"
                      style={{
                        backgroundColor: "var(--urgency-mod-bg)",
                        borderColor: "var(--urgency-mod-border)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="font-bold uppercase tracking-wider text-[10.5px] px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: "var(--surface)",
                            color: "var(--urgency-mod)",
                          }}
                        >
                          Moderate Urgency
                        </span>
                        <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                          Decision Clarity
                        </span>
                      </div>
                      <div className="font-semibold text-[13px] mb-1" style={{ color: "var(--text-primary)" }}>
                        Migraine-type presentation
                      </div>
                      <p className="text-[11.5px] leading-relaxed mb-2.5" style={{ color: "var(--text-secondary)" }}>
                        Self-care in a quiet dark room is appropriate now. Consult a physician if pain persists past 48 hours.
                      </p>
                      <div
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        <span>Verified facilities available by PIN</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3-Stage Visual Progression Line ── */}
          <div className="mt-16 pt-10 border-t border-[var(--border)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  number: "01",
                  title: "Describe your concern",
                  description: "Use voice or plain text. No medical terminology needed.",
                },
                {
                  number: "02",
                  title: "Understand urgency",
                  description: "Nivara asks concise follow-ups and assesses severity calmly.",
                },
                {
                  number: "03",
                  title: "Decide what to do next",
                  description: "Actionable self-care, warning signs, and local care navigation in India.",
                },
              ].map((step) => (
                <div key={step.number} className="flex flex-col text-left">
                  <div
                    className="font-mono text-xs font-bold mb-1.5 tracking-wider"
                    style={{ color: "var(--accent)" }}
                  >
                    {step.number}
                  </div>
                  <h3
                    className="font-serif text-base font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Minimal Medical Safety Disclaimer ── */}
          <footer className="mt-14 pt-6 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[11.5px] leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              <strong>Clinical notice:</strong> Nivara is an intelligent health triage and care navigation guide for users in India. It does not provide medical diagnoses or prescriptions. For sudden severe chest pain, stroke signs, difficulty breathing, or severe trauma, call India&apos;s unified emergency number <strong style={{ color: "var(--urgency-emg)" }}>112</strong> or visit the nearest emergency department immediately.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
