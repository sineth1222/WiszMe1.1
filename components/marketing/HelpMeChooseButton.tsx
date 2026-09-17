"use client";

import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface HelpMeChooseButtonProps {
  onClick: () => void;
}

/**
 * A floating chat-widget-style button, fixed to the bottom-right corner
 * of the viewport (like a support chat bubble) instead of sitting
 * inline in the page flow. The whole button is clickable — the Lottie
 * animation and label live inside it, not wrapping it, since some
 * Lottie players swallow click events on their internal canvas/svg.
 */
export function HelpMeChooseButton({ onClick }: HelpMeChooseButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Not sure what to create? Help Me Choose"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full py-2 pl-2 pr-2 shadow-2xl transition hover:scale-105"
      style={{
        background: "rgba(255,255,255,0.2)",
        //border: "1px solid rgba(185,140,255,0.4)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {/* pulsing glow ring behind the robot to draw the eye */}
      <span
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
        //style={{ background: "rgba(185,140,255,0.12)" }}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={
            {
              //background: "radial-gradient(circle, #B98CFF55, transparent 70%)",
            }
          }
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <span className="relative h-12 w-12">
          <DotLottieReact
            // PASTE YOUR ROBOT ANIMATION'S lottie.host URL HERE —
            // go to lottiefiles.com, search "robot", open one you like,
            // click "Use" / "Embed", and copy the .lottie share URL
            // (looks like: https://lottie.host/xxxxxxxx/yyyyyyyy.lottie)
            //src="https://lottie.host/d42f07f9-6cb4-4f0f-bd85-5188cfac62e4/jdAzARuvZH.lottie"
            src="https://lottie.host/b95be4fb-48ac-4ca4-b847-386695d25e78/Q7MKgRD92F.lottie"
            loop
            autoplay
          />
        </span>
      </span>

      {/*<span
        className="text-left text-xs font-medium leading-tight"
        style={{ color: "#CFC8E8" }}
      >
        Not sure what
        <br />
        to create? ✨
      </span>*/}
    </motion.button>
  );
}

//https://lottie.host/41c3dcec-4d4b-4424-a434-2de69a5dcd09/ZfeaZU0bBa.lottie  display robot animation
