"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface MedalRevealProps {
  onOpened?: () => void;
  accentColor?: string;
}

export function MedalReveal({ onOpened, accentColor = "#F0C674" }: MedalRevealProps) {
  const [opened, setOpened] = useState(false);

  const open = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => onOpened?.(), 700);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={open}
        aria-label="Open the award"
        className="relative flex h-24 w-24 items-center justify-center rounded-2xl"
        style={{ background: opened ? "transparent" : "#1E3A5F", border: `2px solid ${accentColor}` }}
        animate={opened ? { rotateY: 90 } : { scale: [1, 1.03, 1] }}
        transition={opened ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity }}
      >
        {!opened && <span className="text-2xl">🎁</span>}
      </motion.button>

      {opened && (
        <motion.div initial={{ opacity: 0, scale: 0.5, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
          <svg width="70" height="90" viewBox="0 0 70 90">
            <path d="M20 0 L35 30 L15 30 Z" fill="#C0392B" />
            <path d="M50 0 L55 30 L35 30 Z" fill="#2E6DA4" />
            <circle cx="35" cy="55" r="28" fill={accentColor} stroke="#B8863A" strokeWidth="3" />
            <circle cx="35" cy="55" r="18" fill="#1E3A5F" />
            <path d="M35 44L38 51L46 51L40 56L42 64L35 59L28 64L30 56L24 51L32 51Z" fill={accentColor} />
          </svg>
        </motion.div>
      )}

      {!opened && <p className="text-xs opacity-60">Tap to open</p>}
    </div>
  );
}
