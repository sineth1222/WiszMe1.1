"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function NightSky({ glowing }: { glowing: boolean }) {
  const [stars, setStars] = useState<Star[] | null>(null);

  useEffect(() => {
    setStars(
      Array.from({ length: 70 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 80,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)" }}>
      {stars?.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity }}
        />
      ))}

      {/* moon */}
      <motion.div
        className="absolute right-10 top-16 h-24 w-24 rounded-full"
        style={{ background: "radial-gradient(circle at 35% 35%, #FFF9E8, #F0DDA8 60%, #CBB784 100%)" }}
        animate={{
          boxShadow: glowing ? "0 0 60px 20px rgba(240,221,168,0.5)" : "0 0 20px 5px rgba(240,221,168,0.2)",
          scale: glowing ? 1.05 : 1,
        }}
        transition={{ duration: 1.5 }}
      />
    </div>
  );
}
