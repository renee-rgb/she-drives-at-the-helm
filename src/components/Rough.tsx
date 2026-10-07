import React from "react";
import { C } from "../theme";

// SVG defs for the ink-and-wash look: rough (hand-drawn) edges, hatching, wash textures.
// Put <RoughDefs/> once inside any <svg> that uses filter="url(#ink)" etc.
export const RoughDefs: React.FC<{ readonly seed?: number }> = ({ seed = 4 }) => (
  <defs>
    {/* light wobble for outlines */}
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    {/* heavier wobble for washes and brush blocks */}
    <filter id="wash" x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="3" seed={seed + 1} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    {/* paper grain to multiply over washes */}
    <filter id="grainy">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed + 2} result="g" />
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" result="ga" />
      <feComposite in="SourceGraphic" in2="ga" operator="in" />
    </filter>
    <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="14" stroke={C.ink} strokeWidth="2.2" opacity="0.32" />
    </pattern>
    <pattern id="hatchWater" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
      <line x1="0" y1="9" x2="18" y2="9" stroke="#1c7f99" strokeWidth="2" opacity="0.28" />
    </pattern>
    <pattern id="hatchDock" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
      <line x1="0" y1="6" x2="12" y2="6" stroke="#8a5a2b" strokeWidth="2" opacity="0.35" />
    </pattern>
  </defs>
);

// Hand-drawn wave band: several wobbly wave lines that drift with time.
export const WaveLines: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly rows: number; readonly t: number; readonly color?: string; readonly gap?: number }> = ({
  x,
  y,
  w,
  rows,
  t,
  color = "#1c7f99",
  gap = 42,
}) => (
  <g filter="url(#ink)" opacity="0.55">
    {Array.from({ length: rows }).map((_, i) => {
      const off = ((t * 26 * (i % 2 ? 1 : -1)) % 120 + 120) % 120;
      const yy = y + i * gap;
      let d = `M ${x - 140 + off} ${yy}`;
      for (let xx = x - 140 + off; xx < x + w + 140; xx += 60) d += ` q 15 -9 30 0 t 30 0`;
      return <path key={i} d={d} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.5 + 0.4 * Math.sin(i * 1.7)} />;
    })}
  </g>
);

// Rough pink arrow, hand-drawn.
export const InkArrow: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly draw: number; readonly color?: string; readonly w?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  draw,
  color = C.pink,
  w = 9,
}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ex = x1 + Math.cos(a) * len * draw, ey = y1 + Math.sin(a) * len * draw;
  const mx = (x1 + ex) / 2 + Math.cos(a + Math.PI / 2) * 10, my = (y1 + ey) / 2 + Math.sin(a + Math.PI / 2) * 10;
  const head = Math.min(1, Math.max(0, (draw - 0.6) / 0.4));
  return (
    <g filter="url(#ink)" opacity={draw > 0 ? 1 : 0}>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${ex} ${ey}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />
      {head > 0 && (
        <path
          d={`M ${ex} ${ey} L ${ex - Math.cos(a - 0.55) * w * 3.4 * head} ${ey - Math.sin(a - 0.55) * w * 3.4 * head} M ${ex} ${ey} L ${ex - Math.cos(a + 0.55) * w * 3.4 * head} ${ey - Math.sin(a + 0.55) * w * 3.4 * head}`}
          stroke={color}
          strokeWidth={w}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// Caveat label inside the SVG.
export const InkLabel: React.FC<{ readonly x: number; readonly y: number; readonly text: string; readonly alpha: number; readonly size?: number; readonly color?: string; readonly anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  alpha,
  size = 40,
  color = C.ink,
  anchor = "start",
}) => (
  <text x={x} y={y} fontFamily="Caveat" fontWeight={700} fontSize={size} fill={color} textAnchor={anchor} opacity={alpha}>
    {text}
  </text>
);
