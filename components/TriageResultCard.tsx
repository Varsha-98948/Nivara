"use client";

import {
  ArrowLeft,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  ShieldAlert,
  Info,
  CheckCircle2,
} from "lucide-react";
import NivaraLogo from "./NivaraLogo";
import { TriageResult, UrgencyLevel } from "@/lib/types";
import { urgencyConfig } from "@/lib/utils";
import { ThemeToggle } from "./ThemeProvider";

interface TriageResultCardProps {
  result: TriageResult;
  onBack: () => void;
  onFindCare: () => void;
  onNewAssessment: () => void;
}

export default function TriageResultCard({
  result,
  onBack,
  onFindCare,
  onNewAssessment,
}: TriageResultCardProps) {
  const urgency = urgencyConfig(result.urgency);
  const isEmergency = result.urgency === "emergency";
  const isUrgent = result.urgency === "urgent";

  // Parse bullet items
  const parseList = (text: string) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[•\-\*]\s*/, ""));
  };

  const possibleExplanations = parseList(result.possible_explanations || "");
  const warningSigns = parseList(result.warningSigns || "");
  const selfCareTips = parseList(result.selfCare || "");
  const symptomsList = result.symptoms
    ? result.symptoms.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

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
          <button
            type="button"
            onClick={onBack}
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
            <ArrowLeft size={13} />
            <span>Back to chat</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              id="triage-new-assessment-header-btn"
              type="button"
              onClick={onNewAssessment}
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
              <span>New assessment</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Triage Guidance Container (Aligned max-w-2xl) ── */}
      <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-8">
        <div className="max-w-2xl mx-auto w-full space-y-6 animate-fade-in-up">
          {/* ── 1. Urgency Status Banner (Restrained & Clear) ── */}
          <div
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: isEmergency ? "var(--urgency-emg-bg)" : "var(--surface)",
              borderColor: isEmergency ? "var(--urgency-emg-border)" : "var(--border)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded"
                    style={{
                      backgroundColor: urgency.bg,
                      color: urgency.color,
                      border: `1px solid ${urgency.border}`,
                    }}
                  >
                    {urgency.label} Priority
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    India Protocol
                  </span>
                </div>

                <h1
                  className="font-serif text-xl sm:text-2xl font-semibold leading-snug"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isEmergency
                    ? "Immediate Emergency Attention Advised"
                    : isUrgent
                    ? "Prompt Professional Evaluation Advised"
                    : result.urgency === "moderate"
                    ? "Doctor Consultation Recommended"
                    : "Self-Care & Home Monitoring Appropriate"}
                </h1>

                <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {urgency.description}
                </p>
              </div>

              {/* Direct 112 Call for Emergency / Urgent */}
              {(isEmergency || isUrgent) && (
                <a
                  href="tel:112"
                  className="interactive-tap inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: "var(--urgency-emg)",
                    color: "#FFFFFF",
                  }}
                >
                  <Phone size={13} />
                  <span>Call 112</span>
                </a>
              )}
            </div>
          </div>

          {/* ── 2. What Nivara Understood ── */}
          <section
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <h2
              className="text-[11px] font-bold uppercase tracking-wider mb-2.5"
              style={{ color: "var(--text-muted)" }}
            >
              01 · What Nivara Understood
            </h2>

            {/* Reported Symptoms Chips */}
            {symptomsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {symptomsList.map((symp, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: "var(--bg-subtle)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {symp}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {result.summary}
            </p>
          </section>

          {/* ── 3. Possible Explanations (Not Diagnoses) ── */}
          {possibleExplanations.length > 0 && (
            <section
              className="p-5 rounded-xl border shadow-xs"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  02 · Possible Explanations
                </h2>
                <span className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>
                  Not a definitive diagnosis
                </span>
              </div>

              <div className="space-y-2 mt-3">
                {possibleExplanations.map((exp, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    <span className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {exp}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 4. Recommended Next Step (Primary Guidance) ── */}
          <section
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <h2
              className="text-[11px] font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--accent)" }}
            >
              03 · Recommended Next Step
            </h2>

            <div
              className="p-4 rounded-lg font-serif text-sm sm:text-base font-medium leading-relaxed mb-4 border"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {result.nextStep}
            </div>

            {/* Care Navigation Action Button */}
            <button
              type="button"
              onClick={onFindCare}
              className="interactive-tap w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-xs sm:text-sm shadow-sm"
              style={{
                backgroundColor: "var(--botanical)",
                color: "var(--botanical-contrast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--botanical-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--botanical)";
              }}
            >
              <MapPin size={15} />
              <span>Find Nearby Healthcare Facilities (by PIN code)</span>
              <ChevronRight size={14} />
            </button>
          </section>

          {/* ── 5. Warning Signs & Watch-Outs ── */}
          {warningSigns.length > 0 && (
            <section
              className="p-5 rounded-xl border shadow-xs"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-[11px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                style={{ color: "var(--urgency-emg)" }}
              >
                <AlertTriangle size={13} />
                <span>04 · Red Flags to Watch For</span>
              </h2>

              <div className="space-y-2">
                {warningSigns.map((sign, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: "var(--urgency-emg)" }}
                    />
                    <span className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {sign}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 6. Self-Care When Appropriate ── */}
          {selfCareTips.length > 0 && (
            <section
              className="p-5 rounded-xl border shadow-xs"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-[11px] font-bold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                05 · Practical Comfort Measures
              </h2>

              <div className="space-y-2">
                {selfCareTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: "var(--urgency-low)" }}
                    />
                    <span className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Bottom Actions Bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="interactive-tap inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-md"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              <ArrowLeft size={13} />
              <span>Back to conversation</span>
            </button>

            <button
              type="button"
              onClick={onNewAssessment}
              className="interactive-tap inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--accent)",
              }}
            >
              <RotateCcw size={13} />
              <span>Start New Assessment</span>
            </button>
          </div>

          {/* ── Medical Disclaimer ── */}
          <footer className="pt-6 pb-2 text-center border-t border-[var(--border-subtle)]">
            <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <strong>Disclaimer:</strong> Nivara is an automated health triage and navigation tool. It does not provide medical diagnoses or prescriptions. In the event of a medical emergency, call India&apos;s unified emergency number <strong style={{ color: "var(--urgency-emg)" }}>112</strong> or visit your nearest emergency department immediately.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
