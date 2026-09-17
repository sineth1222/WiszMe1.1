"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Item {
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  drift: number;
}

const BALLOON_COLORS = ["#FF7EB6", "#B98CFF", "#F0C674", "#6FC8FF"];

export function FloatingAccents() {
  const [balloons, setBalloons] = useState<Item[] | null>(null);
  const [hearts, setHearts] = useState<Item[] | null>(null);

  useEffect(() => {
    setBalloons(
      Array.from({ length: 6 }, () => ({
        left: Math.random() * 100,
        size: 20 + Math.random() * 14,
        duration: 14 + Math.random() * 10,
        delay: Math.random() * 12,
        color:
          BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        drift: (Math.random() - 0.5) * 40,
      })),
    );
    setHearts(
      Array.from({ length: 3 }, () => ({
        left: Math.random() * 100,
        size: 8 + Math.random() * 8,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 10,
        color: "#FF7EB6",
        drift: (Math.random() - 0.5) * 30,
      })),
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* balloons rise from the bottom, forever /}
      {balloons?.map((b, i) => (
        <motion.div
          key={`balloon-${i}`}
          className="absolute bottom-0 rounded-full"
          style={{ left: `${b.left}%`, width: b.size, height: b.size * 1.2, background: `linear-gradient(160deg, ${b.color}, ${b.color}88)` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-120vh", x: b.drift, opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
        />
      ))*/}

      {/* hearts fall from the top, forever */}
      {hearts?.map((h, i) => (
        <motion.svg
          key={`heart-${i}`}
          className="absolute top-0"
          style={{ left: `${h.left}%` }}
          width={h.size}
          height={h.size}
          viewBox="0 0 20 18"
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: h.drift,
            opacity: [0, 0.8, 0.8, 0],
            rotate: 25,
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M10 18C4 13 0 9 0 5.5C0 2 3 0 5.5 1.2C7.5 2 9 4 10 6C11 4 12.5 2 14.5 1.2C17 0 20 2 20 5.5C20 9 16 13 10 18Z"
            fill={h.color}
          />
        </motion.svg>
      ))}
    </div>
  );
}
