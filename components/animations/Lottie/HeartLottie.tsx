//https://lottie.host/be0a0d87-cfa5-4077-ac49-477159aa3219/L3P9BM0k7n.lottie
//https://lottie.host/82ec5271-3593-442d-967f-2b04f5fffa7e/NuiCyMyYJC.lottie

"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function HeartLottie() {
  return (
    <div className="relative mb-10 flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <DotLottieReact
        src="https://lottie.host/be0a0d87-cfa5-4077-ac49-477159aa3219/L3P9BM0k7n.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
