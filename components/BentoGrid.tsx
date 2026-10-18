"use client";

import React, { useState } from "react";
import TiltCard from "./TiltCard";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import confetti from "canvas-confetti";
import { 
  Flame, 
  Music, 
  ShoppingBag, 
  Sparkles, 
  Radio, 
  Play, 
  ExternalLink, 
  Mic2,
  Tv,
  ArrowUpRight,
  Disc
} from "lucide-react";
import { motion } from "framer-motion";

export default function BentoGrid() {
  const { addToCart, openCart } = useCart();

  const triggerConfetti = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ["#a855f7", "#06b6d4", "#ec4899"],
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs mb-3">
            <Mic2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>ARTIST HUB</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
            YUNG DSA <span className="gradient-text-holo">ARCHIVE</span>
          </h2>
        </div>
        <p className="text-zinc-400 max-w-md font-mono text-xs sm:text-sm">
          Yerwada Pune &apos;06&apos; street rap, Gully Gang Records discography &amp; official merchandise drops.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Box 1: Yeda Yung Featured Track (Spans 2 cols) */}
        <TiltCard intensity={10} className="md:col-span-2 lg:col-span-2 glass-card p-6 border border-purple-500/30 group">
          <div className="relative h-full flex flex-col justify-between">
            
            <div className="flex items-center justify-between z-10">
              <span className="px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/50 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <Flame className="w-3.5 h-3.5 text-pink-400" />
                BREAKTHROUGH VIRAL HIT
              </span>
              <span className="font-mono text-xs text-cyan-300 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                25M+ VIEWS
              </span>
            </div>

            {/* Real Unsplash Photoshoot Image */}
            <div className="relative my-6 h-64 w-full flex items-center justify-center overflow-hidden rounded-xl border border-white/10 group-hover:border-purple-500/40 transition-colors">
              <Image
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200"
                alt="Yung DSA Artist Photoshoot"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block">GULLY GANG RECORDS</span>
                <h3 className="text-2xl font-bold font-mono text-white">YEDA YUNG</h3>
                <p className="text-xs text-zinc-300 font-mono italic mt-1">&quot;Yerwada 06 se sidha Gully Gang tak... Yeda Yung bolte lala!&quot;</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-xs text-zinc-400 font-mono">Prod. Year Down • 2024</span>
              </div>

              <Link
                href="/dsa"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-mono text-xs font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>LISTEN TO DISCOGRAPHY</span>
              </Link>
            </div>
          </div>
        </TiltCard>

        {/* Box 2: Official Merch Drop #001 */}
        <TiltCard intensity={12} className="md:col-span-1 lg:col-span-2 glass-card p-6 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                MERCH DROP #001
              </span>
              <span className="font-mono text-xs font-bold text-white">₹3,499</span>
            </div>

            <div className="relative h-48 w-full rounded-xl overflow-hidden border border-white/10 my-2">
              <Image
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"
                alt="Yeda Yung Heavyweight Hoodie"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-bold font-mono text-white block">YEDA YUNG Heavyweight Oversized Hoodie</span>
                <span className="text-[10px] font-mono text-zinc-400">480 GSM French Terry Cotton</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={(e) => {
                triggerConfetti(e);
                addToCart({
                  id: "hoodie-1",
                  name: "YEDA YUNG Heavyweight Oversized Hoodie",
                  price: 3499,
                  image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
                  category: "Hoodie",
                });
                openCart();
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>COP HOODIE (₹3,499)</span>
            </button>
          </div>
        </TiltCard>

        {/* Box 3: Bigg Boss 20 & Pune 06 Roots */}
        <TiltCard intensity={15} className="glass-card p-6 border border-pink-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Tv className="w-6 h-6 text-pink-400" />
            <span className="font-mono text-[10px] bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full font-bold">
              NATIONAL TV
            </span>
          </div>

          <div className="my-4">
            <h4 className="font-mono font-bold text-white text-base">BIGG BOSS 20</h4>
            <p className="font-mono text-xs text-zinc-400 mt-1">First Captain of the Season • Representing Indian Desi Hip-Hop</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/10 font-mono text-xs text-zinc-300">
            <span className="text-cyan-400 font-bold block mb-1">Yerwada Pune &apos;06&apos;</span>
            From BPO employee to Gully Gang breakthrough artist &amp; TV icon.
          </div>

          <Link
            href="/admin"
            className="mt-4 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-center text-zinc-300 hover:text-white transition-colors block"
          >
            VIEW TOUR TELEMETRY
          </Link>
        </TiltCard>

        {/* Box 4: Sitar Trap Soundscape */}
        <TiltCard intensity={15} className="md:col-span-2 lg:col-span-3 glass-card p-6 border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-purple-400 mb-2">
                <Disc className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>SIGNATURE SOUNDSCAPE</span>
              </div>
              <h3 className="text-2xl font-bold font-mono text-white">
                SITAR FUSION x <span className="text-cyan-400">DESI HEAVY TRAP</span>
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Blending traditional Indian string instruments with 808s and raw Marathi street lyrics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 text-center">
                <span className="block text-2xl font-extrabold font-mono text-purple-400">5+</span>
                <span className="text-[10px] font-mono text-zinc-400">VIRAL SINGLES</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 text-center">
                <span className="block text-2xl font-extrabold font-mono text-cyan-400">100%</span>
                <span className="text-[10px] font-mono text-zinc-400">DESI HUSTLE</span>
              </div>
            </div>
          </div>
        </TiltCard>

      </div>
    </section>
  );
}
