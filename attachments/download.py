"""Fetch a notice's attachment.

Confirmed 2026-10-14: attachments live under NEWPHP/Teacher/Notice_photos/
on the same host as the notice API and are plain unauthenticated static
files -- no login session needed (unlike the old StudentModule/-hosted
attachment links this used to require a session for)."""

import requests

USER_AGENT = "Dart/3.8 (dart:io)"


def download(url: str) -> bytes:
    resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    resp.raise_for_status()
    return resp.content
