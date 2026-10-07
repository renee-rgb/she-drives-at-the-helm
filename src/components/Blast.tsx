import React from "react";
import { C } from "../theme";
import { lin, pop } from "../anim";

// Horn signal pattern. "s" = short blast (dot), "L" = prolonged blast (bar).
// `t` = seconds since the row appeared; blasts fire in sequence.
export const Blast: React.FC<{ readonly pattern: string; readonly t: number; readonly size?: number; readonly color?: string }> = ({
  pattern,
  t,
  size = 52,
  color = C.pink,
}) => {
  const gap = size * 0.45;
  const barW = size * 4;
  const rapid = pattern.length >= 5;
  const step = rapid ? 0.16 : 0.3;
  let x = size / 2 + 4;
  const nodes: React.ReactNode[] = [];
  const cy = size / 2 + 4;
  pattern.split("").forEach((ch, i) => {
    const t0 = i * step;
    const k = pop(t, t0, t0 + 0.28);
    const ring = lin(t, t0, t0 + 0.7);
    if (ch === "L") {
      const fill = lin(t, t0, t0 + 1.4);
      nodes.push(
        <g key={i}>
          <rect x={x - size / 2} y={cy - size / 2} width={barW} height={size} rx={size / 2} fill={color} opacity={0.22} />
          <rect x={x - size / 2} y={cy - size / 2} width={Math.max(size, barW * fill)} height={size} rx={size / 2} fill={color} />
          {ring > 0 && ring < 1 && (
            <rect
              x={x - size / 2 - ring * 40}
              y={cy - size / 2 - ring * 40}
              width={barW + ring * 80}
              height={size + ring * 80}
              rx={size}
              stroke={color}
              strokeWidth={4}
              fill="none"
              opacity={1 - ring}
            />
          )}
        </g>,
      );
      x += barW + gap;
    } else {
      nodes.push(
        <g key={i}>
          <circle cx={x} cy={cy} r={(size / 2) * k} fill={color} />
          {ring > 0 && ring < 1 && <circle cx={x} cy={cy} r={size / 2 + ring * 46} stroke={color} strokeWidth={4} fill="none" opacity={1 - ring} />}
        </g>,
      );
      x += size + gap;
    }
  });
  return (
    <svg width={x + 8} height={size + 8} style={{ display: "block", overflow: "visible" }}>
      {nodes}
    </svg>
  );
};
