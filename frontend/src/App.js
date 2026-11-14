import { useState } from "react";
import "@/App.css";
import { ArrowDown, ArrowUpRight, Check, Instagram, Menu, Play, X, Youtube } from "lucide-react";
import { bio, featuredVideos, images, latestRelease, links, platforms, press, releases, spotifyEmbed, ytEmbed, ytThumb, ytWatch } from "./content";

const nav = ["Music", "Videos", "Shows", "About", "Style", "Press", "Concept"];
const ext = { target: "_blank", rel: "noopener noreferrer" };
const thumb = (item) => ytThumb(item.youtubeId, item.thumbQuality);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [video, setVideo] = useState(null);
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
        <div className="hero-media"><img src={images.hero} alt="YUNG DSA — still from the MAAF KAR official music video" fetchPriority="high" width="1280" height="720" data-testid="hero-image" /></div>
        <div className="hero-inner container">
          <div className="hero-content">
            <p className="eyebrow reveal">INDEPENDENT FAN-MADE CONCEPT</p>
            <h1 className="hero-title reveal delay-1">YUNG<br /><em>DSA</em></h1>
            <p className="hero-sub reveal delay-2">PUNE 06 <span>/</span> INDIAN HIP-HOP</p>
            <div className="hero-actions reveal delay-3"><a className="button button-red" href="#music" data-testid="hero-listen-button">LISTEN NOW <ArrowUpRight size={16} /></a><a className="button button-ghost" data-testid="hero-style-button" href="/style/">EXPLORE STYLE <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="hero-foot"><span className="hero-scroll"><ArrowDown size={14} /> SCROLL</span></div>
        </div>
      </section>


      <section className="style-launch section-pad" id="style" data-testid="style-finder-section">
        <div><p className="eyebrow">NEW / INDEPENDENT STYLE GUIDE</p><h2>FIND THE FIT.<br /><em>KNOW THE SOURCE.</em></h2><p className="muted-copy">Explore sunglasses and baggy lowers with checked retailer links, fit notes and clear labels. Current picks are similar styles, not confirmed artist-worn items.</p><a className="button button-red" href="/style/">OPEN STYLE FINDER <ArrowUpRight size={17} /></a></div>
        <div className="style-launch-guides"><a href="/style/goggles-sunglasses/"><span>01 / EYEWEAR</span><strong>Goggles &amp; sunglasses</strong><ArrowUpRight size={22} /></a><a href="/style/baggy-lowers/"><span>02 / SILHOUETTE</span><strong>Baggy lowers</strong><ArrowUpRight size={22} /></a><a href="/style/looks/"><span>03 / EVIDENCE</span><strong>The look journal</strong><ArrowUpRight size={22} /></a></div>
      </section>

      <section className="release-feature section-pad" id="music" data-testid="latest-release-section"><div className="section-kicker"><span>01</span> FEATURED RELEASE</div><div className="release-grid"><div className="release-art-wrap"><a className="art-play" href={ytWatch(latestRelease.youtubeId)} {...ext} data-testid="latest-release-play-button" aria-label={`Watch ${latestRelease.title} official music video`} onClick={(event) => openVideo(event, latestRelease)}><img src={ytThumb(latestRelease.youtubeId)} alt={`${latestRelease.title} official video still`} width="1280" height="720" loading="lazy" decoding="async" data-testid="latest-release-artwork" /><span className="play-ring"><Play fill="white" size={22} /></span></a></div><div className="release-copy"><p className="eyebrow">FEATURED / OFFICIAL MUSIC VIDEO</p><h2 data-testid="latest-release-title">{latestRelease.title}</h2><p className="release-meta">{latestRelease.type} <span>/</span> {latestRelease.year}</p><p className="muted-copy">{latestRelease.detail}</p><a className="button button-outline" data-testid="latest-release-listen-button" href={ytWatch(latestRelease.youtubeId)} {...ext}>WATCH ON YOUTUBE <ArrowUpRight size={17} /></a><div className="platform-row"><span>ALSO ON</span><a data-testid="latest-platform-spotify" href={links.spotify} {...ext}>Spotify</a><a data-testid="latest-platform-apple-music" href={links.appleMusic} {...ext}>Apple Music</a></div></div></div></section>

      <section className="discography section-pad" data-testid="discography-section"><div className="section-head"><div><div className="section-kicker"><span>02</span> THE CATALOGUE</div><h2>MUSIC</h2></div><p className="head-note" data-testid="catalogue-count">{releases.length} OFFICIAL RELEASES <span>/</span> 2021 — 2026</p></div><div className="release-list">{releases.map((release, index) => <a className="release-row" key={release.youtubeId} href={ytWatch(release.youtubeId)} {...ext} data-testid={`release-card-${index}`} onClick={(event) => openVideo(event, release)}><span className="row-index">{String(index + 1).padStart(2, "0")}</span><img className="row-thumb" loading="lazy" src={thumb(release)} alt="" width={release.thumbQuality === "hqdefault" ? 480 : 1280} height={release.thumbQuality === "hqdefault" ? 360 : 720} decoding="async" /><div className="row-title"><h3>{release.title}</h3><p>{release.note}</p></div><span className="row-year">{release.year}</span><span className="row-play" data-testid={`release-play-${index}`}><Play size={13} fill="currentColor" /></span></a>)}</div>
        <div className="stream-block" data-testid="spotify-player-block"><div><div className="section-kicker"><span>STREAM</span> OFFICIAL SPOTIFY</div><p className="muted-copy">Play the catalogue directly from the official YUNG DSA artist profile.</p><a className="text-button" data-testid="spotify-open-link" href={links.spotify} {...ext}>OPEN ON SPOTIFY <ArrowUpRight size={17} /></a></div><iframe title="YUNG DSA on Spotify" data-testid="spotify-player" src={spotifyEmbed} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /></div></section>

      <section className="video-section section-pad" id="videos" data-testid="videos-section"><div className="section-head"><div><div className="section-kicker"><span>03</span> VISUALS</div><h2>WATCH</h2></div><a className="text-button" data-testid="view-all-videos-button" href={links.youtubeVideos} {...ext}>VIEW ALL VIDEOS <ArrowUpRight size={17} /></a></div><div className="video-grid">{featuredVideos.map((item, index) => <a className={`video-card video-${index}`} key={item.youtubeId} href={ytWatch(item.youtubeId)} {...ext} data-testid={`video-card-${index}`} onClick={(event) => openVideo(event, item)}><img loading="lazy" src={thumb(item)} alt={`${item.title} official music video`} width="1280" height="720" decoding="async" /><span className="video-overlay"><span className="play-ring"><Play fill="white" size={20} /></span><small>OFFICIAL MUSIC VIDEO <span>/</span> {item.year}</small><strong>{item.title}</strong></span></a>)}</div></section>

      <section className="about-section section-pad" id="about" data-testid="about-section"><div className="about-image artist-wordmark" aria-label="Pune 06, Yerwada"><span>PUNE</span><strong>06</strong><small>YERWADA / HIP-HOP</small></div><div className="about-copy"><div className="section-kicker"><span>04</span> THE ARTIST</div><h2>NO<br /><em>SHORTCUTS.</em></h2><p data-testid="artist-bio">{bio}</p><p className="bio-source">Read the <a href="/press-kit.html">artist biography and music sources</a>.</p></div></section>

      <section className="live-section section-pad" id="shows" data-testid="shows-section"><div className="section-head"><div><div className="section-kicker"><span>05</span> ON THE ROAD</div><h2>LIVE</h2></div></div><div className="empty-shows"><div><h3>SHOW INFORMATION</h3><p>Visit the artist’s public channels for confirmed dates. This concept does not sell tickets.</p></div><a className="button button-red" href="#concept" data-testid="shows-booking-button">ABOUT THIS CONCEPT <ArrowUpRight size={17} /></a></div></section>

      <section className="gallery-section section-pad" id="gallery" data-testid="gallery-section"><div className="section-head"><div><div className="section-kicker"><span>06</span> EXPLORE</div><h2>ARTIST<br />CHANNELS</h2></div><p className="head-note">Photos, videos and music at their source.</p></div><div className="artist-channel-grid">{platforms.slice(0, 3).map((platform) => <a className="artist-channel-card" key={platform.name} href={platform.url} {...ext}><span>{platform.name}</span><ArrowUpRight aria-hidden="true" size={28} /></a>)}</div></section>

      <section className="press-section section-pad" id="press" data-testid="press-section"><div className="press-copy"><div className="section-kicker"><span>07</span> ARTIST PROFILE</div><h2>THE<br /><em>PROFILE.</em></h2><p>An independently compiled artist profile with release information and source links. This is not an authorised press kit.</p><a className="button button-outline" data-testid="press-kit-download" href="/press-kit.html" {...ext}>VIEW ARTIST PROFILE <ArrowDown size={17} /></a></div><div className="press-list"><p className="eyebrow">FEATURED IN</p>{press.map((item) => <a key={item.url} className="press-feature" data-testid="press-feature-rolling-stone" href={item.url} {...ext}><div><span>{item.outlet} <em>/ {item.year}</em></span><strong>{item.headline}</strong></div><ArrowUpRight size={18} /></a>)}{["ARTIST BIO", "SOURCE LINKS", "MUSIC & VIDEOS", "INDEPENDENT CONCEPT"].map((item) => <div key={item} data-testid={`press-item-${item.toLowerCase().replaceAll(" ", "-")}`}><span>{item}</span><Check size={16} /></div>)}</div></section>

      <section className="contact-section section-pad" id="concept" data-testid="concept-section"><div className="contact-intro"><div className="section-kicker"><span>08</span> ABOUT THIS WEBSITE</div><h2>THE<br /><em>CONCEPT.</em></h2><p>A fan-made website concept exploring a home for Yung DSA’s music and publicly available artist information.</p></div><div className="concept-card"><h3>Created by <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>Lokesh Bagade</a></h3><p>This website is independent and is not affiliated with or endorsed by Yung DSA or his team.</p><p>Bookings and business enquiries are not accepted here. Please use the contact information published on the artist’s own channels.</p><a className="button button-outline" href={links.instagram} {...ext}>VISIT ARTIST’S INSTAGRAM <ArrowUpRight size={17} /></a><p className="concept-credit">Explore the website creator’s work on <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>LinkedIn <ArrowUpRight size={14} /></a>.</p></div></section>

      <section className="follow-section" data-testid="follow-section"><p className="eyebrow">OFFICIAL CHANNELS</p><h2>FOLLOW THE<br /><em>MOVEMENT.</em></h2><div className="follow-links">{platforms.map((platform) => <a key={platform.name} data-testid={`social-${platform.name.toLowerCase().replace(" ", "-")}-link`} href={platform.url} {...ext}>{platform.name === "Instagram" ? <Instagram size={20} /> : platform.name === "YouTube" ? <Youtube size={20} /> : <span className="platform-symbol">◉</span>}{platform.name}<ArrowUpRight size={16} /></a>)}</div></section>
    </main>
    <footer className="footer"><div className="footer-brand">YUNG<span>DSA</span><small>PUNE 06 / INDIAN HIP-HOP</small></div><div className="footer-links"><a href="/style/" data-testid="footer-style-link">Style Finder</a>{["Music", "Shows", "Press", "Concept"].map((item) => <a key={item} href={`#${item.toLowerCase()}`} data-testid={`footer-${item.toLowerCase()}-link`}>{item}</a>)}</div><p className="creator-credit">Independent concept by <a href="https://www.linkedin.com/in/lokeshbagade/" {...ext}>Lokesh Bagade</a>.<br />Artist content belongs to its respective rights holders.</p></footer>
    {video && <div className="modal-backdrop" data-testid="video-modal" onClick={() => setVideo(null)}><div className="video-modal" onClick={(e) => e.stopPropagation()}><button data-testid="video-modal-close" onClick={() => setVideo(null)}><X /></button><iframe data-testid="video-modal-player" src={ytEmbed(video.youtubeId)} title={`${video.title} — official music video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /><div><p>OFFICIAL MUSIC VIDEO / {video.year}</p><h3 data-testid="video-modal-title">{video.title}</h3><a className="button button-red" data-testid="video-modal-youtube-link" href={ytWatch(video.youtubeId)} {...ext}>OPEN ON YOUTUBE <ArrowUpRight size={16} /></a></div></div></div>}
  </div>;
}

export default App;

