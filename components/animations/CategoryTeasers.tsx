"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { CategoryConfig } from "@/lib/categories";

/** Balloon that pops on tap — BirthzMe teaser */
function BirthdayTeaser() {
  const [popped, setPopped] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setPopped((p) => !p)}>
      <motion.div
        animate={popped ? { scale: [1, 1.4, 0], opacity: [1, 1, 0] } : { y: [0, -8, 0] }}
        transition={popped ? { duration: 0.4 } : { duration: 2, repeat: Infinity }}
        className="h-16 w-14 rounded-full"
        style={{ background: "linear-gradient(160deg, #F0C674, #C9922E)" }}
      />
      {popped && (
        <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute font-serif text-sm text-white">
          🎉
        </motion.p>
      )}
    </div>
  );
}

/** Locked heart that unlocks on tap — UzMe teaser */
function RomanticTeaser() {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setUnlocked((u) => !u)}>
      <motion.svg width="52" height="46" viewBox="0 0 52 46" animate={unlocked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.5 }}>
        <path
          d="M26 46C10 34 0 24 0 14C0 5 8 0 13 3C18 5 22 10 26 16C30 10 34 5 39 3C44 0 52 5 52 14C52 24 42 34 26 46Z"
          fill={unlocked ? "#FF7EB6" : "#8A5A73"}
        />
      </motion.svg>
    </div>
  );
}

/** Yes/No question card — DatezMe teaser */
function DateTeaser() {
  const [yes, setYes] = useState(false);
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2" onClick={() => setYes((y) => !y)}>
      <p className="text-[10px] text-white/80">Go on a date?</p>
      <motion.span
        animate={yes ? { scale: [1, 1.3, 1], color: "#FF7EB6" } : {}}
        className="rounded-full px-3 py-1 text-xs font-medium text-white"
        style={{ background: yes ? "#FF7EB6" : "#B98CFF" }}
      >
        {yes ? "It's a date! ❤️" : "YES"}
      </motion.span>
    </div>
  );
}

/** Countdown + firework burst — FeztMe teaser */
function HolidayTeaser() {
  const [fired, setFired] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setFired((f) => !f)}>
      {!fired ? (
        <motion.span className="font-serif text-3xl text-white" key="count" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          3
        </motion.span>
      ) : (
        <div className="relative h-full w-full">
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
                style={{ background: "#6FC8FF" }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos(angle) * 30, y: Math.sin(angle) * 30, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Sun rising — Good Morning native teaser */
function SunriseTeaser() {
  const [risen, setRisen] = useState(false);
  return (
    <div className="relative h-full w-full overflow-hidden" onClick={() => setRisen((r) => !r)}>
      <motion.div
        className="absolute inset-0"
        animate={{ background: risen ? "linear-gradient(180deg,#FF9E7A,#FFE8B8)" : "linear-gradient(180deg,#4A3B6B,#6B5480)" }}
      />
      <motion.div
        className="absolute left-1/2 h-10 w-10 -translate-x-1/2 rounded-full"
        style={{ background: "#FFE7A0" }}
        animate={{ bottom: risen ? "30%" : "-40%" }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}

/** Moon glow + stars — Good Night native teaser */
function MoonTeaser() {
  const [glow, setGlow] = useState(false);
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#141127" }} onClick={() => setGlow((g) => !g)}>
      <motion.div
        className="absolute right-4 top-4 h-8 w-8 rounded-full"
        style={{ background: "#F0DDA8" }}
        animate={{ boxShadow: glow ? "0 0 30px 10px rgba(240,221,168,0.6)" : "0 0 6px 2px rgba(240,221,168,0.2)" }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}

/** Single flower blooming on tap — Mother's Day native teaser */
function FlowerTeaser() {
  const [bloomed, setBloomed] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setBloomed((b) => !b)}>
      <motion.svg width="34" height="34" viewBox="0 0 30 30" animate={bloomed ? { scale: [0.7, 1.15, 1] } : {}} transition={{ duration: 0.4 }}>
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="15" cy="15" rx="6" ry="10" fill={bloomed ? "#FF7EB6" : "#5C5470"} transform={`rotate(${deg} 15 15) translate(0 -6)`} />
        ))}
        <circle cx="15" cy="15" r="4" fill="#F0C674" />
      </motion.svg>
    </div>
  );
}

/** Small gift that opens into a medal — Father's Day native teaser */
function MedalTeaser() {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setOpened((o) => !o)}>
      {!opened ? (
        <motion.span className="text-2xl" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          🎁
        </motion.span>
      ) : (
        <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-2xl">
          🏅
        </motion.span>
      )}
    </div>
  );
}

/** Two rings sliding together on tap — Wedding native teaser */
function RingsTeaser() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setJoined((j) => !j)}>
      <motion.div className="relative h-8 w-14" animate={{}}>
        <motion.svg className="absolute" width="24" height="24" viewBox="0 0 24 24" animate={{ x: joined ? 8 : 0 }} transition={{ type: "spring", stiffness: 200 }}>
          <circle cx="12" cy="12" r="8" fill="none" stroke="#F0C674" strokeWidth="3" />
        </motion.svg>
        <motion.svg className="absolute" width="24" height="24" viewBox="0 0 24 24" animate={{ x: joined ? 16 : 22 }} transition={{ type: "spring", stiffness: 200 }}>
          <circle cx="12" cy="12" r="8" fill="none" stroke="#F0C674" strokeWidth="3" opacity="0.75" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

/** A single oil lamp that lights on tap — Diwali/Avurudu native teaser */
function DiyaTeaser() {
  const [lit, setLit] = useState(false);
  return (
    <div className="flex h-full w-full items-center justify-center" onClick={() => setLit((l) => !l)}>
      <div className="flex flex-col items-center">
        {lit && (
          <motion.div className="mb-1 h-4 w-2 rounded-full" style={{ background: "linear-gradient(180deg,#FFF3D6,#F0A860)" }} animate={{ scaleY: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
        )}
        <svg width="24" height="14" viewBox="0 0 26 16">
          <path d="M2 4 Q13 -2 24 4 L20 14 Q13 18 6 14 Z" fill={lit ? "#F0C674" : "#4A3B2E"} />
        </svg>
      </div>
    </div>
  );
}

const TEASER_MAP: Record<CategoryConfig["teaser"], React.ComponentType> = {
  birthday: BirthdayTeaser,
  romantic: RomanticTeaser,
  date: DateTeaser,
  holiday: HolidayTeaser,
  sunrise: SunriseTeaser,
  moon: MoonTeaser,
  flower: FlowerTeaser,
  medal: MedalTeaser,
  rings: RingsTeaser,
  diya: DiyaTeaser,
};

export function CategoryTeaser({ teaser }: { teaser: CategoryConfig["teaser"] }) {
  const Teaser = TEASER_MAP[teaser];
  return <Teaser />;
}
