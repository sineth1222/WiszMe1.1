"use client";

import { motion } from "framer-motion";

interface LetterRevealProps {
  text: string;
  className?: string;
  delayStart?: number;
}

export function LetterReveal({ text, className, delayStart = 0 }: LetterRevealProps) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delayStart + i * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.3, 1.2] }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
