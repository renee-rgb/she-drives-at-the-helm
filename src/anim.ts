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

// rubber-stamp arrival: returns style pieces for scale/rotate/opacity/blur over `dur` seconds from t0
export const stamp = (t: number, t0: number, dur = 0.45) => {
  const k = prog(t, t0, t0 + dur);
  const hard = lin(t, t0, t0 + dur * 0.55);
  return {
    opacity: lin(t, t0, t0 + dur * 0.25),
    scale: String(1.55 - 0.55 * Easing.back(1.2)(hard)),
    rotate: `${-5 + 3 * k}deg`,
    filter: `blur(${(1 - hard) * 6}px)`,
  } as const;
};

export const eout = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
