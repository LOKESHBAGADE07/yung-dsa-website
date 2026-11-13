# Independent Style Finder

The style section is generated as static HTML before the existing CRA build. No additional dependencies or routing library are required. Vercel serves each directory's index.html.

## Maintain the catalogue

Edit data/style-catalog.json after reviewing the linked product pages. Update each checkedAt and the catalogue updatedAt date. Prices are dated snapshots, not stock or checkout guarantees. Keep product evidence as "similar" unless the editorial model, labels and primary-source evidence have been reviewed together. The original SVG drawings are generic category illustrations, not retailer product photos.

Run:
- node scripts/build-style.cjs
- npm run test:style
- yarn build (also runs prebuild)

Commit both the catalogue and generated public/style/**/index.html pages. The generator checks basic data integrity and refuses affiliateActive=true to prevent misleading disclosures.

## Current verification

Six direct retailer listings checked 2026-11-13:
- y2k // 001: https://www.urbanmonkey.com/collections/sunglasses/products/y2k-001
- Ape-X // 002: https://www.urbanmonkey.com/collections/sunglasses/products/ape-x-002
- Cyclops // 002: https://www.urbanmonkey.com/collections/sunglasses/products/cyclops-002
- Oxidized Relaxed Rivet Denim: https://www.urbanmonkey.com/collections/bottoms/products/oxidized-relaxed-rivet-denim-black
- Waffle Textured Loose Fit Pants: https://www.urbanmonkey.com/collections/bottoms/products/waffle-textured-loose-fit-pants
- 1998 Denim: https://eevz.in/products/untitled-dec11_20-06?collection=/collections/denim-joggers&feed_index=0

The EEVZ source journal entry is a provisional lead from https://picmany.com/p/DfmYc1zjelT, which attributes a post dated 11 November 2026 to the artist. Original https://www.instagram.com/p/DfmYc1zjelT/ was unavailable for independent retrieval. It does not confirm the 1998 Denim product or a television episode outfit. No exact matches are asserted.

## Monetisation status

All links are direct non-affiliate links; no commission account or approved affiliate IDs are configured. Before adding approved affiliate links, update disclosures on the hub, guides and About page, mark compensated links with rel="sponsored noopener noreferrer", and extend the catalogue/generator validation together. Do not infer sales from clicks. No ads, reels, outreach, accounts, paid services or promotions are created by this change.

## Measurement

Existing Vercel page analytics integration is included on static pages. Browser GPC/DNT signals suppress its load. Dashboard delivery and project settings must be checked in the existing Vercel account; this change does not activate a paid plan.

style.js dispatches a local style:retailer-click CustomEvent with product_id, merchant and pathname. No remote outbound-click collection is configured. A confirmed analytics adapter can subscribe later; avoid duplicate pageview tracking. Vercel custom events may require a paid plan, so do not turn them on or upgrade without budget authorisation.

## Accessibility and rendering

All content and retailer links work without JavaScript. Filters progressively enhance the hub; native selects, details, focus outlines, live result counts and a reset empty state support keyboard use. Styles cover desktop, tablet and small mobile layouts and reduced motion. Automated structural/logic checks do not substitute for visual browser QA.

## Research references

- Vercel directory index handling: https://vercel.com/docs/directory-listing
- Vercel analytics: https://vercel.com/docs/analytics/quickstart
- Compensated outbound links: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
