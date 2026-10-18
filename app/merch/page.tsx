"use client";

import React, { useState } from "react";
import Image from "next/image";
import ThreeBackground from "@/components/ThreeBackground";
import { merchProducts, Product } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MerchPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <ThreeBackground />

      {/* Page Header */}
      <section className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#c9a96e] mb-3">Official Store</p>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white">Merch</h1>
          <p className="mt-4 text-zinc-400 max-w-lg">
            Limited edition streetwear and collectibles. Every piece ships from Pune with love.
          </p>
        </div>
      </section>

      <div className="line-gold max-w-xs mx-6 lg:mx-auto" />

      {/* Products Grid */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="relative z-10 py-16 sm:py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { title: "Free Shipping", desc: "On orders above ₹2,999 across India" },
              { title: "Premium Quality", desc: "Heavyweight cotton, embroidered details" },
              { title: "Limited Drops", desc: "Once sold out, it's gone forever" },
            ].map((info) => (
              <div key={info.title} className="glass-card rounded-xl p-8">
                <h3 className="text-sm font-semibold text-white tracking-wide">{info.title}</h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{info.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || "");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group glass-card rounded-2xl overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-[#c9a96e] text-black">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <span className="text-[10px] tracking-[0.2em] uppercase text-zinc-500">{product.category}</span>
        <h3 className="text-sm font-semibold text-white mt-1">{product.name}</h3>
        <p className="text-lg font-display font-semibold text-[#c9a96e] mt-2">₹{product.price.toLocaleString("en-IN")}</p>

        {/* Sizes */}
        {product.sizes && (
          <div className="flex flex-wrap gap-2 mt-4">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                  selectedSize === size
                    ? "bg-[#c9a96e] text-black"
                    : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={added}
          className={`w-full mt-4 py-3 rounded-lg text-xs font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all ${
            added
              ? "bg-green-900/30 text-green-400 border border-green-500/20"
              : "btn-gold"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
