import React from "react";
import { Composition } from "remotion";
import { AtTheHelm } from "./AtTheHelm";
import { AtTheHelmDiagram } from "./AtTheHelmDiagram";
import pivot from "../lessons/14-pivot-point.json";
import type { Lesson } from "./lesson";
import sound from "../lessons/07-sound-signals.json";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AtTheHelm"
        component={AtTheHelm}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={23 * FPS}
        defaultProps={sound as Lesson}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round((props as Lesson).durationSeconds * FPS) })}
      />
      <Composition
        id="AtTheHelmDiagram"
        component={AtTheHelmDiagram}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={23 * FPS}
        defaultProps={pivot as Lesson}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round((props as Lesson).durationSeconds * FPS) })}
      />
    </>
  );
};
