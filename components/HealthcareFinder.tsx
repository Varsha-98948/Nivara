"use client";

import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Search,
  MapPin,
  Navigation,
  ExternalLink,
  Phone,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { UrgencyLevel } from "@/lib/types";
import { urgencyConfig } from "@/lib/utils";

interface HealthcareFinderProps {
  onBack: () => void;
  urgency: UrgencyLevel;
}

type FacilityType = "emergency" | "urgent" | "clinic" | "pharmacy";

interface Facility {
  name: string;
  type: FacilityType;
  distance: string;
  address: string;
  phone: string;
  hours: string;
  open: boolean;
  googleMapsUrl: string;
}

const FACILITY_TYPES: { key: FacilityType; label: string; icon: string }[] = [
  { key: "emergency", label: "Emergency Room", icon: "🚨" },
  { key: "urgent", label: "Urgent Care", icon: "⚕️" },
  { key: "clinic", label: "Clinic / GP", icon: "🏥" },
  { key: "pharmacy", label: "Pharmacy", icon: "💊" },
];

// Demo facilities — in production these come from a Places API
const DEMO_FACILITIES: Facility[] = [
  {
    name: "City General Hospital — Emergency",
    type: "emergency",
    distance: "1.2 mi",
    address: "100 Hospital Dr, Suite A",
    phone: "555-100-0001",
    hours: "24 / 7",
    open: true,
    googleMapsUrl: "https://maps.google.com",
  },
  {
    name: "QuickCare Urgent Center",
    type: "urgent",
    distance: "0.7 mi",
    address: "45 Elm Street",
    phone: "555-200-0002",
    hours: "8 AM – 10 PM",
    open: true,
    googleMapsUrl: "https://maps.google.com",
  },
  {
    name: "Riverside Urgent Care",
    type: "urgent",
    distance: "2.1 mi",
    address: "208 Riverside Blvd",
    phone: "555-200-0088",
    hours: "7 AM – 11 PM",
    open: true,
    googleMapsUrl: "https://maps.google.com",
  },
  {
    name: "Northside Family Clinic",
    type: "clinic",
    distance: "0.5 mi",
    address: "22 Oak Avenue",
    phone: "555-300-0003",
    hours: "9 AM – 6 PM (Mon–Fri)",
    open: false,
    googleMapsUrl: "https://maps.google.com",
  },
  {
    name: "Wellspring Medical Group",
    type: "clinic",
    distance: "1.8 mi",
    address: "88 Wellspring Way",
    phone: "555-300-0044",
    hours: "8 AM – 5 PM (Mon–Sat)",
    open: true,
    googleMapsUrl: "https://maps.google.com",
  },
  {
    name: "MedPlus Pharmacy",
    type: "pharmacy",
    distance: "0.3 mi",
    address: "10 Main Street",
    phone: "555-400-0004",
    hours: "8 AM – 9 PM",
    open: true,
    googleMapsUrl: "https://maps.google.com",
  },
  {
    name: "HealthFirst Pharmacy",
    type: "pharmacy",
    distance: "1.0 mi",
    address: "56 Commerce Road",
    phone: "555-400-0055",
    hours: "9 AM – 8 PM",
    open: true,
    googleMapsUrl: "https://maps.google.com",
  },
];

const FACILITY_COLORS: Record<FacilityType, { color: string; bg: string; border: string }> = {
  emergency: { color: "var(--red-urgent)", bg: "var(--red-light)", border: "#e8a0a0" },
  urgent: { color: "var(--amber)", bg: "var(--amber-light)", border: "#e8c890" },
  clinic: { color: "var(--forest-mid)", bg: "var(--mint)", border: "var(--mint-dark)" },
  pharmacy: { color: "#5b6baa", bg: "#eef0fa", border: "#c0c8e8" },
};

function FacilityCard({ f }: { f: Facility }) {
  const colors = FACILITY_COLORS[f.type];
  const typeInfo = FACILITY_TYPES.find((t) => t.key === f.type)!;
  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: "var(--white)",
        border: "1px solid var(--mint-dark)",
        borderRadius: "var(--radius)",
        padding: "20px 22px",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.2s, transform 0.2s",
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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                background: colors.bg,
                color: colors.color,
                border: `1px solid ${colors.border}`,
                borderRadius: 99,
                padding: "2px 10px",
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {typeInfo.icon} {typeInfo.label}
            </span>
            <span
              style={{
                background: f.open ? "var(--mint)" : "var(--ivory-dark)",
                color: f.open ? "var(--forest-mid)" : "var(--charcoal-light)",
                border: `1px solid ${f.open ? "var(--mint-dark)" : "#ccc"}`,
                borderRadius: 99,
                padding: "2px 10px",
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              {f.open ? "Open" : "Closed"}
            </span>
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "var(--charcoal)", lineHeight: 1.3 }}>
            {f.name}
          </div>
        </div>
        <div
          style={{
            flexShrink: 0,
            textAlign: "right",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--forest-mid)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Navigation size={13} />
          {f.distance}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--charcoal-mid)" }}>
          <MapPin size={13} color="var(--charcoal-light)" />
          {f.address}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--charcoal-mid)" }}>
          <Phone size={13} color="var(--charcoal-light)" />
          <a href={`tel:${f.phone}`} style={{ color: "inherit", textDecoration: "none" }}>{f.phone}</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--charcoal-mid)" }}>
          <Clock size={13} color="var(--charcoal-light)" />
          {f.hours}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <a
          href={f.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            background: "var(--forest)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-xs)",
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          <MapPin size={13} />
          Get Directions
        </a>
        <a
          href={`tel:${f.phone}`}
          style={{
            background: "var(--mint)",
            color: "var(--forest-mid)",
            border: "1px solid var(--mint-dark)",
            borderRadius: "var(--radius-xs)",
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          <Phone size={13} />
          Call
        </a>
      </div>
    </div>
  );
}

export default function HealthcareFinder({ onBack, urgency }: HealthcareFinderProps) {
  const [activeType, setActiveType] = useState<FacilityType | "all">("all");
  const [search, setSearch] = useState("");
  const cfg = urgencyConfig(urgency);

  const filtered = useCallback(() => {
    let list = DEMO_FACILITIES;
    if (activeType !== "all") list = list.filter((f) => f.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeType, search])();

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
          Back
        </button>
        <h1
          style={{
            fontFamily: "Lora, Georgia, serif",
            fontSize: 18,
            fontWeight: 600,
            color: "var(--charcoal)",
          }}
        >
          Find Care Nearby
        </h1>
      </header>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 20px 48px",
        }}
      >
        <div
          style={{ maxWidth: 720, margin: "0 auto" }}
          className="animate-fade-in-up"
        >
          {/* Urgency reminder */}
          {urgency && urgency !== "routine" && (
            <div
              style={{
                background: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                borderRadius: "var(--radius)",
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <AlertTriangle size={18} color={cfg.color} />
              <div>
                <span style={{ fontWeight: 700, color: cfg.color, fontSize: 14 }}>
                  {cfg.label}:{" "}
                </span>
                <span style={{ fontSize: 14, color: "var(--charcoal-mid)" }}>
                  {cfg.description}
                </span>
              </div>
            </div>
          )}

          {/* Search */}
          <div
            style={{
              background: "var(--white)",
              border: "1.5px solid var(--mint-dark)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 16px",
              marginBottom: 20,
              boxShadow: "var(--shadow-sm)",
              transition: "border-color 0.2s",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--forest-light)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--mint-dark)";
            }}
          >
            <Search size={16} color="var(--charcoal-light)" />
            <input
              id="facility-search-input"
              type="text"
              placeholder="Search by name or area…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 15,
                color: "var(--charcoal)",
                padding: "14px 0",
                fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--charcoal-light)", fontSize: 18 }}
              >
                ×
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <button
              onClick={() => setActiveType("all")}
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                border: `1.5px solid ${activeType === "all" ? "var(--forest)" : "var(--mint-dark)"}`,
                background: activeType === "all" ? "var(--forest)" : "var(--white)",
                color: activeType === "all" ? "white" : "var(--charcoal-mid)",
                transition: "all 0.2s",
              }}
            >
              All
            </button>
            {FACILITY_TYPES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: `1.5px solid ${activeType === key ? "var(--forest)" : "var(--mint-dark)"}`,
                  background: activeType === key ? "var(--forest)" : "var(--white)",
                  color: activeType === key ? "white" : "var(--charcoal-mid)",
                  transition: "all 0.2s",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Emergency numbers */}
          <div
            style={{
              background: "var(--red-light)",
              border: "1px solid #e8a0a0",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Phone size={18} color="var(--red-urgent)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--red-urgent)" }}>
                  Emergency Numbers
                </div>
                <div style={{ fontSize: 13, color: "var(--charcoal-mid)" }}>
                  US: 911 · UK: 999 · EU: 112 · Poison Control: 1-800-222-1222
                </div>
              </div>
            </div>
            <a
              href="tel:911"
              style={{
                background: "var(--red-urgent)",
                color: "white",
                padding: "8px 18px",
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
              Call 911
            </a>
          </div>

          {/* Results note */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "var(--charcoal-light)" }}>
              {filtered.length} location{filtered.length !== 1 ? "s" : ""} found
              <span style={{ marginLeft: 4 }}>· Demo data — enable location for live results</span>
            </p>
            <a
              href={`https://maps.google.com/maps?q=urgent+care+near+me`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: "var(--forest-mid)",
                display: "flex",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Open in Google Maps <ExternalLink size={12} />
            </a>
          </div>

          {/* Facility cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((f) => (
              <FacilityCard key={f.name} f={f} />
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  color: "var(--charcoal-light)",
                  background: "var(--white)",
                  border: "1px solid var(--mint-dark)",
                  borderRadius: "var(--radius)",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <p>No locations match your search. Try a different term or filter.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
