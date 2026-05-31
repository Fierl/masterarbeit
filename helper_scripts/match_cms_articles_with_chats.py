from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any


COPY_TARGETS = {
    "public.users",
    "public.articles",
    "public.chats",
}


@dataclass
class CsvEntry:
    row_number: int
    content_id: int
    occurrence: int
    raw: dict[str, str]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Match a participant CSV with extracted CMS articles and SQL-dump based "
            "article/chat records, then write a consolidated JSON export."
        )
    )
    parser.add_argument("--csv", required=True, help="Path to the participant CSV file")
    parser.add_argument("--cms-json", required=True, help="Path to the extracted CMS JSON file")
    parser.add_argument("--sql-dump", required=True, help="Path to prod_new.sql")
    parser.add_argument(
        "--username",
        help="Optional username override, for example P17. Defaults to the participant code from the CSV.",
    )
    parser.add_argument(
        "--output",
        help="Optional output JSON path. Defaults to <csv-stem>_matched.json next to the CSV.",
    )
    parser.add_argument(
        "--lookahead",
        type=int,
        default=5,
        help="How many upcoming DB articles to consider when resolving order-based matches.",
    )
    return parser.parse_args()


def read_text_file(path: Path) -> str:
    for encoding in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("unknown", b"", 0, 1, f"Could not decode {path}")


def parse_csv(path: Path) -> tuple[str | None, list[CsvEntry], list[str]]:
    text = read_text_file(path)
    rows = list(csv.reader(text.splitlines(), delimiter=";"))

    participant = None
    header_row_index = None
    headers: list[str] = []

    for index, row in enumerate(rows):
        first = row[0].strip() if row else ""
        if first == "Teilnehmer:" and len(row) > 1:
            participant = row[1].strip() or None
        if first.startswith("CREATE-ID"):
            header_row_index = index
            headers = [cell.strip() for cell in row]
            break

    if header_row_index is None:
        raise ValueError(f"Header row with CREATE-ID not found in {path}")

    entries: list[CsvEntry] = []
    occurrence_by_content_id: dict[int, int] = defaultdict(int)

    for offset, row in enumerate(rows[header_row_index + 1 :], start=header_row_index + 2):
        if not row:
            continue
        first = row[0].strip()
        if not first:
            continue
        if not re.fullmatch(r"\d+", first):
            continue

        content_id = int(first)
        occurrence_by_content_id[content_id] += 1
        normalized_row = list(row) + [""] * (len(headers) - len(row))
        raw = {headers[i]: normalized_row[i].strip() for i in range(len(headers))}
        entries.append(
            CsvEntry(
                row_number=offset,
                content_id=content_id,
                occurrence=occurrence_by_content_id[content_id],
                raw=raw,
            )
        )

    return participant, entries, headers


def parse_cms_json(path: Path) -> list[dict[str, Any]]:
    return json.loads(path.read_text(encoding="utf-8"))


def decode_copy_value(value: str) -> Any:
    if value == r"\N":
        return None
    return (
        value.replace(r"\\", "\\")
        .replace(r"\t", "\t")
        .replace(r"\r", "\r")
        .replace(r"\n", "\n")
    )


def parse_copy_tables(path: Path) -> dict[str, list[dict[str, Any]]]:
    tables = {name: [] for name in COPY_TARGETS}
    current_table = None
    current_columns: list[str] = []

    with path.open("r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.rstrip("\n")
            if current_table is None:
                match = re.match(r"^COPY\s+(public\.(?:users|articles|chats))\s+\((.+)\)\s+FROM\s+stdin;$", line)
                if not match:
                    continue
                current_table = match.group(1)
                current_columns = [column.strip() for column in match.group(2).split(",")]
                continue

            if line == r"\.":
                current_table = None
                current_columns = []
                continue

            row = parse_copy_row(current_table, line, current_columns)
            tables[current_table].append(row)

    return tables


def parse_copy_row(table_name: str, line: str, current_columns: list[str]) -> dict[str, Any]:
    if table_name == "public.users":
        parts = line.split("\t")
        if len(parts) != len(current_columns):
            raise ValueError(
                f"Unexpected column count while parsing {table_name}: "
                f"expected {len(current_columns)}, got {len(parts)}"
            )
        return {
            current_columns[index]: decode_copy_value(parts[index])
            for index in range(len(current_columns))
        }

    if table_name == "public.chats":
        match = re.match(
            r"^(\d+)\t(\d+)\t([^\t]+)\t([^\t]+)\t(.*)\t(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?)$",
            line,
        )
        if not match:
            raise ValueError(f"Could not parse chats COPY row: {line[:200]}")
        values = [
            match.group(1),
            match.group(2),
            match.group(3),
            match.group(4),
            match.group(5),
            match.group(6),
        ]
        return {
            current_columns[index]: decode_copy_value(values[index])
            for index in range(len(current_columns))
        }

    if table_name == "public.articles":
        match = re.match(
            r"^(\d+)\t(\d+)\t(.*)\t([tf])\t(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?)\t(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?)$",
            line,
        )
        if not match:
            raise ValueError(f"Could not parse articles COPY row: {line[:200]}")
        payload = decode_copy_value(match.group(3))
        return {
            "id": decode_copy_value(match.group(1)),
            "user_id": decode_copy_value(match.group(2)),
            "payload": payload,
            "is_hidden": decode_copy_value(match.group(4)),
            "created_at": decode_copy_value(match.group(5)),
            "updated_at": decode_copy_value(match.group(6)),
        }

    raise ValueError(f"Unsupported COPY target: {table_name}")


def parse_bool(value: Any) -> bool | None:
    if value is None:
        return None
    if value in ("t", True):
        return True
    if value in ("f", False):
        return False
    return None


def parse_int(value: Any) -> int | None:
    if value is None or value == "":
        return None
    return int(value)


def parse_timestamp(value: Any) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(str(value))


def normalize_dump_tables(tables: dict[str, list[dict[str, Any]]]) -> dict[str, list[dict[str, Any]]]:
    users = []
    for row in tables["public.users"]:
        users.append(
            {
                **row,
                "id": parse_int(row["id"]),
                "created_at": parse_timestamp(row["created_at"]),
            }
        )

    articles = []
    for row in tables["public.articles"]:
        articles.append(
            {
                **row,
                "id": parse_int(row["id"]),
                "user_id": parse_int(row["user_id"]),
                "payload": row.get("payload"),
                "is_hidden": parse_bool(row["is_hidden"]),
                "created_at": parse_timestamp(row["created_at"]),
                "updated_at": parse_timestamp(row["updated_at"]),
            }
        )

    chats = []
    for row in tables["public.chats"]:
        chats.append(
            {
                **row,
                "id": parse_int(row["id"]),
                "article_id": parse_int(row["article_id"]),
                "created_at": parse_timestamp(row["created_at"]),
            }
        )

    return {
        "users": users,
        "articles": articles,
        "chats": chats,
    }


def normalize_text(value: Any) -> str:
    if not value:
        return ""
    text = str(value)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = text.lower()
    text = re.sub(r"-\d+$", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def token_set(value: Any, limit: int = 120) -> set[str]:
    normalized = normalize_text(value)
    if not normalized:
        return set()
    return set(normalized.split()[:limit])


def text_ratio(left: Any, right: Any) -> float:
    left_text = normalize_text(left)
    right_text = normalize_text(right)
    if not left_text or not right_text:
        return 0.0
    return SequenceMatcher(a=left_text, b=right_text).ratio()


def jaccard_score(left: Any, right: Any) -> float:
    left_tokens = token_set(left)
    right_tokens = token_set(right)
    if not left_tokens or not right_tokens:
        return 0.0
    intersection = left_tokens & right_tokens
    union = left_tokens | right_tokens
    return len(intersection) / len(union)


def build_cms_index(cms_articles: list[dict[str, Any]]) -> dict[int, list[dict[str, Any]]]:
    index: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for article in cms_articles:
        content_id = article.get("content_id")
        if content_id is None:
            continue
        index[int(content_id)].append(article)
    return index


def pick_cms_article(index: dict[int, list[dict[str, Any]]], content_id: int, occurrence: int) -> dict[str, Any] | None:
    matches = index.get(content_id, [])
    if not matches:
        return None
    if occurrence <= len(matches):
        return matches[occurrence - 1]
    return matches[-1]


def score_article_match(article: dict[str, Any], cms_article: dict[str, Any] | None, offset: int) -> float:
    if cms_article is None:
        return max(0.0, 0.2 - (offset * 0.02))

    match_fields = article.get("match_fields", {})

    cms_titles = [
        cms_article.get("h1"),
        cms_article.get("line_head"),
        cms_article.get("seo_title"),
        cms_article.get("content_name"),
    ]
    title_score = max(text_ratio(match_fields.get("headline"), title) for title in cms_titles)
    roofline_score = text_ratio(match_fields.get("roofline"), cms_article.get("line_roof"))
    subline_score = text_ratio(match_fields.get("subline"), cms_article.get("line_sub"))
    body_source = match_fields.get("text") or article.get("payload")
    body_score = jaccard_score(body_source, cms_article.get("text"))

    score = (
        (title_score * 3.0)
        + (roofline_score * 1.0)
        + (subline_score * 0.5)
        + (body_score * 1.5)
        - (offset * 0.05)
    )
    return score


def serialize_datetime(value: datetime | None) -> str | None:
    if value is None:
        return None
    return value.isoformat(sep=" ")


def serializable_article(article: dict[str, Any]) -> dict[str, Any]:
    data = {
        **article,
        "created_at": serialize_datetime(article.get("created_at")),
        "updated_at": serialize_datetime(article.get("updated_at")),
    }
    return data


def serializable_chat(chat: dict[str, Any]) -> dict[str, Any]:
    return {
        **chat,
        "created_at": serialize_datetime(chat.get("created_at")),
    }


def build_output(
    username: str,
    csv_entries: list[CsvEntry],
    cms_index: dict[int, list[dict[str, Any]]],
    user_articles: list[dict[str, Any]],
    chats_by_article_id: dict[int, list[dict[str, Any]]],
    lookahead: int,
) -> dict[str, Any]:
    matched_items: list[dict[str, Any]] = []
    skipped_articles: list[dict[str, Any]] = []
    cursor = 0

    article_latest_chat_fields: dict[int, dict[str, str]] = {}
    for article in user_articles:
        sorted_chats = sorted(
            chats_by_article_id.get(article["id"], []),
            key=lambda chat: ((chat.get("created_at") or datetime.min), chat.get("id") or 0),
        )
        latest_by_field: dict[str, str] = {}
        latest_generate_by_field: dict[str, str] = {}
        for chat in sorted_chats:
            field_name = chat.get("field_name")
            content = chat.get("content")
            if not field_name or content is None:
                continue
            latest_by_field[field_name] = str(content)
            if chat.get("chat_type") == "generate":
                latest_generate_by_field[field_name] = str(content)
        match_fields = dict(latest_by_field)
        for key, value in latest_generate_by_field.items():
            match_fields[key] = value
        article["match_fields"] = match_fields
        article_latest_chat_fields[article["id"]] = match_fields

    for sequence_index, entry in enumerate(csv_entries, start=1):
        cms_article = pick_cms_article(cms_index, entry.content_id, entry.occurrence)
        remaining = user_articles[cursor:]
        candidate_slice = remaining[: max(lookahead, 1)]

        selected_article = None
        selected_index = None
        selected_score = None
        candidate_scores: list[dict[str, Any]] = []

        for offset, article in enumerate(candidate_slice):
            score = score_article_match(article, cms_article, offset)
            candidate_scores.append(
                {
                    "article_id": article["id"],
                    "offset": offset,
                    "score": round(score, 4),
                    "headline": article.get("match_fields", {}).get("headline"),
                }
            )
        if candidate_slice:
            selected_article = candidate_slice[0]
            selected_index = cursor
            selected_score = candidate_scores[0]["score"]

        if selected_article is None:
            matched_items.append(
                {
                    "sequence_index": sequence_index,
                    "csv_row_number": entry.row_number,
                    "content_id": entry.content_id,
                    "content_id_occurrence": entry.occurrence,
                    "csv": entry.raw,
                    "cms_article": cms_article,
                    "db_match": None,
                    "match_status": "no-db-article-left",
                }
            )
            continue

        assert selected_index is not None
        skipped_range = user_articles[cursor:selected_index]
        skipped_articles.extend(serializable_article(article) for article in skipped_range)
        cursor = selected_index + 1

        article_chats = sorted(
            chats_by_article_id.get(selected_article["id"], []),
            key=lambda chat: ((chat.get("created_at") or datetime.min), chat.get("id") or 0),
        )
        generated_chats = [chat for chat in article_chats if chat.get("chat_type") == "generate"]
        latest_chat_by_field: dict[str, dict[str, Any]] = {}
        for chat in article_chats:
            field_name = chat.get("field_name")
            if field_name:
                latest_chat_by_field[field_name] = serializable_chat(chat)

        matched_items.append(
            {
                "sequence_index": sequence_index,
                "csv_row_number": entry.row_number,
                "content_id": entry.content_id,
                "content_id_occurrence": entry.occurrence,
                "participant_username": username,
                "csv": entry.raw,
                "cms_article": cms_article,
                "db_match": {
                    "match_method": "order",
                    "match_score": round(selected_score or 0.0, 4),
                    "article_rank_for_user": selected_index + 1,
                    "candidate_scores": candidate_scores,
                    "article": serializable_article(selected_article),
                    "match_fields": article_latest_chat_fields.get(selected_article["id"], {}),
                    "all_chats": [serializable_chat(chat) for chat in article_chats],
                    "generated_chats": [serializable_chat(chat) for chat in generated_chats],
                    "latest_chat_by_field": latest_chat_by_field,
                },
                "match_status": "matched",
            }
        )

    unmatched_articles = [serializable_article(article) for article in user_articles[cursor:]]

    return {
        "meta": {
            "participant_username": username,
            "csv_entry_count": len(csv_entries),
            "db_article_count_for_user": len(user_articles),
            "matched_count": len([item for item in matched_items if item["db_match"] is not None]),
            "unmatched_db_article_count": len(skipped_articles) + len(unmatched_articles),
            "generated_chat_count": sum(
                len(item["db_match"]["generated_chats"])
                for item in matched_items
                if item["db_match"] is not None
            ),
        },
        "items": matched_items,
        "unmatched_db_articles_before_or_between_matches": skipped_articles,
        "unmatched_db_articles_after_last_match": unmatched_articles,
    }


def main() -> None:
    args = parse_args()
    csv_path = Path(args.csv)
    cms_json_path = Path(args.cms_json)
    sql_dump_path = Path(args.sql_dump)
    output_path = Path(args.output) if args.output else csv_path.with_name(f"{csv_path.stem}_matched.json")

    participant_from_csv, csv_entries, csv_headers = parse_csv(csv_path)
    username = args.username or participant_from_csv
    if not username:
        raise ValueError("Could not determine participant username. Pass --username explicitly.")

    cms_articles = parse_cms_json(cms_json_path)
    cms_index = build_cms_index(cms_articles)

    raw_tables = parse_copy_tables(sql_dump_path)
    tables = normalize_dump_tables(raw_tables)

    users_by_username = {str(user["username"]).lower(): user for user in tables["users"]}
    user = users_by_username.get(username.lower())
    if user is None:
        raise ValueError(f"User {username!r} was not found in {sql_dump_path}")

    user_articles = sorted(
        [article for article in tables["articles"] if article.get("user_id") == user["id"]],
        key=lambda article: ((article.get("created_at") or datetime.min), article.get("id") or 0),
    )
    chats_by_article_id: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for chat in tables["chats"]:
        article_id = chat.get("article_id")
        if article_id is not None:
            chats_by_article_id[article_id].append(chat)
    user_articles = [article for article in user_articles if chats_by_article_id.get(article["id"])]

    output = build_output(
        username=username,
        csv_entries=csv_entries,
        cms_index=cms_index,
        user_articles=user_articles,
        chats_by_article_id=chats_by_article_id,
        lookahead=max(1, args.lookahead),
    )
    output["meta"]["csv_headers"] = csv_headers
    output["meta"]["csv_path"] = str(csv_path)
    output["meta"]["cms_json_path"] = str(cms_json_path)
    output["meta"]["sql_dump_path"] = str(sql_dump_path)
    output["meta"]["output_path"] = str(output_path)

    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Participant: {username}")
    print(f"CSV entries: {output['meta']['csv_entry_count']}")
    print(f"DB articles for user: {output['meta']['db_article_count_for_user']}")
    print(f"Matched entries: {output['meta']['matched_count']}")
    print(f"Generated chats included: {output['meta']['generated_chat_count']}")
    print(f"Output written to: {output_path}")


if __name__ == "__main__":
    main()