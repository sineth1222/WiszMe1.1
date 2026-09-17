"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WiszTemplateProps } from "@/types/wisz";
import { Sunrise } from "@/components/animations/Sunrise";
import { LetterReveal } from "@/components/animations/LetterReveal";
import { TypewriterMessage } from "@/components/animations/TypewriterMessage";
import { MemorySlideshow } from "@/components/animations/MemorySlideshow";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/animations/MusicPlayer";
import { Watermark } from "@/components/shared/Watermark";
import { SceneErrorBoundary } from "@/components/shared/SceneErrorBoundary";
import { DoorOpenLottie } from "../animations/Lottie/DoorOpenLottie";
import { HeartBurst } from "../animations/HeartBrust";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { ChairSetyLottie } from "../animations/Lottie/ChairSetyLottie";
import { FlowerBunchLottie } from "../animations/Lottie/FlowerBunchLottie";

const GOLD = "#F0A860";
const INK = "#3A2B1E";

const TOKENS = {
  bg: "radial-gradient(ellipse at 50% -10%, #FBDCE2 0%, #FFF7F2 55%, #FDEDE3 100%)",
  crimson: "#9E1B32",
  burgundy: "#5C0E1E",
  rose: "#C2274D",
  blush: "#FBDCE2",
  gold: "#D9A566",
  ink: "#3A2430",
};

type Scene = "intro" | "rising" | "greeting" | "message" | "memories" | "final";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
  className:
    "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
};

export function HousewarmingTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);
  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || GOLD;
  const risen = scene !== "intro";

  const [burst, setBurst] = useState(0);

  useEffect(() => {
    setBurst((b) => b + 1);

    const interval = setInterval(() => {
      setBurst((b) => b + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scene === "memories" && wish.memories.length === 0) advance("final");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden text-center"
      style={{ color: INK, fontFamily: "var(--font-outfit, sans-serif)" }}
    >
      {wish.hasWatermark && <Watermark />}
      <Sunrise risen={risen} />
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
              <DoorOpenLottie />
              <p className="relative mb-4 text-xs uppercase tracking-[0.3em] opacity-70">
                a new beginning, under one roof
              </p>
              <p className="relative max-w-xs text-lg leading-relaxed text-white">
                Hey {displayName}...
                <br />
                welcome to your new home.
              </p>
              <button
                onClick={() => {
                  advance("rising");
                  onEvent?.("opened");
                  musicRef.current?.play();
                  setTimeout(() => advance("greeting"), 2600);
                }}
                className="relative mt-8 rounded-full px-8 py-4 text-sm font-medium text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #C97A3A)`,
                }}
              >
                Open the Door 🏡
              </button>
            </motion.div>
          )}
          {scene === "rising" && (
            <motion.div key="rising" {...fade}>
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">
                the light is finding its way in...
              </p>
            </motion.div>
          )}
          {scene === "greeting" && (
            <motion.div key="greeting" {...fade}>
              <HeartBurst
                trigger={burst}
                colors={[TOKENS.crimson, TOKENS.rose, TOKENS.gold]}
              />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="Congratulations!"
                  colors={[
                    "#FF7A59",
                    "#2FBFB0",
                    "#7C5CFC",
                    "#FFC93C",
                    "#FF5C8A",
                  ]}
                  fontSize="clamp(1.5rem, 5vw, 2.2rem)"
                />
              </p>
              <ChairSetyLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-70">
                "Congratulations on your new home! Wishing you many happy
                moments and wonderful memories in your new space."
              </p>
              <LetterReveal
                text={displayName}
                className="font-serif text-5xl"
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
                  borderColor: `${accent}55`,
                  background: "rgba(255,255,255,0.35)",
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
              <p className="mb-5 text-xs uppercase tracking-[0.3em] opacity-70">
                a few moments to remember this place by
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
              <h1 className="font-serif text-3xl text-white">
                Congratulations on your new home!, {displayName}. 🏡
              </h1>
              <p className="mt-6 text-xs text-white/70">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs text-white"
                style={{ borderColor: "rgba(255,255,255,0.4)" }}
              >
                Replay 🏡
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
