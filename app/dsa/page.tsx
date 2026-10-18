"use client";

import React, { useState } from "react";
import Image from "next/image";
import ThreeBackground from "@/components/ThreeBackground";
import { albums, featuredTracks, Album } from "@/lib/mockData";
import { Play, Clock, Disc3, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiscographyPage() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  return (
    <div className="relative min-h-screen bg-black">
      <ThreeBackground />

      {/* Page Header */}
      <section className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">Collection</p>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white">Discography</h1>
          <p className="mt-4 text-zinc-400 max-w-lg">
            Every album, EP, and single from the streets of Yerwada to your speakers.
          </p>
        </div>
      </section>

      <div className="line-gold max-w-xs mx-6 lg:mx-auto" />

      {/* Albums Grid */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedAlbum(album)}
                className="group glass-card rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#c9a96e] flex items-center justify-center shadow-lg shadow-[#c9a96e]/20">
                      <Play className="w-7 h-7 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-black/60 text-[#c9a96e] border border-[#c9a96e]/20 backdrop-blur-sm">
                      {album.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-white group-hover:text-[#c9a96e] transition-colors">{album.title}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{album.year} &middot; {album.tracks} tracks</p>
                  <p className="text-sm text-zinc-400 mt-3 leading-relaxed line-clamp-2">{album.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Album Detail Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlbum(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-2xl bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-64 aspect-square flex-shrink-0">
                  <Image src={selectedAlbum.cover} alt={selectedAlbum.title} fill className="object-cover" />
                </div>
                <div className="p-6 sm:p-8 flex-1">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold">{selectedAlbum.type} &middot; {selectedAlbum.year}</span>
                  <h3 className="font-display text-2xl font-bold text-white mt-2">{selectedAlbum.title}</h3>
                  <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{selectedAlbum.description}</p>
                  <div className="flex items-center gap-4 mt-6">
                    <a href={selectedAlbum.spotifyUrl} className="flex items-center gap-2 px-5 py-2.5 btn-gold rounded-full text-xs">
                      <Play className="w-3.5 h-3.5" /> Play
                    </a>
                    <button onClick={() => setSelectedAlbum(null)} className="px-5 py-2.5 text-xs text-zinc-400 hover:text-white transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full Track Listing */}
      <section className="relative z-10 py-16 sm:py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">All Tracks</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Track Listing</h2>
          </div>

          {/* Table Header */}
          <div className="hidden sm:flex items-center gap-5 px-4 pb-4 border-b border-white/[0.06] text-[10px] tracking-[0.2em] uppercase text-zinc-600">
            <span className="w-8 text-right">#</span>
            <span className="w-8" />
            <span className="flex-1">Title</span>
            <span className="w-40">Album</span>
            <span className="w-20 text-right">Streams</span>
            <span className="w-16 text-right flex items-center justify-end gap-1"><Clock className="w-3 h-3" /></span>
          </div>

          <div className="space-y-0">
            {featuredTracks.map((track, index) => (
              <div
                key={track.id}
                className="group flex items-center gap-5 py-4 px-4 rounded-lg hover:bg-white/[0.02] transition-all duration-300 border-b border-white/[0.04] sm:border-none"
              >
                <span className="w-8 text-right text-sm text-zinc-600 font-medium group-hover:hidden">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Play className="w-8 text-[#c9a96e] hidden group-hover:block" />
                <div className="w-8 h-8 rounded bg-white/[0.04] flex items-center justify-center">
                  <Disc3 className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{track.title}</p>
                  {track.featured && <p className="text-xs text-[#c9a96e]">feat. {track.featured}</p>}
                </div>
                <span className="hidden sm:block w-40 text-xs text-zinc-500 truncate">{track.album}</span>
                <span className="hidden sm:block w-20 text-right text-xs text-zinc-600">{track.streamCount}</span>
                <span className="w-16 text-right text-xs text-zinc-600">{track.duration}</span>
              </div>
            ))}
          </div>

          {/* Streaming Links */}
          <div className="mt-16 pt-12 border-t border-white/[0.06]">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-6">Listen Everywhere</p>
            <div className="flex flex-wrap gap-4">
              {["Spotify", "Apple Music", "YouTube Music", "JioSaavn", "Gaana"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] text-sm text-zinc-400 hover:border-[#c9a96e]/30 hover:text-[#c9a96e] transition-all"
                >
                  {platform}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
