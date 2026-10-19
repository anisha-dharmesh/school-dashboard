"""
Fill gaps in our own notice feed with Notes/Study material that other
sections of the same class received but our feed didn't.

Each section's teacher uploads the same note separately (different PDF
filename, often slightly different caption), so neither the content-hash id
nor the attachment URL can dedup across feeds -- a note counts as already
present when an existing Subject Notes record has the same posted date,
subject and material type and a matching (or missing) chapter.

Only Subject Notes (Notes / Revision / Worksheet / Answer Key) are ever
taken from the extra feeds, and only ones we don't already have; our own
feed is never overwritten. Added records carry `other_section: True` as a
quiet marker -- no student/section id and no change to any visible text.
"""

import logging
import os
import re
from datetime import date
from difflib import SequenceMatcher
from typing import Optional

from classifier.classify import classify
from datastore.store import build_record
from scraper.notices import fetch_all_notices

logger = logging.getLogger(__name__)

EXTRA_STUDENTS_ENV = "ERP_EXTRA_STUDENTS"


def parse_extra_students(raw: Optional[str]) -> list:
    """'13:425,12:427' -> ['13', '12']. The section half is documentation
    only (which class each student belongs to); the notice API needs just
    the StudentId. A bare '13' is accepted too."""
    ids = []
    for part in (raw or "").split(","):
        part = part.strip()
        if part:
            ids.append(part.split(":")[0].strip())
    return ids


def _norm(s: Optional[str]) -> str:
    return re.sub(r"\W+", "", (s or "").lower())


def _same_chapter(a: Optional[str], b: Optional[str]) -> bool:
    # Many Hindi/Revision/Worksheet notices carry no chapter at all -- two
    # such notices of the same date/subject/type are treated as the same.
    na, nb = _norm(a), _norm(b)
    if not na or not nb:
        return True
    return na == nb or na in nb or nb in na or SequenceMatcher(None, na, nb).ratio() >= 0.8


# Sections often post the same note a day or two apart; with a named chapter
# that's still the same note, so allow a few days of slack there.
NEARBY_DAYS = 3


def _is_dupe(rec: dict, pool: dict) -> bool:
    d = date.fromisoformat(rec["posted_date_iso"])
    for other in pool.get((rec["subject"], rec["material_type"]), ()):
        gap = abs((date.fromisoformat(other["posted_date_iso"]) - d).days)
        if gap == 0 and _same_chapter(rec["chapter"], other["chapter"]):
            return True
        if 0 < gap <= NEARBY_DAYS and _norm(rec["chapter"]) and _norm(other["chapter"]) and _same_chapter(rec["chapter"], other["chapter"]):
            return True
    return False


def _index(records) -> dict:
    pool: dict = {}
    for r in records:
        if r["category"] == "Subject Notes":
            pool.setdefault((r["subject"], r["material_type"]), []).append(r)
    return pool


def fetch_gap_notes(known: list, since: str, student_ids: Optional[list] = None) -> list:
    """Return new Subject Notes records found in the extra feeds that aren't
    already in `known` (existing store + freshly fetched own notices)."""
    if student_ids is None:
        student_ids = parse_extra_students(os.environ.get(EXTRA_STUDENTS_ENV))
    if not student_ids:
        return []

    known_ids = {r["id"] for r in known}
    pool = _index(known)
    added = []
    for sid in student_ids:
        try:
            notices = fetch_all_notices(student_id=sid)
        except Exception:
            logger.exception("Failed to fetch an extra feed -- skipping it")
            continue
        for n in notices:
            rec = build_record(n, classify(n.text))
            if rec["category"] != "Subject Notes" or rec["posted_date_iso"] < since:
                continue
            if rec["id"] in known_ids or _is_dupe(rec, pool):
                continue
            rec["other_section"] = True
            added.append(rec)
            known_ids.add(rec["id"])
            pool.setdefault((rec["subject"], rec["material_type"]), []).append(rec)
    logger.info("Gap-fill: %d new notes from %d extra feeds", len(added), len(student_ids))
    return added


def drop_superseded(merged: list, own_fresh: list) -> list:
    """If our own feed later posts a note we'd previously gap-filled, keep
    ours and drop the gap-filled stand-in."""
    pool = _index(own_fresh)
    return [r for r in merged if not (r.get("other_section") and _is_dupe(r, pool))]
