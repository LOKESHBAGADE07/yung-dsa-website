import json
from datetime import date
from pathlib import Path
from types import SimpleNamespace
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from api import receipt_retention as retention


class RetentionTests(unittest.TestCase):
    def setUp(self):
        self.files = {}
        for name in ("query_blob_entries", "query_blobs", "get_blob", "put_blob", "delete_blob"):
            mocked = patch.object(retention, name, getattr(self, name))
            mocked.start()
            self.addCleanup(mocked.stop)
        self.today = date(2027, 1, 2)

    def query_blob_entries(self, *, prefix, **kwargs):
        folders = {k[len(prefix):].split("/")[0] for k in self.files if k.startswith(prefix)}
        return [SimpleNamespace(prefix=prefix + day + "/") for day in folders]

    def query_blobs(self, *, prefix, **kwargs):
        return iter(SimpleNamespace(pathname=k) for k in sorted(self.files) if k.startswith(prefix))

    def put_blob(self, key, body, *, access, allow_overwrite, **kwargs):
        self.assertEqual(access, "private")
        self.assertFalse(allow_overwrite)
        if key in self.files:
            raise ValueError("already exists")
        self.files[key] = body

    def get_blob(self, key, *, access):
        self.assertEqual(access, "private")
        return SimpleNamespace(body=self.files[key])

    def delete_blob(self, keys):
        for key in keys:
            del self.files[key]

    def test_cutoff_and_partial_retry_preserve_one_snapshot(self):
        old = "fit/v1/production/2026-12-03/fit_open/home/"
        kept = "fit/v1/production/2026-12-04/fit_open/home/recent.json"
        self.files[kept] = self.files["unrelated/file"] = b"{}"
        for n in range(3):
            self.files[old + str(n) + ".json"] = b"{}"
        with patch.object(retention, "BATCH", 2):
            retention.compact(self.today, batch_limit=1)
            self.assertEqual(len(list(self.query_blobs(prefix=old))), 1)
            day = date(2026, 12, 3)
            key = retention.summary_key("production", day)
            self.assertEqual(json.loads(self.files[key]), {"counts":[["fit_open","home",3]]})
            self.assertEqual(retention.read_counts("production", day, compactable=True)[("fit_open","home")], 3)
            retention.compact(self.today)
            self.assertEqual(retention.compact(self.today), 0)
            self.assertEqual(set(self.files), {key, kept, "unrelated/file"})

    def test_storage_failure_preserves_raw_receipts(self):
        key = "fit/v1/checks-preview/2026-12-03/fit_open/shared/event.json"
        self.files[key] = b"{}"
        with patch.object(retention, "put_blob", side_effect=OSError("storage unavailable")):
            with self.assertRaises(OSError):
                retention.compact(self.today)
        self.assertEqual(set(self.files), {key})

    def test_only_authenticated_production_cron_can_run(self):
        with patch.dict(retention.os.environ, {"VERCEL_ENV":"production","CRON_SECRET":"test-only"}):
            self.assertFalse(retention.authorized(None))
            self.assertFalse(retention.authorized("Bearer incorrect"))
            self.assertTrue(retention.authorized("Bearer test-only"))
            with patch.dict(retention.os.environ, {"VERCEL_ENV":"preview"}):
                self.assertFalse(retention.authorized("Bearer test-only"))


if __name__ == "__main__":
    unittest.main()
