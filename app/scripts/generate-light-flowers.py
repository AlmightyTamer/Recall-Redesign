#!/usr/bin/env python3
"""Build light-theme flower assets from dark PNG sources.

Keeps the exact same composition as dark mode: colorful flower pixels are
unchanged, black background becomes warm cream, and grayscale smoke/fog is
mirrored so it reads on a light canvas.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "public" / "flowers"
OUT_DIR = ROOT / "public" / "flowers" / "light"

# Matches --studio-bg in light theme
BG = np.array([248, 244, 239], dtype=np.float32)
BG_THRESHOLD = 14
SMOKE_SAT_MAX = 35


def build_light_variant(src: Path) -> None:
    im = np.array(Image.open(src).convert("RGB"), dtype=np.float32)
    lum = 0.299 * im[:, :, 0] + 0.587 * im[:, :, 1] + 0.114 * im[:, :, 2]
    sat = im.max(axis=2) - im.min(axis=2)

    out = np.tile(BG, (im.shape[0], im.shape[1], 1))

    bg = lum <= BG_THRESHOLD
    smoke = (~bg) & (sat <= SMOKE_SAT_MAX)
    color = (~bg) & (~smoke)

    out[color] = im[color]

    if smoke.any():
        l = lum[smoke]
        t = np.clip((l - BG_THRESHOLD) / (255 - BG_THRESHOLD), 0, 1)
        smoke_rgb = BG - t[:, None] * np.array([55, 58, 62], dtype=np.float32)
        out[smoke] = np.clip(smoke_rgb, 0, 255)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stem = src.stem
    png_path = OUT_DIR / f"{stem}.png"
    webp_path = OUT_DIR / f"{stem}.webp"

    result = Image.fromarray(out.astype(np.uint8))
    result.save(png_path, optimize=True)
    result.save(webp_path, format="WEBP", quality=84, method=4)
    print(f"✓ {stem}")


def main() -> None:
    files = sorted(SRC_DIR.glob("flower-*.png"))
    if not files:
        raise SystemExit(f"No PNG flowers found in {SRC_DIR}")

    for src in files:
        build_light_variant(src)

    print(f"\nGenerated {len(files)} light flower variants in {OUT_DIR}")


if __name__ == "__main__":
    main()
