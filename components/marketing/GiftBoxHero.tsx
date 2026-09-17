"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

// A curated, visually varied subset — showing all 12 would clutter the
// orbit; these represent the spread of what WiszMe can create.
const ORBIT_SLUGS = ["birthday", "just-because", "new-year", "date-invitation", "good-morning", "good-night", "mothers-day"];

export function GiftBoxHero() {
  const [opened, setOpened] = useState(false);
  const orbitItems = CATEGORIES.filter((c) => ORBIT_SLUGS.includes(c.slug));

  return (
    <div className="relative flex h-72 w-72 items-center justify-center">
      {/* glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, #B98CFF55, transparent 70%)" }}
        animate={{ opacity: opened ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3], scale: opened ? 1.3 : 1 }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* orbiting category icons — appear once opened */}
      <AnimatePresence>
        {opened &&
          orbitItems.map((c, i) => {
            const angle = (i / orbitItems.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 120;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={c.slug}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{ x, y, opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 200, damping: 16 }}
              >
                <Link
                  href={`/create/${c.slug}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-lg transition hover:scale-125"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(185,140,255,0.4)" }}
                  title={c.name}
                >
                  {c.emoji}
                </Link>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* the gift itself */}
      <motion.button
        onClick={() => setOpened((o) => !o)}
        aria-label={opened ? "Close experience picker" : "What would you like to create?"}
        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl"
        style={{ background: "linear-gradient(145deg, #B98CFF, #6E4FA8)" }}
        animate={opened ? { rotate: [0, -6, 6, 0], scale: 1.08 } : { y: [0, -6, 0] }}
        transition={opened ? { duration: 0.4 } : { duration: 2.4, repeat: Infinity }}
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-4xl">{opened ? "✨" : "🎁"}</span>
      </motion.button>

      {!opened && (
        <motion.p
          className="absolute -bottom-8 text-xs"
          style={{ color: "#CFC8E8", opacity: 0.7 }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap to see what you can create ✦
        </motion.p>
      )}
    </div>
  );
}
