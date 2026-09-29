"use client";

import { HeartPulse } from "lucide-react";

export default function NivaraLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        style={{
          width: size + 8,
          height: size + 8,
          background: "linear-gradient(135deg, var(--forest), var(--forest-mid))",
          borderRadius: "11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(30, 77, 53, 0.25)",
          border: "1px solid var(--forest-light)",
        }}
      >
        <HeartPulse size={size * 0.58} color="white" strokeWidth={2.2} />
      </div>
      <span
        style={{
          fontFamily: "var(--font-display), Lora, Georgia, serif",
          fontWeight: 600,
          fontSize: size * 0.9,
          color: "var(--foreground)",
          letterSpacing: "-0.01em",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span>Nivara</span>
        <span
          style={{
            display: "inline-block",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--forest-light)",
            marginBottom: 2,
          }}
        />
      </span>
    </div>
  );
}
