"""Compact closed UTC days in the project's private Fit Check receipt store."""
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from hmac import compare_digest
from http.server import BaseHTTPRequestHandler
from itertools import islice
import json
import os

from vercel.blob.sync import delete_blob, get_blob, put_blob, query_blob_entries, query_blobs

SCOPES = ("production", "checks-production", "preview", "checks-preview")
EVENTS = ("fit_open", "fit_complete", "retailer_click", "wallpaper_choice")
KEEP_DAYS = 30
BATCH = 500


def summary_key(scope, day):
    return f"fit/daily/v1/{scope}/{day}.json"


def exists(key):
    return any(item.pathname == key for item in query_blobs(prefix=key))


def day_counts(prefix):
    counts = Counter()
    for item in query_blobs(prefix=prefix, page_size=1000):
        event, group, name = item.pathname.removeprefix(prefix).split("/")
        if event not in EVENTS or not group or not name.endswith(".json"):
            raise ValueError("Unrecognized receipt in day folder")
        counts[event, group] += 1
    return counts


def read_counts(scope, day, *, compactable):
    prefix = f"fit/v1/{scope}/{day}/"
    key = summary_key(scope, day)
    if not compactable:
        return day_counts(prefix)
    if not exists(key):
        counts = day_counts(prefix)
        if not exists(key):
            return counts
    data = json.loads(get_blob(key, access="private").body)
    return Counter({(event, group): count for event, group, count in data["counts"]})


def compact_day(scope, day, remaining_batches):
    prefix = f"fit/v1/{scope}/{day}/"
    key = summary_key(scope, day)
    if not exists(key):
        counts = day_counts(prefix)
        if not counts:
            return 0
        data = {"counts": [[event, group, count] for (event, group), count in sorted(counts.items())]}
        # Creation is atomic. Concurrent runs may read the same day, but only
        # the first complete snapshot wins, even after partial raw deletions.
        try:
            put_blob(key, json.dumps(data).encode(), access="private", content_type="application/json",
                     add_random_suffix=False, allow_overwrite=False)
        except Exception:
            if not exists(key):
                raise
    used = 0
    while used < remaining_batches:
        # Restart at the beginning after each deletion; a mutating listing
        # cannot safely supply the pagination cursor for the next batch.
        batch = [item.pathname for item in islice(query_blobs(prefix=prefix, page_size=BATCH), BATCH)]
        if not batch:
            break
        delete_blob(batch)
        used += 1
        if len(batch) < BATCH:
            break
    return used


def compact(today, batch_limit=12):
    first_kept = today - timedelta(days=KEEP_DAYS - 1)
    eligible = []
    for scope in SCOPES:
        prefix = f"fit/v1/{scope}/"
        for entry in query_blob_entries(prefix=prefix, page_size=1000):
            folder = getattr(entry, "prefix", "")
            if not folder.startswith(prefix) or not folder.endswith("/"):
                continue
            label = folder[len(prefix):-1]
            try:
                day = date.fromisoformat(label)
            except ValueError:
                continue
            if label == day.isoformat() and day < first_kept:
                eligible.append((day, scope))
    used = 0
    for day, scope in sorted(eligible):
        if used >= batch_limit:
            break
        used += compact_day(scope, day, batch_limit - used)
    return used


def authorized(header):
    secret = os.environ.get("CRON_SECRET", "")
    return bool(secret and os.getenv("VERCEL_ENV") == "production"
                and compare_digest((header or "").encode(), ("Bearer " + secret).encode()))


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if not authorized(self.headers.get("Authorization")):
            status = 401
        else:
            try:
                compact(datetime.now(timezone.utc).date())
                status = 204
            except Exception as error:
                print("Receipt retention failed:", type(error).__name__, flush=True)
                status = 503
        self.send_response(status)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", "0")
        self.end_headers()
