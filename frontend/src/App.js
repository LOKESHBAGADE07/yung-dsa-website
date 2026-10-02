import { useState } from "react";
import "@/App.css";
import axios from "axios";
import { ArrowDown, ArrowUpRight, Check, Instagram, Menu, Play, X, Youtube } from "lucide-react";
import { Toaster, toast } from "sonner";
import { bio, featuredVideos, gallery, images, latestRelease, links, platforms, press, releases, spotifyEmbed, ytEmbed, ytThumb, ytWatch } from "./content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const nav = ["Music", "Videos", "Shows", "About", "Gallery", "Press", "Contact"];
const ext = { target: "_blank", rel: "noopener noreferrer" };
const thumb = (item) => ytThumb(item.youtubeId, item.thumbQuality);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
    const [lightbox, setLightbox] = useState(null);
  const [video, setVideo] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const submitInquiry = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await axios.post(`${API}/booking-inquiries`, payload);
      setSubmitted(true); event.currentTarget.reset(); toast.success("Inquiry received by management.");
    } catch { toast.error("The inquiry could not be sent. Please try again."); }
  };

  return <div className="site-shell">
    <Toaster theme="dark" position="bottom-right" />
    <header className="nav-bar" data-testid="site-navigation">
      <div className="nav-inner container">
        <button className="brand-mark" data-testid="home-logo-button" onClick={() => scrollTo("home")}>YUNG<span>DSA</span></button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>{nav.map((item) => <button key={item} data-testid={`nav-${item.toLowerCase()}-link`} onClick={() => scrollTo(item.toLowerCase())}>{item}</button>)}</nav>
        <button className="nav-book" data-testid="nav-booking-button" onClick={() => scrollTo("contact")}>BOOK YUNG DSA <ArrowUpRight size={15} /></button>
        <button className="menu-button" data-testid="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>

    <main>
      <section className="hero" id="home" data-testid="hero-section">
        <div className="hero-media"><img src={images.hero} alt="YUNG DSA — still from the MAAF KAR official music video" fetchpriority="high" data-testid="hero-image" /></div>
        <div className="hero-inner container">
          <div className="hero-content">
            <p className="eyebrow reveal">OFFICIAL ARTIST WEBSITE</p>
            <h1 className="hero-title reveal delay-1">YUNG<br /><em>DSA</em></h1>
            <p className="hero-sub reveal delay-2">PUNE 06 <span>/</span> INDIAN HIP-HOP</p>
            <div className="hero-actions reveal delay-3"><button className="button button-red" data-testid="hero-listen-button" onClick={() => scrollTo("music")}>LISTEN NOW <ArrowUpRight size={16} /></button><button className="button button-ghost" data-testid="hero-booking-button" onClick={() => scrollTo("contact")}>BOOK YUNG DSA <ArrowUpRight size={16} /></button></div>
          </div>
          <div className="hero-foot"><span className="hero-scroll"><ArrowDown size={14} /> SCROLL</span></div>
        </div>
      </section>

      <section className="release-feature section-pad" id="music" data-testid="latest-release-section"><div className="section-kicker"><span>01</span> LATEST RELEASE</div><div className="release-grid"><div className="release-art-wrap"><button className="art-play" data-testid="latest-release-play-button" onClick={() => setVideo(latestRelease)}><img src={ytThumb(latestRelease.youtubeId)} alt={`${latestRelease.title} official video still`} data-testid="latest-release-artwork" /><span className="play-ring"><Play fill="white" size={22} /></span></button></div><div className="release-copy"><p className="eyebrow">OUT NOW / OFFICIAL RELEASE</p><h2 data-testid="latest-release-title">{latestRelease.title}</h2><p className="release-meta">{latestRelease.type} <span>/</span> {latestRelease.year}</p><p className="muted-copy">{latestRelease.detail}</p><a className="button button-outline" data-testid="latest-release-listen-button" href={ytWatch(latestRelease.youtubeId)} {...ext}>WATCH ON YOUTUBE <ArrowUpRight size={17} /></a><div className="platform-row"><span>ALSO ON</span><a data-testid="latest-platform-spotify" href={links.spotify} {...ext}>Spotify</a><a data-testid="latest-platform-apple-music" href={links.appleMusic} {...ext}>Apple Music</a></div></div></div></section>

      <section className="discography section-pad" data-testid="discography-section"><div className="section-head"><div><div className="section-kicker"><span>02</span> THE CATALOGUE</div><h2>MUSIC</h2></div><p className="head-note" data-testid="catalogue-count">{releases.length} OFFICIAL RELEASES <span>/</span> 2021 — 2026</p></div><div className="release-list">{releases.map((release, index) => <button className="release-row" key={release.youtubeId} data-testid={`release-card-${index}`} onClick={() => setVideo(release)}><span className="row-index">{String(index + 1).padStart(2, "0")}</span><img className="row-thumb" loading="lazy" src={thumb(release)} alt="" /><span className="row-title"><h3>{release.title}</h3><p>{release.note}</p></span><span className="row-year">{release.year}</span><span className="row-play" data-testid={`release-play-${index}`}><Play size={13} fill="currentColor" /></span></button>)}</div>
        <div className="stream-block" data-testid="spotify-player-block"><div><div className="section-kicker"><span>STREAM</span> OFFICIAL SPOTIFY</div><p className="muted-copy">Play the catalogue directly from the official YUNG DSA artist profile.</p><a className="text-button" data-testid="spotify-open-link" href={links.spotify} {...ext}>OPEN ON SPOTIFY <ArrowUpRight size={17} /></a></div><iframe title="YUNG DSA on Spotify" data-testid="spotify-player" src={spotifyEmbed} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" /></div></section>

      <section className="video-section section-pad" id="videos" data-testid="videos-section"><div className="section-head"><div><div className="section-kicker"><span>03</span> VISUALS</div><h2>WATCH</h2></div><a className="text-button" data-testid="view-all-videos-button" href={links.youtubeVideos} {...ext}>VIEW ALL VIDEOS <ArrowUpRight size={17} /></a></div><div className="video-grid">{featuredVideos.map((item, index) => <button className={`video-card video-${index}`} key={item.youtubeId} data-testid={`video-card-${index}`} onClick={() => setVideo(item)}><img loading="lazy" src={thumb(item)} alt={`${item.title} official music video`} /><span className="video-overlay"><span className="play-ring"><Play fill="white" size={20} /></span><small>OFFICIAL MUSIC VIDEO <span>/</span> {item.year}</small><strong>{item.title}</strong></span></button>)}</div></section>

      <section className="about-section section-pad" id="about" data-testid="about-section"><div className="about-image"><img loading="lazy" src={images.portrait} alt="YUNG DSA official artist portrait" /></div><div className="about-copy"><div className="section-kicker"><span>04</span> THE ARTIST</div><h2>NO<br /><em>SHORTCUTS.</em></h2><p data-testid="artist-bio">{bio}</p></div></section>

      <section className="live-section section-pad" id="shows" data-testid="shows-section"><div className="section-head"><div><div className="section-kicker"><span>05</span> ON THE ROAD</div><h2>LIVE</h2></div></div><div className="empty-shows"><div><h3>NO UPCOMING SHOWS</h3><p>Confirmed live dates will appear here first.</p></div><button className="button button-red" data-testid="shows-booking-button" onClick={() => scrollTo("contact")}>BOOK YUNG DSA <ArrowUpRight size={17} /></button></div></section>

      <section className="gallery-section section-pad" id="gallery" data-testid="gallery-section"><div className="section-head"><div><div className="section-kicker"><span>06</span> THE ARCHIVE</div><h2>GALLERY</h2></div><p className="head-note">OFFICIAL PHOTOGRAPHY <span>/</span> MORE FRAMES COMING SOON</p></div><div className="gallery-grid">{gallery.map((item, index) => <button key={item.category} className={`gallery-item gallery-${index}`} data-testid={`gallery-image-${index}`} onClick={() => setLightbox(item)}><img loading="lazy" src={item.image} alt={item.category} /><span>{item.category}</span></button>)}</div></section>

      <section className="press-section section-pad" id="press" data-testid="press-section"><div className="press-copy"><div className="section-kicker"><span>07</span> MEDIA / PRESS</div><h2>THE<br /><em>PRESS KIT.</em></h2><p>Official bio, approved imagery and essential artist information for media and professional use.</p><a className="button button-outline" data-testid="press-kit-download" href="/press-kit-placeholder.pdf" download>DOWNLOAD PRESS KIT <ArrowDown size={17} /></a></div><div className="press-list"><p className="eyebrow">FEATURED IN</p>{press.map((item) => <a key={item.url} className="press-feature" data-testid="press-feature-rolling-stone" href={item.url} {...ext}><div><span>{item.outlet} <em>/ {item.year}</em></span><strong>{item.headline}</strong></div><ArrowUpRight size={18} /></a>)}{["OFFICIAL BIO", "PRESS PHOTOS", "MUSIC & VIDEOS", "BOOKING INFORMATION"].map((item) => <div key={item} data-testid={`press-item-${item.toLowerCase().replaceAll(" ", "-")}`}><span>{item}</span><Check size={16} /></div>)}</div></section>

      <section className="contact-section section-pad" id="contact" data-testid="contact-section"><div className="contact-intro"><div className="section-kicker"><span>08</span> PROFESSIONAL INQUIRIES</div><h2>BOOK<br /><em>YUNG DSA.</em></h2><p>For live performances, events, brand collaborations and professional inquiries.</p><div className="contact-types"><span>LIVE SHOWS</span><span>BRAND COLLABORATIONS</span><span>MEDIA / PRESS</span><span>GENERAL BUSINESS</span></div></div><form className="inquiry-form" data-testid="booking-inquiry-form" onSubmit={submitInquiry}>{submitted && <div className="success-message" data-testid="booking-success-message"><Check size={18} /> INQUIRY RECEIVED — MANAGEMENT WILL FOLLOW UP.</div>}<div className="form-grid"><label>NAME<input name="name" required data-testid="booking-name-input" placeholder="Your full name" /></label><label>EMAIL<input type="email" name="email" required data-testid="booking-email-input" placeholder="you@company.com" /></label><label>PHONE<input name="phone" data-testid="booking-phone-input" placeholder="+91" /></label><label>COMPANY / ORGANIZATION<input name="organization" data-testid="booking-organization-input" placeholder="Company name" /></label><label>INQUIRY TYPE<select name="inquiry_type" required data-testid="booking-type-select"><option value="Live Shows">Live Shows</option><option value="Brand Collaborations">Brand Collaborations</option><option value="Media / Press">Media / Press</option><option value="General Business">General Business</option></select></label><label>CITY<input name="city" data-testid="booking-city-input" placeholder="City" /></label><label>EVENT DATE<input type="date" name="event_date" data-testid="booking-date-input" /></label><label>BUDGET<input name="budget" data-testid="booking-budget-input" placeholder="Optional" /></label></div><label>MESSAGE<textarea name="message" required data-testid="booking-message-input" placeholder="Tell us about the opportunity..." rows="4" /></label><button className="button button-red" type="submit" data-testid="booking-submit-button">SEND INQUIRY <ArrowUpRight size={17} /></button><p className="form-note">FORM DESTINATION: MANAGEMENT INBOX <span>/</span> PLACEHOLDER UNTIL CONFIRMED</p></form></section>

      <section className="follow-section" data-testid="follow-section"><p className="eyebrow">OFFICIAL CHANNELS</p><h2>FOLLOW THE<br /><em>MOVEMENT.</em></h2><div className="follow-links">{platforms.map((platform) => <a key={platform.name} data-testid={`social-${platform.name.toLowerCase().replace(" ", "-")}-link`} href={platform.url} {...ext}>{platform.name === "Instagram" ? <Instagram size={20} /> : platform.name === "YouTube" ? <Youtube size={20} /> : <span className="platform-symbol">◉</span>}{platform.name}<ArrowUpRight size={16} /></a>)}</div></section>
    </main>
    <footer className="footer"><div className="footer-brand">YUNG<span>DSA</span><small>PUNE 06 / INDIAN HIP-HOP</small></div><div className="footer-links">{["Music", "Shows", "Booking", "Press", "Contact"].map((item) => <button key={item} data-testid={`footer-${item.toLowerCase()}-link`} onClick={() => scrollTo(item === "Booking" ? "contact" : item.toLowerCase())}>{item}</button>)}</div><p>© 2026 YUNG DSA. ALL RIGHTS RESERVED.</p></footer>
    {lightbox && <div className="modal-backdrop" data-testid="gallery-lightbox" onClick={() => setLightbox(null)}><div className="lightbox"><button data-testid="gallery-lightbox-close" onClick={() => setLightbox(null)}><X /></button><img src={lightbox.image} alt={lightbox.category} /><p>{lightbox.category}</p></div></div>}
    {video && <div className="modal-backdrop" data-testid="video-modal" onClick={() => setVideo(null)}><div className="video-modal" onClick={(e) => e.stopPropagation()}><button data-testid="video-modal-close" onClick={() => setVideo(null)}><X /></button><iframe data-testid="video-modal-player" src={ytEmbed(video.youtubeId)} title={`${video.title} — official music video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /><div><p>OFFICIAL MUSIC VIDEO / {video.year}</p><h3 data-testid="video-modal-title">{video.title}</h3><a className="button button-red" data-testid="video-modal-youtube-link" href={ytWatch(video.youtubeId)} {...ext}>OPEN ON YOUTUBE <ArrowUpRight size={16} /></a></div></div></div>}
  </div>;
}

export default App;
