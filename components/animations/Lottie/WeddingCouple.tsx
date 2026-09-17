"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function WeddingCoupleLottie() {
  return (
    <div className="relative mb-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      <DotLottieReact
        src="https://lottie.host/f70f24f0-e5b1-45a7-90be-20abdf1d6b59/K8cy3B1fg6.lottie"
        //loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
