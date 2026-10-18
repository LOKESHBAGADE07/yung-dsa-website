export type Track = {
  id: string;
  title: string;
  album: string;
  duration: string;
  year: number;
  streamCount: string;
  spotifyUrl: string;
  featured?: string;
};

export type Album = {
  id: string;
  title: string;
  year: number;
  cover: string;
  tracks: number;
  type: "Album" | "EP" | "Single";
  spotifyUrl: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Apparel" | "Accessories" | "Vinyl" | "Limited Edition";
  sizes?: string[];
  description: string;
  badge?: string;
};

export type TourDate = {
  id: string;
  city: string;
  venue: string;
  date: string;
  status: "On Sale" | "Sold Out" | "Coming Soon";
  ticketUrl?: string;
};

// ——— Albums / Discography ———
export const albums: Album[] = [
  {
    id: "1",
    title: "YERWADA CHRONICLES",
    year: 2024,
    cover: "/images/album1.png",
    tracks: 12,
    type: "Album",
    spotifyUrl: "#",
    description: "The debut studio album. 12 tracks of raw street poetry straight from Pune's heart — produced by Sez On The Beat and Karan Kanchan.",
  },
  {
    id: "2",
    title: "GULLY DIARIES",
    year: 2023,
    cover: "/images/album2.png",
    tracks: 7,
    type: "EP",
    spotifyUrl: "#",
    description: "A 7-track EP recorded in late-night sessions at home. Lo-fi beats, unfiltered lyrics, no compromises.",
  },
  {
    id: "3",
    title: "RAJ",
    year: 2024,
    cover: "/images/album3.png",
    tracks: 5,
    type: "EP",
    spotifyUrl: "#",
    description: "The crown EP. 5 tracks exploring identity, ambition, and Marathi pride — co-produced with Karan Kanchan.",
  },
];

// ——— Featured Tracks ———
export const featuredTracks: Track[] = [
  {
    id: "1",
    title: "Yerwada Anthem",
    album: "YERWADA CHRONICLES",
    duration: "3:42",
    year: 2024,
    streamCount: "2.1M",
    spotifyUrl: "#",
  },
  {
    id: "2",
    title: "Desi Trap (feat. MC Stan)",
    album: "YERWADA CHRONICLES",
    duration: "4:15",
    year: 2024,
    streamCount: "5.8M",
    spotifyUrl: "#",
    featured: "MC Stan",
  },
  {
    id: "3",
    title: "Pune Se",
    album: "GULLY DIARIES",
    duration: "3:21",
    year: 2023,
    streamCount: "1.3M",
    spotifyUrl: "#",
  },
  {
    id: "4",
    title: "Raj",
    album: "RAJ",
    duration: "3:58",
    year: 2024,
    streamCount: "890K",
    spotifyUrl: "#",
  },
  {
    id: "5",
    title: "Midnight Hustle",
    album: "YERWADA CHRONICLES",
    duration: "3:33",
    year: 2024,
    streamCount: "1.7M",
    spotifyUrl: "#",
  },
  {
    id: "6",
    title: "Crown (Interlude)",
    album: "RAJ",
    duration: "2:10",
    year: 2024,
    streamCount: "420K",
    spotifyUrl: "#",
  },
];

// ——— Merch Products ———
export const merchProducts: Product[] = [
  {
    id: "1",
    name: "Yerwada Chronicles Hoodie",
    price: 3499,
    image: "/images/hoodie.png",
    category: "Apparel",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Premium heavyweight cotton hoodie with embroidered Yung DSA logo. Oversized drop-shoulder fit, brushed fleece interior.",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Desi Trap Graphic Tee",
    price: 1999,
    image: "/images/tee.png",
    category: "Apparel",
    sizes: ["S", "M", "L", "XL"],
    description: "Acid wash oversized tee with chrome lettering. 240 GSM ring-spun cotton.",
  },
  {
    id: "3",
    name: "RAJ Vinyl (Limited)",
    price: 4999,
    image: "/images/vinyl.png",
    category: "Vinyl",
    description: "Limited edition gold-pressed vinyl of the RAJ EP. Holographic sleeve art, numbered 1-500.",
    badge: "Limited",
  },
  {
    id: "4",
    name: "Gully Cap",
    price: 1499,
    image: "/images/album3.png",
    category: "Accessories",
    description: "Structured 6-panel snapback with gold metallic embroidered crown emblem. One size fits all.",
  },
];

// ——— Tour Dates ———
export const tourDates: TourDate[] = [
  { id: "1", city: "Mumbai", venue: "Mehboob Studios", date: "2025-02-14", status: "Sold Out" },
  { id: "2", city: "Pune", venue: "High Spirits", date: "2025-02-28", status: "Sold Out" },
  { id: "3", city: "Delhi", venue: "Summer House Café", date: "2025-03-15", status: "On Sale", ticketUrl: "#" },
  { id: "4", city: "Bangalore", venue: "The Humming Tree", date: "2025-03-22", status: "On Sale", ticketUrl: "#" },
  { id: "5", city: "Hyderabad", venue: "Prism Club", date: "2025-04-05", status: "Coming Soon" },
  { id: "6", city: "Chandigarh", venue: "The Flying Saucer", date: "2025-04-12", status: "Coming Soon" },
];

// ——— Stats ———
export const artistStats = {
  monthlyListeners: "1.2M",
  totalStreams: "18.5M",
  followers: "340K",
  countries: "12",
};
