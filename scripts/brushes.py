#!/usr/bin/env python3
"""Turn Draw Things brush-stroke paintings into transparent brush PNGs.

Usage: scripts/brushes.py "/path/to/folder/with/brush-*.png"
Each brush-XX.png is cut out with rembg, trimmed to its bounding box, and saved to public/brushes/.
"""
import glob, io, subprocess, sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

out = Path(__file__).resolve().parent.parent / "public" / "brushes"
out.mkdir(parents=True, exist_ok=True)
sess = new_session("u2netp")
n = 0
for f in sorted(glob.glob(sys.argv[1])):
    im = Image.open(f).convert("RGB")
    buf = io.BytesIO(); im.save(buf, "PNG")
    cut = Image.open(io.BytesIO(remove(buf.getvalue(), session=sess))).convert("RGBA")
    bbox = cut.getbbox()
    if not bbox:
        print("skip (empty):", f); continue
    cut = cut.crop(bbox)
    cut.save(out / f"{Path(f).stem}.png"); n += 1
subprocess.run([str(Path(__file__).resolve().parent / "sync-assets.sh")], check=True)
print(f"{n} brushes ready")
