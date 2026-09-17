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
import { WinnerLottie } from "../animations/Lottie/WinnerLottie";
import { HeartLottie } from "../animations/Lottie/HeartLottie";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { HeartBurst } from "../animations/HeartBrust";
import { CheerCuteLottie } from "../animations/Lottie/CheerCute";
import { GoodLuckLottie } from "../animations/Lottie/GoodLuckLottie";

const GREEN = "#5CE87A";
const INK = "#12261A";

const TOKENS = {
  bg: "radial-gradient(ellipse at 50% -10%, #FBDCE2 0%, #FFF7F2 55%, #FDEDE3 100%)",
  crimson: "#9E1B32",
  burgundy: "#5C0E1E",
  rose: "#C2274D",
  blush: "#FBDCE2",
  gold: "#D9A566",
  ink: "#3A2430",
};

type Scene = "intro" | "charm" | "greeting" | "message" | "memories" | "final";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
  className:
    "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
};

export function GoodLuckTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);
  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || GREEN;

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
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #EAFBEE 0%, #F6FEF8 55%, #FFFFFF 100%)",
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
      <HeartBurst
        trigger={burst}
        colors={[TOKENS.crimson, TOKENS.rose, TOKENS.gold]}
      />
      <SceneErrorBoundary onSkip={() => setScene("final")} accentColor={accent}>
        <AnimatePresence>
          {scene === "intro" && (
            <motion.div key="intro" {...fade}>
              <CheerCuteLottie />
              {/*<WinnerLottie />*/}
              <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-60">
                rooting for you
              </p>
              <p className="max-w-xs text-lg leading-relaxed">
                Hey {displayName}...
                <br />
                someone's cheering you on today.
              </p>
              <button
                onClick={() => {
                  advance("charm");
                  onEvent?.("opened");
                  musicRef.current?.play();
                }}
                className="mt-8 rounded-full px-8 py-4 text-sm font-medium"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #2FAE4E)`,
                  color: "#0E1B12",
                }}
              >
                Open It 🍀
              </button>
            </motion.div>
          )}
          {scene === "charm" && (
            <motion.div key="charm" {...fade}>
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
              {/*<HeartLottie />*/}
              <WinnerLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="Good Luck!"
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
                Wishing you endless confidence, great success, and the best of
                luck in everything you do.
              </p>
              <LetterReveal
                text={displayName}
                className="font-serif text-4xl"
              />
              <button
                onClick={() => advance("message")}
                className="mt-8 rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: accent, color: "#0E1B12" }}
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
                className="mt-6 rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: accent, color: "#0E1B12" }}
              >
                Continue
              </button>
            </motion.div>
          )}
          {scene === "memories" && wish.memories.length > 0 && (
            <motion.div key="memories" {...fade}>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] opacity-60">
                a few good memories
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
              <GoodLuckLottie />
              <h1 className="font-serif text-3xl" style={{ color: accent }}>
                You&apos;ve got this, {displayName}. 🍀
              </h1>
              <p className="mt-6 text-xs opacity-60">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                Replay 🍀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
