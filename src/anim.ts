import { interpolate, Easing } from "remotion";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// progress 0..1 between two times (seconds), eased out
export const prog = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const lin = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// overshoot pop for stamps and slams
export const pop = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.back(1.4),
  });

// in then out window: fades in over `fade`, holds, fades out over `fade` before `end`
export const window01 = (t: number, start: number, end: number, fade = 0.35) =>
  Math.min(prog(t, start, start + fade), 1 - lin(t, end - fade, end));
