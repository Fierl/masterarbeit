"""
extract_used_fields.py

Creates a reduced JSON from *_matched.json files that contains:
  - CSV metadata for each article
  - Only the cms_article fields that were actually used (based on "Verwendete Felder")
  - Only the ai-generated match_fields that were actually used

Reads all *_matched.json files in the phase2 directory and writes
*_extracted.json files into phase2/extracted/.

Usage:
    python helper_scripts/extract_used_fields.py
    python helper_scripts/extract_used_fields.py --input masterthesis/data/excel/phase2
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

# Maps db field name -> corresponding key inside cms_article
CMS_FIELD_MAP: dict[str, str | None] = {
    "text":        "text",
    "headline":    "h1",
    "roofline":    "line_roof",
    "subline":     "line_sub",
    "subheadings": None,   # not present in cms_article
    "teaser":      None,   # not present in cms_article
    "tags":        None,   # not present in cms_article
    "shorten_text": None,
}

# Maps db field name -> corresponding key inside match_fields (usually identical)
MATCH_FIELD_MAP: dict[str, str] = {
    "text":         "text",
    "headline":     "headline",
    "roofline":     "roofline",
    "subline":      "subline",
    "subheadings":  "subheadings",
    "teaser":       "teaser",
    "tags":         "tags",
    "shorten_text": "shorten_text",
}


def process_item(item: dict) -> dict:
    used_fields: list[str] = item.get("used_db_fields", [])
    cms_article: dict = item.get("cms_article", {})
    match_fields: dict = item.get("db_match", {}).get("match_fields", {})

    cms_extracted: dict = {}
    for field in used_fields:
        cms_key = CMS_FIELD_MAP.get(field)
        if cms_key and cms_key in cms_article:
            cms_extracted[field] = cms_article[cms_key]

    ai_extracted: dict = {}
    for field in used_fields:
        match_key = MATCH_FIELD_MAP.get(field, field)
        if match_key in match_fields:
            ai_extracted[field] = match_fields[match_key]

    return {
        "sequence_index":       item.get("sequence_index"),
        "csv_row_number":       item.get("csv_row_number"),
        "content_id":           item.get("content_id"),
        "participant_username": item.get("participant_username"),
        "match_status":         item.get("match_status"),
        "used_db_fields":       used_fields,
        "csv":                  item.get("csv", {}),
        "cms_article":          cms_extracted,
        "ai_generated":         ai_extracted,
    }


def process_file(input_path: Path, output_path: Path) -> None:
    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    items = data.get("items", [])
    processed = [process_item(item) for item in items]

    output = {
        "meta": data.get("meta", {}),
        "items": processed,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"  {input_path.name} -> {output_path} ({len(processed)} items)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract used fields from matched JSON files.")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("masterthesis/data/excel/phase2"),
        help="Directory containing *_matched.json files",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output directory (default: <input>/extracted)",
    )
    args = parser.parse_args()

    input_dir: Path = args.input
    output_dir: Path = args.output or (input_dir / "extracted")

    matched_files = sorted(input_dir.glob("*_matched.json"))
    if not matched_files:
        print(f"No *_matched.json files found in {input_dir}")
        return

    print(f"Processing {len(matched_files)} file(s) -> {output_dir}/")
    for json_file in matched_files:
        output_file = output_dir / json_file.name.replace("_matched.json", "_extracted.json")
        process_file(json_file, output_file)

    print("Done.")


if __name__ == "__main__":
    main()
