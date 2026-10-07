import React from "react";
import { AbsoluteFill, Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Lesson } from "./lesson";
import { Paper } from "./components/Paper";
import { Masthead } from "./components/Masthead";
import { Headline, Script } from "./components/Type";
import { BrushLabel } from "./components/Brush";
import { Hero, Meaning, Examples, Tip, Cta, Footer } from "./components/Beats";
import { prog } from "./anim";
import "./theme";

export const AtTheHelm: React.FC<Lesson> = (lesson) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const b = lesson.beats;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio
        src={staticFile("sfx/ambient.wav")}
        volume={(f) => interpolate(f, [0, 20, lesson.durationSeconds * fps - 40, lesson.durationSeconds * fps], [0, 0.22, 0.22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      <Paper />
      {/* corner decorations, like the carousel posters */}
      <div style={{ position: "absolute", top: 118, left: 44, rotate: "-7deg", opacity: prog(t, 1.4, 1.8) }}>
        <BrushLabel text={lesson.cornerTag} reveal={prog(t, 1.4, 2.0)} size={24} seed={9} width={330} />
      </div>
      <Script t={t} start={1.7} text={lesson.cornerScript} size={56} rotate={-8} style={{ top: 112, right: 70 }} />

      <Masthead t={t} number={lesson.number} />
      <Headline t={t} title={lesson.title} subhead={lesson.subhead} />

      <Hero t={t} end={b.meaning} lesson={lesson} />
      <Meaning t={t} start={b.meaning} end={b.examples} lesson={lesson} />
      <Examples t={t} start={b.examples} end={b.tip} lesson={lesson} />
      <Tip t={t} start={b.tip} end={b.cta} lesson={lesson} />
      <Cta t={t} start={b.cta} lesson={lesson} />

      <Script t={t} start={2.2} text={lesson.scriptLine} size={44} rotate={-3} heart={false} style={{ top: 1545, left: 80, opacity: 1 - prog(t, b.cta - 0.3, b.cta) }} />
      <Footer t={t} hide={b.cta} lesson={lesson} />
    </AbsoluteFill>
  );
};
