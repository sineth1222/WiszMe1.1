"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS, type ProductId } from "@/lib/categories";

interface Scene {
  product: ProductId;
  emoji: string;
  line: string;
}

const SCENES: Scene[] = [
  { product: "birthzme", emoji: "🎂", line: "A birthday, made unforgettable." },
  { product: "uzme", emoji: "❤️", line: "A love story, told beautifully." },
  { product: "datezme", emoji: "💌", line: "An invitation, worth saying yes to." },
  { product: "feztme", emoji: "🎆", line: "A countdown, ending in fireworks." },
  { product: "wiszme", emoji: "☀️", line: "A morning, started with warmth." },
  { product: "wiszme", emoji: "🌙", line: "A night, ended with sweet words." },
];

const SCENE_DURATION = 2600;

/**
 * A slow, cinematic auto-advancing reel — one product vignette at a
 * time, each with its own product-accent glow — standing in for "a
 * short movie of everything WiszMe connects to" on the homepage hero.
 */
export function ProductShowcaseReel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SCENES.length), SCENE_DURATION);
    return () => clearInterval(t);
  }, []);

  const scene = SCENES[index];
  const product = PRODUCTS[scene.product];

  return (
    <div className="relative mx-auto flex h-40 w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl border" style={{ borderColor: "rgba(185,140,255,0.2)", background: "rgba(255,255,255,0.02)" }}>
      <motion.div
        className="absolute inset-0"
        animate={{ background: `radial-gradient(circle at 50% 40%, ${product.accent}22, transparent 70%)` }}
        transition={{ duration: 0.8 }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center gap-2 px-6 text-center"
        >
          <span className="text-4xl">{scene.emoji}</span>
          <p className="text-sm" style={{ color: "#CFC8E8" }}>{scene.line}</p>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: product.accent }}>{product.name}</p>
        </motion.div>
      </AnimatePresence>

      {/* progress dots */}
      <div className="absolute bottom-3 flex gap-1.5">
        {SCENES.map((_, i) => (
          <span key={i} className="h-1 rounded-full transition-all" style={{ width: i === index ? 16 : 6, background: i === index ? product.accent : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  );
}
