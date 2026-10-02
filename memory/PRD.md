# YUNG DSA Official Artist Website

## Original problem statement
Build a premium, official artist website for YUNG DSA: a dark, cinematic, professional Indian hip-hop artist home that showcases music, videos, live shows, booking, press, gallery, social channels, and editable management content without inventing artist facts.

## User choices
- (Superseded Jul 2026) Use REAL artist media only — no AI/stock imagery. All images/videos are now sourced from official public channels.
- Platform/social items link to verified official URLs (Instagram, YouTube, Spotify, Apple Music).
- Keep editable content in a clearly organized data file.
- Use a working booking form with a clearly marked placeholder destination.
- Link to a placeholder PDF location until the official press kit is uploaded.

## Architecture decisions
- React single-page experience with semantic sections and smooth-scroll navigation.
- FastAPI endpoint `POST /api/booking-inquiries` stores booking inquiries in MongoDB using the existing environment configuration.
- Artist copy, releases, video entries, gallery images, and temporary image URLs live in `/app/frontend/src/content.js` for management-friendly editing.
- Responsive CSS uses a cinematic black / off-white / crimson system, grain texture, editorial grids, and mobile-specific layouts.

## Implemented
- Sticky responsive navigation with mobile menu and booking CTA.
- Cinematic hero, latest release, discography filters, video modal, live empty state, editorial about section, gallery lightbox, press kit, booking form, social connection section, and footer.
- Honest pending-link feedback for platforms and official video destinations.
- Placeholder PDF at `/press-kit-placeholder.pdf`.
- Booking submission success state and backend persistence.
- All critical user-facing and interactive elements have descriptive `data-testid` values.

## Prioritized backlog
- **P0:** Replace temporary imagery and release/video metadata with approved official assets and verified links.
- **P1:** Upload approved press kit PDF and add confirmed management contact destination.
- **P1:** Add management editor for content updates if the team needs in-browser editing.
- **P2:** Add confirmed upcoming shows and lightweight updates/news entries.
## Update — July 2026: Real media + hero/header polish
### Real media (verified sources, see `/app/frontend/src/content.js`)
- 10 official music videos from YouTube channel @yung_dsa (IDs verified via oEmbed): FACHADI, RADE RAPATE, MAAF KAR, CHALA KALTI, YEDA YUNG, HOOD 06, HUSTLE IS A FLEX, SANGEET, STRAIGHT OUTTA YERWADA, YUNG SITAR.
- Video stills (img.youtube.com) used for hero, catalogue, video grid, live strip, gallery; Spotify artist photo for About; Rolling Stone India press photo + article link in Press.
- Embedded playback: YouTube modal (youtube-nocookie embed) for every release; Spotify artist embed player in Music section.
- Official links wired: Instagram, YouTube, Spotify, Apple Music. Amazon Music removed (unverified).
- Bio rewritten using only facts verifiable from official video titles/labels (Pune 06 / Yerwada, Gully Gang Records 2024, Sony Music India 2025).
- Known env artifact: YouTube/Spotify iframes show "unavailable"/"Application error" ONLY in headless automation (bot detection / locale RangeError); real browsers play fine.

### Hero/header polish
- Shared grid: `.container` (max 1440px, `--page-x` clamp(24px,6vw,96px)); all sections aligned via `--grid-x`.
- Header 84px, logo/nav/CTA vertically centred, bordered CTA; hero `<img>` with art-directed object-position per breakpoint, oversized + top-anchored to crop the still's baked-in title.
- Wordmark: clamp(4.25rem,10.4vw,10.75rem), letter-spacing -.045em, line-height .86; equal-height 52px CTAs (red primary, ghost secondary); minimal "01 / 04" index + SCROLL in a hero footer row; removed red dot, red line, hero credit, glow shadows.
- Mobile (<600px): image block on top (58vh) with text stacked below; full-width CTAs.

### Pending
- Google sign-in (Emergent-managed) requested earlier — placement/purpose still unanswered by user; must use integration playbook before any auth code.
- Still placeholders: booking destination (DB only), press-kit PDF, no live shows.

## Update — July 2026: Full-site cleanup audit (desktop / laptop / tablet / mobile)
Removed or simplified (senseless / decorative / duplicate):
- Hero fake "01 / 04" slide index (no carousel exists), red dot, red line, image credit.
- Latest release: "YDS 26" stamp removed; 16:9 artwork instead of square crop; duplicate YouTube platform link removed ("ALSO ON Spotify / Apple Music").
- Catalogue: ALL/SINGLE/FEATURED filters removed (FEATURED returned 1 item); thumbnail grid replaced with an editorial list (index, 16:9 thumb, title, credit, year, play) — no longer duplicates the WATCH grid; `type` field dropped from release data.
- WATCH grid: 1 lead + 2 stacked cards, all 16:9 (no more chopped artwork); centred play ring sized responsively.
- About: redundant mono signature block removed. Live: 75px "live strip" sliver and red dash removed.
- Gallery: now 3 real photos only (Rolling Stone press portrait, Spotify portrait, YouTube portrait), self-hosted in /frontend/public/media/ for reliability; video-still "posters" removed from the gallery.
- Press: "PRESS KIT." em now black on crimson (was invisible red-on-red); `.press-list div` leak into press-feature fixed.
Responsive fixes: leftover ≤520px rules (`.video-card{height:300px}`, flex grids) removed — fixed 557px horizontal overflow at 390; "MOVEMENT." no longer breaks mid-word; hero crop uses 128% top-anchored image so the baked-in "MAAF KAR" title (bottom 20% of frame) is never visible at any viewport.
Verified by testing agent (iteration_3.json): all contracts pass at 1920/1440/1024/768/390; mobile hero text intentionally overlaps the image gradient by design.
