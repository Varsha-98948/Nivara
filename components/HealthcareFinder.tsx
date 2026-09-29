"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  ExternalLink,
  Search,
  Building2,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
  Navigation,
} from "lucide-react";
import { UrgencyLevel } from "@/lib/types";
import { urgencyConfig } from "@/lib/utils";
import {
  CareCategory,
  HealthcareProvider,
  getHealthcareProviders,
  validateIndianPin,
  SAMPLE_PINS,
} from "@/lib/providers";
import { ThemeToggle } from "./ThemeProvider";
import NivaraLogo from "./NivaraLogo";

interface HealthcareFinderProps {
  onBack: () => void;
  urgency: UrgencyLevel;
  onNewAssessment?: () => void;
}

const CATEGORY_TABS: { key: CareCategory; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Facilities", icon: <Building2 size={13} /> },
  { key: "emergency", label: "Emergency Care", icon: <ShieldAlert size={13} /> },
  { key: "hospital", label: "Hospitals", icon: <Building2 size={13} /> },
  { key: "clinic", label: "Doctor / Clinic", icon: <Stethoscope size={13} /> },
];

export default function HealthcareFinder({
  onBack,
  urgency,
  onNewAssessment,
}: HealthcareFinderProps) {
  const initialCategory: CareCategory =
    urgency === "emergency" ? "emergency" : urgency === "urgent" ? "hospital" : "all";

  const [pinCode, setPinCode] = useState("110001");
  const [activeCategory, setActiveCategory] = useState<CareCategory>(initialCategory);
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const cfg = urgencyConfig(urgency);
  const isEmergencyOrUrgent = urgency === "emergency" || urgency === "urgent";

  const performLookup = useCallback(
    async (codeToLookup: string, categoryToLookup: CareCategory) => {
      const validation = validateIndianPin(codeToLookup);
      if (!validation.valid) {
        setValidationError(validation.error || "Invalid PIN code");
        return;
      }

      setValidationError(null);
      setIsLoading(true);
      setHasSearched(true);

      try {
        const results = await getHealthcareProviders(codeToLookup, categoryToLookup);
        setProviders(results);
      } catch {
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    performLookup(pinCode, activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(pinCode, activeCategory);
  };

  const handleCategoryChange = (newCat: CareCategory) => {
    setActiveCategory(newCat);
    performLookup(pinCode, newCat);
  };

  const handleQuickPinSelect = (samplePin: string) => {
    setPinCode(samplePin);
    setValidationError(null);
    performLookup(samplePin, activeCategory);
  };

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
            id="finder-back-btn"
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
            <span>Back to guidance</span>
          </button>

          <div className="flex items-center gap-2.5">
            {onNewAssessment && (
              <button
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
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Main Container (Aligned max-w-2xl) ── */}
      <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-8">
        <div className="max-w-2xl mx-auto w-full space-y-5 animate-fade-in-up">
          {/* Triage Context Card */}
          {urgency && (
            <div
              className="p-4 rounded-xl border shadow-xs flex items-center justify-between gap-4"
              style={{
                backgroundColor: isEmergencyOrUrgent ? "var(--urgency-emg-bg)" : "var(--surface)",
                borderColor: isEmergencyOrUrgent ? "var(--urgency-emg-border)" : "var(--border)",
              }}
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: cfg.color }}>
                  {cfg.label} Care Recommended
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {urgency === "emergency"
                    ? "24/7 hospital casualty wards & emergency units are highlighted below."
                    : "Nearest available healthcare facilities matching your location."}
                </div>
              </div>

              {isEmergencyOrUrgent && (
                <a
                  href="tel:112"
                  className="interactive-tap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: "var(--urgency-emg)",
                    color: "#FFFFFF",
                  }}
                >
                  <Phone size={13} />
                  <span>Dial 112</span>
                </a>
              )}
            </div>
          )}

          {/* Search Box */}
          <div
            className="p-5 rounded-xl border shadow-xs"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Locate Facilities by PIN
              </h2>
              <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                6-Digit Postal Code
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div
                className="flex-1 flex items-center px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: validationError ? "var(--urgency-emg)" : "var(--border)",
                }}
              >
                <MapPin size={15} style={{ color: "var(--text-muted)", marginRight: 8 }} />
                <input
                  id="pin-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPinCode(val);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Enter 6-digit Indian PIN (e.g. 110001)"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold tracking-wider"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              <button
                id="search-facilities-btn"
                type="submit"
                disabled={isLoading}
                className="interactive-tap inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shrink-0"
                style={{
                  backgroundColor: "var(--botanical)",
                  color: "var(--botanical-contrast)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <Search size={14} />
                <span>{isLoading ? "Searching…" : "Search"}</span>
              </button>
            </form>

            {/* Validation Error */}
            {validationError && (
              <div
                className="flex items-center gap-1.5 text-xs font-medium mt-2"
                style={{ color: "var(--urgency-emg)" }}
              >
                <AlertTriangle size={13} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Quick Sample PIN Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-3 border-t border-[var(--border-subtle)]">
              <span className="text-[11px] font-medium mr-1" style={{ color: "var(--text-muted)" }}>
                Verified PINs:
              </span>
              {SAMPLE_PINS.map(({ pin, label }) => (
                <button
                  key={pin}
                  type="button"
                  onClick={() => handleQuickPinSelect(pin)}
                  className="interactive-tap text-[11px] font-medium px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: pinCode === pin ? "var(--accent-soft)" : "var(--surface)",
                    borderColor: pinCode === pin ? "var(--accent-border)" : "var(--border)",
                    color: pinCode === pin ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  {pin} <span className="opacity-70">({label.split(" ")[0]})</span>
                </button>
              ))}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)] overflow-x-auto scrollbar-none">
              {CATEGORY_TABS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(key)}
                  className="interactive-tap inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md shrink-0"
                  style={{
                    backgroundColor: activeCategory === key ? "var(--botanical)" : "var(--bg-subtle)",
                    color: activeCategory === key ? "var(--botanical-contrast)" : "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Result Count and Source Attribution Line */}
          <div className="flex items-center justify-between text-xs px-1" style={{ color: "var(--text-muted)" }}>
            <div>
              Facilities near PIN <strong>{pinCode}</strong> ({providers.length} found)
            </div>
            <div className="text-[11px]">
              Source: India Hospital Directory (NHP / Living Atlas)
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div
              className="p-8 rounded-xl border text-center animate-fade-in"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex justify-center items-center gap-1.5 mb-2">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Retrieving verified healthcare facilities near PIN {pinCode}…
              </div>
            </div>
          )}

          {/* Facility Cards List */}
          {!isLoading && providers.length > 0 && (
            <div className="space-y-3">
              {providers.map((p) => {
                const isEmg = p.category === "emergency" || p.emergencyAvailable;
                const mapsQuery =
                  typeof p.lat === "number" && typeof p.lon === "number"
                    ? `${p.lat},${p.lon}`
                    : `${p.name}, ${p.address}`;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-xl border shadow-xs transition-colors animate-fade-in-up"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: isEmg ? "var(--urgency-emg-border)" : "var(--border)",
                    }}
                  >
                    {/* Header Row: Category Badge + Distance */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            backgroundColor:
                              p.category === "emergency"
                                ? "var(--urgency-emg-bg)"
                                : "var(--bg-subtle)",
                            color:
                              p.category === "emergency"
                                ? "var(--urgency-emg)"
                                : "var(--text-secondary)",
                            border: `1px solid ${
                              p.category === "emergency"
                                ? "var(--urgency-emg-border)"
                                : "var(--border-subtle)"
                            }`,
                          }}
                        >
                          {p.categoryLabel}
                        </span>

                        {p.emergencyAvailable && (
                          <span
                            className="text-[10.5px] font-semibold px-2 py-0.5 rounded flex items-center gap-1"
                            style={{
                              backgroundColor: "var(--urgency-mod-bg)",
                              color: "var(--urgency-mod)",
                              border: "1px solid var(--urgency-mod-border)",
                            }}
                          >
                            <ShieldAlert size={11} />
                            <span>24/7 Emergency</span>
                          </span>
                        )}
                      </div>

                      {p.distanceKm && (
                        <div
                          className="inline-flex items-center gap-1 text-xs font-semibold"
                          style={{ color: "var(--accent)" }}
                        >
                          <Navigation size={12} />
                          <span>~{p.distanceKm} km</span>
                        </div>
                      )}
                    </div>

                    {/* Facility Name */}
                    <h3 className="font-serif text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      {p.name}
                    </h3>

                    {/* Address & Locality */}
                    <p className="text-xs leading-relaxed mb-3 flex items-start gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <MapPin size={13} className="shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                      <span>{p.address}</span>
                    </p>

                    {/* Operational Details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs mb-3.5" style={{ color: "var(--text-muted)" }}>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{p.hours}</span>
                      </div>
                      {p.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          <span>{p.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactive-tap inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md"
                        style={{
                          backgroundColor: "var(--botanical)",
                          color: "var(--botanical-contrast)",
                        }}
                      >
                        <MapPin size={12} />
                        <span>Get Directions</span>
                        <ExternalLink size={11} className="opacity-70" />
                      </a>

                      {p.phone && (
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, "")}`}
                          className="interactive-tap inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border"
                          style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <Phone size={12} />
                          <span>Call Facility</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Graceful Empty State */}
          {!isLoading && hasSearched && providers.length === 0 && (
            <div
              className="p-8 rounded-xl border text-center space-y-3 animate-fade-in"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--bg-subtle)" }}>
                <Building2 size={20} style={{ color: "var(--text-muted)" }} />
              </div>
              <h3 className="font-serif text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                {activeCategory === "all"
                  ? "No Facilities in Current Dataset for this PIN"
                  : "No Facilities Found for this Category"}
              </h3>
              <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                {activeCategory === "all"
                  ? `No matching records for PIN ${pinCode} were found in the India Hospital Directory dataset. Try a nearby postal PIN code or a major district center.`
                  : `No facilities in category "${activeCategory}" for PIN ${pinCode}. Try selecting "All Facilities" or searching a nearby PIN.`}
              </p>
              {activeCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("all")}
                  className="interactive-tap text-xs font-semibold px-3 py-1.5 rounded-md"
                  style={{
                    backgroundColor: "var(--botanical)",
                    color: "var(--botanical-contrast)",
                  }}
                >
                  Show All Facilities
                </button>
              )}
            </div>
          )}

          {/* India Emergency Helpline Box */}
          <div
            className="p-4 rounded-xl border flex items-center justify-between gap-4 text-xs"
            style={{
              backgroundColor: "var(--urgency-emg-bg)",
              borderColor: "var(--urgency-emg-border)",
            }}
          >
            <div>
              <div className="font-bold mb-0.5" style={{ color: "var(--urgency-emg)" }}>
                India National Emergency Lines
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                Unified Emergency: <strong>112</strong> · Medical Ambulance: <strong>108 / 102</strong>
              </div>
            </div>

            <a
              href="tel:112"
              className="interactive-tap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shrink-0"
              style={{
                backgroundColor: "var(--urgency-emg)",
                color: "#FFFFFF",
              }}
            >
              <Phone size={12} />
              <span>Call 112</span>
            </a>
          </div>

          {/* Medical Disclaimer */}
          <footer className="pt-4 text-center border-t border-[var(--border-subtle)]">
            <p className="text-[11.5px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              <strong>Attribution:</strong> Facility directory data is sourced from the official Hospital Directory of India (National Health Portal / Living Atlas). Listings reflect verified facilities in the dataset for the searched postal PIN. Always verify operating hours and emergency availability directly with the facility.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
