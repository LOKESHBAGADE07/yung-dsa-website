# Source-backed guide expansion — 26 November 2026

This extends the unmerged photographic Style Finder preview. Production publication and Search Console indexing requests remain separate steps after visual review.

## Content and routes

- Homepage: updated title/description/social metadata, Hood Talk lyric video, eleven releases, four visible sourced FAQs, and direct body/footer links to all canonical pages.
- Sunglasses and baggy-lowers guides: clearer search titles, actual retailer product photos, existing measurement/fit advice and contextual links to the hoodie guide. Prices retain their 23 November verification date.
- `/style/hoodies-brand/`: clothing partnership credits versus ownership, the unconfirmed BAPE identification and price, and original hoodie fit advice.
- `/bigg-boss-20/`: dated artist and broadcaster sources, a music/TV timeline, and the official voting destination without invented current eligibility or nomination status.
- `/slang-guide/`: source-linked title/context explanations, explicitly labelled interpretations, and a visible Rade Rapate embed with matching VideoObject data. No lyrics are reproduced.
- `/wallpapers/`: one original AI-generated typography wallpaper, a working PNG download, actual 941 × 1672 dimensions, and fan-art disclosure. It is not advertised as 4K or an artist photograph.

`src/editorial.json` supplies shared homepage editorial data. `data/seo-pages.json` remains the canonical page registry. The build generates four guides before the sitemap, then compiles and prerenders the actual homepage. Both Vercel configurations include exact page routes and canonical redirects before the existing filesystem/404 handling.

## Evidence decisions

- Rade Rapate is dated 6 March 2026 by the official video and Apple Music, not 15 November.
- Yeda Yung's official video credits Urban Monkey and Bank of Brokes as clothing partners. A credit does not establish artist ownership, an ongoing endorsement or a particular TV outfit match.
- The hoodie fan post is a lead. Neither an exact artist-worn product nor the circulating INR 92,000 price is confirmed here.
- Google discontinued FAQ rich results beginning 7 May 2026. The homepage has useful visible FAQs; this change does not add FAQPage markup or promise an enhanced listing.
- No fixed word-count threshold, exact-match-domain ranking promise or guaranteed indexing claim is used. Search Console impressions do not establish a Google trust score.

## Validation

The CI workflow runs the production build, eleven-page canonical/link/image/schema/sitemap/404 checks, real client hydration smoke tests, and fifteen style/gallery/editorial tests. New regressions check discoverability, breadcrumb destinations, video/embed/date consistency, the PNG signature and dimensions, and evidence limits on brand/voting pages.

Local tests can run without a complete install, with the gallery JSDOM integration explicitly skipped there; the full CI installation must run it. Structural/hydration checks are not a substitute for a fresh visual browser review. The browser checks documented in STYLE_REDESIGN_REVIEW.md refer to the 24 November design preview, not these new pages.

## After publication

Check production status codes, redirects, canonical HTML and sitemap before requesting indexing for changed URLs. Inspect the actual exclusion reason and Google-selected canonical in Search Console; do not blindly validate a count of excluded URLs. The performance connector does not expose URL Inspection or Request Indexing. None of those actions is claimed complete by a successful build.

## Sources

- https://www.youtube.com/watch?v=ZMQBrlntZEM
- https://music.apple.com/us/album/rade-rapate-single/1880597368
- https://www.youtube.com/watch?v=Ym4ti89tItw
- https://www.youtube.com/watch?v=XTA_OgnN_8s
- Additional article/retailer links are embedded beside the relevant claims and listed in `src/editorial.json`.
- https://developers.google.com/search/updates
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/appearance/structured-data/video
- https://support.google.com/webmasters/answer/7440203
