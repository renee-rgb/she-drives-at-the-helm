import React from "react";
import { Anchor } from "lucide-react";
import { C, F } from "../theme";
import { pop, prog } from "../anim";

const Wave: React.FC<{ readonly flip?: boolean }> = ({ flip }) => (
  <svg width="150" height="22" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
    <path d="M 2 11 q 15 -9 30 0 t 30 0 t 30 0 t 30 0 t 30 0" stroke={C.deep} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M 2 17 q 15 -9 30 0 t 30 0 t 30 0 t 30 0 t 30 0" stroke={C.deep} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const Masthead: React.FC<{ readonly t: number; readonly number: string }> = ({ t, number }) => {
  const k = pop(t, 0.05, 0.6);
  const n = Math.round(parseInt(number, 10) * prog(t, 0.4, 1.3));
  return (
    <div style={{ position: "absolute", top: 250, left: 0, width: 1080, textAlign: "center", opacity: prog(t, 0.05, 0.4), scale: String(0.92 + 0.08 * k) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ width: 150, height: 3, background: C.deep }} />
        <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 52, letterSpacing: 10, color: C.deep }}>AT THE HELM</div>
        <div style={{ width: 150, height: 3, background: C.deep }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 6 }}>
        <Wave />
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: C.deep }}>NO. {String(n).padStart(2, "0")}</div>
        <Anchor size={30} color={C.deep} strokeWidth={2.6} />
        <Wave flip />
      </div>
      <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 24, letterSpacing: 8, color: C.char, marginTop: 10 }}>REAL SKILLS. MORE CONFIDENCE.</div>
    </div>
  );
};
