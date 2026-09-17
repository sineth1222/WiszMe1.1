"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SunriseProps {
  risen: boolean;
}

interface Cloud {
  top: number;
  scale: number;
  duration: number;
  delay: number;
}

const CLOUDS: Cloud[] = [
  { top: 15, scale: 1, duration: 40, delay: 0 },
  { top: 28, scale: 0.7, duration: 55, delay: -10 },
  { top: 40, scale: 1.3, duration: 65, delay: -25 },
];

export function Sunrise({ risen }: SunriseProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* sky gradient shifts from night-blue to warm sunrise */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: risen
            ? "linear-gradient(180deg, #FF9E7A 0%, #FFC978 35%, #FFE8B8 65%, #FFF6E5 100%)"
            : "linear-gradient(180deg, #2E2A55 0%, #4A3B6B 50%, #6B5480 100%)",
        }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />

      {/* sun rising from the bottom */}
      <motion.div
        className="absolute left-1/2 h-40 w-40 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, #FFE7A0 0%, #FFB868 60%, transparent 75%)" }}
        initial={{ bottom: "-30%", opacity: 0.3 }}
        animate={{ bottom: risen ? "35%" : "-30%", opacity: risen ? 1 : 0.3 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />

      {/* drifting clouds, fade in once risen */}
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute h-10 w-28 rounded-full bg-white/70 blur-sm"
          style={{ top: `${c.top}%`, scale: c.scale }}
          initial={{ x: "-20vw", opacity: 0 }}
          animate={{ x: "120vw", opacity: risen ? 0.8 : 0 }}
          transition={{ x: { duration: c.duration, repeat: Infinity, ease: "linear", delay: c.delay }, opacity: { duration: 1.5 } }}
        />
      ))}
    </div>
  );
}
