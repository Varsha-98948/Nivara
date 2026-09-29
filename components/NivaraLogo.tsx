"use client";

interface NivaraLogoProps {
  size?: number;
  showWordmark?: boolean;
}

export default function NivaraLogo({ size = 24, showWordmark = true }: NivaraLogoProps) {
  const iconSize = size + 6;

  return (
    <div className="inline-flex items-center gap-2.5 select-none group">
      {/* ── Abstract Geometric Nivara Mark: Path of Clarity / "N" Gateway ── */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: 8,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xs)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "border-color 0.2s ease, transform 0.2s ease",
        }}
        className="group-hover:border-[var(--accent)]"
      >
        <svg
          width={iconSize * 0.72}
          height={iconSize * 0.72}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Continuous architectural path representing convergence from uncertainty to direction */}
          <path
            d="M 6 18.5 V 7.5 L 17 16 V 5.5"
            stroke="var(--text-primary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Guiding apex of clarity in warm terracotta */}
          <circle cx="17" cy="5.5" r="1.8" fill="var(--accent)" />
        </svg>
      </div>

      {/* ── Refined Editorial Wordmark ── */}
      {showWordmark && (
        <span
          className="font-serif tracking-tight"
          style={{
            fontSize: size * 0.95,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            display: "inline-flex",
            alignItems: "baseline",
          }}
        >
          <span>Nivara</span>
          <span
            style={{
              color: "var(--accent)",
              fontSize: size * 1.1,
              lineHeight: 0,
              marginLeft: 1.5,
              fontWeight: 700,
            }}
          >
            .
          </span>
        </span>
      )}
    </div>
  );
}
