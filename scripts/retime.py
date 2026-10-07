#!/usr/bin/env python3
"""Re-time a lesson's beats to Renee's recorded VO.

Usage: scripts/retime.py lessons/07-sound-signals.json vo/07.srt

The lesson JSON carries a "vo" list: [{"beat": "meaning", "cue": "Boats talk with a horn"}, ...].
For each beat we find the first SRT cue whose text contains the cue phrase (case-insensitive,
punctuation ignored) and set beats[beat] = that cue's start time. durationSeconds becomes the
last cue's end + 1.5s. The SRT can come from DaVinci Resolve's transcription or CapCut captions.
"""
import json, re, sys
from pathlib import Path

def norm(s):
    return re.sub(r"[^a-z0-9 ]", "", s.lower())

def parse_srt(path):
    txt = Path(path).read_text(encoding="utf-8", errors="ignore")
    cues = []
    for block in re.split(r"\n\s*\n", txt.strip()):
        lines = block.strip().splitlines()
        if len(lines) < 2:
            continue
        m = re.search(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)", lines[1] if "-->" in lines[1] else lines[0])
        if not m:
            continue
        h1, m1, s1, ms1, h2, m2, s2, ms2 = map(int, m.groups())
        start = h1 * 3600 + m1 * 60 + s1 + ms1 / 1000
        end = h2 * 3600 + m2 * 60 + s2 + ms2 / 1000
        text = " ".join(l for l in lines[(2 if "-->" in lines[1] else 1):])
        cues.append((start, end, text))
    return cues

def main(lesson_path, srt_path):
    lesson = json.loads(Path(lesson_path).read_text())
    cues = parse_srt(srt_path)
    if not cues:
        sys.exit("no cues found in SRT")
    joined = [(s, e, norm(t)) for s, e, t in cues]
    for item in lesson.get("vo", []):
        key = norm(item["cue"])
        hit = next((s for s, e, t in joined if key in t), None)
        if hit is None:
            print(f"!! cue not found for beat {item['beat']}: {item['cue']!r}")
            continue
        lesson["beats"][item["beat"]] = round(hit, 2)
        print(f"beat {item['beat']:9s} -> {hit:6.2f}s  ({item['cue']})")
    lesson["durationSeconds"] = round(cues[-1][1] + 1.5, 2)
    Path(lesson_path).write_text(json.dumps(lesson, indent=2) + "\n")
    print(f"duration -> {lesson['durationSeconds']}s. Wrote {lesson_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
