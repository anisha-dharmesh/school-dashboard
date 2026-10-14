"""
Fetch the Daily Class Update (DCU) -- classwork/homework per period, per
day -- from the ERP's own JSON API (NEWPHP/DCU/GetDailyWork.php).

Until 2026-10-07 this content was posted as a free-text "Daily Class
Update" circular ("Period 1: ... Period 2: ...") that classifier/periods.py
parsed with regex. From 2026-10-07 onward the school moved it to its own
section of the App ("Daily Class Updates (DCU) ... will be available in
the DCU section of the School App" -- see that date's circular in
docs/notices.json) backed by this endpoint instead, so no more "Daily
Class Update" notices appear in NoticeSMS.php's feed to parse. Confirmed
2026-10-14 by capturing the app's traffic: same no-login, no-cookies shape
as NoticeSMS.php, one day's periods per request (no date range param).

Returns the same {"period", "subject", "note", "hw"} shape
classifier/periods.parse_periods() produces, so build_record()'s existing
"Daily Class Update" rendering needs no changes downstream.
"""

import logging
import os
import re
from datetime import date
from typing import Optional

import requests

from classifier.classify import _KNOWN_SUBJECTS_RE, _normalize_subject

logger = logging.getLogger(__name__)

DAILY_WORK_PATH = "/NEWPHP/DCU/GetDailyWork.php"
USER_AGENT = "Dart/3.8 (dart:io)"  # matches the School App's own requests

# What the ERP sends for "nothing here" -- a bare "-", "NA"/"N/A", a lone
# ".", "no"/"nil"/"none" (seen on Homework specifically, e.g. a Homework
# of literal "no"), or blank -- all of which should read as no
# classwork/homework, matching how notice text's own absence of a line is
# already handled.
_BLANK_RE = re.compile(r"^\s*(-+|n\s*/?\s*a|\.+|no|nil|none)?\s*$", re.I)
_LEADING_PERIOD_NUM_RE = re.compile(r"^\s*(\d+)\s*(.*)$")


def _clean(value: Optional[str]) -> Optional[str]:
    if not value or _BLANK_RE.match(value):
        return None
    return value.strip()


def _parse_subject(subject_name: str) -> tuple:
    """SubjectName is "<period number> <subject>" e.g. "4 Math" -- split
    the two apart and normalize the subject the same way free-text period
    parsing does, so Daily Class Update periods look identical regardless
    of which source they came from."""
    m = _LEADING_PERIOD_NUM_RE.match(subject_name or "")
    if not m:
        return None, subject_name or None
    period_num = int(m.group(1))
    raw_subject = m.group(2).strip()
    subj_match = _KNOWN_SUBJECTS_RE.match(raw_subject) or _KNOWN_SUBJECTS_RE.search(raw_subject)
    subject = _normalize_subject(subj_match.group(1)) if subj_match else (raw_subject or None)
    return period_num, subject


def fetch_daily_work(
    date_iso: str,
    class_section_id: Optional[str] = None,
    academic_year_id: Optional[str] = None,
    base_url: Optional[str] = None,
) -> list:
    """Fetch one day's classwork/homework, period by period. Entries with
    neither classwork nor homework (a placeholder/duplicate period slot --
    seen in practice as a second same-numbered entry with everything
    blank) are dropped rather than rendered as an empty card."""
    class_section_id = class_section_id or os.environ["ERP_CLASS_SECTION_ID"]
    academic_year_id = academic_year_id or os.environ["ERP_ACADEMIC_YEAR_ID"]
    base_url = (base_url or os.environ["ERP_BASE_URL"]).rstrip("/")

    url = f"{base_url}{DAILY_WORK_PATH}"
    resp = requests.get(
        url,
        params={"Date1": date_iso, "TenantClassId": class_section_id, "AcademicYearId": academic_year_id},
        headers={"User-Agent": USER_AGENT, "Content-Type": "application/json"},
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()
    if data.get("status") != "true":
        raise RuntimeError(f"Unexpected GetDailyWork.php response shape: {list(data.keys())}")

    periods = []
    for item in data.get("DailyClassMaster", []):
        period_num, subject = _parse_subject(item.get("SubjectName", ""))
        note = _clean(item.get("ClassWork"))
        hw = _clean(item.get("Homework"))
        if note is None and hw is None:
            continue
        periods.append({"period": period_num, "subject": subject, "note": note, "hw": hw})

    periods.sort(key=lambda p: (p["period"] is None, p["period"]))
    return periods


if __name__ == "__main__":
    import json

    from dotenv import load_dotenv

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    load_dotenv()

    result = fetch_daily_work(date.today().isoformat())
    print(json.dumps(result, indent=2, ensure_ascii=False))
