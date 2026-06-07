#!/usr/bin/env python3
"""Resize generated light flower PNGs and export matching webp assets."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path('/Users/GodZilla/.cursor/projects/empty-window/assets')
DARK_DIR = ROOT / 'public' / 'flowers'
OUT_DIR = ROOT / 'public' / 'flowers' / 'light'

MAPPING = {
    'flower-01-splash-light.png': 'flower-01-splash',
    'flower-02-landing-light.png': 'flower-02-landing',
    'flower-03-patient-light.png': 'flower-03-patient',
    'flower-04-supervisor-light.png': 'flower-04-supervisor',
    'flower-05-patient-enter-light.png': 'flower-05-patient-enter',
    'flower-06-supervisor-enter-light.png': 'flower-06-supervisor-enter',
    'flower-07-patient-app-light.png': 'flower-07-patient-app',
    'flower-08-supervisor-app-light.png': 'flower-08-supervisor-app',
    'flower-09-home-light.png': 'flower-09-home',
    'flower-10-comfort-light.png': 'flower-10-comfort',
}


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for src_name, stem in MAPPING.items():
        src = ASSETS / src_name
        if not src.exists():
            raise SystemExit(f'Missing generated asset: {src}')

        dark_ref = DARK_DIR / f'{stem}.png'
        target_size = Image.open(dark_ref).size

        img = Image.open(src).convert('RGB')
        img = img.resize(target_size, Image.Resampling.LANCZOS)

        png_out = OUT_DIR / f'{stem}.png'
        webp_out = OUT_DIR / f'{stem}.webp'
        img.save(png_out, optimize=True)
        img.save(webp_out, format='WEBP', quality=84, method=4)
        print(f'✓ {stem} -> {target_size[0]}x{target_size[1]}')


if __name__ == '__main__':
    main()
