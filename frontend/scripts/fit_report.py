"""Count anonymous production style and wallpaper receipts for a UTC date window.

Run from a server environment connected to the project's private Vercel Blob store:
    python scripts/fit_report.py --days 7
"""
import argparse
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from api.receipt_retention import EVENTS, KEEP_DAYS, SCOPES, read_counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, choices=range(1, 32), default=7, metavar="1..31")
    parser.add_argument("--scope", choices=SCOPES, default="production")
    args = parser.parse_args()
    today = datetime.now(timezone.utc).date()
    start = today - timedelta(days=args.days - 1)
    totals, breakdown = Counter(), Counter()
    for offset in range(args.days):
        day = start + timedelta(days=offset)
        counts = read_counts(args.scope, day, compactable=day <= today - timedelta(days=KEEP_DAYS))
        breakdown.update(counts)
        for (event, _), count in counts.items():
            totals[event] += count
    print(f"{args.scope} | {start} to {today} UTC")
    for event in EVENTS:
        print(f"{event}: {totals[event]}")
        for (kind, group), count in breakdown.most_common():
            if kind == event:
                print(f"  {group.replace('~', ' / ')}: {count}")


if __name__ == "__main__":
    main()
