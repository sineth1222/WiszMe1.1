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
import { TeaLottie } from "../animations/Lottie/TeaLottie";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { FlyingBirdsLottie } from "../animations/Lottie/FlyingBirdsLottie";
import { FlowerLottie } from "../animations/Lottie/FlowerLottie";

const GOLD = "#F0A860";
const CREAM = "#3A2B1E";

type Scene = "intro" | "rising" | "greeting" | "message" | "memories" | "final";

// mode="wait" deliberately not used on AnimatePresence — documented
// source of scenes getting permanently stuck when multiple state
// updates land in the same tick. Default mode + absolute positioning
// gives a clean crossfade without that risk.
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
  className:
    "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
};

export function GoodMorningTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);

  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || GOLD;
  const risen = scene !== "intro";

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
              <TeaLottie />
              <p className="relative mb-4 text-xs uppercase tracking-[0.3em] opacity-70">
                before your day begins
              </p>
              <p className="relative max-w-xs text-lg leading-relaxed text-white">
                Hey {displayName}...
                <br />
                someone wanted your morning to start a little brighter.
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
                Let the sun rise ☀️
              </button>
            </motion.div>
          )}

          {scene === "rising" && (
            <motion.div key="rising" {...fade}>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-700/30">
                good morning is on its way...
              </p>
            </motion.div>
          )}

          {scene === "greeting" && (
            <motion.div key="greeting" {...fade}>
              <FlyingBirdsLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="Good Morning!"
                  colors={[
                    "#3A2B1E",
                    //"#FF7A59",
                    //"#2FBFB0",
                    //"#7C5CFC",
                    //"#FFC93C",
                    "#FF5C8A",
                    "#F0A860",
                    "#ffffff",
                    "#000000",
                  ]}
                  fontSize="clamp(1.5rem, 5vw, 2.2rem)"
                />
              </p>
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-70">
                Hope your day starts with a smile and ends with joy.
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
                className="mt-6 rounded-full px-6 py-2.5 text-sm font-medium text-white"
                style={{ background: accent }}
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
                a little sunshine from us
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
              <FlowerLottie />
              <h1 className="font-serif text-3xl text-gray-700/30">
                Have a beautiful day, {displayName}. ☀️
              </h1>
              <p className="mt-6 text-xs text-gray-300/70">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs text-gray-300/70"
                style={{ borderColor: "rgba(255,255,255,0.4)" }}
              >
                Replay ☀️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
