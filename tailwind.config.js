/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wisz: {
          void: "#0B0A14",
          deep: "#141127",
          plum: "#241B3D",
          glow: "#B98CFF",
          gold: "#F0C674",
          rose: "#FF7EB6",
          sky: "#6FC8FF",
          mist: "#CFC8E8",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
        scriptnew: ['"Great Vibes"', "cursive"],
        bodynew: ["Inter", "sans-serif"],
        elegant: ['"Alex Brush"', "cursive"],
      },
    },
  },
  plugins: [],
};
