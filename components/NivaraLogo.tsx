"use client";

import { Heart } from "lucide-react";

export default function NivaraLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        style={{
          width: size + 8,
          height: size + 8,
          background: "var(--forest)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(30,77,53,0.25)",
        }}
      >
        <Heart size={size * 0.6} color="white" fill="white" strokeWidth={1.5} />
      </div>
      <span
        style={{
          fontFamily: "var(--font-display), Lora, Georgia, serif",
          fontWeight: 600,
          fontSize: size * 0.9,
          color: "var(--forest)",
          letterSpacing: "-0.01em",
        }}
      >
        Nivara
      </span>
    </div>
  );
}
