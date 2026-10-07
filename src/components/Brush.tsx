import React from "react";
import { C, F } from "../theme";

// Pink brush-stroke highlight with a label on it. `reveal` 0..1 wipes it on left to right.
export const BrushLabel: React.FC<{
  readonly text: string;
  readonly reveal: number;
  readonly size?: number;
  readonly color?: string;
  readonly ink?: string;
  readonly seed?: number;
  readonly width?: number;
}> = ({ text, reveal, size = 44, color = C.highlight, ink = C.ink, seed = 2, width }) => {
  const w = width ?? Math.round(text.length * size * 0.66 + size * 1.2);
  const h = Math.round(size * 1.55);
  return (
    <div style={{ position: "relative", width: w, height: h, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={`rough${seed}`} x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.12" numOctaves="3" seed={seed} />
            <feDisplacementMap in="SourceGraphic" scale={size * 0.4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#rough${seed})`} opacity="0.95">
          <rect x={size * 0.2} y={h * 0.18} width={w - size * 0.4} height={h * 0.66} rx={h * 0.1} fill={color} />
          <rect x={size * 0.35} y={h * 0.3} width={w - size * 0.7} height={h * 0.5} rx={h * 0.1} fill={color} opacity="0.7" transform={`rotate(-0.8 ${w / 2} ${h / 2})`} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.display2,
          fontSize: size,
          letterSpacing: size * 0.04,
          color: ink,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Pink brush underline that draws on. Width in px, `draw` 0..1.
export const Underline: React.FC<{ readonly width: number; readonly draw: number; readonly color?: string; readonly thick?: number }> = ({
  width,
  draw,
  color = C.pink,
  thick = 10,
}) => {
  const len = width * 1.05;
  return (
    <svg width={width} height={thick * 3} style={{ display: "block", overflow: "visible" }}>
      <path
        d={`M 4 ${thick * 1.6} q ${width * 0.25} -${thick * 0.9} ${width * 0.5} -${thick * 0.2} t ${width * 0.48} -${thick * 0.3}`}
        stroke={color}
        strokeWidth={thick}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
      />
    </svg>
  );
};
