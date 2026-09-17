"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WiszTemplateProps } from "@/types/wisz";
import { NightSky } from "@/components/animations/NightSky";
import { LetterReveal } from "@/components/animations/LetterReveal";
import { TypewriterMessage } from "@/components/animations/TypewriterMessage";
import { MemorySlideshow } from "@/components/animations/MemorySlideshow";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/animations/MusicPlayer";
import { Watermark } from "@/components/shared/Watermark";
import { SceneErrorBoundary } from "@/components/shared/SceneErrorBoundary";
import { BatLottie } from "../animations/Lottie/BatLottie";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { SleepCutieLottie } from "../animations/Lottie/SleepCutieLottie";

const MOON_GOLD = "#F0DDA8";
const CREAM = "#CFC8E8";

type Scene =
  | "intro"
  | "moonrise"
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

export function GoodNightTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);

  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || MOON_GOLD;
  const glowing = scene !== "intro";

  useEffect(() => {
    if (scene === "memories" && wish.memories.length === 0) advance("final");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden text-center"
      style={{ color: CREAM, fontFamily: "var(--font-outfit, sans-serif)" }}
    >
      {wish.hasWatermark && <Watermark />}
      <NightSky glowing={glowing} />
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
              <BatLottie />
              <p className="relative mb-4 text-xs uppercase tracking-[0.3em] opacity-70">
                before you close your eyes
              </p>
              <p className="relative max-w-xs text-lg leading-relaxed">
                Hey {displayName}...
                <br />
                someone wanted to say goodnight properly.
              </p>
              <button
                onClick={() => {
                  advance("moonrise");
                  onEvent?.("opened");
                  musicRef.current?.play();
                  setTimeout(() => advance("greeting"), 2200);
                }}
                className="relative mt-8 rounded-full px-8 py-4 text-sm font-medium"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #B99B5C)`,
                  color: "#0B0A14",
                }}
              >
                Turn on the stars 🌙
              </button>
            </motion.div>
          )}

          {scene === "moonrise" && (
            <motion.div key="moonrise" {...fade}>
              <p className="text-sm uppercase tracking-[0.3em] opacity-70">
                the sky is settling in...
              </p>
            </motion.div>
          )}

          {scene === "greeting" && (
            <motion.div key="greeting" {...fade}>
              <BatLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="Good Night!"
                  colors={[
                    "#3A2B1E",
                    //"#FF7A59",
                    "#2FBFB0",
                    //"#7C5CFC",
                    //"#FFC93C",
                    "#FF5C8A",
                    "#F0A860",
                    "#ffffff",
                    //"#000000",
                  ]}
                  fontSize="clamp(1.5rem, 5vw, 2.2rem)"
                />
              </p>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-70">
                Wishing you a restful sleep and a bright morning tomorrow.
              </p>
              <LetterReveal
                text={displayName}
                className="font-serif text-5xl italic"
              />
              <button
                onClick={() => advance("message")}
                className="mt-8 rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: accent, color: "#0B0A14" }}
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
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <TypewriterMessage
                  message={wish.mainMessage}
                  textColor={CREAM}
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
                className="mt-6 rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: accent, color: "#0B0A14" }}
              >
                Continue
              </button>
            </motion.div>
          )}

          {scene === "memories" && wish.memories.length > 0 && (
            <motion.div
              key="memories"
              {...fade}
              onAnimationComplete={() => onEvent?.("interaction")}
            >
              <p className="mb-5 text-xs uppercase tracking-[0.3em] opacity-70">
                a few moments to dream about
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
              <SleepCutieLottie />
              <h1
                className="font-serif text-3xl italic"
                style={{ color: accent }}
              >
                Good Night, {displayName}. Sweet dreams. 🌙
              </h1>
              <p className="mt-6 text-xs opacity-60">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                Replay 🌙
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
