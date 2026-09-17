"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CATEGORIES,
  GROUP_LABELS,
  PRODUCTS,
  type ProductId,
} from "@/lib/categories";
import { CategoryCard } from "@/components/marketing/CategoryCard";
import { HelpMeChoose } from "@/components/marketing/HelpMeChoose";
import { InstallAppSection } from "@/components/shared/InstallAppSection";
import { GiftBoxHero } from "@/components/marketing/GiftBoxHero";
import { DayNightCycle } from "@/components/animations/DayNightCycle";
import { FloatingAccents } from "@/components/animations/FloatingAccents";
import { ProductShowcaseReel } from "@/components/marketing/ProductShowcaseReel";
import { BalloonField } from "../animations/BalloonField";
import { Fireworks } from "../animations/Fireworks";
import { CloudLottie } from "../animations/Lottie/CloudLottie";
import { ProductPreviewModal } from "./ProductPreviewModal";
import { HelpMeChooseButton } from "./HelpMeChooseButton";

const STEPS = [
  {
    title: "Choose",
    desc: "Pick what you want to create — birthday, romance, holiday, or an everyday moment.",
  },
  {
    title: "Personalize",
    desc: "Add their name, your message, photos and music.",
  },
  {
    title: "Preview",
    desc: "See a real animated preview before you send anything.",
  },
  { title: "Share", desc: "One private link — nothing for them to install." },
];

const PARTNER_IDS: ProductId[] = ["birthzme", "uzme", "datezme", "feztme"];

export default function LandingPage() {
  const groups = Array.from(new Set(CATEGORIES.map((c) => c.group)));
  const [helpOpen, setHelpOpen] = useState(false);
  const [isNight, setIsNight] = useState(true);
  const [burst, setBurst] = useState(0);
  const [previewProduct, setPreviewProduct] = useState<ProductId | null>(null);

  // Continuous ambient fireworks on the landing page hero — fires
  // immediately on load, then keeps launching a fresh volley every few
  // seconds, permanently (no scene/condition gating it, unlike the
  // recipient templates).
  useEffect(() => {
    setBurst((b) => b + 1);

    const interval = setInterval(() => {
      setBurst((b) => b + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{ fontFamily: "var(--font-outfit, sans-serif)", color: "#CFC8E8" }}
    >
      {/* HERO /}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ background: "#0B0A14" }}
      >
        <DayNightCycle />
        <FloatingAccents />
        <div className="relative z-10 flex flex-col items-center">
          {/*<GiftBoxHero />/}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: "#B98CFF", color: "#B98CFF" }}
          >
            One place. Every special moment.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl"
          >
            Make Something They&apos;ll Never Forget. ✨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-lg text-sm leading-relaxed"
            style={{ color: "#CFC8E8", opacity: 0.8 }}
          >
            Create beautiful interactive wishes, invitations and surprises — all
            from one place. Choose an occasion below and WiszMe guides you to
            the right experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <a
              href="#finder"
              className="rounded-full px-7 py-3.5 text-sm font-semibold shadow-lg transition hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
                color: "#0B0A14",
              }}
            >
              Create Something ✨
            </a>
            <a
              href="#products"
              className="rounded-full border px-7 py-3.5 text-sm transition hover:scale-105"
              style={{ borderColor: "rgba(185,140,255,0.3)", color: "#CFC8E8" }}
            >
              Explore Experiences
            </a>
          </motion.div>

          {/*<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 w-full"
          >
            <ProductShowcaseReel />
          </motion.div>/}
        </div>
      </section>*/}

      {/* HERO */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ background: "#0B0A14" }}
      >
        <DayNightCycle onPhaseChange={setIsNight} />
        <FloatingAccents />
        <BalloonField colors={["#B8265A", "#E3B583", "#F6DDE0"]} count={2} />
        <Fireworks
          trigger={burst}
          colors={["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#f368e0"]}
          //intense={scene === "final"}
        />
        <div className="relative z-10 flex flex-col items-center">
          {/*<GiftBoxHero />*/}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <CloudLottie />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block font-script rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{
              borderColor: isNight ? "#B98CFF" : "#7C4DFF",
              color: isNight ? "#B98CFF" : "#5B2FC9",
              transition: "border-color 1.2s ease, color 1.2s ease",
            }}
          >
            One place. Every special moment.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-4xl font-extrabold leading-tight text-wine sm:text-5xl"
            style={{
              color: isNight ? "#F5F2FF" : "#2A1F3D",
              transition: "color 1.2s ease",
            }}
          >
            WizhMe.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-scriptnew text-2xl md:text-3xl"
            style={{
              color: isNight ? "#F5F2FF" : "#2A1F3D",
              transition: "color 1.2s ease",
            }}
          >
            Make Something They&apos;ll Never Forget.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 max-w-lg font-scriptnew text-sm leading-relaxed"
            style={{
              color: isNight ? "#CFC8E8" : "#3A2E4D",
              opacity: 0.85,
              transition: "color 1.2s ease",
            }}
          >
            Create beautiful interactive wishes, invitations and surprises — all
            from one place. Choose an occasion below and WiszMe guides you to
            the right experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-9 mb-10 flex flex-wrap justify-center gap-3"
          >
            <a
              href="#finder"
              className="rounded-full font-display px-7 py-3.5 text-sm font-semibold shadow-lg transition hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
                color: "#0B0A14",
              }}
            >
              Create Something ✨
            </a>

            <a
              href="#products"
              className="rounded-full font-display  border px-7 py-3.5 text-sm transition hover:scale-105"
              style={{
                borderColor: isNight
                  ? "rgba(185,140,255,0.3)"
                  : "rgba(91,47,201,0.35)",
                color: isNight ? "#CFC8E8" : "#3A2E4D",
                transition: "border-color 1.2s ease, color 1.2s ease",
              }}
            >
              Explore Experiences
            </a>
          </motion.div>

          {/*<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-12 w-full"
    >
      <ProductShowcaseReel />
    </motion.div>*/}
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section
        id="products"
        className="px-6 py-20"
        style={{ background: "#141127" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#B98CFF" }}
          >
            Our experiences
          </p>
          <h2 className="mb-10 font-serif text-3xl">
            Four products. One place to find them.
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_IDS.map((id, i) => {
              const p = PRODUCTS[id];
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setPreviewProduct(id)}
                  //className="rounded-2xl border p-6"
                  //className="cursor-pointer rounded-2xl border p-6 text-left"
                  className="relative overflow-hidden rounded-2xl border p-6"
                  style={{
                    borderColor: `${p.accent}33`,
                    background: `${p.accent}0d`,
                  }}
                >
                  {p.logoUrl && (
                    <div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.15] blur-[0.5px]"
                      style={{
                        backgroundImage: `url(${p.logoUrl})`,
                        backgroundSize: "70%",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  )}
                  <p
                    className="font-serif text-xl font-semibold"
                    style={{ color: p.accent }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "#CFC8E8", opacity: 0.7 }}
                  >
                    {p.tagline}
                  </p>

                  <p
                    className="mt-3 text-[10px] font-medium font-script uppercase tracking-wide"
                    style={{ color: p.accent, opacity: 0.8 }}
                  >
                    Tap to preview
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {previewProduct && (
        <ProductPreviewModal
          productId={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-center font-serif text-3xl">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-2xl border p-5"
              style={{ borderColor: "rgba(185,140,255,0.15)" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-sm"
                style={{
                  background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
                  color: "#0B0A14",
                }}
              >
                {i + 1}
              </div>
              <div>
                <p className="font-medium">{s.title}</p>
                <p
                  className="mt-1 text-sm font-scriptnew"
                  style={{ color: "#CFC8E8", opacity: 0.75 }}
                >
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORY FINDER */}
      <section
        id="finder"
        className="px-6 py-20"
        style={{ background: "#141127" }}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-serif text-3xl">
            What do you want to create?
          </h2>
          <p
            className="mb-10 text-center font-scriptnew text-sm"
            style={{ color: "#CFC8E8", opacity: 0.7 }}
          >
            Tap a category — WizhMe shows you a quick preview, then takes you to
            the right place to create it.
          </p>
          <div className="mb-10 flex justify-center">
            {/*<button
              onClick={() => setHelpOpen(true)}
              className="rounded-full border px-6 py-2.5 text-sm font-medium"
              style={{
                borderColor: "rgba(185,140,255,0.35)",
                color: "#B98CFF",
              }}
            >
              Not sure what to create? Help Me Choose ✨
            </button>/}
            <HelpMeChooseButton onClick={() => setHelpOpen(true)} />*/}
            <HelpMeChooseButton onClick={() => setHelpOpen(true)} />
          </div>
          {helpOpen && <HelpMeChoose onClose={() => setHelpOpen(false)} />}
          {groups.map((group) => {
            const label = GROUP_LABELS[group];
            const items = CATEGORIES.filter((c) => c.group === group);
            return (
              <div key={group} className="mb-10">
                <p
                  className="mb-3 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#B98CFF" }}
                >
                  {label.emoji} {label.name}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <CategoryCard key={c.slug} category={c} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INSTALL */}
      <section className="px-6 pb-6" style={{ background: "#141127" }}>
        <InstallAppSection />
      </section>

      {/* FINAL CTA */}
      <section
        className="flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #241B3D 0%, #141127 60%, #0B0A14 100%)",
        }}
      >
        <h2 className="font-serif text-3xl">
          Whatever you want to say, WiszMe helps you say it.
        </h2>
        <a
          href="#finder"
          className="mt-7 rounded-full px-8 py-4 text-sm font-semibold shadow-lg transition hover:scale-105"
          style={{
            background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
            color: "#0B0A14",
          }}
        >
          Create Something ✨
        </a>
        <Link
          href="/dashboard"
          className="mt-5 text-xs opacity-30"
          style={{ color: "#CFC8E8" }}
        >
          Already have wishes? Go to your dashboard
        </Link>
      </section>

      <footer
        className="px-4 py-10 text-center text-xs"
        style={{ background: "#0B0A14", color: "rgba(207,200,232,0.5)" }}
      >
        WiszMe · One place. Every special moment. ❤️
        <br />
        <span className="mt-1 inline-block">
          {PARTNER_IDS.map((id) => PRODUCTS[id].name).join(" · ")}
        </span>
      </footer>
    </main>
  );
}
