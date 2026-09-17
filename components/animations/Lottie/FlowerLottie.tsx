"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function FlowerLottie() {
  return (
    <div className="relative mb-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      <DotLottieReact
        src="https://lottie.host/8f61f864-8edc-4570-88c7-33685667eff6/rhh8f6Pgee.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
