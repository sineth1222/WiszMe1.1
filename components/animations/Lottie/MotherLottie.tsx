"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function MotherLottie() {
  return (
    <div className="relative mb-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      <DotLottieReact
        src="https://lottie.host/81d3dc7e-e9df-48dd-b34d-29e45492bc32/ImbnakGE8l.lottie"
        //loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
