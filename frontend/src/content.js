// Video links go to the artist, the releasing label or the film's distributor.

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
  hero: "https://i.ytimg.com/vi/plK0mRQEluI/maxresdefault.jpg",
  heroSmall: "https://i.ytimg.com/vi/plK0mRQEluI/mqdefault.jpg",
};

export const bio =
  "YUNG DSA (Harsh Vijay Machare) is a rapper from Yerwada, Pune 06. His music includes YUNG SITAR, STRAIGHT OUTTA YERWADA, YEDA YUNG on Gully Gang Records and MAAF KAR on Sony Music India. Explore the releases below, or follow the linked artist channels for current updates.";

export const latestRelease = {
  title: "HOOD TALK",
  type: "SINGLE",
  videoType: "Official lyric video",
  year: "2026",
  youtubeId: "D72IGt5CYl4",
  detail: "Released on 20 November 2026, Hood Talk pairs Yung DSA’s Yerwada references with production by Starboibeatz.",
  appleMusic: "https://music.apple.com/us/album/hood-talk-single/6834405615",
};

// Selected releases and collaborations with official playback links, newest first.
export const releases = [
  { title: latestRelease.title, year: latestRelease.year, note: "20 Nov · Prod. Starboibeatz", videoType: latestRelease.videoType, youtubeId: latestRelease.youtubeId, featured: true },
  { title: "MODUS OPERANDI", year: "2026", note: "One of a Kind · With Yung Sammy · Arranged by Wamp", videoType: "Official audio", youtubeId: "1CINF9mbPtU" },
  { title: "FACHADI", year: "2026", note: "Prod. Cosmo Drop", youtubeId: "XbG9xca0Qvo", featured: true },
  { title: "GONI MEIN PAISA", year: "2026", note: "7 Apr · Toaster soundtrack · Rap by Yung DSA, music by Aman Pant", videoType: "Official lyric video", youtubeId: "0fb4zmzR2JA" },
  { title: "RADE RAPATE", year: "2026", note: "6 Mar · Gully Gang Records / Prod. Starboibeatz", youtubeId: "ZMQBrlntZEM", featured: true },
  { title: "MAAF KAR", year: "2025", note: "Sony Music India / Prod. Cosmo Drop", youtubeId: "plK0mRQEluI" },
  { title: "CHALA KALTI", year: "2025", note: "Prod. Yeardown", youtubeId: "dkbu2RVP190" },
  { title: "YEDA YUNG", year: "2024", note: "Gully Gang Records / Prod. YD", youtubeId: "Ym4ti89tItw", thumbQuality: "hqdefault" },
  { title: "HOOD 06", year: "2024", note: "Official music video", youtubeId: "Lfwt1_gpjLA" },
  { title: "HUSTLE IS A FLEX", year: "2024", note: "ft. MC SUN-E", youtubeId: "_bo7av8niN4" },
  { title: "SANGEET", year: "2023", note: "Dir. Gaurav Bhat", youtubeId: "b8NJ1sBYzwk" },
  { title: "STRAIGHT OUTTA YERWADA", year: "2023", note: "Dir. Hrishikesh x Mr Andy", youtubeId: "qJDaBaLJWng" },
  { title: "YUNG SITAR", year: "2021", note: "Dir. Gaurav Bhat", youtubeId: "njp-feQu9iE" },
];

export const featuredVideos = releases.filter(release => release.featured);


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



