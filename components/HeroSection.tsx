"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-[11px] sm:text-xs font-medium tracking-[0.3em] uppercase text-[#c9a96e] mb-6"
        >
          Yerwada, Pune &middot; Est. 2006
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-6xl sm:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tight text-white"
        >
          YUNG
          <br />
          <span className="gradient-gold">DSA</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 text-base sm:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed"
        >
          Desi trap meets raw Marathi street poetry.
          <br className="hidden sm:block" />
          The voice of Pune&apos;s underground.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dsa"
            className="group flex items-center gap-3 px-8 py-4 btn-gold rounded-full text-sm"
          >
            <Play className="w-4 h-4" />
            LISTEN NOW
          </Link>
          <Link
            href="/merch"
            className="flex items-center gap-3 px-8 py-4 btn-outline-gold rounded-full text-sm tracking-[0.1em] uppercase"
          >
            SHOP MERCH
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto"
        >
          {[
            { label: "Monthly Listeners", value: "1.2M" },
            { label: "Total Streams", value: "18.5M" },
            { label: "Followers", value: "340K" },
            { label: "Countries", value: "12" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-display font-bold text-white">{stat.value}</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 tracking-[0.15em] uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#c9a96e] to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
