"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DiyaLightProps {
  onAllLit?: () => void;
  accentColor?: string;
  count?: number;
}

export function DiyaLight({ onAllLit, accentColor = "#F0C674", count = 5 }: DiyaLightProps) {
  const [lit, setLit] = useState<boolean[]>(Array(count).fill(false));

  const light = (i: number) => {
    if (lit[i]) return;
    const next = [...lit];
    next[i] = true;
    setLit(next);
    if (next.every(Boolean)) setTimeout(() => onAllLit?.(), 500);
  };

  return (
    <div className="flex items-end justify-center gap-3">
      {lit.map((isLit, i) => (
        <button key={i} onClick={() => light(i)} aria-label={`Light lamp ${i + 1}`} className="relative flex flex-col items-center">
          {isLit && (
            <motion.div
              className="mb-1 h-5 w-2.5 rounded-full"
              style={{ background: "linear-gradient(180deg, #FFF3D6, #F0A860)" }}
              animate={{ scaleY: [1, 1.3, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
          <svg width="26" height="16" viewBox="0 0 26 16">
            <path d="M2 4 Q13 -2 24 4 L20 14 Q13 18 6 14 Z" fill={isLit ? accentColor : "#4A3B2E"} />
          </svg>
        </button>
      ))}
    </div>
  );
}
