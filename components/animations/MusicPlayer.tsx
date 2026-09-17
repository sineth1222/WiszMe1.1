"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

interface MusicPlayerProps {
  src: string | null;
  onStart?: () => void;
  accentColor: string;
}

export interface MusicPlayerHandle {
  play: () => Promise<void>;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  function MusicPlayer({ src, onStart, accentColor }, ref) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [needsTap, setNeedsTap] = useState(true);

    useEffect(() => {
      if (!src) return;
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
      return () => {
        audioRef.current?.pause();
      };
    }, [src]);

    const startPlayback = async () => {
      if (!audioRef.current) return;
      try {
        await audioRef.current.play();
        setPlaying(true);
        setNeedsTap(false);
        onStart?.();
      } catch {
        setNeedsTap(true);
      }
    };

    useImperativeHandle(ref, () => ({ play: startPlayback }));

    const toggle = async () => {
      if (!audioRef.current) return;
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
        return;
      }
      await startPlayback();
    };

    if (!src) return null;

    return (
      <div className="fixed right-4 bottom-4 z-30 flex items-center gap-2">
        {needsTap && !playing && (
          <motion.span
            className="rounded-full bg-white/90 px-3 py-1.5 text-xs shadow-md"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Tap to begin ✨
          </motion.span>
        )}
        <motion.button
          aria-label={playing ? "Pause music" : "Play music"}
          onClick={toggle}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md"
          style={{ color: accentColor }}
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            playing ? { duration: 4, repeat: Infinity, ease: "linear" } : {}
          }
        >
          🎵
        </motion.button>
      </div>
    );
  },
);
