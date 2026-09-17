"use client";

interface MorphingLEDTextProps {
  text: string;
  /** The palette each letter cycles through, forever, in a loop. */
  colors?: string[];
  fontSize?: string;
  className?: string;
  /** How long one full color-cycle takes, in seconds. */
  cycleSeconds?: number;
}

const DEFAULT_COLORS = [
  "#748ffc",
  "#a78bfa",
  "#f472b6",
  "#facc15",
  "#4ade80",
  "#748ffc",
];

/**
 * Each letter continuously morphs through a color palette forever (not
 * a one-time reveal, not a per-word static assignment) — the glow and
 * text-shadow color animate together via CSS custom properties, since
 * you can't directly keyframe a computed value like textShadow's color
 * without also driving it from the same custom property. A small
 * per-letter delay offset makes the colors ripple across the sentence
 * like a wave instead of every letter changing in perfect unison.
 */
export function MorphingLEDText({
  text,
  colors = DEFAULT_COLORS,
  fontSize = "clamp(1.8rem, 5vw, 2.5rem)",
  className,
  cycleSeconds = 6,
}: MorphingLEDTextProps) {
  const letters = text.split("");
  const stops = [...colors, colors[0]]; // loop back to the start color for a seamless repeat

  return (
    <h1
      className={className}
      style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontWeight: 900,
        lineHeight: 1.1,
        marginBottom: "20px",
        display: "inline-block",
      }}
    >
      {letters.map((char, i) => (
        <span
          key={i}
          className="morph-led-letter"
          style={{
            display: "inline-block",
            fontSize,
            animationDuration: `${cycleSeconds}s`,
            animationDelay: `${i * (cycleSeconds / (letters.length * 2))}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}

      <style>{`
        .morph-led-letter {
          animation-name: morphLED;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes morphLED {
          ${stops
            .map((c, idx) => {
              const pct = (idx / (stops.length - 1)) * 100;
              return `${pct}% { color: ${c}; text-shadow: 0 0 6px ${c}, 0 0 14px ${c}, 0 0 28px ${c}99, 0 0 46px ${c}55; }`;
            })
            .join("\n")}
        }
      `}</style>
    </h1>
  );
}
