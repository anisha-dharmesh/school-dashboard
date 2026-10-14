"""
Fetch the notice list from the ERP's own JSON API (NEWPHP/Comman/NoticeSMS.php)
-- the endpoint the official School App itself calls.

Confirmed 2026-10-14 by capturing the app's traffic (mitmproxy): this endpoint
takes AcademicYearId + StudentId as plain query params, returns the whole
notice history as JSON in one response (newest first, no pagination), and
needs no login/session/cookies at all -- a plain unauthenticated GET from
any host returns the same data the app shows after sign-in. Attachment URLs
in the response (Notice_photos) are equally unauthenticated static files on
the same host. This replaces the previous approach of logging into the
ASP.NET site and scraping StudentModule/SchoolNotice.aspx's HTML table --
same data, no session management, no HTML parsing.

StudentId/AcademicYearId are tied to the enrolled child (not derived from a
login), so they come from env rather than from a session.
"""

import logging
import os
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

import requests

logger = logging.getLogger(__name__)

NOTICE_SMS_PATH = "/NEWPHP/Comman/NoticeSMS.php"

USER_AGENT = "Dart/3.8 (dart:io)"  # matches the School App's own requests


class NoticeFetchError(RuntimeError):
    """Raised when the ERP's notice API doesn't return what we expect."""


@dataclass
class Notice:
    sr: str
    posted_date: str  # DD-MM-YYYY, kept in this format for compatibility
    text: str
    attachment_url: Optional[str]

    @property
    def posted_date_parsed(self) -> datetime:
        return datetime.strptime(self.posted_date, "%d-%m-%Y")


def _to_notice(item: dict) -> Notice:
    posted = datetime.strptime(item["CirCularDate"]["date"][:19], "%Y-%m-%d %H:%M:%S")
    photos = (item.get("Notice_photos") or "").strip()
    attachment_url = f"https://{photos}" if photos else None
    return Notice(
        sr=str(item["CircularId"]),
        posted_date=posted.strftime("%d-%m-%Y"),
        text=item["Circular"],
        attachment_url=attachment_url,
    )


def fetch_all_notices(
    student_id: Optional[str] = None,
    academic_year_id: Optional[str] = None,
    base_url: Optional[str] = None,
) -> list:
    """Fetch the full notice history in one request, newest first."""
    student_id = student_id or os.environ["ERP_STUDENT_ID"]
    academic_year_id = academic_year_id or os.environ["ERP_ACADEMIC_YEAR_ID"]
    base_url = (base_url or os.environ["ERP_BASE_URL"]).rstrip("/")

    url = f"{base_url}{NOTICE_SMS_PATH}"
    resp = requests.get(
        url,
        params={"AcademicYearId": academic_year_id, "StudentId": student_id},
        headers={"User-Agent": USER_AGENT, "Content-Type": "application/json"},
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()
    if data.get("status") != "true" or "NoticeSMS" not in data:
        raise NoticeFetchError(f"Unexpected NoticeSMS.php response shape: {list(data.keys())}")

    notices = [_to_notice(item) for item in data["NoticeSMS"]]
    logger.info("Fetched %d notices from NoticeSMS.php", len(notices))
    return notices


def fetch_notices(limit: int = 50, **kwargs) -> list:
    return fetch_all_notices(**kwargs)[:limit]


def fetch_notices_for_year(year: int, **kwargs) -> list:
    return [n for n in fetch_all_notices(**kwargs) if n.posted_date_parsed.year == year]


if __name__ == "__main__":
    import json

    from dotenv import load_dotenv

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    load_dotenv()

    result = fetch_notices(limit=50)
    print(json.dumps([n.__dict__ for n in result], indent=2, ensure_ascii=False))
