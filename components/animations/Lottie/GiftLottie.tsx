"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function GiftLottie() {
  return (
    <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      <DotLottieReact
        src="https://lottie.host/a7635446-b5fd-4c9e-8dd5-40342331cc2c/xQ9se9wd5M.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
