"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * The hero's visual centerpiece, powered by a Lottie animation instead of
 * hand-drawn SVG. Same role as HeroCake in BirthzMe — the first thing the
 * eye lands on.
 */
export function RingLottie() {
  return (
    <div className="relative mb-10 flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <DotLottieReact
        src="https://lottie.host/f6a785b4-c26d-4be2-98ce-dba0b2de9d7d/ntdghAOrXL.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

//https://lottie.host/363d1bce-b16b-4f6b-beb5-058931a7d06e/hYZaR2LeTC.lottie
//https://lottie.host/f6a785b4-c26d-4be2-98ce-dba0b2de9d7d/ntdghAOrXL.lottie
//https://lottie.host/bd2b4859-fe3d-4e57-b811-4b6f91858f79/r03m45El0D.lottie
