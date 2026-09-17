//https://lottie.host/74d1ead4-40fc-4e7c-bd5a-c06c54470a02/23NWWgdB08.lottie

"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function CheerCuteLottie() {
  return (
    <div className="relative mb-5 flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <DotLottieReact
        src="https://lottie.host/74d1ead4-40fc-4e7c-bd5a-c06c54470a02/23NWWgdB08.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
