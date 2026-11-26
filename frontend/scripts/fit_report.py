"""Count anonymous production Fit Check receipts for a UTC date window.

Run from a server environment connected to the project's private Vercel Blob store:
    python scripts/fit_report.py --days 7
"""
import argparse
from collections import Counter
from datetime import datetime, timedelta, timezone

from vercel.blob.sync import query_blobs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, choices=range(1, 32), default=7, metavar="1..31")
    parser.add_argument("--scope", choices=["production", "preview", "checks-production", "checks-preview"], default="production")
    args = parser.parse_args()
    today = datetime.now(timezone.utc).date()
    start = today - timedelta(days=args.days - 1)
    totals, breakdown = Counter(), Counter()
    for offset in range(args.days):
        day = start + timedelta(days=offset)
        prefix = f"fit/v1/{args.scope}/{day.isoformat()}/"
        for receipt in query_blobs(prefix=prefix, page_size=1000):
            event, group, _ = receipt.pathname.removeprefix(prefix).split("/")
            totals[event] += 1
            breakdown[(event, group)] += 1
    print(f"{args.scope} | {start} to {today} UTC")
    for event in ("fit_open", "fit_complete", "retailer_click"):
        print(f"{event}: {totals[event]}")
        for (kind, group), count in breakdown.most_common():
            if kind == event:
                print(f"  {group.replace('~', ' / ')}: {count}")


if __name__ == "__main__":
    main()
