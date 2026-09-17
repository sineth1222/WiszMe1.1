//https://lottie.host/413c7ead-53e6-429c-907a-856f8c245425/m7N3kotV24.lottie

"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function SleepCutieLottie() {
  return (
    <div className="relative mb-10 mt-[-10] flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <DotLottieReact
        src="https://lottie.host/413c7ead-53e6-429c-907a-856f8c245425/m7N3kotV24.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
