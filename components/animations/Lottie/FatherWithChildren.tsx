//MotherWithChildLottie
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function FatherWithChildrenLottie() {
  return (
    <div className="relative mb-10 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      <DotLottieReact
        src="https://lottie.host/35af4bbe-1900-4266-a0cf-637f927cf091/W76tUizLuz.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

//https://lottie.host/939a762a-07af-45c8-bc99-0578b104f534/uJF2bt3EjX.lottie  fatherwith children in circle
