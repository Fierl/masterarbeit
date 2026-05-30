"""
Extrahiert ausgewählte Felder aus den Artikel-JSON-Dateien und speichert sie
als neue JSON-Dateien im Ordner masterthesis/extracted/.

Extrahierte Felder
------------------
Top-Level  : content_id, content_name, published_date
Attribute  : line_head, line_roof, line_sub, origin_id, seo_description,
             seo_title, h1, paywall_teaser, text, intro, paywall_active
"""

import json
import glob
import os
import html

# Zielordner
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "masterthesis", "extracted")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Attribute, deren Wert in value_text steht
TEXT_ATTRS = {
    "line_head", "line_roof", "line_sub", "origin_id",
    "seo_description", "seo_title", "h1",
    "paywall_teaser", "text", "intro",
}

# Attribute, deren Wert in value_int steht
INT_ATTRS = {"paywall_active"}

ALL_ATTRS = TEXT_ATTRS | INT_ATTRS


def get_attr_value(attributes: list, identifier: str) -> object:
    """Gibt den ersten nicht-None-Wert eines Attributs zurück."""
    for attr in attributes:
        if attr["identifier"] != identifier:
            continue
        if identifier in INT_ATTRS:
            if attr["value_int"] is not None:
                return attr["value_int"]
        else:
            if attr["value_text"] is not None:
                # HTML-Entities dekodieren
                return html.unescape(attr["value_text"])
    return None


def extract_article(article: dict) -> dict:
    attrs = article.get("attributes", [])
    record = {
        "content_id":     article.get("content_id"),
        "content_name":   article.get("content_name"),
        "published_date": article.get("published_date"),
    }
    for identifier in sorted(ALL_ATTRS):
        record[identifier] = get_attr_value(attrs, identifier)
    return record


def process_file(input_path: str) -> None:
    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    extracted = [extract_article(article) for article in data]

    # Phase-Ordner in Dateiname einbeziehen, z.B. "phase_2_articles_output_p04.json"
    phase = os.path.basename(os.path.dirname(input_path))
    filename = f"{phase}_{os.path.basename(input_path)}"
    output_path = os.path.join(OUTPUT_DIR, filename)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(extracted, f, ensure_ascii=False, indent=2)

    print(f"  {len(extracted):3d} Artikel  ->  {output_path}")


def main():
    pattern = os.path.join(
        os.path.dirname(__file__), "..", "masterthesis", "phase_*", "*.json"
    )
    files = sorted(glob.glob(pattern))
    if not files:
        print("Keine Eingabedateien gefunden.")
        return

    print(f"{len(files)} Dateien gefunden:\n")
    for fpath in files:
        process_file(fpath)
    print("\nFertig.")


if __name__ == "__main__":
    main()
