import React from "react";
import { C } from "../theme";
import { lin, prog, eout } from "../anim";
import { RoughDefs, WaveLines, InkArrow, InkLabel } from "../components/Rough";

// Ink-and-wash top-down diagram: pontoon alongside a dock (dock on the left).
// Phases (seconds, absolute):
//   A 0.0-3.0  idle
//   B 3.0-7.6  hand pushes the bow off; boat pivots about its middle; stern swings into the dock
//   C 7.6-8.6  reset
//   D 8.6-14.0 motor turned away, reverse bump; stern walks out on the bow fender
//   E 14.0-18.6 back away clean
// After 18.6 the scene holds.

const W = 1080, H = 630;
const DOCK = 210;
const BW = 170, BL = 440;
const GAP = 100;
const CX0 = DOCK + GAP + BW / 2, CY0 = 330;
const MOTOR_Y = BL / 2 + 8;

const rot = (x: number, y: number, a: number): [number, number] => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// angle at which the stern-left corner meets the dock edge (phase B)
let TH = 0;
for (let a = 0; a < 0.6; a += 0.0005) {
  if (CX0 + rot(-BW / 2 - 6, BL / 2, a)[0] <= DOCK + 2) { TH = a; break; }
}

const Boat: React.FC<{ readonly motorA: number; readonly fender: boolean; readonly thrust: number }> = ({ motorA, fender, thrust }) => (
  <g>
    {/* shadow wash */}
    <rect x={-BW / 2 - 2 + 14} y={-BL / 2 + 16} width={BW + 4} height={BL} rx={70} fill={C.ink} opacity={0.10} filter="url(#wash)" />
    {/* tubes */}
    {[-BW / 2 - 8, -22, BW / 2 - 36].map((x, i) => (
      <g key={i} filter="url(#ink)">
        <rect x={x} y={-BL / 2} width={44} height={BL - 16} rx={22} fill="#fff" stroke={C.ink} strokeWidth={3.5} />
        <path d={`M ${x + 6} ${-BL / 2 + 30} v ${BL - 80}`} stroke={C.ink} strokeWidth={1.6} opacity={0.35} />
      </g>
    ))}
    {/* deck wash + outline */}
    <rect x={-BW / 2 + 4} y={-BL / 2 + 20} width={BW - 8} height={BL - 56} rx={28} fill="#fbe4ee" filter="url(#wash)" />
    <rect x={-BW / 2 + 4} y={-BL / 2 + 20} width={BW - 8} height={BL - 56} rx={28} fill="none" stroke={C.ink} strokeWidth={4} filter="url(#ink)" />
    <rect x={-BW / 2 + 18} y={-BL / 2 + 36} width={BW - 36} height={BL - 88} rx={20} fill="none" stroke={C.ink} strokeWidth={1.8} opacity={0.5} filter="url(#ink)" />
    {/* seats */}
    <g filter="url(#ink)" fill={C.highlight} stroke={C.ink} strokeWidth={2.5}>
      <rect x={-BW / 2 + 28} y={-BL / 2 + 50} width={BW - 56} height={36} rx={10} />
      <rect x={-BW / 2 + 28} y={20} width={36} height={110} rx={10} />
      <rect x={BW / 2 - 64} y={20} width={36} height={110} rx={10} />
      <rect x={-BW / 2 + 28} y={BL / 2 - 86} width={BW - 56} height={32} rx={10} />
    </g>
    {/* helm + wheel */}
    <g filter="url(#ink)">
      <rect x={BW / 2 - 72} y={-110} width={44} height={52} rx={8} fill={C.ink} />
      <circle cx={BW / 2 - 50} cy={-82} r={11} fill="none" stroke={C.pink} strokeWidth={3.5} />
      <circle cx={BW / 2 - 50} cy={-30} r={16} fill={C.highlight} stroke={C.ink} strokeWidth={2.5} />
    </g>
    {/* bow fender */}
    {fender && (
      <g filter="url(#ink)">
        <ellipse cx={-BW / 2 - 24} cy={-BL / 2 + 90} rx={15} ry={34} fill="#fff" stroke={C.ink} strokeWidth={3} />
        <path d={`M ${-BW / 2 - 24} ${-BL / 2 + 56} l 18 -22`} stroke={C.ink} strokeWidth={2.5} />
      </g>
    )}
    {/* outboard: bracket + cowl + lower unit pivoting */}
    <rect x={-30} y={BL / 2 - 34} width={60} height={30} rx={6} fill="#ddd" stroke={C.ink} strokeWidth={2.5} filter="url(#ink)" />
    <g transform={`translate(0 ${MOTOR_Y}) rotate(${(motorA * 180) / Math.PI})`}>
      <rect x={-26} y={-18} width={52} height={64} rx={12} fill={C.orange} stroke={C.ink} strokeWidth={3.5} filter="url(#ink)" />
      <rect x={-7} y={44} width={14} height={30} rx={5} fill={C.ink} filter="url(#ink)" />
      {thrust > 0 && (
        <g opacity={thrust} filter="url(#ink)" stroke="#1c7f99" strokeWidth={3} fill="none">
          <path d="M -26 86 q 13 -10 26 0 t 26 0" />
          <path d="M -34 104 q 17 -12 34 0 t 34 0" opacity={0.7} />
          <path d="M -42 122 q 21 -14 42 0 t 42 0" opacity={0.4} />
        </g>
      )}
    </g>
  </g>
);

const Hand: React.FC<{ readonly x: number; readonly y: number; readonly alpha: number }> = ({ x, y, alpha }) => (
  <g transform={`translate(${x} ${y}) rotate(90)`} opacity={alpha} filter="url(#ink)">
    <rect x={-26} y={-30} width={52} height={66} rx={18} fill="#fde7d3" stroke={C.ink} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-26 + i * 13.5} y={-66} width={11} height={42} rx={5} fill="#fde7d3" stroke={C.ink} strokeWidth={2.5} />
    ))}
    <rect x={20} y={-22} width={13} height={36} rx={6} fill="#fde7d3" stroke={C.ink} strokeWidth={2.5} />
  </g>
);

export const PivotScene: React.FC<{ readonly t: number }> = ({ t }) => {
  // phase B rotation about the middle
  let thB = 0;
  if (t >= 3.0 && t < 7.6) {
    if (t < 6.0) thB = TH * eio(prog(t, 3.6, 6.0));
    else { const k = t - 6.0; thB = TH - TH * 0.05 * Math.sin(k * 10) * Math.exp(-k * 5); }
  }
  const reset = 1 - eio(prog(t, 7.6, 8.6));
  const thBr = t >= 7.6 ? TH * reset : thB;

  // phase D/E: pivot near the bow fender, stern walks out, then back away
  const walk = eio(prog(t, 9.6, 12.6));
  const thD = -0.42 * walk;
  const piv: [number, number] = [-BW / 2 - 6, -BL / 2 + 90];
  const back = prog(t, 14.0, 18.6);
  const dist = 170 * (back * back * back) + 40 * eout(back);

  let cx = CX0, cy = CY0, th = thBr;
  if (t >= 8.6) {
    th = thD;
    const o = rot(-piv[0], -piv[1], th);
    cx = CX0 + piv[0] + o[0]; cy = CY0 + piv[1] + o[1];
    const bd = rot(0, 1, th);
    cx += bd[0] * dist; cy += bd[1] * dist;
  }
  const motorA = -0.6 * eio(prog(t, 8.9, 9.6)) + 0.6 * eio(prog(t, 14.3, 15.1));
  const thrust = Math.min(prog(t, 9.4, 9.8), 1 - lin(t, 12.6, 13.0)) + Math.min(prog(t, 14.4, 14.8), 1 - lin(t, 18.2, 18.6));
  const fender = t >= 8.6;

  // annotations
  const bp = rot(-BW / 2 - 6, -BL / 2 + 80, th);
  const handA = Math.min(prog(t, 3.1, 3.5), 1 - lin(t, 7.2, 7.6));
  const push = 26 * eout(prog(t, 3.6, 4.3));
  const sternB = rot(-BW / 2 - 6, BL / 2, th);
  const sternR = rot(BW / 2 + 10, BL / 2 - 30, th);
  const dirR = rot(1, 0, th);
  const breathe = 1 + 0.025 * lin(t, 0, 20);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", scale: String(breathe) }}>
      <RoughDefs />
      {/* water wash */}
      <rect x={DOCK - 10} y={-10} width={W - DOCK + 20} height={H + 20} fill="#bfe6ef" filter="url(#wash)" />
      <rect x={DOCK - 10} y={-10} width={W - DOCK + 20} height={H + 20} fill="url(#hatchWater)" opacity={0.6} />
      <WaveLines x={DOCK} y={40} w={W - DOCK} rows={15} t={t} />
      {/* dock */}
      <rect x={-20} y={-10} width={DOCK + 20} height={H + 20} fill="#e9c99a" filter="url(#wash)" />
      <rect x={-20} y={-10} width={DOCK + 20} height={H + 20} fill="url(#hatchDock)" />
      <path d={`M ${DOCK} -10 V ${H + 10}`} stroke={C.ink} strokeWidth={5} filter="url(#ink)" />
      {[120, 300, 480].map((y) => (
        <g key={y} filter="url(#ink)">
          <rect x={DOCK - 54} y={y - 6} width={40} height={12} rx={5} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
          <rect x={DOCK - 40} y={y - 16} width={12} height={32} rx={5} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
        </g>
      ))}
      {[60, 560].map((y) => (
        <circle key={y} cx={DOCK - 26} cy={y} r={22} fill="#b98a55" stroke={C.ink} strokeWidth={3.5} filter="url(#ink)" />
      ))}

      {/* stern arc trace, phase B */}
      {t >= 3.6 && t < 8.4 && (
        <path
          d={(() => {
            const r = Math.hypot(-BW / 2 - 6, BL / 2 + 14), a0 = Math.atan2(BL / 2 + 14, -BW / 2 - 6);
            const a1 = a0 + Math.min(th, TH);
            const x1 = CX0 + Math.cos(a0) * r, y1 = CY0 + Math.sin(a0) * r, x2 = CX0 + Math.cos(a1) * r, y2 = CY0 + Math.sin(a1) * r;
            return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
          })()}
          stroke={C.pink}
          strokeWidth={6}
          strokeDasharray="14 12"
          fill="none"
          strokeLinecap="round"
          filter="url(#ink)"
          opacity={1 - lin(t, 7.6, 8.4)}
        />
      )}

      <g transform={`translate(${cx} ${cy}) rotate(${(th * 180) / Math.PI})`}>
        <Boat motorA={motorA} fender={fender} thrust={thrust} />
      </g>

      {/* hand push + arrow + labels (phase B) */}
      <Hand x={cx + bp[0] - 58 + push} y={cy + bp[1]} alpha={handA} />
      <InkArrow x1={cx + bp[0] - 150 + push} y1={cy + bp[1] + 70} x2={cx + bp[0] - 40 + push} y2={cy + bp[1] + 70} draw={Math.min(prog(t, 3.5, 4.2), 1 - lin(t, 7.2, 7.6))} />
      <InkLabel x={cx + bp[0] - 150} y={cy + bp[1] - 70} text="push by hand" alpha={handA} size={36} />
      {/* pivot dot mid-boat (phase B) */}
      {t >= 3.8 && t < 7.6 && (
        <g opacity={Math.min(prog(t, 3.8, 4.2), 1 - lin(t, 7.2, 7.6))} filter="url(#ink)">
          <circle cx={cx} cy={cy} r={13} fill="#fff" stroke={C.pink} strokeWidth={4} />
          <circle cx={cx} cy={cy} r={5} fill={C.pink} />
          <circle cx={cx} cy={cy} r={13 + 30 * ((t * 1.3) % 1)} fill="none" stroke={C.pink} strokeWidth={3} opacity={1 - ((t * 1.3) % 1)} />
        </g>
      )}
      <InkLabel x={cx + BW / 2 + 36} y={cy + 12} text="it pivots" alpha={t >= 3.8 && t < 7.6 ? Math.min(prog(t, 4.0, 4.4), 1 - lin(t, 7.2, 7.6)) : 0} color={C.deep} />
      <InkLabel x={cx + BW / 2 + 20} y={cy + BL / 2 + 30} text="stern swings in" alpha={t >= 4.4 && t < 7.6 ? Math.min(prog(t, 4.4, 4.8), 1 - lin(t, 7.2, 7.6)) : 0} color={C.deep} />
      {/* contact burst */}
      {t >= 6.0 && t < 7.2 && (() => {
        const k = prog(t, 6.0, 7.2), s2 = rot(-BW / 2 - 6, BL / 2, TH);
        return [0, 1, 2].map((i) => {
          const kk = Math.max(0, Math.min(1, k * 1.4 - i * 0.18));
          return <circle key={i} cx={CX0 + s2[0]} cy={CY0 + s2[1]} r={8 + kk * 110} fill="none" stroke={C.pink} strokeWidth={7 - i * 2} opacity={0.9 * (1 - kk)} filter="url(#ink)" />;
        });
      })()}

      {/* phase D annotations */}
      {t >= 9.4 && t < 13.2 && (
        <>
          <InkArrow x1={cx + sternR[0]} y1={cy + sternR[1]} x2={cx + sternR[0] + dirR[0] * 130} y2={cy + sternR[1] + dirR[1] * 130} draw={Math.min(prog(t, 9.4, 10.0), 1 - lin(t, 12.8, 13.2))} />
          <InkLabel x={cx + sternR[0] + 20} y={cy + sternR[1] + 62} text="stern walks out" alpha={Math.min(prog(t, 9.6, 10.0), 1 - lin(t, 12.8, 13.2))} color={C.deep} />
          <InkLabel x={cx + bp[0] - 150} y={cy + bp[1] + 80} text="fender holds" size={34} alpha={Math.min(prog(t, 8.8, 9.2), 1 - lin(t, 12.8, 13.2))} />
        </>
      )}
      {t >= 14.2 && t < 18.6 && <InkLabel x={cx + BW / 2 + 60} y={cy - 120} text="back away clean" alpha={Math.min(prog(t, 14.2, 14.6), 1 - lin(t, 18.2, 18.6))} color={C.deep} />}
    </svg>
  );
};
