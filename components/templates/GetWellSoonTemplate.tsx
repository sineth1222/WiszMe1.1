"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WiszTemplateProps } from "@/types/wisz";
import { FlowerBloom } from "@/components/animations/FlowerBloom";
import { LetterReveal } from "@/components/animations/LetterReveal";
import { TypewriterMessage } from "@/components/animations/TypewriterMessage";
import { MemorySlideshow } from "@/components/animations/MemorySlideshow";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/animations/MusicPlayer";
import { Watermark } from "@/components/shared/Watermark";
import { SceneErrorBoundary } from "@/components/shared/SceneErrorBoundary";
import { HeartBeatLottie } from "../animations/Lottie/HeartBeatLottie";
import { HospitalBedLottie } from "../animations/Lottie/HospitalBedLottie";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { FlowerBunchLottie } from "../animations/Lottie/FlowerBunchLottie";

const TEAL = "#6FC8FF";
const INK = "#20323A";

type Scene =
  | "intro"
  | "flowers"
  | "greeting"
  | "message"
  | "memories"
  | "final";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
  className:
    "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
};

export function GetWellSoonTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);
  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || TEAL;

  useEffect(() => {
    if (scene === "memories" && wish.memories.length === 0) advance("final");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden text-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #E8F5FF 0%, #F5FBFF 55%, #FFFFFF 100%)",
        color: INK,
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      {wish.hasWatermark && <Watermark />}
      {wish.musicUrl && (
        <MusicPlayer
          ref={musicRef}
          src={wish.musicUrl}
          accentColor={accent}
          onStart={() => onEvent?.("music_started")}
        />
      )}
      <SceneErrorBoundary onSkip={() => setScene("final")} accentColor={accent}>
        <AnimatePresence>
          {scene === "intro" && (
            <motion.div key="intro" {...fade}>
              <HeartBeatLottie />
              <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-60">
                thinking of you
              </p>
              <p className="max-w-xs text-lg leading-relaxed">
                Hey {displayName}...
                <br />
                someone picked these to cheer you up.
              </p>
              <button
                onClick={() => {
                  advance("flowers");
                  onEvent?.("opened");
                  musicRef.current?.play();
                }}
                className="mt-8 rounded-full px-8 py-4 text-sm font-medium text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #3E9DD6)`,
                }}
              >
                Open the Flowers 🌼
              </button>
            </motion.div>
          )}
          {scene === "flowers" && (
            <motion.div key="flowers" {...fade}>
              <p className="mb-6 text-xs uppercase tracking-[0.3em] opacity-60">
                tap each flower to open it
              </p>
              <FlowerBloom
                accentColor={accent}
                onAllBloomed={() => {
                  onEvent?.("interaction");
                  advance("greeting");
                }}
              />
            </motion.div>
          )}
          {scene === "greeting" && (
            <motion.div key="greeting" {...fade}>
              <HospitalBedLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="get well soon!"
                  colors={[
                    //"#3A2B1E",
                    //"#FF7A59",
                    //"#2FBFB0",
                    //"#7C5CFC",
                    //"#FFC93C",
                    //"#FF5C8A",
                    "#F0A860",
                    "#ffffff",
                    "#000000",
                  ]}
                  fontSize="clamp(1.5rem, 5vw, 2.2rem)"
                />
              </p>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                Rest, heal, and shine again wishing you a speedy recovery.
              </p>
              <LetterReveal
                text={displayName}
                className="font-serif text-4xl"
              />
              <button
                onClick={() => advance("message")}
                className="mt-8 rounded-full px-6 py-2.5 text-sm font-medium text-white"
                style={{ background: accent }}
              >
                Continue
              </button>
            </motion.div>
          )}
          {scene === "message" && (
            <motion.div key="message" {...fade}>
              <div
                className="rounded-2xl border p-6"
                style={{
                  borderColor: `${accent}44`,
                  background: "rgba(255,255,255,0.6)",
                }}
              >
                <TypewriterMessage
                  message={wish.mainMessage}
                  textColor={INK}
                  onComplete={() => onEvent?.("message_revealed")}
                />
                <p
                  className="mt-4 text-right font-serif text-lg italic"
                  style={{ color: accent }}
                >
                  — {wish.senderName}
                </p>
              </div>
              <button
                onClick={() => advance("memories")}
                className="mt-6 rounded-full px-6 py-2.5 text-sm font-medium text-white"
                style={{ background: accent }}
              >
                Continue
              </button>
            </motion.div>
          )}
          {scene === "memories" && wish.memories.length > 0 && (
            <motion.div key="memories" {...fade}>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] opacity-60">
                a few happy memories
              </p>
              <MemorySlideshow
                memories={wish.memories}
                onComplete={() => advance("final")}
              />
            </motion.div>
          )}
          {scene === "final" && (
            <motion.div
              key="final"
              {...fade}
              onAnimationComplete={() => onEvent?.("completed")}
            >
              <FlowerBunchLottie />
              <h1 className="font-serif text-3xl" style={{ color: accent }}>
                Feel better soon, {displayName}. 🌼
              </h1>
              <p className="mt-6 text-xs opacity-60">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                Replay 🌼
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
