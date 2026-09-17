"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink } from "lucide-react";
import { CATEGORIES, GROUP_LABELS, isNative, PRODUCTS } from "@/lib/categories";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#finder", label: "Explore" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/dashboard", label: "My Wishes" },
];

export function Navbar() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const groups = Array.from(new Set(CATEGORIES.map((c) => c.group)));

  // Recipient-facing public experiences are meant to be immersive, with
  // no site chrome — the same principle as every other product in this
  // ecosystem (BirthzMe/UsMe/DatezMe/FeztMe never show creator UI on the
  // public link).
  const isImmersiveRoute =
    pathname?.startsWith("/good-morning/") ||
    pathname?.startsWith("/good-night/") ||
    pathname?.startsWith("/good-luck/") ||
    pathname?.startsWith("/diwali/") ||
    pathname?.startsWith("/fathers-day/") ||
    pathname?.startsWith("/housewarming/") ||
    pathname?.startsWith("/get-well-soon/") ||
    pathname?.startsWith("/mothers-day/") ||
    pathname?.startsWith("/sinhala-tamil-new-year/") ||
    pathname?.startsWith("/wedding/") ||
    pathname?.startsWith("/new-baby/");
  if (isImmersiveRoute) return null;

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        borderColor: "rgba(185,140,255,0.15)",
        background: "rgba(11,10,20,0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="font-serif text-lg font-bold"
          style={{ color: "#CFC8E8" }}
        >
          Wizh<span className="text-wisz-gold">Me .</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <button
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
            className="relative py-2"
            style={{ color: "#CFC8E8" }}
          >
            <span className="flex items-center gap-1">Create</span>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 rounded-2xl border p-6 text-left shadow-2xl"
                  style={{
                    borderColor: "rgba(185,140,255,0.2)",
                    background: "#141127",
                  }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    {groups.map((group) => {
                      const label = GROUP_LABELS[group];
                      const items = CATEGORIES.filter((c) => c.group === group);
                      return (
                        <div key={group}>
                          <p
                            className="mb-2 text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "#B98CFF" }}
                          >
                            {label.emoji} {label.name}
                          </p>
                          <ul className="flex flex-col gap-1.5">
                            {items.map((c) => (
                              <li key={c.slug}>
                                <Link
                                  href={`/create/${c.slug}`}
                                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition hover:bg-white/5"
                                  style={{ color: "#CFC8E8" }}
                                >
                                  <span>{c.emoji}</span> {c.name}
                                  {!isNative(c) && (
                                    <ExternalLink
                                      size={10}
                                      className="opacity-50"
                                    />
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2"
              style={{ color: "#CFC8E8", opacity: 0.85 }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#finder"
            className="rounded-full px-5 py-2 text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg,#B98CFF,#FF7EB6)",
              color: "#0B0A14",
            }}
          >
            Create a Link ✨
          </a>
        </div>

        {/* mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X color="#CFC8E8" /> : <Menu color="#CFC8E8" />}
        </button>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t md:hidden"
            style={{
              borderColor: "rgba(185,140,255,0.15)",
              background: "#141127",
            }}
          >
            <div className="flex flex-col gap-1 px-5 py-4 text-sm">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-2 py-2.5"
                  style={{ color: "#CFC8E8" }}
                >
                  {l.label}
                </Link>
              ))}
              <p
                className="mt-2 px-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#B98CFF" }}
              >
                Create
              </p>
              {CATEGORIES.map((c) => {
                const product = PRODUCTS[c.product];
                return (
                  <Link
                    key={c.slug}
                    href={`/create/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs"
                    style={{ color: "#CFC8E8" }}
                  >
                    <span>{c.emoji}</span> {c.name}
                    <span
                      className="ml-auto opacity-50"
                      style={{ color: product.accent }}
                    >
                      {product.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
