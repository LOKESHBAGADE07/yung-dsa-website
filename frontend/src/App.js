import { useEffect, useRef, useState } from "react";
import "@/App.css";
import editorial from "./editorial.json";
import { ArrowDown, ArrowUpRight, Check, Instagram, Menu, Play, X, Youtube } from "lucide-react";
import { bio, featuredVideos, images, latestRelease, links, platforms, press, releases, spotifyEmbed, ytEmbed, ytThumb, ytWatch } from "./content";

const nav = ["Music", "Videos", "Shows", "About", "Style", "Press", "Concept"];
const ext = { target: "_blank", rel: "noopener noreferrer" };
const thumb = (item) => ytThumb(item.youtubeId, item.thumbQuality);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [video, setVideo] = useState(null);
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  const videoDialog = useRef(null);
  useEffect(() => {
    if (video && videoDialog.current && !videoDialog.current.open) videoDialog.current.showModal();
  }, [video]);
  const openVideo = (event, item) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setVideo(item);
  };

  return <div className="site-shell">
    <a className="skip-to-content" href="#main">Skip to content</a>
    <header className="nav-bar" data-testid="site-navigation">
      <div className="nav-inner container">
        <a className="brand-mark" href="#home" data-testid="home-logo-button" onClick={() => setMenuOpen(false)}>YUNG<span>DSA</span></a>
        <nav id="main-navigation" aria-label="Main navigation" className={menuOpen ? "nav-links open" : "nav-links"}>{nav.map((item) => item === "Style" ? <a key={item} href="/style/" data-testid="nav-style-link">Style</a> : <a key={item} href={`#${item.toLowerCase()}`} data-testid={`nav-${item.toLowerCase()}-link`} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav>
        <a className="nav-book" data-testid="nav-style-finder-button" href="/style/">STYLE FINDER <ArrowUpRight size={15} /></a>
        <button className="menu-button" data-testid="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="main-navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>

    <main id="main">
      <aside className="concept-notice" aria-label="Website disclosure" data-testid="concept-disclosure">An independent concept by <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>Lokesh Bagade</a>. Not affiliated with or endorsed by Yung DSA or his team.</aside>
      <section className="hero" id="home" data-testid="hero-section">
        <div className="hero-media"><img src={images.hero} srcSet={`${images.heroSmall} 320w, ${images.hero} 1280w`} sizes="100vw" alt="YUNG DSA — still from the MAAF KAR official music video" fetchPriority="high" width="1280" height="720" data-testid="hero-image" /></div>
        <div className="hero-inner container">
          <div className="hero-content">
            <p className="eyebrow reveal">INDEPENDENT FAN-MADE CONCEPT</p>
            <h1 className="hero-title reveal delay-1">YUNG<br /><em>DSA</em></h1>
            <p className="hero-sub reveal delay-2">PUNE 06 <span>/</span> INDIAN HIP-HOP</p>
            <div className="hero-actions reveal delay-3"><a className="button button-red" href="#music" data-testid="hero-listen-button">LISTEN NOW <ArrowUpRight size={16} /></a><a className="button button-ghost" data-testid="hero-style-button" href="/style/fit-check/">BUILD YOUR FIT <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="hero-foot"><span className="hero-scroll"><ArrowDown size={14} /> SCROLL</span></div>
        </div>
      </section>


      <section className="style-launch section-pad" id="style" data-testid="style-finder-section">
        <div><p className="eyebrow">SUNGLASSES + LOWERS</p><h2>06 <em>FIT CHECK.</em></h2><p className="muted-copy">Pick two pieces, see how they fit your budget and send your combination to a friend.</p><a className="button button-red" href="/style/fit-check/">BUILD YOUR FIT <ArrowUpRight size={17} /></a></div>
        <div className="style-launch-guides"><a href="/style/goggles-sunglasses/"><span>01 / EYEWEAR</span><strong>Goggles &amp; sunglasses</strong><ArrowUpRight size={22} /></a><a href="/style/baggy-lowers/"><span>02 / SILHOUETTE</span><strong>Baggy lowers</strong><ArrowUpRight size={22} /></a><a href="/style/looks/"><span>03 / EVIDENCE</span><strong>The look journal</strong><ArrowUpRight size={22} /></a></div>
      </section>

      <section className="release-feature section-pad" id="music" data-testid="latest-release-section"><div className="section-kicker"><span>01</span> FEATURED RELEASE</div><div className="release-grid"><div className="release-art-wrap"><a className="art-play" href={ytWatch(latestRelease.youtubeId)} {...ext} data-testid="latest-release-play-button" aria-label={`Watch ${latestRelease.title} ${latestRelease.videoType.toLowerCase()}`} onClick={(event) => openVideo(event, latestRelease)}><img src={ytThumb(latestRelease.youtubeId)} alt={`${latestRelease.title} official video still`} width="1280" height="720" loading="lazy" decoding="async" data-testid="latest-release-artwork" /><span className="play-ring"><Play fill="white" size={22} /></span></a></div><div className="release-copy"><p className="eyebrow">FEATURED / {latestRelease.videoType.toUpperCase()}</p><h2 data-testid="latest-release-title">{latestRelease.title}</h2><p className="release-meta">{latestRelease.type} <span>/</span> {latestRelease.year}</p><p className="muted-copy">{latestRelease.detail}</p><a className="button button-outline" data-testid="latest-release-listen-button" href={ytWatch(latestRelease.youtubeId)} {...ext}>WATCH ON YOUTUBE <ArrowUpRight size={17} /></a><div className="platform-row"><span>ALSO ON</span><a data-testid="latest-platform-spotify" href={links.spotify} {...ext}>Spotify</a><a data-testid="latest-platform-apple-music" href={links.appleMusic} {...ext}>Apple Music</a></div></div></div></section>

      <section className="discography section-pad" data-testid="discography-section"><div className="section-head"><div><div className="section-kicker"><span>02</span> THE CATALOGUE</div><h2>MUSIC</h2></div><p className="head-note" data-testid="catalogue-count">{releases.length} OFFICIAL RELEASES <span>/</span> 2021 — 2026</p></div><div className="release-list">{releases.map((release, index) => <a className="release-row" key={release.youtubeId} href={ytWatch(release.youtubeId)} {...ext} data-testid={`release-card-${index}`} onClick={(event) => openVideo(event, release)}><span className="row-index">{String(index + 1).padStart(2, "0")}</span><img className="row-thumb" loading="lazy" src={thumb(release)} alt="" width={release.thumbQuality === "hqdefault" ? 480 : 1280} height={release.thumbQuality === "hqdefault" ? 360 : 720} decoding="async" /><div className="row-title"><h3>{release.title}</h3><p>{release.note}</p></div><span className="row-year">{release.year}</span><span className="row-play" data-testid={`release-play-${index}`}><Play size={13} fill="currentColor" /></span></a>)}</div>
        <div className="stream-block" data-testid="spotify-player-block"><div><div className="section-kicker"><span>STREAM</span> OFFICIAL SPOTIFY</div><p className="muted-copy">Play the catalogue directly from the official YUNG DSA artist profile.</p><a className="text-button" data-testid="spotify-open-link" href={links.spotify} {...ext}>OPEN ON SPOTIFY <ArrowUpRight size={17} /></a></div>{spotifyLoaded ? <iframe title="YUNG DSA on Spotify" data-testid="spotify-player" src={spotifyEmbed} width="100%" height="352" frameBorder="0" allow="encrypted-media; fullscreen; picture-in-picture" loading="lazy" /> : <button type="button" className="spotify-load button button-outline" onClick={() => setSpotifyLoaded(true)}>Load Spotify player <Play size={16} /></button>}</div></section>

      <section className="video-section section-pad" id="videos" data-testid="videos-section"><div className="section-head"><div><div className="section-kicker"><span>03</span> VISUALS</div><h2>WATCH</h2></div><a className="text-button" data-testid="view-all-videos-button" href={links.youtubeVideos} {...ext}>VIEW ALL VIDEOS <ArrowUpRight size={17} /></a></div><div className="video-grid">{featuredVideos.map((item, index) => <a className={`video-card video-${index}`} key={item.youtubeId} href={ytWatch(item.youtubeId)} {...ext} data-testid={`video-card-${index}`} onClick={(event) => openVideo(event, item)}><img loading="lazy" src={thumb(item)} alt={`${item.title} ${(item.videoType || "Official music video").toLowerCase()}`} width="1280" height="720" decoding="async" /><span className="video-overlay"><span className="play-ring"><Play fill="white" size={20} /></span><small>{(item.videoType || "Official music video").toUpperCase()} <span>/</span> {item.year}</small><strong>{item.title}</strong></span></a>)}</div></section>

      <section className="about-section section-pad" id="about" data-testid="about-section"><div className="about-image artist-wordmark" aria-label="Pune 06, Yerwada"><span>PUNE</span><strong>06</strong><small>YERWADA / HIP-HOP</small></div><div className="about-copy"><div className="section-kicker"><span>04</span> THE ARTIST</div><h2>NO<br /><em>SHORTCUTS.</em></h2><p data-testid="artist-bio">{bio}</p><p>His 2026 catalogue includes <em>Rade Rapate</em> and <em>Hood Talk</em>. Colors TV introduced him to Bigg Boss 20 in September 2026. Explore the <a href="/bigg-boss-20/">dated Bigg Boss guide and official voting sources</a>, or start with the <a href="/slang-guide/">song and slang guide</a>.</p><p className="bio-source">Read the <a href="/press-kit.html">artist biography and music sources</a>.</p></div></section>

      <section className="live-section section-pad" id="shows" data-testid="shows-section"><div className="section-head"><div><div className="section-kicker"><span>05</span> ON THE ROAD</div><h2>LIVE</h2></div></div><div className="empty-shows"><div><h3>SHOW INFORMATION</h3><p>Visit the artist’s public channels for confirmed dates. This concept does not sell tickets.</p></div><a className="button button-red" href="#concept" data-testid="shows-booking-button">ABOUT THIS CONCEPT <ArrowUpRight size={17} /></a></div></section>

      <section className="gallery-section section-pad" id="gallery" data-testid="gallery-section"><div className="section-head"><div><div className="section-kicker"><span>06</span> EXPLORE</div><h2>ARTIST<br />CHANNELS</h2></div><p className="head-note">Photos, videos and music at their source.</p></div><div className="artist-channel-grid">{platforms.slice(0, 3).map((platform) => <a className="artist-channel-card" key={platform.name} href={platform.url} {...ext}><span>{platform.name}</span><ArrowUpRight aria-hidden="true" size={28} /></a>)}</div></section>

      <section className="press-section section-pad" id="press" data-testid="press-section"><div className="press-copy"><div className="section-kicker"><span>07</span> ARTIST PROFILE</div><h2>THE<br /><em>PROFILE.</em></h2><p>An independently compiled artist profile with release information and source links. This is not an authorised press kit.</p><a className="button button-outline" data-testid="press-kit-download" href="/press-kit.html" {...ext}>VIEW ARTIST PROFILE <ArrowDown size={17} /></a></div><div className="press-list"><p className="eyebrow">FEATURED IN</p>{press.map((item) => <a key={item.url} className="press-feature" data-testid="press-feature-rolling-stone" href={item.url} {...ext}><div><span>{item.outlet} <em>/ {item.year}</em></span><strong>{item.headline}</strong></div><ArrowUpRight size={18} /></a>)}{["ARTIST BIO", "SOURCE LINKS", "MUSIC & VIDEOS", "INDEPENDENT CONCEPT"].map((item) => <div key={item} data-testid={`press-item-${item.toLowerCase().replaceAll(" ", "-")}`}><span>{item}</span><Check size={16} /></div>)}</div></section>

      <section className="contact-section section-pad" id="concept" data-testid="concept-section"><div className="contact-intro"><div className="section-kicker"><span>08</span> ABOUT THIS WEBSITE</div><h2>THE<br /><em>CONCEPT.</em></h2><p>A fan-made website concept exploring a home for Yung DSA’s music and publicly available artist information.</p></div><div className="concept-card"><h3>Created by <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>Lokesh Bagade</a></h3><p>This website is independent and is not affiliated with or endorsed by Yung DSA or his team.</p><p>Bookings and business enquiries are not accepted here. Please use the contact information published on the artist’s own channels.</p><a className="button button-outline" href={links.instagram} {...ext}>VISIT ARTIST’S INSTAGRAM <ArrowUpRight size={17} /></a><p className="concept-credit">Explore the website creator’s work on <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>LinkedIn <ArrowUpRight size={14} /></a>.</p></div></section>

      <section className="reader-guides section-pad" id="guides" aria-labelledby="reader-guides-title">
        <div className="section-head"><div><p className="eyebrow">THE FAN GUIDE</p><h2 id="reader-guides-title">GO A<br /><em>LITTLE DEEPER.</em></h2></div><p className="head-note">Music, style and the story.<br />Sources you can follow.</p></div>
        <nav className="reader-guide-links" aria-label="All website guides">{editorial.guides.filter(guide => guide.path !== "/").map((guide, index) => <a key={guide.path} href={guide.path}><span>{String(index + 1).padStart(2, "0")}</span><strong>{guide.label}</strong><ArrowUpRight size={20} aria-hidden="true" /></a>)}</nav>
      </section>
      <section className="artist-faq section-pad" aria-labelledby="artist-faq-title">
        <div><p className="eyebrow">A FEW ANSWERS</p><h2 id="artist-faq-title">YUNG DSA.<br /><em>THE DETAILS.</em></h2><p className="muted-copy">Reviewed <time dateTime="2026-11-27">27 November 2026</time>.<br />An independent, source-linked guide.</p></div>
        <div className="artist-faq-list">{editorial.homeFaq.map(faq => (
          <article key={faq.question}>
            <h3>{faq.question}</h3><p>{faq.answer}</p>
            <div className="faq-links">
              {faq.href && <a href={faq.href}>{faq.hrefLabel || "Read the guide"} <ArrowUpRight size={14} aria-hidden="true" /></a>}
              {faq.source && <a href={editorial.sources[faq.source]} {...ext}>{faq.sourceLabel || "Read the source"} <ArrowUpRight size={14} aria-hidden="true" /></a>}
            </div>
          </article>
        ))}</div>
      </section>

      <section className="follow-section" data-testid="follow-section"><p className="eyebrow">OFFICIAL CHANNELS</p><h2>FOLLOW THE<br /><em>MOVEMENT.</em></h2><div className="follow-links">{platforms.map((platform) => <a key={platform.name} data-testid={`social-${platform.name.toLowerCase().replace(" ", "-")}-link`} href={platform.url} {...ext}>{platform.name === "Instagram" ? <Instagram size={20} /> : platform.name === "YouTube" ? <Youtube size={20} /> : <span className="platform-symbol">◉</span>}{platform.name}<ArrowUpRight size={16} /></a>)}</div></section>
    </main>
    <footer className="footer"><div className="footer-brand">YUNG<span>DSA</span><small>PUNE 06 / INDIAN HIP-HOP</small></div><div className="footer-links"><a href="/style/about/#privacy">Privacy &amp; analytics</a><a href="/style/" data-testid="footer-style-link">Style Finder</a>{["Music", "Shows", "Press", "Concept"].map((item) => <a key={item} href={`#${item.toLowerCase()}`} data-testid={`footer-${item.toLowerCase()}-link`}>{item}</a>)}</div><nav className="footer-guide-links" aria-label="Website pages">{editorial.guides.map(guide => <a key={guide.path} href={guide.path}>{guide.label}</a>)}</nav><p className="creator-credit">Independent concept by <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>Lokesh Bagade</a>.<br />Artist content belongs to its respective rights holders.</p></footer>
    {video && <dialog ref={videoDialog} className="modal-backdrop" data-testid="video-modal" aria-labelledby="playing-video-title" onClose={() => setVideo(null)} onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}><div className="video-modal"><button type="button" aria-label="Close video" data-testid="video-modal-close" onClick={() => videoDialog.current.close()}><X /></button><iframe data-testid="video-modal-player" src={ytEmbed(video.youtubeId)} title={`${video.title} — official music video`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /><div><p>{(video.videoType || "Official music video").toUpperCase()} / {video.year}</p><h3 id="playing-video-title" data-testid="video-modal-title">{video.title}</h3><a className="button button-red" data-testid="video-modal-youtube-link" href={ytWatch(video.youtubeId)} {...ext}>OPEN ON YOUTUBE <ArrowUpRight size={16} /></a></div></div></dialog>}
  </div>;
}

export default App;


