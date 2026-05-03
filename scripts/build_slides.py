#!/usr/bin/env python3
"""Download the curated Wikimedia slide images and generate Deep Zoom (DZI) tile pyramids.

Pyramids are written under ``public/slides/<id>/`` and consumed by the React app
through OpenSeadragon's ``tileSources``. The script also emits
``src/data/slide-dimensions.json`` so the data layer can ship real
width/height for each slide.

Run:
    python3 scripts/build_slides.py
"""

from __future__ import annotations

import math
import sys
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image

# Pillow's pixel limit guard is for decompression bombs; the curated Wikimedia
# images are large but not malicious, so we lift the cap.
Image.MAX_IMAGE_PIXELS = None

REPO_ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = REPO_ROOT / "slides-raw"
PUBLIC_SLIDES_DIR = REPO_ROOT / "public" / "slides"
DIMENSIONS_OUT = REPO_ROOT / "src" / "data" / "slide-dimensions.ts"

TILE_SIZE = 254
TILE_OVERLAP = 1
TILE_FORMAT = "jpeg"
TILE_EXT = "jpg"
TILE_QUALITY = 80

USER_AGENT = "celula-sim-slide-builder/1.0 (educational; contact: danielmellofarias@gmail.com)"


@dataclass(frozen=True)
class SlideSource:
    id: str
    url: str
    filename: str


SOURCES: list[SlideSource] = [
    SlideSource(
        id="onion-fresh",
        url="https://upload.wikimedia.org/wikipedia/commons/3/30/Onion_Epidermis_Cells_W.M._40x_-_294.jpg",
        filename="onion-fresh.jpg",
    ),
    SlideSource(
        id="onion-stained",
        url="https://upload.wikimedia.org/wikipedia/commons/8/86/Chicory_Stomata.jpg",
        filename="onion-stained.jpg",
    ),
    SlideSource(
        id="cheek-fresh",
        url="https://upload.wikimedia.org/wikipedia/commons/4/4b/Human_cheek_cells_from_science_class.jpg",
        filename="cheek-fresh.jpg",
    ),
    SlideSource(
        id="cheek-stained",
        url="https://upload.wikimedia.org/wikipedia/commons/f/fd/Blood_under_microscope.jpg",
        filename="cheek-stained.jpg",
    ),
]


def download(source: SlideSource) -> Path:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    target = RAW_DIR / source.filename
    if target.exists() and target.stat().st_size > 0:
        print(f"  · cached  {target.relative_to(REPO_ROOT)}")
        return target

    print(f"  · fetch   {source.url}")
    request = urllib.request.Request(source.url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response, target.open("wb") as fh:
        fh.write(response.read())
    print(f"           saved → {target.relative_to(REPO_ROOT)} ({target.stat().st_size // 1024} KB)")
    return target


def write_dzi_descriptor(out_path: Path, width: int, height: int) -> None:
    descriptor = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<Image xmlns="http://schemas.microsoft.com/deepzoom/2008"'
        f' Format="{TILE_EXT}"'
        f' Overlap="{TILE_OVERLAP}"'
        f' TileSize="{TILE_SIZE}">\n'
        f'  <Size Width="{escape(str(width))}" Height="{escape(str(height))}" />\n'
        '</Image>\n'
    )
    out_path.write_text(descriptor, encoding="utf-8")


def tile_level(level_image: Image.Image, level_dir: Path) -> None:
    level_dir.mkdir(parents=True, exist_ok=True)
    width, height = level_image.size
    cols = math.ceil(width / TILE_SIZE)
    rows = math.ceil(height / TILE_SIZE)

    for row in range(rows):
        for col in range(cols):
            left = max(col * TILE_SIZE - TILE_OVERLAP, 0)
            top = max(row * TILE_SIZE - TILE_OVERLAP, 0)
            right = min((col + 1) * TILE_SIZE + TILE_OVERLAP, width)
            bottom = min((row + 1) * TILE_SIZE + TILE_OVERLAP, height)
            tile = level_image.crop((left, top, right, bottom))
            if tile.mode != "RGB":
                tile = tile.convert("RGB")
            tile.save(level_dir / f"{col}_{row}.{TILE_EXT}", "JPEG", quality=TILE_QUALITY, optimize=True)


def build_pyramid(source: SlideSource, raw_path: Path) -> tuple[int, int]:
    slide_dir = PUBLIC_SLIDES_DIR / source.id
    files_dir = slide_dir / f"{source.id}_files"

    if files_dir.exists():
        # Drop a stale pyramid before rebuilding so deleted levels don't linger.
        for sub in sorted(files_dir.glob("*"), reverse=True):
            if sub.is_dir():
                for tile in sub.iterdir():
                    tile.unlink()
                sub.rmdir()
        files_dir.rmdir()

    slide_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(raw_path) as base:
        base.load()
        if base.mode != "RGB":
            base = base.convert("RGB")
        width, height = base.size
        max_level = max(0, math.ceil(math.log2(max(width, height))))

        # DZI levels go from 0 (1x1 thumbnail) up to ``max_level`` (full size).
        for level in range(max_level + 1):
            scale = 2 ** (max_level - level)
            level_w = max(1, math.ceil(width / scale))
            level_h = max(1, math.ceil(height / scale))
            level_image = base if scale == 1 else base.resize((level_w, level_h), Image.LANCZOS)
            level_dir = files_dir / str(level)
            tile_level(level_image, level_dir)
            if level_image is not base:
                level_image.close()

    write_dzi_descriptor(slide_dir / f"{source.id}.dzi", width, height)
    return width, height


def main() -> int:
    print(f"Building slide pyramids → {PUBLIC_SLIDES_DIR.relative_to(REPO_ROOT)}/")
    PUBLIC_SLIDES_DIR.mkdir(parents=True, exist_ok=True)
    DIMENSIONS_OUT.parent.mkdir(parents=True, exist_ok=True)

    dimensions: dict[str, dict[str, int]] = {}
    for source in SOURCES:
        print(f"\n[{source.id}]")
        raw = download(source)
        width, height = build_pyramid(source, raw)
        dimensions[source.id] = {"width": width, "height": height}
        print(f"  · pyramid {width} × {height}px → public/slides/{source.id}/")

    lines = [
        "// Auto-generated by scripts/build_slides.py — do not edit by hand.",
        "// Regenerate with: python3 scripts/build_slides.py",
        "",
        "export type SlideDimensions = { readonly width: number; readonly height: number }",
        "",
        "export const SLIDE_DIMENSIONS = {",
    ]
    for slide_id in sorted(dimensions):
        dim = dimensions[slide_id]
        lines.append(f"  '{slide_id}': {{ width: {dim['width']}, height: {dim['height']} }},")
    lines += [
        "} as const satisfies Record<string, SlideDimensions>",
        "",
    ]
    DIMENSIONS_OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nWrote dimensions manifest → {DIMENSIONS_OUT.relative_to(REPO_ROOT)}")
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
