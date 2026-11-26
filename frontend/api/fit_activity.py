"""Record a private, anonymous receipt for a Fit Check interaction."""
import json
import os
import re
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from pathlib import Path

from vercel.blob.sync import put_blob

CATALOGUE = json.loads((Path(__file__).resolve().parents[1] / "data" / "style-catalog.json").read_text(encoding="utf-8"))
CATEGORIES = {product["id"]: product["category"] for product in CATALOGUE["products"]}
SOURCES = {"home", "gallery", "fit-check", "sunglasses", "lowers", "guide", "external-or-direct", "shared"}
EVENT_ID = re.compile(r"[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}")

def group_for(payload):
    event = payload.get("event")
    if event == "fit_open" and payload.get("source") in SOURCES:
        return payload["source"]
    if event == "retailer_click" and payload.get("source") in SOURCES and payload.get("product") in CATEGORIES:
        return f"{payload['source']}~{payload['product']}"
    if event == "fit_complete" and payload.get("budget") in (2500, 3500):
        frames, lowers = payload.get("frames"), payload.get("lowers")
        if CATEGORIES.get(frames) == "eyewear" and CATEGORIES.get(lowers) == "lowers":
            return f"{payload['budget']}~{frames}~{lowers}"
    return None


class handler(BaseHTTPRequestHandler):
    def finish_response(self, status):
        self.send_response(status)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        self.finish_response(405)

    def do_POST(self):
        if self.headers.get("Sec-GPC") == "1" or self.headers.get("DNT") == "1":
            return self.finish_response(204)
        if self.headers.get("Origin") != f"https://{self.headers.get('Host')}" or self.headers.get("Sec-Fetch-Site", "same-origin") != "same-origin":
            return self.finish_response(403)
        if self.headers.get_content_type() != "application/json":
            return self.finish_response(415)
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 512:
                return self.finish_response(413)
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict) or not EVENT_ID.fullmatch(data.get("id", "")):
                return self.finish_response(400)
            group = group_for(data)
            if group is None:
                return self.finish_response(400)
        except (TypeError, ValueError, UnicodeError):
            return self.finish_response(400)

        scope = "production" if os.getenv("VERCEL_ENV") == "production" else "preview"
        if self.headers.get("X-Fit-Check-Test") == "1":
            scope = "checks-" + scope
        day = datetime.now(timezone.utc).date().isoformat()
        key = f"fit/v1/{scope}/{day}/{data['event']}/{group}/{data['id']}.json"
        try:
            # One event ID maps to one object, including if the sender retries.
            put_blob(key, b"{}", access="private", content_type="application/json", allow_overwrite=True)
        except Exception as error:
            print("Fit Check receipt failed:", type(error).__name__, flush=True)
            return self.finish_response(503)
        print(f"Fit Check receipt stored {scope} {data['event']}", flush=True)
        self.finish_response(204)
