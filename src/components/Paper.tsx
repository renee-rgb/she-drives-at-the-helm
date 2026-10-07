import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";

// Blush paper with grain and a soft vignette. Static; cheap to render.
export const Paper: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 35%, ${C.paperLight} 0%, ${C.paper} 60%, #f7dde8 100%)`,
    }}
  >
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "multiply" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="1080" height="1920" filter="url(#grain)" />
    </svg>
    {/* faint wave rules, like printed guide lines */}
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <path
          key={i}
          d={`M -20 ${140 + i * 135} q 60 -14 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`}
          stroke={C.deep}
          strokeWidth="3"
          fill="none"
        />
      ))}
    </svg>
  </AbsoluteFill>
);
