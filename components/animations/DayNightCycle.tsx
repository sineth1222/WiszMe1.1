"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Cloud {
  y: number;
  scale: number;
  duration: number;
  delay: number;
}

interface DayNightCycleProps {
  /** Fires whenever the cycle crosses into or out of the night phase,
   * so the page around it can fade its text colors to match. */
  onPhaseChange?: (isNight: boolean) => void;
}

// Five distinct phases — dawn is only the transition INTO sunrise, so it
// isn't repeated at the end; the cycle loops straight from night back to
// phase 0 for a seamless repeat instead of a visible "reset" jump.
const PHASES = [
  {
    sky: "radial-gradient(ellipse at 50% 0%, #2E2A55 0%, #4A3B6B 55%, #6B5480 100%)",
    bodyHeight: 0,
    isNight: true,
    isDay: false,
    durationMs: 3000,
  },
  {
    sky: "radial-gradient(ellipse at 50% 0%, #FF9E7A 0%, #FFC978 45%, #FDE9C8 100%)",
    bodyHeight: 0.35,
    isNight: false,
    isDay: true,
    durationMs: 3600,
  },
  {
    sky: "radial-gradient(ellipse at 50% -10%, #7EC8FF 0%, #A8DBFF 50%, #E8F5FF 100%)",
    bodyHeight: 0.9,
    isNight: false,
    isDay: true,
    durationMs: 5000,
  },
  {
    sky: "radial-gradient(ellipse at 50% 0%, #FF7E5F 0%, #C9548A 45%, #4A3B6B 100%)",
    bodyHeight: 0.35,
    isNight: false,
    isDay: true,
    durationMs: 3600,
  },
  {
    sky: "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)",
    bodyHeight: 0,
    isNight: true,
    isDay: false,
    durationMs: 5000,
  },
];

export function DayNightCycle({ onPhaseChange }: DayNightCycleProps) {
  const [stars, setStars] = useState<Star[] | null>(null);
  const [clouds, setClouds] = useState<Cloud[] | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 55,
        size: 1 + Math.random() * 1.5,
        delay: Math.random() * 3,
      })),
    );
    setClouds(
      Array.from({ length: 3 }, () => ({
        y: 12 + Math.random() * 25,
        scale: 0.7 + Math.random() * 0.6,
        duration: 26 + Math.random() * 14,
        delay: Math.random() * 10,
      })),
    );
  }, []);

  // Step through phases with a self-scheduling timer — each phase's
  // duration comes from its own entry, so day segments (which need
  // slower, calmer light) can run longer than the quick dawn/dusk
  // transitions without needing a fixed-ratio timeline.
  useEffect(() => {
    const phase = PHASES[phaseIndex];
    const t = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, phase.durationMs);
    return () => clearTimeout(t);
  }, [phaseIndex]);

  useEffect(() => {
    onPhaseChange?.(PHASES[phaseIndex].isNight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];
  const nextDurationSeconds = phase.durationMs / 1000;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ background: phase.sky }}
        transition={{ duration: nextDurationSeconds, ease: "linear" }}
      />

      {/* drifting clouds — only visible during the day phases, fading
          in/out as the sky crosses in and out of daylight */}
      {clouds?.map((c, i) => (
        <motion.div
          key={i}
          className="absolute h-10 w-28 rounded-full bg-white/70 blur-sm"
          style={{ top: `${c.y}%`, scale: c.scale }}
          initial={{ x: "-20vw" }}
          animate={{ x: "120vw", opacity: phase.isDay ? 0.8 : 0 }}
          transition={{
            x: {
              duration: c.duration,
              repeat: Infinity,
              ease: "linear",
              delay: c.delay,
            },
            opacity: { duration: 1.5 },
          }}
        />
      ))}

      {/* stars fade in only during the night phases */}
      {stars?.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: phase.isNight ? 0.9 : 0 }}
          transition={{ duration: 1.5, delay: i * 0.02 }}
        />
      ))}

      {/* sun/moon arcing across the sky */}
      <motion.div
        className="absolute left-1/2 h-16 w-16 -translate-x-1/2 rounded-full"
        initial={{ top: "0%", opacity: 1 }}
        animate={{
          top: `${phase.bodyHeight * 55}%`,
          background: phase.isNight
            ? "radial-gradient(circle,#F0DDA8,#CBB784)"
            : "radial-gradient(circle,#FFE7A0,#FFB868)",
          boxShadow: phase.isNight
            ? "0 0 40px 12px rgba(240,221,168,0.4)"
            : "0 0 50px 16px rgba(255,184,104,0.5)",
        }}
        transition={{ duration: nextDurationSeconds, ease: "easeInOut" }}
      />
    </div>
  );
}

/*"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
}

const CYCLE_SECONDS = 58;

// Sky color keyframes across one full cycle: dawn -> day -> sunset -> night -> dawn
const SKY_STOPS = [
  "radial-gradient(ellipse at 50% 0%, #2E2A55 0%, #4A3B6B 55%, #6B5480 100%)", // pre-dawn
  "radial-gradient(ellipse at 50% 0%, #FF9E7A 0%, #FFC978 45%, #FDE9C8 100%)", // sunrise
  "radial-gradient(ellipse at 50% -10%, #7EC8FF 0%, #A8DBFF 50%, #E8F5FF 100%)", // midday
  "radial-gradient(ellipse at 50% 0%, #FF7E5F 0%, #C9548A 45%, #4A3B6B 100%)", // sunset
  "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)", // night
  "radial-gradient(ellipse at 50% 0%, #2E2A55 0%, #4A3B6B 55%, #6B5480 100%)", // back to pre-dawn
];

// Sun/moon vertical position (0 = below horizon, 1 = peak) matching the sky stops above
const BODY_HEIGHT = [0, 0.35, 0.9, 0.35, 0, 0];
const IS_NIGHT = [false, false, false, false, true, false];

export function DayNightCycle() {
  const [stars, setStars] = useState<Star[] | null>(null);

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 55,
        size: 1 + Math.random() * 1.5,
        delay: Math.random() * 3,
      })),
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ background: SKY_STOPS }}
        transition={{
          duration: CYCLE_SECONDS,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.15, 0.4, 0.6, 0.85, 1],
        }}
      />

      {/* stars fade in only during the night portion of the cycle /}
      {stars?.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0, 0, 0, 0.9, 0] }}
          transition={{
            duration: CYCLE_SECONDS,
            repeat: Infinity,
            delay: s.delay * 0.05,
            times: [0, 0.6, 0.75, 0.9, 1],
            ease: "easeInOut",
          }}
        />
      ))}

      {/* sun/moon arcing across the sky /}
      <motion.div
        className="absolute left-1/2 h-16 w-16 -translate-x-1/2 rounded-full"
        animate={{
          bottom: BODY_HEIGHT.map((h) => `${h * 55}%`),
          background: IS_NIGHT.map((n) =>
            n
              ? "radial-gradient(circle,#F0DDA8,#CBB784)"
              : "radial-gradient(circle,#FFE7A0,#FFB868)",
          ),
          boxShadow: IS_NIGHT.map((n) =>
            n
              ? "0 0 40px 12px rgba(240,221,168,0.4)"
              : "0 0 50px 16px rgba(255,184,104,0.5)",
          ),
        }}
        transition={{
          duration: CYCLE_SECONDS,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.15, 0.4, 0.6, 0.85, 1],
        }}
      />
    </div>
  );
}*/
