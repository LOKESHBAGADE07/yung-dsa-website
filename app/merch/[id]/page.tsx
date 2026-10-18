"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { merchProducts } from "@/lib/mockData";
import ThreeBackground from "@/components/ThreeBackground";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Check,
  Minus,
  Plus,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, openCart } = useCart();

  const productId = params?.id as string;
  const product = merchProducts.find((p) => p.id === productId) || merchProducts[0];

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[1] || product.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: selectedSize,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  return (
    <div className="relative min-h-screen bg-black">
      <ThreeBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-12">

        {/* Back Link */}
        <Link
          href="/merch"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-[#c9a96e] mb-10 transition-colors tracking-[0.15em] uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: Image */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="relative aspect-square bg-[#0a0a0a]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-[#c9a96e] text-black">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#c9a96e] font-semibold">{product.category}</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-display font-bold text-[#c9a96e]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-zinc-500 line-through">
                ₹{Math.round(product.price * 1.3).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm text-zinc-400 leading-relaxed border-t border-b border-white/[0.06] py-6">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && (
              <div className="mt-6">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-semibold mb-3">
                  Select Size
                </label>
                <div className="flex items-center gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "bg-[#c9a96e] text-black font-bold"
                          : "bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:border-white/[0.15]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-zinc-400 font-semibold mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-zinc-400 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-zinc-400 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full mt-8 py-4 rounded-xl text-sm font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-3 transition-all ${
                added
                  ? "bg-green-900/30 text-green-400 border border-green-500/20"
                  : "btn-gold"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart &middot; ₹{(product.price * quantity).toLocaleString("en-IN")}
                </>
              )}
            </button>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 text-center">
              <div className="glass-card rounded-xl p-4">
                <Truck className="w-5 h-5 text-[#c9a96e] mx-auto mb-2" />
                <span className="text-[10px] text-zinc-500 block tracking-wide uppercase">Free Shipping</span>
              </div>
              <div className="glass-card rounded-xl p-4">
                <ShieldCheck className="w-5 h-5 text-[#c9a96e] mx-auto mb-2" />
                <span className="text-[10px] text-zinc-500 block tracking-wide uppercase">Authentic</span>
              </div>
              <div className="glass-card rounded-xl p-4">
                <RotateCcw className="w-5 h-5 text-[#c9a96e] mx-auto mb-2" />
                <span className="text-[10px] text-zinc-500 block tracking-wide uppercase">7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
