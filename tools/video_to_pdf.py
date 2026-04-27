#!/usr/bin/env python3
"""Convert a video file into a multi-page PDF by sampling frames."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlparse

from PIL import Image


def run_ffmpeg(input_video: str, frames_dir: Path, interval_seconds: float, width: int) -> None:
    fps_expr = f"1/{interval_seconds}"
    vf = f"fps={fps_expr},scale={width}:-1:flags=lanczos"
    output_pattern = str(frames_dir / "frame_%06d.jpg")

    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        input_video,
        "-vf",
        vf,
        "-q:v",
        "3",
        output_pattern,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "ffmpeg failed")


def sample_frames(frames: list[Path], max_pages: int) -> list[Path]:
    if len(frames) <= max_pages:
        return frames

    # Keep the first and last frame and sample evenly in-between.
    selected = [frames[0]]
    slots = max_pages - 2
    for i in range(1, slots + 1):
        idx = round(i * (len(frames) - 1) / (slots + 1))
        selected.append(frames[idx])
    selected.append(frames[-1])
    return selected


def convert_to_pdf(frame_paths: list[Path], output_pdf: Path) -> None:
    if not frame_paths:
        raise ValueError("No frames were extracted. Try a smaller --interval value.")

    images: list[Image.Image] = []
    for frame in frame_paths:
        with Image.open(frame) as img:
            images.append(img.convert("RGB"))

    first, rest = images[0], images[1:]
    first.save(output_pdf, save_all=True, append_images=rest)


def is_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def infer_output_name(input_value: str) -> str:
    if is_url(input_value):
        parsed = urlparse(input_value)
        stem = Path(parsed.path).stem
        return f"{stem or 'lecture'}.pdf"

    return f"{Path(input_value).stem}.pdf"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert a video file into a PDF summary.")
    parser.add_argument("input", help="Input video file path or direct video URL")
    parser.add_argument("-o", "--output", type=Path, help="Output PDF path")
    parser.add_argument(
        "--interval",
        type=float,
        default=30.0,
        help="Frame sampling interval in seconds (default: 30)",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=80,
        help="Maximum pages in output PDF (default: 80)",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1280,
        help="Frame resize width in pixels (default: 1280)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if shutil.which("ffmpeg") is None:
        print("Error: ffmpeg is not installed or not in PATH.", file=sys.stderr)
        return 1

    input_value = str(args.input).strip()
    input_is_url = is_url(input_value)
    if input_is_url:
        ffmpeg_input = input_value
    else:
        input_video = Path(input_value).resolve()
        if not input_video.exists():
            print(f"Error: input file not found: {input_video}", file=sys.stderr)
            return 1
        ffmpeg_input = str(input_video)

    if args.interval <= 0:
        print("Error: --interval must be greater than 0.", file=sys.stderr)
        return 1
    if args.max_pages < 1:
        print("Error: --max-pages must be at least 1.", file=sys.stderr)
        return 1
    if args.width < 320:
        print("Error: --width must be at least 320.", file=sys.stderr)
        return 1

    if args.output:
        output_pdf = args.output.resolve()
    else:
        desktop_dir = Path.home() / "Desktop"
        output_pdf = desktop_dir / infer_output_name(input_value)
    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="video-to-pdf-") as temp_dir:
        frames_dir = Path(temp_dir)
        try:
            run_ffmpeg(ffmpeg_input, frames_dir, args.interval, args.width)
        except RuntimeError as exc:
            print(f"Error: {exc}", file=sys.stderr)
            if input_is_url:
                print(
                    "Hint: LMS URL usually requires login session and a direct video stream URL.",
                    file=sys.stderr,
                )
            return 1

        frames = sorted(frames_dir.glob("*.jpg"))
        sampled_frames = sample_frames(frames, args.max_pages)
        convert_to_pdf(sampled_frames, output_pdf)

    print(f"Done: {output_pdf}")
    print(f"Pages: {len(sampled_frames)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())