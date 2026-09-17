"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { WiszMemory } from "@/types/wisz";

interface MemorySlideshowProps {
  memories: WiszMemory[];
  onComplete?: () => void;
  msPerPhoto?: number;
}

export function MemorySlideshow({ memories, onComplete, msPerPhoto = 1800 }: MemorySlideshowProps) {
  const [index, setIndex] = useState(0);
  const fadeSeconds = Math.min(0.35, msPerPhoto / 1000 / 2);

  useEffect(() => {
    if (memories.length === 0) return;
    if (index >= memories.length - 1) {
      const t = setTimeout(() => onComplete?.(), msPerPhoto);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), msPerPhoto);
    return () => clearTimeout(t);
  }, [index, memories.length, msPerPhoto, onComplete]);

  if (memories.length === 0) return null;
  const photo = memories[index];

  return (
    <div className="relative h-72 w-56 overflow-hidden rounded-2xl shadow-2xl">
      {/* mode="wait" deliberately not used — it stacks fade time on top
          of msPerPhoto since the next photo waits for the previous
          one's exit to finish first. Default mode overlaps them for a
          clean crossfade instead. */}
      <AnimatePresence>
        <motion.div key={photo.url} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: fadeSeconds }}>
          <Image src={photo.url} alt={photo.caption ?? "memory"} fill sizes="224px" className="object-cover" />
          {photo.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
              <p className="font-serif text-sm italic text-white">{photo.caption}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
