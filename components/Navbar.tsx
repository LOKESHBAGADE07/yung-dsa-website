"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Discography", path: "/dsa" },
    { name: "Merch", path: "/merch" },
    { name: "Tour", path: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="group">
          <span className="font-display text-2xl font-bold tracking-wide text-white group-hover:text-[#c9a96e] transition-colors duration-300">
            YUNG DSA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className="relative py-1"
              >
                <span className={`text-[13px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
                  active ? "text-[#c9a96e]" : "text-zinc-400 hover:text-white"
                }`}>
                  {link.name}
                </span>
                {active && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#c9a96e]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Cart + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative p-2 text-zinc-400 hover:text-[#c9a96e] transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#c9a96e] text-black text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/[0.06] px-6 pb-6"
          >
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm tracking-[0.15em] uppercase border-b border-white/[0.04] ${
                  pathname === link.path ? "text-[#c9a96e]" : "text-zinc-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
