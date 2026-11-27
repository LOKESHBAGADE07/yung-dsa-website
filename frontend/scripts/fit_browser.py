"""End-to-end Fit Check regression on an isolated browser and the built website."""
import argparse
import json
import os
import shutil
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ROUTE = "/style/fit-check/"

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def check_guide_journey(page, base, events):
    page.goto(base, wait_until="domcontentloaded")
    page.get_by_role("link", name="See the company and clothing credits").click()
    expect(page.get_by_role("heading", level=1)).to_have_text("Does Yung DSA own a company or clothing brand?")
    expect(page.locator("#company table")).to_contain_text("Bank of Brokes")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    page.get_by_role("link", name="Pair sunglasses and lowers in 06 Fit Check").click()
    for guide_label, pair_label in (
        ("Compare frame measurements", "Pair these frames with baggy lowers"),
        ("Check how the lowers fit", "Pair these lowers with sunglasses"),
    ):
        page.get_by_role("link", name=guide_label).click()
        page.get_by_role("link", name=pair_label).click()
        expect(page.locator("[data-builder]")).to_be_visible()
    page.goto(base + "/wallpapers/", wait_until="domcontentloaded")
    choices = page.get_by_role("navigation", name="Artist photos and wallpaper")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    with page.expect_download() as download:
        choices.get_by_role("link", name="Download the fan wallpaper").click()
    assert download.value.suggested_filename == "yung-dsa-pune-06-fan-wallpaper.png"
    header = Path(download.value.path()).read_bytes()[:24]
    assert header[:8] == bytes.fromhex("89504e470d0a1a0a")
    assert int.from_bytes(header[16:20], "big") == 941 and int.from_bytes(header[20:24], "big") == 1672
    choices.get_by_role("link", name="View sourced artist photos").click()
    expect(page).to_have_url(base + "/style/#orbit")
    expect(page.locator("#orbit")).to_be_visible()
    for _ in range(40):
        choices_seen = {e.get("choice") for e, status in events if e["event"] == "wallpaper_choice" and status == 204}
        sources_seen = {e.get("source") for e, status in events if e["event"] == "fit_open" and status == 204}
        if choices_seen == {"artist-photos", "download-artwork"} and {"hoodies", "sunglasses", "lowers"} <= sources_seen:
            return
        page.wait_for_timeout(250)
    raise AssertionError("Missing a guide referral or wallpaper choice in the recorded events")


def run(base, out, live):
    catalogue = {p["id"]: p for p in json.loads((ROOT / "data/style-catalog.json").read_text())["products"]}
    out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as api:
        browser = api.chromium.launch(executable_path=shutil.which("google-chrome"), args=["--no-sandbox"])
        for width, height in ([(390, 844)] if live else [(390, 844), (320, 740), (1440, 975)]):
            ctx = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce",
                                      color_scheme="light", has_touch=width < 500, accept_downloads=True)
            events = []
            page_errors = []
            ctx.route("**/_vercel/**", lambda route: route.abort())
            def receipt(route):
                data = route.request.post_data_json
                if live:
                    response = route.fetch(headers={**route.request.all_headers(), "x-fit-check-test": "1"})
                    events.append((data, response.status))
                    route.fulfill(response=response)
                else:
                    events.append((data, 204))
                    route.fulfill(status=204, body="")
            ctx.route("**/api/fit_activity", receipt)
            ctx.add_init_script("Object.defineProperty(navigator,'share',{value:undefined,configurable:true});")
            page = ctx.new_page()
            page.on("pageerror", lambda err: page_errors.append(str(err)))
            page.goto(base, wait_until="domcontentloaded")
            page.locator('[data-testid="hero-style-button"]').click()
            expect(page.locator("[data-builder]")).to_be_visible()
            expect(page.locator("[data-total]")).to_have_text("₹2,050")
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), width
            assert page.locator(".segments label").first.bounding_box()["height"] >= 44
            assert page.locator(".piece-choice").first.bounding_box()["height"] >= 44
            if not live:
                # Layout assertions and screenshots are independent of transient image CDNs.
                page.screenshot(path=out / f"builder-{width}.png", full_page=True, timeout=25000)
            page.locator('label:has(input[value="cyclops-002"])').click()
            page.locator('label:has(input[value="waffle-pants"])').click()
            expect(page.locator("[data-balance]")).to_have_text("₹700 over budget")
            page.locator('label:has(input[value="3500"])').click()
            expect(page.locator("[data-balance]")).to_have_text("₹300 under budget")
            page.get_by_role("button", name="Reveal my fit").click()
            expect(page.locator("#result-title")).to_be_focused()
            expect(page.locator("[data-total]")).to_have_text("₹3,200")
            shared = page.url
            assert "budget=3500" in shared and "frames=cyclops-002" in shared and "lowers=waffle-pants" in shared
            if not live:
                page.screenshot(path=out / f"result-{width}.png", full_page=True, timeout=25000)
            page.get_by_role("button", name="Share this fit").click()
            expect(page.locator("#fit-link")).to_have_value(shared)
            page.evaluate("Object.defineProperty(navigator,'share',{value:async d=>{window.sharedFit=d.url},configurable:true})")
            page.get_by_role("button", name="Share this fit").click()
            assert page.evaluate("window.sharedFit") == shared
            with page.expect_download() as download:
                page.get_by_role("button", name="Save card").click()
            png = Path(download.value.path()).read_bytes()
            assert png[:8] == bytes.fromhex("89504e470d0a1a0a") and int.from_bytes(png[16:20], "big") == 1080 and int.from_bytes(png[20:24], "big") == 1350
            if width == 390 and not live:
                (out / "share-card.png").write_bytes(png)
            link = page.locator('[data-shop="frames"]')
            assert link.get_attribute("href") == catalogue["cyclops-002"]["url"]
            ctx.route("**/products/**", lambda route: route.fulfill(status=200, content_type="text/html", body="<title>Product destination</title>"))
            with ctx.expect_page() as popup:
                link.click()
            popup.value.close()
            page.get_by_role("button", name="Edit this fit").click()
            expect(page.locator('input[value="cyclops-002"]')).to_be_checked()
            page.go_back()
            expect(page.locator("[data-result]")).to_be_visible()
            friend = ctx.new_page()
            friend.goto(shared, wait_until="domcontentloaded")
            expect(friend.locator("[data-total]")).to_have_text("₹3,200")
            expect(friend.locator('[data-name="lowers"]')).to_have_text(catalogue["waffle-pants"]["name"])
            for _ in range(40):
                if len(events) >= 4: break
                page.wait_for_timeout(250)
            assert [e["event"] for e, status in events].count("fit_complete") == 1, events
            assert all(status == 204 for e, status in events), events
            assert any(e["event"] == "fit_open" and e["source"] == "home" for e, _ in events), events
            assert any(e["event"] == "fit_open" and e["source"] == "shared" for e, _ in events), events
            assert any(e["event"] == "retailer_click" and e["product"] == "cyclops-002" for e, _ in events), events
            if not live:
                friend.goto(base + ROUTE + "?budget=12&frames=missing&lowers=waffle-pants", wait_until="domcontentloaded")
                expect(friend.locator("[data-status]")).to_contain_text("unavailable")
                expect(friend.locator("[data-builder]")).to_be_visible()
                assert friend.evaluate("document.documentElement.scrollWidth <= innerWidth")
            check_guide_journey(page, base, events)
            assert not page_errors, page_errors
            print(f"{width}px — selection, budgets, share, restore, PNG, guide navigation, both wallpaper choices and {len(events)} receipts passed", flush=True)
            ctx.close()
        if not live:
            ctx = browser.new_context(java_script_enabled=False, viewport={"width":320,"height":740})
            tab = ctx.new_page()
            tab.goto(base + ROUTE, wait_until="domcontentloaded")
            assert tab.locator("noscript li a").count() == len(catalogue)
            ctx.close()
            ctx = browser.new_context()
            sent = []
            ctx.add_init_script("Object.defineProperty(navigator,'globalPrivacyControl',{value:true})")
            ctx.on("request", lambda req: sent.append(req.url))
            tab = ctx.new_page()
            tab.goto(base + ROUTE, wait_until="domcontentloaded")
            tab.get_by_role("button", name="Reveal my fit").click()
            assert not any("/api/fit_activity" in url or "/_vercel/" in url for url in sent)
            ctx.close()
        browser.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--production", action="store_true", help="Check the live domain with QA-labelled receipts")
    args = parser.parse_args()
    out = Path(os.getenv("RUNNER_TEMP", ".")) / "fit-check-screens"
    if args.production:
        asset_paths = ("style/fit-check/fit.js", "guides/static-metrics.js")
        expected = {name: (ROOT / "build" / name).read_bytes() for name in asset_paths}
        def asset_is_live(name):
            with urlopen("https://yungdsa.com/" + name, timeout=8) as response:
                return response.read() == expected[name]
        for attempt in range(28):
            try:
                if all(asset_is_live(name) for name in asset_paths):
                    break
            except (URLError, TimeoutError):
                pass
            time.sleep(5)
        else:
            raise RuntimeError("The published domain has not served the tested Fit Check version")
        run("https://yungdsa.com", out, True)
    else:
        with ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=ROOT / "build")) as server:
            threading.Thread(target=server.serve_forever, daemon=True).start()
            try:
                run(f"http://127.0.0.1:{server.server_port}", out, False)
            finally:
                server.shutdown()
