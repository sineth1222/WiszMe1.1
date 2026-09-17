"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RingsJoinProps {
  onJoined?: () => void;
  accentColor?: string;
}

export function RingsJoin({ onJoined, accentColor = "#F0C674" }: RingsJoinProps) {
  const [joined, setJoined] = useState(false);

  const join = () => {
    if (joined) return;
    setJoined(true);
    setTimeout(() => onJoined?.(), 700);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button onClick={join} aria-label="Join the rings" className="relative flex h-24 w-40 items-center justify-center">
        <motion.svg width="60" height="60" viewBox="0 0 60 60" animate={{ x: joined ? 12 : -8 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}>
          <circle cx="30" cy="30" r="20" fill="none" stroke={accentColor} strokeWidth="6" />
        </motion.svg>
        <motion.svg className="absolute" width="60" height="60" viewBox="0 0 60 60" animate={{ x: joined ? -12 : 8 }} transition={{ type: "spring", stiffness: 180, damping: 14 }}>
          <circle cx="30" cy="30" r="20" fill="none" stroke={accentColor} strokeWidth="6" opacity="0.75" />
        </motion.svg>
        {joined && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.4, 1], opacity: [1, 1, 0] }} transition={{ duration: 0.8 }} className="absolute h-24 w-24 rounded-full" style={{ background: `radial-gradient(circle, ${accentColor}88, transparent 70%)` }} />
        )}
      </button>
      {!joined && <p className="text-xs opacity-60">Tap to bring the rings together</p>}
    </div>
  );
}
