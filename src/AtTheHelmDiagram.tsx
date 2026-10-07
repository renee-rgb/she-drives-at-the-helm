import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx, ChromeSfx } from "./components/Sfx";
import type { Lesson } from "./lesson";
import { Paper } from "./components/Paper";
import { Masthead } from "./components/Masthead";
import { Headline, Script } from "./components/Type";
import { BrushLabel } from "./components/Brush";
import { Tip, Cta, Footer } from "./components/Beats";
import { PivotScene } from "./diagrams/Pivot";
import { prog, lin, stamp } from "./anim";
import { C, F } from "./theme";
import "./theme";

const STAGE_TOP = 730;

export const AtTheHelmDiagram: React.FC<Lesson> = (lesson) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const b = lesson.beats;
  const cards = lesson.diagram?.cards ?? [];
  const sceneAlpha = Math.min(prog(t, 0.3, 0.8), 1 - lin(t, b.tip - 0.3, b.tip));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Paper />
      <ChromeSfx ctaAt={b.cta} />
      {cards.map((c, i) => (
        <Sfx key={i} name="stamp" at={c.at + 0.05} volume={0.6} />
      ))}
      <Sfx name="stamp" at={b.tip + 0.08} />
      <Sfx name="scratch" at={b.tip + 0.6} volume={0.5} />
      <div style={{ position: "absolute", top: 118, left: 44, rotate: "-7deg", opacity: prog(t, 1.4, 1.8) }}>
        <BrushLabel text={lesson.cornerTag} reveal={prog(t, 1.4, 2.0)} size={24} seed={9} width={330} />
      </div>
      <Script t={t} start={1.7} text={lesson.cornerScript} size={56} rotate={-8} style={{ top: 112, right: 70 }} />
      <Masthead t={t} number={lesson.number} />
      <Headline t={t} title={lesson.title} subhead={lesson.subhead} />

      {/* diagram stage */}
      <div style={{ position: "absolute", top: STAGE_TOP + 120, left: 0, width: 1080, height: 630, opacity: sceneAlpha }}>
        <div style={{ position: "absolute", inset: "0 40px", borderRadius: 26, overflow: "hidden", boxShadow: "0 20px 50px rgba(60,10,40,0.16)", rotate: "-0.6deg" }}>
          <PivotScene t={t} />
        </div>
      </div>
      {/* cards above the diagram */}
      {cards.map((c, i) => {
        const a = Math.min(prog(t, c.at, c.at + 0.3), 1 - lin(t, c.end - 0.3, c.end));
        return (
          <div key={i} style={{ position: "absolute", top: STAGE_TOP + 10, left: 0, width: 1080, display: "flex", justifyContent: "center", opacity: a, ...(t < c.at + 0.5 ? stamp(t, c.at) : {}) }}>
            <div style={{ padding: "16px 36px", background: "rgba(255,255,255,0.9)", borderRadius: 22, boxShadow: "0 10px 30px rgba(60,10,40,0.12)", fontFamily: F.body, fontWeight: 700, fontSize: 44, color: C.ink, whiteSpace: "nowrap" }}>
              {c.text.split("*").map((p, j) => (
                <span key={j} style={{ color: j % 2 ? C.pink : C.ink }}>{p}</span>
              ))}
            </div>
          </div>
        );
      })}

      <Tip t={t} start={b.tip} end={b.cta} lesson={lesson} />
      <Cta t={t} start={b.cta} lesson={lesson} />
      <Script t={t} start={2.2} text={lesson.scriptLine} size={44} rotate={-3} heart={false} style={{ top: 1545, left: 80, opacity: 1 - prog(t, b.cta - 0.3, b.cta) }} />
      <Footer t={t} hide={b.cta} lesson={lesson} />
    </AbsoluteFill>
  );
};
