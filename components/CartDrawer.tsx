"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[#0a0a0a] border-l border-white/[0.06] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h2 className="font-display text-lg font-semibold text-white">Your Cart</h2>
              <button onClick={closeCart} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-zinc-500 text-sm">Your cart is empty.</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-[#c9a96e] text-sm font-medium hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-white/[0.04]">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#111] flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                        <p className="text-sm text-[#c9a96e] font-semibold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-zinc-500 hover:text-white"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-sm text-white w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-zinc-500 hover:text-white"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 text-zinc-600 hover:text-red-400 self-start">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-400">Subtotal</span>
                  <span className="text-lg font-display font-semibold text-white">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <button className="w-full py-3.5 btn-gold rounded-lg text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-2 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
