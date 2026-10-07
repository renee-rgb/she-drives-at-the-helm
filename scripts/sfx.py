#!/usr/bin/env python3
"""Synthesize the short UI sounds the template plays on page events. No samples, no licenses.

Writes to public/sfx/:
  stamp.wav    rubber stamp hitting paper (labels, cards)
  whoosh.wav   headline slam
  swish.wav    paper sliding in (pills, tape, hero)
  tick.wav     a row or icon landing
  scratch.wav  pen scratching for ~0.9 s (script lines, underlines)
  scratch-s.wav pen scratch ~0.35 s (icons drawing on)
  pop.wav      CTA pill
"""
import numpy as np
from pathlib import Path
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
rng = np.random.default_rng(3)
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)

def filt(x, lo=None, hi=None, order=2):
    if lo and hi:
        b, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], btype="band")
    elif hi:
        b, a = butter(order, hi / (SR / 2))
    else:
        b, a = butter(order, lo / (SR / 2), btype="high")
    return lfilter(b, a, x)

def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))

def write(name, x, peak=0.7):
    x = x / (np.abs(x).max() + 1e-9) * peak
    # tiny fade at both ends to avoid clicks
    f = int(0.004 * SR)
    x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
    wavfile.write(OUT / name, SR, (x * 32767).astype(np.int16))
    print("wrote", name, f"{len(x)/SR:.2f}s")

# stamp: low thump + paper slap
n = int(0.22 * SR); t = np.arange(n) / SR
thump = np.sin(2 * np.pi * (95 * np.exp(-t * 9) + 45) * t) * env_exp(n, 0.045)
slap = filt(rng.standard_normal(n), 800, 5000) * env_exp(n, 0.012) * 0.6
write("stamp.wav", thump * 1.0 + slap)

# whoosh: noise sweep, short
n = int(0.28 * SR); t = np.arange(n) / SR
w = rng.standard_normal(n)
sweep = np.zeros(n)
for i in range(0, n, 512):
    hi = 600 + 5000 * (i / n) ** 1.6
    seg = filt(w[i:i + 512], 200, min(hi, 12000))
    sweep[i:i + 512] = seg[: len(sweep[i:i + 512])]
write("whoosh.wav", sweep * np.sin(np.pi * t / t[-1]) ** 1.3, peak=0.5)

# swish: paper slide
n = int(0.18 * SR); t = np.arange(n) / SR
write("swish.wav", filt(rng.standard_normal(n), 900, 6000) * np.sin(np.pi * t / t[-1]) ** 2, peak=0.4)

# tick: tiny wooden click
n = int(0.06 * SR); t = np.arange(n) / SR
tick = np.sin(2 * np.pi * 1800 * t) * env_exp(n, 0.006) + filt(rng.standard_normal(n), 2000, 9000) * env_exp(n, 0.004) * 0.7
write("tick.wav", tick, peak=0.45)

# pen scratch: grainy band-limited noise with a hand's irregular pressure
def scratch(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    g = filt(rng.standard_normal(n), 1800, 7500)
    pressure = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * (6 + 3 * rng.random()) * t + rng.random() * 6)) ** 0.5
    wobble = 0.8 + 0.2 * np.sin(2 * np.pi * 1.7 * t)
    env = np.minimum(1, t / 0.03) * np.minimum(1, (t[-1] - t) / 0.08)
    return g * pressure * wobble * env

write("scratch.wav", scratch(0.9), peak=0.32)
write("scratch-s.wav", scratch(0.35), peak=0.3)

# pop: CTA pill
n = int(0.16 * SR); t = np.arange(n) / SR
pop = np.sin(2 * np.pi * (520 * np.exp(-t * 18) + 260) * t) * env_exp(n, 0.04)
write("pop.wav", pop, peak=0.5)
