"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FlowerBloomProps {
  onAllBloomed?: () => void;
  accentColor?: string;
  count?: number;
}

const POSITIONS = [
  { x: -60, y: 0 }, { x: -30, y: -18 }, { x: 0, y: -24 }, { x: 30, y: -18 }, { x: 60, y: 0 },
];

export function FlowerBloom({ onAllBloomed, accentColor = "#FF7EB6", count = 5 }: FlowerBloomProps) {
  const flowers = POSITIONS.slice(0, count);
  const [bloomed, setBloomed] = useState<boolean[]>(Array(flowers.length).fill(false));

  const tap = (i: number) => {
    if (bloomed[i]) return;
    const next = [...bloomed];
    next[i] = true;
    setBloomed(next);
    if (next.every(Boolean)) setTimeout(() => onAllBloomed?.(), 500);
  };

  return (
    <div className="relative flex h-32 w-full items-end justify-center gap-1">
      {flowers.map((pos, i) => (
        <motion.button
          key={i}
          onClick={() => tap(i)}
          aria-label={`Bloom flower ${i + 1}`}
          className="relative"
          style={{ marginBottom: -pos.y }}
          animate={bloomed[i] ? { scale: [0.6, 1.15, 1] } : { y: [0, -3, 0] }}
          transition={bloomed[i] ? { duration: 0.5 } : { duration: 2, repeat: Infinity, delay: i * 0.2 }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30">
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="15"
                cy="15"
                rx="6"
                ry="10"
                fill={bloomed[i] ? accentColor : "#5C5470"}
                opacity={bloomed[i] ? 0.9 : 0.4}
                transform={`rotate(${deg} 15 15) translate(0 -6)`}
              />
            ))}
            <circle cx="15" cy="15" r="4" fill={bloomed[i] ? "#F0C674" : "#3A3550"} />
          </svg>
        </motion.button>
      ))}
    </div>
  );
}
