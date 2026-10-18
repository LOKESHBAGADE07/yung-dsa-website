import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-black text-white">
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold tracking-wide text-white">
              YUNG DSA
            </Link>
            <p className="text-sm text-zinc-500 mt-4 leading-relaxed">
              Yerwada, Pune &apos;06&apos;. Desi trap meets raw Marathi street poetry. Official site of Harsh Vijay Machare.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e] mb-5">Navigate</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/dsa" className="hover:text-white transition-colors">Discography</Link></li>
              <li><Link href="/merch" className="hover:text-white transition-colors">Merch Store</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Tour & Stats</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e] mb-5">Connect</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="https://open.spotify.com/search/Yung%20DSA" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Spotify</a></li>
              <li><a href="https://www.youtube.com/results?search_query=Yung+DSA" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a></li>
              <li><a href="https://www.instagram.com/yungdsa/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Apple Music</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c9a96e] mb-5">Stay Updated</h4>
            <p className="text-sm text-zinc-500 mb-4">
              Get early access to new drops and tour announcements.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-[#111] border border-white/[0.08] rounded-l-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9a96e]/50"
              />
              <button className="px-4 py-2.5 bg-[#c9a96e] text-black text-xs font-bold tracking-wider uppercase rounded-r-lg hover:bg-[#e0c992] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Yung DSA. All rights reserved.</p>
          <p>Gully Gang Records &middot; DIVINE&apos;s Label</p>
        </div>
      </div>
    </footer>
  );
}
