#!/usr/bin/env python3
"""Prepare a painted hero for the 2.5D parallax slot.

Usage: scripts/hero.py "/path/to/08.png" 08
Writes public/heroes/08-bg.png (the painting, resized to 1920x1040) and public/heroes/08-fg.png
(the subject cut out with rembg), then runs sync-assets. Point the lesson at:
  "hero": { "kind": "image", "image": "heroes/08-bg.png", "cutout": "heroes/08-fg.png" }
"""
import io, subprocess, sys
from pathlib import Path
from PIL import Image, ImageOps
from rembg import remove, new_session

src, num = Path(sys.argv[1]), sys.argv[2]
out = Path(__file__).resolve().parent.parent / "public" / "heroes"
out.mkdir(parents=True, exist_ok=True)
im = Image.open(src).convert("RGB")
im = ImageOps.fit(im, (1600, 1200), Image.LANCZOS, centering=(0.5, 0.5))
im.save(out / f"{num}-bg.png")
buf = io.BytesIO(); im.save(buf, "PNG")
fg = remove(buf.getvalue(), session=new_session("u2netp"))
(out / f"{num}-fg.png").write_bytes(fg)
subprocess.run([str(Path(__file__).resolve().parent / "sync-assets.sh")], check=True)
print(f"wrote {num}-bg.png and {num}-fg.png")
