import React from "react";
import * as Icons from "lucide-react";
import { Img, staticFile } from "remotion";
import { C, F } from "../theme";
import { lin, pop, prog, window01, stamp } from "../anim";
import { DrawIcon } from "./DrawIcon";
import { WaveLines, RoughDefs } from "./Rough";
import { BrushLabel, Underline } from "./Brush";
import { Blast } from "./Blast";
import type { Lesson } from "../lesson";

const STAGE_TOP = 730;
const STAGE_H = 760;

const Stage: React.FC<{ readonly opacity: number; readonly y?: number; readonly children: React.ReactNode }> = ({ opacity, y = 0, children }) => (
  <div style={{ position: "absolute", top: STAGE_TOP, left: 0, width: 1080, height: STAGE_H, opacity, translate: `0px ${y}px` }}>{children}</div>
);

const iconByName = (name: string): React.FC<any> | null => {
  const pascal = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return ((Icons as any)[pascal] as React.FC<any>) ?? null;
};

// ---- Beat 1: hero -----------------------------------------------------------
export const Hero: React.FC<{ readonly t: number; readonly end: number; readonly lesson: Lesson }> = ({ t, end, lesson }) => {
  const a = window01(t, 0.3, end, 0.3);
  if (lesson.hero.kind === "image" && lesson.hero.image) {
    // 2.5D: background drifts and zooms slowly, cutout subject moves a touch less and casts a shadow.
    const drift = lin(t, 0, end);
    const z = 1 + 0.07 * drift;
    return (
      <Stage opacity={a}>
        <div style={{ position: "absolute", left: 60, top: 0, width: 960, height: STAGE_H + 40, overflow: "hidden", borderRadius: 30, boxShadow: "0 24px 60px rgba(60,10,40,0.18)", rotate: "-1.2deg" }}>
          <Img src={staticFile(lesson.hero.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", scale: String(z), translate: `${-18 * drift}px ${8 * drift}px` }} />
          {lesson.hero.cutout && (
            <Img src={staticFile(lesson.hero.cutout)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", scale: String(1 + 0.11 * drift), translate: `${10 * drift}px ${-6 * drift}px`, filter: "drop-shadow(0 18px 22px rgba(30,10,30,0.35))" }} />
          )}
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 90px rgba(120,30,80,0.18)" }} />
        </div>
        {/* tape corners */}
        {[[40, -14, -8], [930, -14, 6]].map(([x, y, r], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 110, height: 34, background: "rgba(255,255,255,0.55)", border: "1px solid rgba(0,0,0,0.08)", rotate: `${r}deg`, opacity: prog(t, 0.5, 0.9) }} />
        ))}
      </Stage>
    );
  }
  if (lesson.hero.kind === "line") {
    const txt = lesson.hero.text ?? lesson.cornerScript;
    const w = Math.min(900, Math.round(txt.length * 72 * 0.4));
    return (
      <Stage opacity={a}>
        <div style={{ margin: "150px auto 0", width: 900, textAlign: "center", fontFamily: F.script, fontWeight: 700, fontSize: 84, lineHeight: 1.1, color: C.ink, rotate: "-3deg", scale: String(0.96 + 0.04 * prog(t, 0.3, 1.0)) }}>
          {txt}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Underline width={w} draw={prog(t, 0.8, 1.8)} thick={14} />
          </div>
        </div>
      </Stage>
    );
  }
  // blast-chart hero: the danger signal, big, firing on loop
  const loopT = ((t - 0.3) % 2.6 + 2.6) % 2.6;
  return (
    <Stage opacity={a}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 230, display: "flex", justifyContent: "center" }}>
        <Blast pattern="sssss" t={loopT} size={110} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 430, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 38, letterSpacing: 6, color: C.deep, opacity: prog(t, 0.9, 1.3) }}>
        FIVE SHORT BLASTS
      </div>
    </Stage>
  );
};

// ---- Beat 2: what it means --------------------------------------------------
export const Meaning: React.FC<{ readonly t: number; readonly start: number; readonly end: number; readonly lesson: Lesson }> = ({ t, start, end, lesson }) => {
  const k = t - start;
  const a = window01(t, start, end, 0.3);
  return (
    <Stage opacity={a} y={(1 - prog(k, 0, 0.5)) * 24}>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 150, ...stamp(k, 0.05) }}>
        <BrushLabel text={lesson.meaning.label} reveal={1} size={54} seed={3} />
      </div>
      <div style={{ margin: "56px auto 0", width: 900, textAlign: "center", fontFamily: F.body, fontWeight: 600, fontSize: 56, lineHeight: 1.25, color: C.ink, opacity: prog(k, 0.45, 0.9) }}>
        {lesson.meaning.text}
      </div>
    </Stage>
  );
};

// ---- Beat 3: examples / signals ---------------------------------------------
export const Examples: React.FC<{ readonly t: number; readonly start: number; readonly end: number; readonly lesson: Lesson }> = ({ t, start, end, lesson }) => {
  const k = t - start;
  const a = window01(t, start, end, 0.3);
  const items = lesson.examples.items;
  const rowH = Math.min(150, Math.floor(620 / items.length));
  const stagger = Math.min(2.4, (end - start - 2.5) / items.length);
  return (
    <Stage opacity={a}>
      <div style={{ position: "absolute", left: 90, top: 0, transformOrigin: "left center", ...stamp(k, 0.05) }}>
        <BrushLabel text={lesson.examples.label} reveal={1} size={46} seed={5} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 110, width: 920 }}>
        {items.map((it, i) => {
          const t0 = 0.5 + i * stagger;
          const rowA = prog(k, t0, t0 + 0.35);
          const rowT = Math.max(0, k - t0);
          const isBlast = it.icon.startsWith("blast:");
          const Icon = isBlast ? null : iconByName(it.icon);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", height: rowH, opacity: rowA, translate: `${(1 - rowA) * -30}px 0px` }}>
              <div style={{ width: 330, display: "flex", alignItems: "center" }}>
                {isBlast ? (
                  <Blast pattern={it.icon.slice(6)} t={rowT} size={items.length > 4 ? 44 : 56} />
                ) : (
                  <div style={{ width: 76, height: 76, borderRadius: 38, border: `4px solid ${C.pink}`, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(rowT, 0, 0.4)) }}>
                    <DrawIcon name={it.icon} draw={prog(rowT, 0.15, 0.9)} size={40} color={C.ink} strokeWidth={2.4} />
                  </div>
                )}
              </div>
              <div style={{ width: 590, fontFamily: F.body, fontWeight: 600, fontSize: items.length > 4 ? 36 : 42, color: C.ink, lineHeight: 1.12 }}>
                {it.label.includes(":") ? (
                  <>
                    <span style={{ fontWeight: 800, color: C.deep }}>{it.label.split(":")[0]}:</span>
                    {it.label.slice(it.label.indexOf(":") + 1)}
                  </>
                ) : (
                  it.label
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

// ---- Beat 4: quick tip -------------------------------------------------------
export const Tip: React.FC<{ readonly t: number; readonly start: number; readonly end: number; readonly lesson: Lesson }> = ({ t, start, end, lesson }) => {
  const k = t - start;
  const a = window01(t, start, end, 0.3);
  const fs = lesson.tip.text.length > 20 ? 92 : 116;
  const w = Math.min(900, Math.round(lesson.tip.text.length * fs * 0.42));
  return (
    <Stage opacity={a} y={(1 - prog(k, 0, 0.5)) * 24}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22, marginTop: 130, ...stamp(k, 0.05) }}>
        <DrawIcon name="lightbulb" draw={prog(k, 0.2, 1.0)} size={64} color={C.ink} strokeWidth={2.2} />
        <BrushLabel text={lesson.tip.label} reveal={1} size={54} seed={7} />
      </div>
      <div style={{ margin: "60px auto 0", width: 920, textAlign: "center", fontFamily: F.script, fontWeight: 700, fontSize: fs, lineHeight: 1.05, color: C.ink, opacity: prog(k, 0.4, 0.8), rotate: "-3deg" }}>
        {lesson.tip.text}
        <div style={{ display: "flex", justifyContent: "center" }}><Underline width={w} draw={prog(k, 0.6, 1.3)} thick={14} /></div>
      </div>
    </Stage>
  );
};

// ---- Beat 5: CTA --------------------------------------------------------------
export const Cta: React.FC<{ readonly t: number; readonly start: number; readonly lesson: Lesson }> = ({ t, start, lesson }) => {
  const k = t - start;
  return (
    <Stage opacity={prog(k, 0, 0.3)} y={(1 - prog(k, 0, 0.5)) * 24}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 140, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 170, lineHeight: 0.9, color: C.ink, scale: String(pop(k, 0.05, 0.6)) }}>SHE DRIVES</div>
        <svg width="260" height="22" style={{ marginTop: 6 }}>
          <path d="M 2 11 q 20 -10 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" stroke={C.pink} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - prog(k, 0.3, 0.9))} />
        </svg>
        <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 24, letterSpacing: 9, color: C.char, marginTop: 6, opacity: prog(k, 0.5, 0.9) }}>WOMEN ON THE WATER</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 44,
            padding: "22px 54px",
            borderRadius: 60,
            background: C.pink,
            color: "#fff",
            fontFamily: F.body,
            fontWeight: 800,
            fontSize: 46,
            opacity: prog(k, 0.8, 1.1),
            scale: String(pop(k, 0.8, 1.3)),
          }}
        >
          {lesson.cta}
        </div>
      </div>
    </Stage>
  );
};

// Small footer that lives under the stage on every beat except CTA.
export const Footer: React.FC<{ readonly t: number; readonly hide: number; readonly lesson: Lesson }> = ({ t, hide, lesson }) => (
  <div style={{ position: "absolute", top: 1660, left: 0, width: 1080, textAlign: "center", opacity: prog(t, 1.6, 2.0) * (1 - lin(t, hide - 0.3, hide)) }}>
    <div style={{ fontFamily: F.display, fontSize: 54, color: C.ink, letterSpacing: 2 }}>SHE DRIVES</div>
    <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 17, letterSpacing: 7, color: C.char, marginTop: -2 }}>WOMEN ON THE WATER</div>
    <div style={{ fontFamily: F.body, fontWeight: 500, fontSize: 15, letterSpacing: 3, color: C.deep, marginTop: 10, opacity: 0.8 }}>{lesson.footnote}</div>
  </div>
);
