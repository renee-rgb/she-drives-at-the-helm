import React from "react";
import { C, F } from "../theme";
import { pop, prog } from "../anim";
import { Underline } from "./Brush";

export const Headline: React.FC<{ readonly t: number; readonly title: string; readonly subhead: string }> = ({ t, title, subhead }) => {
  const k = pop(t, 0.5, 1.1);
  const lines = title.split("\n").length;
  return (
    <div style={{ position: "absolute", top: lines > 1 ? 418 : 430, left: 0, width: 1080, textAlign: "center" }}>
      <div
        style={{
          fontFamily: F.display,
          fontSize: lines > 1 ? 122 : 190,
          lineHeight: 0.92,
          color: C.deep,
          letterSpacing: 2,
          opacity: prog(t, 0.5, 0.75),
          scale: String(1.35 - 0.35 * k),
          whiteSpace: lines > 1 ? "pre-line" : "nowrap",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontWeight: 600,
          fontSize: 30,
          letterSpacing: 9,
          color: C.ink,
          marginTop: 10,
          opacity: prog(t, 1.1, 1.5),
          translate: `0px ${(1 - prog(t, 1.1, 1.6)) * 16}px`,
        }}
      >
        {subhead}
      </div>
    </div>
  );
};

// Handwritten accent with a drawn underline and a small heart.
export const Script: React.FC<{
  readonly t: number;
  readonly start: number;
  readonly text: string;
  readonly size?: number;
  readonly rotate?: number;
  readonly heart?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ t, start, text, size = 60, rotate = -6, heart = true, style }) => {
  const a = prog(t, start, start + 0.4);
  const d = prog(t, start + 0.25, start + 1.0);
  const w = Math.round(text.length * size * 0.42);
  return (
    <div style={{ position: "absolute", opacity: a, rotate: `${rotate}deg`, ...style }}>
      <div style={{ fontFamily: F.script, fontWeight: 700, fontSize: size, color: C.ink, lineHeight: 1.05, whiteSpace: "pre-line" }}>{text}</div>
      <Underline width={w} draw={d} thick={Math.max(6, size * 0.14)} />
      {heart && (
        <svg width="40" height="36" style={{ position: "absolute", right: -46, bottom: -6, opacity: prog(t, start + 0.9, start + 1.2), scale: String(pop(t, start + 0.9, start + 1.3)) }}>
          <path d="M20 32 C 4 20, 2 8, 11 5 C 16 3, 20 8, 20 11 C 20 8, 24 3, 29 5 C 38 8, 36 20, 20 32 Z" fill="none" stroke={C.pink} strokeWidth="3.5" />
        </svg>
      )}
    </div>
  );
};
