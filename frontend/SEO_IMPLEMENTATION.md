# SEO implementation — 14 November 2026

Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

The website remains an independent fan project. This change adds no ads, affiliate accounts, messages or paid tools.

## Changes
- Build the actual React homepage into the delivered HTML and hydrate that same UI. This exposes the catalogue, biography and style links without waiting for JavaScript.
- Use native anchors for navigation and music video links. Normal clicks retain the video dialog; modified clicks and disabled JavaScript retain normal links.
- Update homepage and profile metadata to describe their content. Remove the unused keywords tag.
- Correct the artist entity to Person; keep artist and independent publisher identities separate. Add breadcrumb data to guides/profile.
- Remove a press listing that linked to an Instagram account instead of a publication.
- Keep informative image alternatives; add intrinsic image dimensions and lazy decoding below the fold.
- Generate the canonical sitemap from data/seo-pages.json. Dates represent edits, not every build. Retailer prices retain their 13 November check date.
- Use static output routing with canonical slash/index redirects and a custom noindex 404 page. Existing press-kit.html remains the published profile URL.

## Build and verification
yarn build runs style generation and sitemap generation, CRA compilation, homepage prerendering, then structural SEO and hydration checks.
npm run test:style tests catalogue filtering and the static guides.
npm run test:seo checks an existing build.

The prerender loader uses Babel, JSX and CommonJS transforms already installed by react-scripts. It strips stylesheet imports only for server rendering. Client CSS still uses the normal CRA pipeline. The hydration smoke test uses jsdom from the existing Jest toolchain and runs the real client entry. It does not replace visual browser QA.

## Hosting
Vercel deployment metadata identifies frontend as the configured project root. frontend/vercel.json explicitly builds with yarn build and serves build. The repository-root config retains its equivalent cd frontend commands and frontend/build output for root-based deployments; both share canonical routing. framework:null selects static hosting instead of a single-page fallback, so unknown paths can return 404. Known style routes rewrite to their HTML files. trailingSlash:true leaves paths with file extensions intact. Index aliases redirect permanently.

## Follow-up in Search Console
Inspect the homepage and guide URLs with URL Inspection, check the chosen canonical and rendered page, and confirm sitemap.xml is fetched. A successful deployment or source test does not prove Google indexing. Search Console inspection, rich-result eligibility and live HTTP status verification must be reported separately from build checks.

Monitor actual clicks/impressions by page and query after Google recrawls. Do not promise a ranking or traffic outcome.

## Technical references
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://vercel.com/docs/project-configuration/vercel-json
- https://vercel.com/kb/guide/custom-404-page
