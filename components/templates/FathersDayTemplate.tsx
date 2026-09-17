"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WiszTemplateProps } from "@/types/wisz";
import { MedalReveal } from "@/components/animations/MedalReveal";
import { LetterReveal } from "@/components/animations/LetterReveal";
import { TypewriterMessage } from "@/components/animations/TypewriterMessage";
import { MemorySlideshow } from "@/components/animations/MemorySlideshow";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/animations/MusicPlayer";
import { Watermark } from "@/components/shared/Watermark";
import { SceneErrorBoundary } from "@/components/shared/SceneErrorBoundary";
import { GiftLottie } from "../animations/Lottie/GiftLottie";
import { FatherLottie } from "../animations/Lottie/FatherLottie";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { FatherWithChildrenLottie } from "../animations/Lottie/FatherWithChildren";
import { OneGiftLottie } from "../animations/Lottie/OneGiftLottie";

const GOLD = "#F0C674";
const NAVY = "#0F1E33";
const CREAM = "#E8EEF6";

type Scene = "intro" | "medal" | "greeting" | "message" | "memories" | "final";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
  className:
    "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
};

export function FathersDayTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);

  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || GOLD;

  useEffect(() => {
    if (scene === "memories" && wish.memories.length === 0) advance("final");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden text-center"
      style={{
        background: `radial-gradient(ellipse at 50% -10%, #1E3A5F 0%, ${NAVY} 55%, #070D16 100%)`,
        color: CREAM,
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
              <OneGiftLottie />
              <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-70">
                an award, well earned
              </p>
              <p className="max-w-xs text-lg leading-relaxed">
                Hey {displayName}...
                <br />
                someone wanted to give you a little recognition.
              </p>
              <button
                onClick={() => {
                  advance("medal");
                  onEvent?.("opened");
                  musicRef.current?.play();
                }}
                className="mt-8 rounded-full px-8 py-4 text-sm font-medium"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #B8863A)`,
                  color: "#0F1E33",
                }}
              >
                Open It 🎁
              </button>
            </motion.div>
          )}

          {scene === "medal" && (
            <motion.div key="medal" {...fade}>
              <MedalReveal
                accentColor={accent}
                onOpened={() => {
                  onEvent?.("interaction");
                  advance("greeting");
                }}
              />
            </motion.div>
          )}

          {scene === "greeting" && (
            <motion.div key="greeting" {...fade}>
              <FatherLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-70">
                "You gave me roots to feel grounded and wings to chase my
                dreams. Thank you, Dad."
              </p>
              <LetterReveal
                text={displayName}
                className="font-serif text-4xl"
              />
              <button
                onClick={() => advance("message")}
                className="mt-8 rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: accent, color: "#0F1E33" }}
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
                style={{ background: accent, color: "#0F1E33" }}
              >
                Continue
              </button>
            </motion.div>
          )}

          {scene === "memories" && wish.memories.length > 0 && (
            <motion.div key="memories" {...fade}>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] opacity-70">
                a few favorite moments together
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
              <FatherWithChildrenLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="Happy Father's Day!"
                  colors={[
                    "#FF7A59",
                    "#2FBFB0",
                    "#7C5CFC",
                    "#FFC93C",
                    "#FF5C8A",
                  ]}
                />
              </p>
              <h1 className="font-serif text-3xl" style={{ color: accent }}>
                {displayName}. 🏅
              </h1>
              <p className="mt-6 text-xs opacity-60">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                Replay 🏅
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
