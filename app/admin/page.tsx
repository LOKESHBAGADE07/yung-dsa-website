"use client";

import React from "react";
import ThreeBackground from "@/components/ThreeBackground";
import { tourDates, artistStats } from "@/lib/mockData";
import { MapPin, Calendar, ExternalLink, TrendingUp, Users, Globe, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function TourPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <ThreeBackground />

      {/* Page Header */}
      <section className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">Live Shows</p>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white">Tour 2025</h1>
          <p className="mt-4 text-zinc-400 max-w-lg">
            The Yerwada Chronicles Tour. Six cities, pure street energy, no playback.
          </p>
        </div>
      </section>

      <div className="line-gold max-w-xs mx-6 lg:mx-auto" />

      {/* Tour Dates */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-0">
            {tourDates.map((show, i) => {
              const dateObj = new Date(show.date);
              const month = dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
              const day = dateObj.getDate();
              const year = dateObj.getFullYear();

              return (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group flex items-center gap-6 py-6 border-b border-white/[0.06] hover:bg-white/[0.01] transition-all px-4 -mx-4 rounded-lg"
                >
                  {/* Date */}
                  <div className="w-16 text-center flex-shrink-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold">{month}</p>
                    <p className="text-3xl font-display font-bold text-white leading-tight">{day}</p>
                  </div>

                  {/* Venue Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">{show.city}</h3>
                    <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3" /> {show.venue}
                    </p>
                  </div>

                  {/* Status / Ticket */}
                  <div className="flex-shrink-0">
                    {show.status === "Sold Out" ? (
                      <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-full border border-red-500/30 text-red-400">
                        Sold Out
                      </span>
                    ) : show.status === "On Sale" ? (
                      <a
                        href={show.ticketUrl}
                        className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 btn-gold rounded-full"
                      >
                        Get Tickets <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-full border border-[#c9a96e]/20 text-[#c9a96e]">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artist Stats Dashboard */}
      <section className="relative z-10 py-16 sm:py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">By The Numbers</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Artist Stats</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Headphones, label: "Monthly Listeners", value: artistStats.monthlyListeners, color: "text-[#c9a96e]" },
              { icon: TrendingUp, label: "Total Streams", value: artistStats.totalStreams, color: "text-[#c9a96e]" },
              { icon: Users, label: "Followers", value: artistStats.followers, color: "text-[#c9a96e]" },
              { icon: Globe, label: "Countries", value: artistStats.countries, color: "text-[#c9a96e]" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-6 sm:p-8">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-4`} />
                <p className="text-3xl sm:text-4xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-2 tracking-[0.1em] uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">About</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">The Story</h2>
              <div className="mt-6 space-y-4 text-zinc-400 leading-relaxed text-sm">
                <p>
                  Born and raised in Yerwada, Pune — Harsh Vijay Machare, known as Yung DSA, 
                  represents the raw spirit of Marathi street culture fused with modern trap production.
                </p>
                <p>
                  From late-night recording sessions in a bedroom studio to headlining stages across India, 
                  the journey has been built on authenticity, hard bars, and zero compromises.
                </p>
                <p>
                  Working with producers like Sez On The Beat and Karan Kanchan, Yung DSA is carving 
                  a space where desi trap meets regional pride — music that hits different.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="font-display text-xl italic text-zinc-300 leading-relaxed">
                &ldquo;Main apni gully se aaya hoon, aur yahi meri pehchaan hai.&rdquo;
              </p>
              <div className="line-gold max-w-16 mx-auto mt-6" />
              <p className="text-xs text-zinc-500 mt-4 tracking-[0.15em] uppercase">— Yung DSA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
