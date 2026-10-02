// All entries below are sourced from YUNG DSA's official public channels
// (YouTube @yung_dsa, Spotify artist page, Apple Music, Instagram) and verified press.
// Video IDs and titles come from the official YouTube channel "YUNG DSA".

export const links = {
  instagram: "https://www.instagram.com/yung_dsa/",
  youtube: "https://www.youtube.com/@yung_dsa",
  youtubeVideos: "https://www.youtube.com/@yung_dsa/videos",
  spotify: "https://open.spotify.com/artist/5e8gOu2fk8b1txcXWlX1Pl",
  appleMusic: "https://music.apple.com/in/artist/yung-dsa/1690984090",
};

export const ytThumb = (id, quality = "maxresdefault") => `https://img.youtube.com/vi/${id}/${quality}.jpg`;
export const ytWatch = (id) => `https://www.youtube.com/watch?v=${id}`;
export const ytEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
export const spotifyEmbed = "https://open.spotify.com/embed/artist/5e8gOu2fk8b1txcXWlX1Pl?utm_source=generator&theme=0";

export const images = {
  // Official still from the MAAF KAR music video (Sony Music India, 2025)
  hero: ytThumb("plK0mRQEluI"),
  // Official artist photo from the Spotify artist profile (self-hosted copy)
  portrait: "/media/artist-portrait-spotify.jpg",
  // Official YouTube channel profile photo (self-hosted copy)
  channelAvatar: "/media/official-portrait-youtube.jpg",
  // Press photo published by Rolling Stone India, May 2025 (self-hosted copy)
  press: "/media/press-portrait-rolling-stone.jpg",
};

export const bio =
  "YUNG DSA is a rapper from Pune 06, representing Yerwada and Indian hip-hop. From the early street visuals of YUNG SITAR and STRAIGHT OUTTA YERWADA to the breakout of YEDA YUNG on Gully Gang Records in 2024, and the Sony Music India release MAAF KAR in 2025, the catalogue is a record of the city, the hustle and the sound — no shortcuts.";

export const latestRelease = {
  title: "FACHADI",
  type: "SINGLE",
  year: "2026",
  youtubeId: "XbG9xca0Qvo",
  detail: "Official music video, produced by Cosmo Drop. Out now on the official YUNG DSA YouTube channel.",
};

// Official music videos from the YUNG DSA YouTube channel (newest first)
export const releases = [
  { title: "FACHADI", year: "2026", note: "Prod. Cosmo Drop", youtubeId: "XbG9xca0Qvo" },
  { title: "RADE RAPATE", year: "2026", note: "Gully Gang Records / Prod. Starboibeatz", youtubeId: "ZMQBrlntZEM" },
  { title: "MAAF KAR", year: "2025", note: "Sony Music India / Prod. Cosmo Drop", youtubeId: "plK0mRQEluI" },
  { title: "CHALA KALTI", year: "2025", note: "Prod. Yeardown", youtubeId: "dkbu2RVP190" },
  { title: "YEDA YUNG", year: "2024", note: "Gully Gang Records / Prod. YD", youtubeId: "Ym4ti89tItw", thumbQuality: "hqdefault" },
  { title: "HOOD 06", year: "2024", note: "Official music video", youtubeId: "Lfwt1_gpjLA" },
  { title: "HUSTLE IS A FLEX", year: "2024", note: "ft. MC SUN-E", youtubeId: "_bo7av8niN4" },
  { title: "SANGEET", year: "2023", note: "Dir. Gaurav Bhat", youtubeId: "b8NJ1sBYzwk" },
  { title: "STRAIGHT OUTTA YERWADA", year: "2023", note: "Dir. Hrishikesh x Mr Andy", youtubeId: "qJDaBaLJWng" },
  { title: "YUNG SITAR", year: "2021", note: "Dir. Gaurav Bhat", youtubeId: "njp-feQu9iE" },
];

export const featuredVideos = releases.slice(0, 3);

export const gallery = [
  { category: "PRESS PORTRAIT / ROLLING STONE INDIA, 2025", image: images.press },
  { category: "ARTIST PORTRAIT / SPOTIFY", image: images.portrait },
  { category: "OFFICIAL PORTRAIT / YOUTUBE", image: images.channelAvatar },
];

export const press = [
  {
    outlet: "ROLLING STONE INDIA",
    headline: "Yung Dsa Flexes His Newfound Fame on Latest Release 'Maaf Kar'",
    year: "2025",
    url: "https://rollingstoneindia.com/yung-dsa-interview-maaf-kar-yeda-yung/",
  },
];

export const platforms = [
  { name: "Instagram", url: links.instagram },
  { name: "YouTube", url: links.youtube },
  { name: "Spotify", url: links.spotify },
  { name: "Apple Music", url: links.appleMusic },
];
