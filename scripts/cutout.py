#!/usr/bin/env python3
"""Cut a painted hero out of its background so it can float over the paper.

Usage: scripts/cutout.py heroes-in/07.png public/heroes/07.png
Uses rembg (u2netp, CPU). Keep the original; the cutout is a new file.
"""
import sys
from pathlib import Path
from rembg import remove, new_session

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
dst.parent.mkdir(parents=True, exist_ok=True)
dst.write_bytes(remove(src.read_bytes(), session=new_session("u2netp")))
print(f"wrote {dst}")
