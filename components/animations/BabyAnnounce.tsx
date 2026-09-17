"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface BabyAnnounceProps {
  onOpened?: () => void;
  accentColor?: string;
}

export function BabyAnnounce({ onOpened, accentColor = "#B98CFF" }: BabyAnnounceProps) {
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
        aria-label="Open the announcement"
        className="flex h-24 w-24 items-center justify-center rounded-2xl"
        style={{ background: `${accentColor}22`, border: `2px solid ${accentColor}` }}
        animate={opened ? { rotate: 8, scale: 0 } : { y: [0, -5, 0] }}
        transition={opened ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity }}
      >
        {!opened && <span className="text-3xl">🎁</span>}
      </motion.button>

      {opened && (
        <motion.span initial={{ scale: 0.4, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} className="text-6xl">
          👶
        </motion.span>
      )}

      {!opened && <p className="text-xs opacity-60">Tap to open</p>}
    </div>
  );
}
