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
  Sparkles,
  ShieldAlert,
  Building2,
  Stethoscope,
  HeartPulse,
  Navigation,
  CheckCircle2,
  RotateCcw,
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

interface HealthcareFinderProps {
  onBack: () => void;
  urgency: UrgencyLevel;
  onNewAssessment?: () => void;
}

const CATEGORY_TABS: { key: CareCategory; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All Facilities", icon: <Building2 size={14} /> },
  { key: "emergency", label: "Emergency Care", icon: <ShieldAlert size={14} /> },
  { key: "hospital", label: "Hospitals", icon: <Building2 size={14} /> },
  { key: "clinic", label: "Doctor / Clinic", icon: <Stethoscope size={14} /> },
];

export default function HealthcareFinder({
  onBack,
  urgency,
  onNewAssessment,
}: HealthcareFinderProps) {
  // If user came with urgent/emergency triage, default category to emergency/hospital
  const initialCategory: CareCategory =
    urgency === "emergency" ? "emergency" : urgency === "urgent" ? "hospital" : "all";

  const [pinCode, setPinCode] = useState("560001");
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

  // Initial lookup on mount
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
      style={{
        minHeight: "100vh",
        background: "var(--ivory)",
        display: "flex",
        flexDirection: "column",
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
          boxShadow: "var(--shadow-sm)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <button
          id="finder-back-btn"
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
          Back to summary
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
              Healthcare Navigation
            </h1>
            <p style={{ fontSize: 11.5, color: "var(--charcoal-light)", margin: 0 }}>
              PIN-code based facility locator
            </p>
          </div>

          {onNewAssessment && (
            <button
              id="finder-new-assessment-header-btn"
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
          )}
        </div>
      </header>

      {/* ── Main Container ── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px 48px",
        }}
      >
        <div
          style={{ maxWidth: 740, margin: "0 auto" }}
          className="animate-fade-in-up"
        >
          {/* Urgency Highlight Banner if user has urgent/emergency triage status */}
          {urgency && urgency !== "routine" && (
            <div
              style={{
                background: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                borderRadius: "var(--radius)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                marginBottom: 20,
                boxShadow: isEmergencyOrUrgent ? "var(--shadow-md)" : "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 24, lineHeight: 1 }}>{cfg.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: cfg.color, fontSize: 14 }}>
                    {cfg.label} Triage Level
                  </div>
                  <div style={{ fontSize: 13.5, color: "var(--charcoal)", lineHeight: 1.45 }}>
                    {urgency === "emergency"
                      ? "Emergency services & 24/7 hospital emergency rooms are highlighted below."
                      : urgency === "urgent"
                      ? "Immediate medical evaluation within 24 hours is advised."
                      : cfg.description}
                  </div>
                </div>
              </div>

              {/* Quick National Emergency dial link for urgent/emergency */}
              {isEmergencyOrUrgent && (
                <a
                  href="tel:112"
                  style={{
                    background: "var(--red-urgent)",
                    color: "white",
                    borderRadius: "var(--radius-xs)",
                    padding: "8px 14px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(184,44,44,0.25)",
                  }}
                >
                  <Phone size={13} />
                  Dial 112
                </a>
              )}
            </div>
          )}

          {/* ── Search & Filter Box ── */}
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--mint-dark)",
              borderRadius: "var(--radius)",
              padding: "20px 22px",
              boxShadow: "var(--shadow-sm)",
              marginBottom: 20,
            }}
          >
            <form onSubmit={handleSearchSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <label
                  htmlFor="pin-input"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--charcoal-mid)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <MapPin size={15} color="var(--forest)" />
                  Enter 6-Digit Indian PIN Code
                </label>
                <span style={{ fontSize: 12, color: "var(--charcoal-light)" }}>
                  e.g., 560001, 110001, 400001
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "stretch",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "1 1 240px",
                    display: "flex",
                    alignItems: "center",
                    background: "var(--ivory)",
                    border: `1.5px solid ${validationError ? "var(--red-urgent)" : "var(--mint-dark)"}`,
                    borderRadius: "var(--radius-sm)",
                    padding: "0 14px",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
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
                    placeholder="Enter 6-digit PIN (e.g. 560001)"
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "var(--charcoal)",
                      padding: "12px 0",
                      fontFamily: "inherit",
                    }}
                  />
                  {pinCode.length === 6 && !validationError && (
                    <CheckCircle2 size={18} color="var(--forest-light)" />
                  )}
                </div>

                <button
                  id="search-facilities-btn"
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: "var(--forest)",
                    color: "white",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    padding: "0 22px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 2px 6px rgba(30,77,53,0.2)",
                    transition: "background 0.15s ease",
                    minHeight: 46,
                  }}
                >
                  <Search size={15} />
                  <span>{isLoading ? "Searching…" : "Find Nearby Facilities"}</span>
                </button>
              </div>

              {/* Inline Validation Error */}
              {validationError && (
                <div
                  className="animate-fade-in"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--red-urgent)",
                    fontSize: 12.5,
                    marginTop: 8,
                    fontWeight: 500,
                  }}
                >
                  <AlertTriangle size={14} />
                  <span>{validationError}</span>
                </div>
              )}
            </form>

            {/* Quick Sample PIN Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--charcoal-light)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Sample PINs:
              </span>
              {SAMPLE_PINS.map(({ pin, label }) => (
                <button
                  key={pin}
                  type="button"
                  onClick={() => handleQuickPinSelect(pin)}
                  style={{
                    background: pinCode === pin ? "var(--mint)" : "var(--ivory)",
                    border: `1px solid ${pinCode === pin ? "var(--forest-light)" : "var(--mint-dark)"}`,
                    borderRadius: 99,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: pinCode === pin ? "var(--forest)" : "var(--charcoal-mid)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {pin} <span style={{ opacity: 0.75 }}>({label.split(" ")[0]})</span>
                </button>
              ))}
            </div>

            {/* ── Category Filter Tabs ── */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                marginTop: 18,
                paddingTop: 14,
                borderTop: "1px solid var(--mint-dark)",
              }}
            >
              {CATEGORY_TABS.map(({ key, label, icon }) => {
                const isSelected = activeCategory === key;
                const isEmergencyTab = key === "emergency";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCategoryChange(key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 14px",
                      borderRadius: 99,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: isSelected
                        ? `1.5px solid ${isEmergencyTab ? "var(--red-urgent)" : "var(--forest)"}`
                        : "1px solid var(--mint-dark)",
                      background: isSelected
                        ? isEmergencyTab
                          ? "var(--red-light)"
                          : "var(--forest)"
                        : "var(--white)",
                      color: isSelected
                        ? isEmergencyTab
                          ? "var(--red-urgent)"
                          : "white"
                        : "var(--charcoal-mid)",
                      transition: "all 0.15s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Status Bar & MVP Demo Data Notice ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
              flexWrap: "wrap",
              gap: 8,
              fontSize: 12.5,
              color: "var(--charcoal-light)",
            }}
          >
            <div>
              Showing facilities around PIN <strong>{pinCode}</strong> ({providers.length} found)
            </div>
            <div style={{ fontStyle: "italic", fontSize: 12 }}>
              Demonstration provider data · Live Maps API ready
            </div>
          </div>

          {/* ── Loading State ── */}
          {isLoading && (
            <div
              className="animate-fade-in"
              style={{
                background: "var(--white)",
                border: "1px solid var(--mint-dark)",
                borderRadius: "var(--radius)",
                padding: "36px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  gap: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <div style={{ fontSize: 14.5, color: "var(--charcoal-mid)", fontWeight: 500 }}>
                Looking up healthcare facilities near PIN {pinCode}…
              </div>
            </div>
          )}

          {/* ── Provider Cards List ── */}
          {!isLoading && providers.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {providers.map((p) => {
                const isEmg = p.category === "emergency" || p.emergencyAvailable;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${p.name}, ${p.address}`
                )}`;

                return (
                  <div
                    key={p.id}
                    className="animate-fade-in-up"
                    style={{
                      background: "var(--white)",
                      border: `1.5px solid ${isEmg ? "#f0c080" : "var(--mint-dark)"}`,
                      borderRadius: "var(--radius)",
                      padding: "20px 22px",
                      boxShadow: isEmg ? "var(--shadow-md)" : "var(--shadow-sm)",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = isEmg
                        ? "var(--shadow-md)"
                        : "var(--shadow-sm)";
                    }}
                  >
                    {/* Card Top Row: Type Badge + Distance */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            background:
                              p.category === "emergency"
                                ? "var(--red-light)"
                                : p.category === "hospital"
                                ? "var(--mint)"
                                : "var(--ivory-dark)",
                            color:
                              p.category === "emergency"
                                ? "var(--red-urgent)"
                                : p.category === "hospital"
                                ? "var(--forest)"
                                : "var(--forest-mid)",
                            border: `1px solid ${
                              p.category === "emergency"
                                ? "#e8a0a0"
                                : p.category === "hospital"
                                ? "var(--mint-dark)"
                                : "#cbd5e1"
                            }`,
                            borderRadius: 99,
                            padding: "3px 10px",
                            fontSize: 11.5,
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                          }}
                        >
                          {p.categoryLabel}
                        </span>

                        {p.emergencyAvailable && (
                          <span
                            style={{
                              background: "#fff3e0",
                              color: "#b06010",
                              border: "1px solid #f0c080",
                              borderRadius: 99,
                              padding: "2px 8px",
                              fontSize: 11,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <ShieldAlert size={12} />
                            24/7 Emergency
                          </span>
                        )}
                      </div>

                      {p.distanceKm && (
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--forest-mid)",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            flexShrink: 0,
                          }}
                        >
                          <Navigation size={13} />
                          <span>~{p.distanceKm} km</span>
                        </div>
                      )}
                    </div>

                    {/* Facility Name & Area */}
                    <h3
                      style={{
                        margin: "0 0 4px",
                        fontSize: 16.5,
                        fontWeight: 700,
                        color: "var(--charcoal)",
                        lineHeight: 1.35,
                      }}
                    >
                      {p.name}
                    </h3>

                    <div style={{ fontSize: 13, color: "var(--charcoal-mid)", marginBottom: 12 }}>
                      {p.area}, {p.city} · PIN {p.pinCode}
                    </div>

                    {/* Metadata details */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        fontSize: 13,
                        color: "var(--charcoal-mid)",
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <MapPin size={14} color="var(--charcoal-light)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>{p.address}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Clock size={14} color="var(--charcoal-light)" style={{ flexShrink: 0 }} />
                        <span>{p.hours}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Phone size={14} color="var(--charcoal-light)" style={{ flexShrink: 0 }} />
                        <a
                          href={`tel:${p.phone.replace(/\s+/g, "")}`}
                          style={{ color: "inherit", textDecoration: "none", fontWeight: 500 }}
                        >
                          {p.phone}
                        </a>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: "1 1 180px",
                          background: isEmg ? "var(--forest)" : "var(--white)",
                          color: isEmg ? "white" : "var(--forest)",
                          border: isEmg ? "none" : "1.5px solid var(--forest-light)",
                          borderRadius: "var(--radius-xs)",
                          padding: "10px 16px",
                          fontSize: 13.5,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          textDecoration: "none",
                          boxShadow: isEmg ? "0 2px 6px rgba(30,77,53,0.2)" : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <MapPin size={14} />
                        <span>Get Directions</span>
                        <ExternalLink size={12} style={{ opacity: 0.7 }} />
                      </a>

                      <a
                        href={`tel:${p.phone.replace(/\s+/g, "")}`}
                        style={{
                          background: "var(--mint)",
                          color: "var(--forest-mid)",
                          border: "1px solid var(--mint-dark)",
                          borderRadius: "var(--radius-xs)",
                          padding: "10px 16px",
                          fontSize: 13.5,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          textDecoration: "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Phone size={14} />
                        <span>Call Facility</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Empty State ── */}
          {!isLoading && hasSearched && providers.length === 0 && (
            <div
              className="animate-fade-in"
              style={{
                textAlign: "center",
                padding: "48px 24px",
                background: "var(--white)",
                border: "1px solid var(--mint-dark)",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏥</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 17, color: "var(--charcoal)" }}>
                No Facilities Found for this Category
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--charcoal-light)",
                  maxWidth: 420,
                  margin: "0 auto 16px",
                  lineHeight: 1.5,
                }}
              >
                No matching healthcare providers in category &ldquo;{activeCategory}&rdquo; for PIN {pinCode}.
                Try selecting &ldquo;All Facilities&rdquo; or a different PIN code.
              </p>
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                style={{
                  background: "var(--forest)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-xs)",
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Show All Facilities
              </button>
            </div>
          )}

          {/* ── Emergency Call Helpline Box ── */}
          <div
            style={{
              background: "var(--red-light)",
              border: "1px solid #e8a0a0",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Phone size={18} color="var(--red-urgent)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--red-urgent)" }}>
                  National Emergency Helplines (India)
                </div>
                <div style={{ fontSize: 12.5, color: "var(--charcoal-mid)" }}>
                  National Emergency: 112 · Medical Ambulance: 108 / 102
                </div>
              </div>
            </div>
            <a
              href="tel:112"
              style={{
                background: "var(--red-urgent)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "var(--radius-xs)",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Phone size={13} />
              Call 112
            </a>
          </div>

          {/* ── Navigation Bottom Bar ── */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              padding: "16px 20px",
              background: "var(--white)",
              border: "1px solid var(--mint-dark)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={{
                background: "transparent",
                border: "1px solid var(--mint-dark)",
                borderRadius: "var(--radius-xs)",
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                color: "var(--charcoal-mid)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Triage Guidance</span>
            </button>

            {onNewAssessment && (
              <button
                type="button"
                id="finder-new-assessment-footer-btn"
                onClick={onNewAssessment}
                style={{
                  background: "var(--forest)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-xs)",
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  boxShadow: "0 2px 6px rgba(30,77,53,0.2)",
                }}
              >
                <RotateCcw size={14} />
                <span>Start New Assessment</span>
              </button>
            )}
          </div>

          {/* ── Medical Disclaimer ── */}
          <footer style={{ marginTop: 20, textAlign: "center", padding: "0 12px" }}>
            <p
              style={{
                fontSize: 12,
                color: "var(--charcoal-light)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <strong>Disclaimer:</strong> Provider listings and operational hours are demonstration data for navigation purposes. Always verify open hours directly with the facility. In any life-threatening situation, immediately contact national emergency services or visit the nearest casualty department.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
