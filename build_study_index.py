"""Rebuild docs/study/index.json from the chapter files under docs/study/<subject>/.

Each chapter file is docs/study/<subject-slug>/<chapter-slug>.json with
{subject, chapter, number, tests, sections}. The index only lists what the
Study tab needs to browse (subject -> chapters, with their test labels), so a
new chapter is: drop in its JSON, run this script, commit both.
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent / "docs" / "study"
SUBJECT_ORDER = ["English", "Hindi", "Maths", "Science", "Social Studies"]


def main() -> None:
    subjects: dict[str, dict] = {}
    for f in sorted(ROOT.glob("*/*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        s = subjects.setdefault(d["subject"], {"subject": d["subject"], "slug": f.parent.name, "chapters": []})
        s["chapters"].append({"slug": f.stem, "title": d["chapter"], "number": d.get("number"), "tests": d.get("tests", [])})
    for s in subjects.values():
        s["chapters"].sort(key=lambda c: (c["number"] is None, c["number"] or 0, c["title"]))
    ordered = sorted(subjects.values(), key=lambda s: (SUBJECT_ORDER.index(s["subject"]) if s["subject"] in SUBJECT_ORDER else 99, s["subject"]))
    (ROOT / "index.json").write_text(json.dumps({"subjects": ordered}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{sum(len(s['chapters']) for s in ordered)} chapters in {len(ordered)} subjects")


if __name__ == "__main__":
    main()
