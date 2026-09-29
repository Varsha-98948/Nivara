"use client";

import { Shield, Clock, MapPin, MessageCircle } from "lucide-react";
import NivaraLogo from "./NivaraLogo";

interface WelcomeScreenProps {
  onStart: () => void;
}

const features = [
  {
    icon: MessageCircle,
    title: "Symptom Understanding",
    desc: "Describe what you're feeling in your own words. Nivara listens and asks the right questions.",
  },
  {
    icon: Shield,
    title: "Urgency Guidance",
    desc: "Know whether to call 911, visit urgent care, or manage at home — clearly and calmly.",
  },
  {
    icon: Clock,
    title: "Self-Care Advice",
    desc: "Get evidence-based self-care tips and warning signs to watch for.",
  },
  {
    icon: MapPin,
    title: "Find Care Nearby",
    desc: "Locate emergency rooms, urgent care centres, and pharmacies near you.",
  },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ivory)" }}>
      {/* Nav */}
      <nav
        style={{
          borderBottom: "1px solid var(--mint-dark)",
          background: "var(--white)",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "var(--shadow-sm)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <NivaraLogo size={22} />
        <span
          style={{
            fontSize: 13,
            color: "var(--charcoal-light)",
            fontWeight: 500,
            padding: "5px 14px",
            border: "1px solid var(--mint-dark)",
            borderRadius: 99,
            background: "var(--mint)",
          }}
        >
          AI Health Assistant
        </span>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div
          className="animate-fade-in-up"
          style={{ maxWidth: 680, width: "100%", textAlign: "center" }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 mb-8"
            style={{
              background: "var(--mint)",
              border: "1px solid var(--mint-dark)",
              borderRadius: 99,
              padding: "6px 16px",
              fontSize: 13,
              color: "var(--forest-mid)",
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--forest-light)",
              }}
            />
            Powered by Gemini AI
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "Lora, Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 600,
              color: "var(--charcoal)",
              lineHeight: 1.2,
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
          >
            Understand your health.{" "}
            <span style={{ color: "var(--forest)" }}>Know what to do next.</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              color: "var(--charcoal-mid)",
              lineHeight: 1.7,
              marginBottom: 44,
              maxWidth: 540,
              margin: "0 auto 44px",
            }}
          >
            Describe what you&apos;re experiencing and Nivara helps you understand your
            concern, assess its urgency, and find the right next step.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="start-with-nivara-btn"
              onClick={onStart}
              style={{
                background: "var(--forest)",
                color: "var(--white)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "14px 36px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 16px rgba(30,77,53,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--forest-mid)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 20px rgba(30,77,53,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--forest)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 16px rgba(30,77,53,0.25)";
              }}
            >
              Start with Nivara
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p
              style={{
                fontSize: 12,
                color: "var(--charcoal-light)",
                marginTop: 0,
              }}
            >
              No sign-up required · Not a substitute for medical advice
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div
          className="animate-fade-in-up"
          style={{
            maxWidth: 800,
            width: "100%",
            marginTop: 80,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            animationDelay: "0.15s",
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "var(--white)",
                border: "1px solid var(--mint-dark)",
                borderRadius: "var(--radius)",
                padding: "24px 20px",
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
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "var(--mint)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Icon size={20} color="var(--forest-mid)" strokeWidth={1.8} />
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
                  fontSize: 13.5,
                  color: "var(--charcoal-light)",
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          className="animate-fade-in"
          style={{
            marginTop: 56,
            padding: "14px 20px",
            background: "var(--ivory-dark)",
            border: "1px solid var(--mint-dark)",
            borderRadius: "var(--radius-sm)",
            maxWidth: 600,
            textAlign: "center",
            animationDelay: "0.3s",
          }}
        >
          <p
            style={{
              fontSize: 12.5,
              color: "var(--charcoal-light)",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "var(--charcoal-mid)" }}>Medical Disclaimer:</strong>{" "}
            Nivara provides general health information and is not a substitute for professional
            medical advice, diagnosis, or treatment. Always consult a qualified healthcare
            provider with questions about a medical condition.
          </p>
        </div>
      </main>
    </div>
  );
}
