# Photography-led style edit — review preview, 24 November 2026

The rejected procedural avatar has been removed from production. This branch is a review preview; it must not be merged until Lokesh has reviewed the visual direction.

## Reference inspected

https://hanzife-orbit-gallery.myshopify.com/

Inspected the desktop hero, collection carousel, drag response, image transforms, hotspots, independently scrolling product panel, featured product rail, social image track and phone layout. The reference uses photographic figures, scale, opacity and blur to create depth; the inspected gallery does not use a rendered human 3D mesh. Its strength is art direction and restrained interaction, not a collection of avatar controls.

The preview translates those patterns into an editorial fan guide: a photographic opening, three artist photographs in a draggable depth gallery, a synchronized panel of similar-style alternatives, fit-detail dialogs, a filtered horizontal product rail and concise guide links. Mobile suggestions sit below the gallery rather than obscuring the photograph. This is a photographic gallery, not a reconstructed 3D likeness.

## Source and product boundaries

Artist photos link to their published sources: Indulge, Indiatimes and District. The photos have not been edited to depict the artist wearing the suggested products. Retailer images come from the six catalogue entries verified on 23 November. Every recommendation remains a similar-style alternative. The site is independent, checkout stays with the retailer, and all current links are non-affiliate.

The creator attribution continues to link to https://www.linkedin.com/in/lokeshbagade/ . No outreach, advertising, reel creation or spending is included.

## Behaviour and checks

- Drag and arrow controls select a look; dots, title, photo credit and product panel stay synchronized. A quick swipe advances at most one look.
- Arrow keys, Home and End operate the focused gallery. Inactive hotspots leave the keyboard tab order.
- Hotspots and product detail buttons open a native dialog. Escape, the close control and backdrop close it; focus returns to the trigger. The close control stays visible while the dialog content scrolls.
- Category, budget and sorting work together. Empty results have a reset. Direct retailer links and the full catalogue remain in server-rendered HTML without JavaScript.
- Reduced-motion preferences disable spring animation and scroll reveals. Motion does not run continuously. Global Privacy Control and Do Not Track retain the existing analytics opt-out.
- Browser checks cover desktop, 390-pixel and 320-pixel layouts, source-image loading, drag, navigation, hotspots, dialogs, filters, reset, sorting and horizontal overflow.
- CI runs the build, prerender, seven-page SEO/link/image/schema checks, hydration checks and eleven style/gallery tests. The JSDOM integration test is explicitly skipped in the partial local workspace and runs in the complete CI installation.

## Implementation

`scripts/style-orbit.cjs` renders the hub after the existing guide generator. `public/style/orbit.css` supplies the new hub styling; `orbit-core.js` and `orbit.js` implement its interactions. Supporting guide routes, home-page hydration, canonical URLs and Vercel routing remain intact. The old avatar assets are not loaded by the preview or rolled-back production page.
