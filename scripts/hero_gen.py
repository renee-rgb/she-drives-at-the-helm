#!/usr/bin/env python3
"""Paint missing heroes with FLUX.1 schnell on Replicate, cut them out, and point the lesson at them.

Runs in GitHub Actions (needs REPLICATE_API_TOKEN). For every lessons/*.json whose hero has a
"prompt" but no "image", it:
  1. builds the brand prompt (skeleton + subject sentence),
  2. asks Replicate for one 16:9 PNG,
  3. writes public/heroes/<num>-bg.png and a rembg cutout <num>-fg.png,
  4. sets hero.kind = "image", hero.image, hero.cutout in the lesson JSON.
Re-run with --force <lesson-id> to repaint one hero (bump "seed" in the lesson to get a different take).
"""
import io, json, os, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKELETON = (
    "Hand-illustrated editorial boating illustration, like a page from a stylish vintage boating handbook: "
    "slightly inked black outlines, loose watercolor and marker texture, believable proportions, realistic enough "
    "to teach from. Palette: pale blush pink paper background, white boat, aqua turquoise water with loose "
    "watercolor texture and energetic white wakes, hot magenta accents, black ink, orange only where the subject "
    "needs it. {subject} Subject centered and filling the frame, simple composition, imperfect hand-drawn edges, "
    "no airbrush, no glossy 3D shading, no photorealism, no text, no letters, no logo."
)
MODEL = "black-forest-labs/flux-schnell"

def replicate(prompt: str, seed: int | None, token: str) -> bytes:
    body = {"input": {"prompt": prompt, "aspect_ratio": "16:9", "output_format": "png", "num_outputs": 1, "go_fast": True, "output_quality": 95}}
    if seed is not None:
        body["input"]["seed"] = seed
    req = urllib.request.Request(
        f"https://api.replicate.com/v1/models/{MODEL}/predictions",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json", "Prefer": "wait=60"},
    )
    pred = None
    for attempt in range(8):  # low-balance accounts are throttled to ~1 request at a time
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                pred = json.load(r)
            break
        except urllib.error.HTTPError as e:
            if e.code != 429:
                raise
            wait = 12
            try:
                wait = int(json.load(e).get("retry_after", 12)) + 2
            except Exception:
                pass
            print(f"throttled, retrying in {wait}s")
            time.sleep(wait)
    if pred is None:
        raise SystemExit("replicate kept throttling")
    # poll if not finished within the wait window
    while pred.get("status") not in ("succeeded", "failed", "canceled"):
        time.sleep(2)
        req2 = urllib.request.Request(pred["urls"]["get"], headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(req2, timeout=60) as r:
            pred = json.load(r)
    if pred["status"] != "succeeded":
        raise SystemExit(f"replicate failed: {pred.get('error')}")
    out = pred["output"]
    url = out[0] if isinstance(out, list) else out
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()

def main():
    token = os.environ.get("REPLICATE_API_TOKEN")
    if not token:
        sys.exit("REPLICATE_API_TOKEN not set")
    force = sys.argv[2] if len(sys.argv) > 2 and sys.argv[1] == "--force" else None
    changed = []
    for lp in sorted((ROOT / "lessons").glob("*.json")):
        lesson = json.loads(lp.read_text())
        hero = lesson.get("hero", {})
        if not hero.get("prompt"):
            continue
        if force and lesson["id"] != force:
            continue  # --force <id> paints only that lesson
        if hero.get("image") and not force:
            continue
        num = lesson["number"]
        prompt = SKELETON.format(subject=hero["prompt"].strip())
        print(f"painting {lesson['id']}: {hero['prompt']}")
        png = replicate(prompt, hero.get("seed"), token)
        src = ROOT / "heroes-in"; src.mkdir(exist_ok=True)
        (src / f"{num}.png").write_bytes(png)
        subprocess.run([sys.executable, str(ROOT / "scripts" / "hero.py"), str(src / f"{num}.png"), num], check=True)
        hero.update({"kind": "image", "image": f"heroes/{num}-bg.png", "cutout": f"heroes/{num}-fg.png"})
        lesson["hero"] = hero
        lp.write_text(json.dumps(lesson, indent=2) + "\n")
        changed.append(lesson["id"])
        time.sleep(12)
    print("painted:", changed or "nothing to do")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # surface the reason as a GitHub annotation (logs are not always reachable)
        import urllib.error
        detail = ""
        if isinstance(e, urllib.error.HTTPError):
            try:
                detail = e.read().decode()[:400]
            except Exception:
                pass
        print(f"::error::hero_gen failed: {type(e).__name__}: {e} {detail}")
        raise
