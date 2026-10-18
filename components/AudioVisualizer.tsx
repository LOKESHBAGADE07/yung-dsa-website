"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Disc, Sparkles, Music } from "lucide-react";

export default function AudioVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("Yeda Yung (Desi Trap)");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tracks = [
    "Yeda Yung (Desi Trap)",
    "Rade Rapate (Pune 06)",
    "Chala Kalti (Gully Gang)",
    "Yung Sitar (Instrumental)"
  ];

  // Synth Audio Loop mimicking Indian Sitar Trap Beat
  const toggleAudio = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    } else {
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        } else if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.08, ctx.currentTime);
        mainGain.connect(ctx.destination);

        // Desi Sitar / Indian Scale frequencies
        const notes = [146.83, 164.81, 185.0, 220.0, 246.94, 293.66]; // D Sitar Scale
        let step = 0;

        intervalRef.current = setInterval(() => {
          if (!audioCtxRef.current) return;
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = step % 4 === 0 ? "sawtooth" : "triangle";
          osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);

          noteGain.gain.setValueAtTime(0.07, ctx.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

          osc.connect(noteGain);
          noteGain.connect(mainGain);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);

          step++;
        }, 300);

        setIsPlaying(true);
      } catch (err) {
        console.error("Audio synth error", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full glass-card border border-purple-500/30 shadow-lg">
      <button
        onClick={toggleAudio}
        className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
          isPlaying
            ? "bg-purple-600/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
            : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
        }`}
        title={isPlaying ? "Pause Track" : "Play Yung DSA Beats"}
      >
        <Disc className={`w-4 h-4 ${isPlaying ? "animate-spin text-cyan-400" : ""}`} />
      </button>

      {/* Animated Sound Frequency Bars */}
      <div className="flex items-end gap-1 h-4 w-14 px-1 overflow-hidden">
        {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-gradient-to-t from-purple-500 via-cyan-400 to-pink-500 animate-pulse"
                : "bg-zinc-700 h-1"
            }`}
            style={{
              height: isPlaying ? `${Math.max(25, Math.random() * 100)}%` : "20%",
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-purple-300/90 font-bold">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span className="truncate max-w-[130px]">{currentTrack}</span>
      </div>
    </div>
  );
}
