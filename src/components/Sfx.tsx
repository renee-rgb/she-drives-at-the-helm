import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";

export type SfxName = "stamp" | "whoosh" | "swish" | "tick" | "scratch" | "scratch-s" | "pop";

// One sound at one moment. `at` in seconds. Volume is already conservative; the mix is meant to sit under VO.
export const Sfx: React.FC<{ readonly name: SfxName; readonly at: number; readonly volume?: number }> = ({ name, at, volume = 0.6 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const from = Math.round(at * fps);
  if (from < 0 || from >= durationInFrames - 2) return null;
  return (
    <Sequence from={from} durationInFrames={Math.min(45, durationInFrames - from)} premountFor={fps}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};

// The sounds every poster shares: masthead, headline, corner decorations, script lines, footer.
export const ChromeSfx: React.FC<{ readonly ctaAt: number }> = ({ ctaAt }) => (
  <>
    <Sfx name="swish" at={0.05} volume={0.4} />
    <Sfx name="whoosh" at={0.5} volume={0.55} />
    <Sfx name="stamp" at={0.72} volume={0.7} />
    <Sfx name="tick" at={1.1} volume={0.4} />
    <Sfx name="swish" at={1.4} volume={0.35} />
    <Sfx name="scratch" at={1.75} volume={0.5} />
    <Sfx name="scratch" at={2.3} volume={0.45} />
    <Sfx name="tick" at={1.65} volume={0.3} />
    <Sfx name="stamp" at={ctaAt + 0.1} volume={0.6} />
    <Sfx name="pop" at={ctaAt + 0.85} volume={0.5} />
  </>
);
