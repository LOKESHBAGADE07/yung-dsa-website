import http.client
import json
from http.server import ThreadingHTTPServer
from pathlib import Path
import sys
import threading
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from api import fit_activity

EVENT = {"event":"retailer_click","measurement":"allow","source":"fit-check","product":"y2k-001","id":"199213bb-45c2-4253-bc1d-5e3a977682ab"}

class ReceiptTest(unittest.TestCase):
    def setUp(self):
        environment = patch.dict(fit_activity.os.environ, {"VERCEL_ENV": "production"})
        environment.start()
        self.addCleanup(environment.stop)
    @classmethod
    def setUpClass(cls):
        cls.server = ThreadingHTTPServer(("127.0.0.1",0), fit_activity.handler)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()

    def send(self, data, **headers):
        host, port = self.server.server_address
        conn = http.client.HTTPConnection(host, port)
        conn.request("POST", "/api/fit_activity", json.dumps(data), {
            "Host": "example.test", "Origin":"https://example.test", "Content-Type":"application/json", **headers
        })
        response = conn.getresponse()
        status = response.status
        response.read()
        conn.close()
        return status

    @patch.object(fit_activity,"put_blob")
    def test_retry_maps_to_one_private_receipt(self, put):
        for _ in range(2):
            self.assertEqual(self.send(EVENT), 204)
        self.assertEqual(put.call_args_list[0], put.call_args_list[1])
        args, kwargs = put.call_args
        self.assertIn("/retailer_click/fit-check~y2k-001/", args[0])
        self.assertEqual(args[1], b"{}")
        self.assertEqual(kwargs["access"], "private")

    @patch.object(fit_activity,"put_blob")
    def test_privacy_invalid_payload_and_source_do_not_write(self, put):
        self.assertEqual(self.send(EVENT, **{"Sec-GPC":"1"}), 204)
        self.assertEqual(self.send(EVENT, Origin="https://elsewhere.example"), 403)
        self.assertEqual(self.send({**EVENT,"product":"unlisted"}), 400)
        self.assertEqual(self.send({**EVENT,"product":[]}), 400)
        self.assertEqual(self.send({**EVENT,"event":"fit_complete","budget":2500,"frames":"rivet-denim-black","lowers":"y2k-001"}),400)
        self.assertEqual(self.send({**EVENT,"source":"a"*600}),413)
        put.assert_not_called()

    @patch.object(fit_activity, "put_blob")
    def test_wallpaper_choices_are_separate_and_allowlisted(self, put):
        payload = {"event": "wallpaper_choice", "measurement":"allow", "id": EVENT["id"]}
        for choice in ("artist-photos", "download-artwork"):
            self.assertEqual(self.send({**payload, "choice": choice}), 204)
            self.assertIn("/wallpaper_choice/" + choice + "/", put.call_args.args[0])
        self.assertEqual(self.send({**payload, "choice": "other"}), 400)
        self.assertEqual(put.call_count, 2)

    @patch.object(fit_activity,"put_blob",side_effect=RuntimeError("unavailable"))
    def test_unavailable_destination_does_not_acknowledge_receipt(self,_):
        self.assertEqual(self.send(EVENT),503)

    @patch.object(fit_activity, "put_blob")
    def test_preview_or_missing_permission_never_writes(self, put):
        self.assertEqual(self.send({k:v for k,v in EVENT.items() if k != "measurement"}), 204)
        self.assertEqual(self.send(EVENT, DNT="1"), 204)
        with patch.dict(fit_activity.os.environ, {"VERCEL_ENV": "preview"}):
            self.assertEqual(self.send(EVENT), 204)
        put.assert_not_called()

if __name__ == "__main__":
    unittest.main()
