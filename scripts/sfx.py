#!/usr/bin/env python3
"""Synthesize the ambient bed for every lesson: water lapping, a distant outboard at idle, a gull now and then.

Writes public/sfx/ambient.wav (40 s, stereo, 44.1 kHz). Deterministic (fixed seed) so renders are repeatable.
No samples, no licenses. The template plays it quietly under everything; Renee's VO goes on top in Resolve.
"""
import numpy as np
from pathlib import Path
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
DUR = 40.0
rng = np.random.default_rng(7)
n = int(SR * DUR)
t = np.arange(n) / SR

def lowpass(x, hz, order=2):
    b, a = butter(order, hz / (SR / 2))
    return lfilter(b, a, x)

def bandpass(x, lo, hi, order=2):
    b, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], btype="band")
    return lfilter(b, a, x)

# --- water: filtered noise with slow swells and small random laps -------------------------------
noise = rng.standard_normal(n)
water = lowpass(noise, 900) * 0.6 + bandpass(noise, 300, 2500) * 0.25
swell = 0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * t + 1.3) * np.sin(2 * np.pi * 0.07 * t)
water *= swell
laps = np.zeros(n)
for _ in range(26):
    s = int(rng.uniform(0.5, DUR - 1.5) * SR); L = int(rng.uniform(0.25, 0.7) * SR)
    env = np.hanning(L) ** 2
    laps[s:s + L] += bandpass(rng.standard_normal(L), 500, 4000) * env * rng.uniform(0.5, 1.0)
water = water + laps * 0.8
water_l = water * (0.9 + 0.1 * np.sin(2 * np.pi * 0.05 * t))
water_r = np.roll(water, 900) * (0.9 - 0.1 * np.sin(2 * np.pi * 0.05 * t))

# --- outboard at idle, distant: low fundamental with harmonics, slow wobble, heavily lowpassed ---
f0 = 52 + 2.5 * np.sin(2 * np.pi * 0.23 * t) + 0.8 * rng.standard_normal(n).cumsum() / SR
phase = 2 * np.pi * np.cumsum(f0) / SR
motor = np.zeros(n)
for k, amp in [(1, 1.0), (2, 0.55), (3, 0.3), (4, 0.18), (5, 0.1), (6, 0.06)]:
    motor += amp * np.sin(k * phase + rng.uniform(0, 6.28))
motor += 0.25 * lowpass(rng.standard_normal(n), 400)         # exhaust burble
motor = lowpass(motor, 320) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.9 * t))

# --- gulls: a few distant cries, swept tone with vibrato, soft and far away -----------------------
gulls = np.zeros(n)
for start in [6.5, 17.0, 29.5]:
    for j in range(rng.integers(1, 3)):
        s = int((start + j * rng.uniform(0.6, 1.1)) * SR); L = int(rng.uniform(0.35, 0.6) * SR)
        tt = np.arange(L) / SR
        f = 2200 + 900 * np.exp(-tt * 6) - 400 * tt + 60 * np.sin(2 * np.pi * 28 * tt)
        env = np.sin(np.pi * tt / tt[-1]) ** 1.5
        cry = np.sin(2 * np.pi * np.cumsum(f) / SR) * env
        cry += 0.3 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * env
        gulls[s:s + L] += lowpass(cry, 3800) * 0.9
# a little distance: short exponential tail
tail = np.exp(-np.arange(int(0.25 * SR)) / (0.08 * SR))
gulls = np.convolve(gulls, tail / tail.sum() * 1.4, mode="same") + gulls * 0.6

left = water_l * 0.42 + motor * 0.22 + gulls * 0.35
right = water_r * 0.42 + motor * 0.22 + gulls * 0.25
mix = np.stack([left, right], axis=1)
mix /= np.abs(mix).max()
mix *= 0.5                                                    # headroom; template sets final level
mix[: int(0.8 * SR)] *= np.linspace(0, 1, int(0.8 * SR))[:, None]
out = Path(__file__).resolve().parent.parent / "public" / "sfx"
out.mkdir(parents=True, exist_ok=True)
wavfile.write(out / "ambient.wav", SR, (mix * 32767).astype(np.int16))
print("wrote", out / "ambient.wav")
