"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WiszTemplateProps } from "@/types/wisz";
import { DiyaLight } from "@/components/animations/DiyaLight";
import { LetterReveal } from "@/components/animations/LetterReveal";
import { TypewriterMessage } from "@/components/animations/TypewriterMessage";
import { MemorySlideshow } from "@/components/animations/MemorySlideshow";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/animations/MusicPlayer";
import { Watermark } from "@/components/shared/Watermark";
import { SceneErrorBoundary } from "@/components/shared/SceneErrorBoundary";
import { RathinnaLottie } from "../animations/Lottie/RathinnaLottie";
import { PahanaLottie } from "../animations/Lottie/PahanaLottie";
import { Fireworks } from "../animations/Fireworks";
import { MorphingLEDText } from "../animations/MorphingLEDText";
import { DiwalihandLottie } from "../animations/Lottie/DiwalihandLottie";
import { DiwaliFoodLottie } from "../animations/Lottie/DiwaliFoodLottie";
import { HappyDiwaliLottie } from "../animations/Lottie/HappyDiwaliLottie";

const GOLD = "#F0C674";
const CREAM = "#FDF3E3";

type Scene = "intro" | "diyas" | "greeting" | "message" | "memories" | "final";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
  className:
    "absolute inset-0 flex flex-col items-center justify-center px-6 text-center",
};

export function DiwaliTemplate({ wish, onEvent }: WiszTemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const musicRef = useRef<MusicPlayerHandle>(null);
  const advance = (next: Scene) => setScene(next);
  const displayName = wish.recipientNickname?.trim() || wish.recipientName;
  const accent = wish.accentColor || GOLD;
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
          "radial-gradient(ellipse at 50% -10%, #3A1B4D 0%, #241130 55%, #120818 100%)",
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

      <Fireworks
        trigger={burst}
        colors={["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#f368e0"]}
        rocketCount={5}
        //intense={scene === "final"}
      />
      <SceneErrorBoundary onSkip={() => setScene("final")} accentColor={accent}>
        <AnimatePresence>
          {scene === "intro" && (
            <motion.div key="intro" {...fade}>
              <PahanaLottie />
              <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-70">
                a festival of light
              </p>
              <p className="max-w-xs text-lg leading-relaxed">
                Hey {displayName}...
                <br />
                someone lit these for you.
              </p>
              <button
                onClick={() => {
                  advance("diyas");
                  onEvent?.("opened");
                  musicRef.current?.play();
                }}
                className="mt-8 rounded-full px-8 py-4 text-sm font-medium"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #B8863A)`,
                  color: "#120818",
                }}
              >
                Light the Diyas 🪔
              </button>
            </motion.div>
          )}
          {scene === "diyas" && (
            <motion.div key="diyas" {...fade}>
              <p className="mb-6 text-xs uppercase tracking-[0.3em] opacity-70">
                tap each lamp to light it
              </p>
              <DiyaLight
                accentColor={accent}
                onAllLit={() => {
                  onEvent?.("interaction");
                  advance("greeting");
                }}
              />
            </motion.div>
          )}
          {scene === "greeting" && (
            <motion.div key="greeting" {...fade}>
              <DiwalihandLottie />
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-60">
                <MorphingLEDText
                  text="Happy Diwali!"
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
              <p className="mb-2 text-xs uppercase tracking-[0.3em] opacity-70">
                "Sending you warm wishes on Diwali. May the diyas light your way
                to happiness and success."
              </p>

              <LetterReveal
                text={displayName}
                className="font-serif text-4xl"
              />
              <button
                onClick={() => advance("message")}
                className="mt-8 rounded-full px-6 py-2.5 text-sm font-medium"
                style={{ background: accent, color: "#120818" }}
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
                  background: "rgba(255,255,255,0.06)",
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
                style={{ background: accent, color: "#120818" }}
              >
                Continue
              </button>
            </motion.div>
          )}
          {scene === "memories" && wish.memories.length > 0 && (
            <motion.div key="memories" {...fade}>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] opacity-70">
                a few bright memories
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
              {/*<HappyDiwaliLottie />*/}
              <DiwaliFoodLottie />
              <h1 className="font-serif text-3xl" style={{ color: accent }}>
                Happy Diwali, {displayName}. 🪔
              </h1>
              <p className="mt-6 text-xs opacity-60">
                Made specially for you by {wish.senderName}
              </p>
              <button
                onClick={() => setScene("intro")}
                className="mt-7 rounded-full border px-6 py-2.5 text-xs"
                style={{ borderColor: `${accent}55`, color: accent }}
              >
                Replay 🪔
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </SceneErrorBoundary>
    </div>
  );
}
