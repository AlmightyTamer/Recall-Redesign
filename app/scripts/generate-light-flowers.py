#!/usr/bin/env python3
"""Build light-theme flower assets from dark PNG sources."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "public" / "flowers"
OUT_DIR = ROOT / "public" / "flowers" / "light"
CREAM = (236, 230, 220)


def build_light_variant(src: Path) -> None:
    img = Image.open(src).convert("RGBA")
    width, height = img.size

    cream = Image.new("RGB", (width, height), CREAM)
    rgb = img.convert("RGB")
    lum = img.convert("L")
    alpha = img.split()[3]

    mask = lum.point(lambda p: 255 if p > 20 else 0)
    composed = cream.copy()
    composed.paste(rgb, mask=mask)

    # Soft drop shadow so petals read on cream.
    shadow = alpha.filter(ImageFilter.GaussianBlur(18))
    shadow = ImageEnhance.Brightness(shadow).enhance(0.45)
    shadow_rgba = Image.merge(
        "RGBA",
        (
            shadow.point(lambda p: 110),
            shadow.point(lambda p: 102),
            shadow.point(lambda p: 94),
            shadow.point(lambda p: min(72, int(p * 0.4))),
        ),
    )
    shadow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    shadow_layer.paste(shadow_rgba, (0, 14), shadow_rgba)

    composed = composed.convert("RGBA")
    composed = Image.alpha_composite(composed, shadow_layer)

    # Warm atmospheric smoke.
    smoke_src = ImageOps.autocontrast(lum, cutoff=1).filter(ImageFilter.GaussianBlur(radius=24))
    smoke_rgba = Image.merge(
        "RGBA",
        (
            smoke_src.point(lambda p: 150),
            smoke_src.point(lambda p: 140),
            smoke_src.point(lambda p: 128),
            smoke_src.point(lambda p: min(48, int(p * 0.18))),
        ),
    )
    composed = Image.alpha_composite(composed, smoke_rgba)

    # Slight petal definition on flower pixels only.
    boosted = ImageEnhance.Contrast(composed).enhance(1.12)
    composed = Image.composite(boosted, composed, mask.filter(ImageFilter.GaussianBlur(1)))

    composed = ImageEnhance.Color(composed).enhance(1.05)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    stem = src.stem
    composed.save(OUT_DIR / f"{stem}.png", optimize=True)
    composed.convert("RGB").save(
        OUT_DIR / f"{stem}.webp",
        format="WEBP",
        quality=84,
        method=4,
    )
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
