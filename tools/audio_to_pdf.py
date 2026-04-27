#!/usr/bin/env python3
"""Transcribe audio and save transcript as a PDF file."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from faster_whisper import WhisperModel
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Transcribe audio and export to PDF.")
    parser.add_argument("input", type=Path, help="Input audio/video file path")
    parser.add_argument("-o", "--output", type=Path, help="Output PDF path")
    parser.add_argument("--model", default="small", help="Whisper model size (default: small)")
    parser.add_argument("--language", default="ko", help="Language code (default: ko)")
    parser.add_argument(
        "--compute-type",
        default="int8",
        help="Compute type for inference (default: int8)",
    )
    return parser.parse_args()


def format_timestamp(seconds: float) -> str:
    total = max(0, int(seconds))
    hours = total // 3600
    minutes = (total % 3600) // 60
    secs = total % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def get_default_output(input_path: Path) -> Path:
    desktop = Path.home() / "Desktop"
    return desktop / f"{input_path.stem}_transcript.pdf"


def get_windows_korean_font() -> Path | None:
    candidates = [
        Path("C:/Windows/Fonts/malgun.ttf"),
        Path("C:/Windows/Fonts/NanumGothic.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def create_pdf(lines: list[str], output_pdf: Path) -> None:
    output_pdf.parent.mkdir(parents=True, exist_ok=True)

    font_name = "Helvetica"
    font_path = get_windows_korean_font()
    if font_path is not None:
        font_name = "KR"
        pdfmetrics.registerFont(TTFont(font_name, str(font_path)))

    page_w, page_h = A4
    margin_x = 40
    margin_y = 40
    line_height = 15
    max_width = page_w - (margin_x * 2)

    c = canvas.Canvas(str(output_pdf), pagesize=A4)
    c.setFont(font_name, 12)

    y = page_h - margin_y
    c.drawString(margin_x, y, "LMS Lecture Transcript")
    y -= line_height * 1.5

    def draw_wrapped(text: str) -> float:
        nonlocal y
        current = ""
        for ch in text:
            trial = current + ch
            if pdfmetrics.stringWidth(trial, font_name, 11) <= max_width:
                current = trial
                continue

            if y <= margin_y:
                c.showPage()
                c.setFont(font_name, 11)
                y = page_h - margin_y
            c.drawString(margin_x, y, current)
            y -= line_height
            current = ch

        if current:
            if y <= margin_y:
                c.showPage()
                c.setFont(font_name, 11)
                y = page_h - margin_y
            c.drawString(margin_x, y, current)
            y -= line_height

        return y

    c.setFont(font_name, 11)
    for line in lines:
        draw_wrapped(line)

    c.save()


def transcribe(input_path: Path, model_name: str, language: str, compute_type: str) -> list[str]:
    model = WhisperModel(model_name, device="cpu", compute_type=compute_type)
    segments, _ = model.transcribe(
        str(input_path),
        language=language,
        vad_filter=True,
    )

    lines: list[str] = []
    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue
        start = format_timestamp(seg.start)
        end = format_timestamp(seg.end)
        lines.append(f"[{start} - {end}] {text}")

    return lines


def main() -> int:
    args = parse_args()
    input_path = args.input.resolve()

    if not input_path.exists():
        print(f"Error: input file not found: {input_path}", file=sys.stderr)
        return 1

    output_pdf = args.output.resolve() if args.output else get_default_output(input_path)

    try:
        lines = transcribe(input_path, args.model, args.language, args.compute_type)
    except Exception as exc:  # noqa: BLE001
        print(f"Error during transcription: {exc}", file=sys.stderr)
        return 1

    if not lines:
        print("Error: No speech content recognized.", file=sys.stderr)
        return 1

    create_pdf(lines, output_pdf)
    print(f"Done: {output_pdf}")
    print(f"Lines: {len(lines)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())