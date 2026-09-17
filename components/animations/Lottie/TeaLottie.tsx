"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function TeaLottie() {
  return (
    <div className="relative mb-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      <DotLottieReact
        src="https://lottie.host/f94e25a3-cca0-4a49-97cf-7b6d9a794be0/ZHucff8Bej.lottie"
        //src="https://lottie.host/170df582-afc8-4359-adee-e611d400984a/GnMjd1oQwm.lottie" hand tea cup
        //src="/animation/tea.lottie"
        //loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
