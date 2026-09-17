"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { CategoryConfig } from "@/lib/categories";
import { PRODUCTS, isNative } from "@/lib/categories";
import { CategoryTeaser } from "@/components/animations/CategoryTeasers";

export function CategoryCard({ category }: { category: CategoryConfig }) {
  const native = isNative(category);
  const product = PRODUCTS[category.product];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border transition hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: "rgba(185,140,255,0.18)", background: "rgba(255,255,255,0.02)", opacity: category.comingSoon ? 0.6 : 1 }}
    >
      <div className="relative h-28 cursor-pointer" style={{ background: `linear-gradient(135deg, ${product.accent}22, transparent)` }}>
        <CategoryTeaser teaser={category.teaser} />
        <span className="absolute left-3 top-3 text-2xl">{category.emoji}</span>
        {category.comingSoon && (
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium" style={{ color: "#CFC8E8" }}>
            Coming Soon
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 text-left">
        <p className="font-serif text-base font-semibold" style={{ color: "#CFC8E8" }}>
          {category.name}
        </p>
        <p className="mt-0.5 text-[11px] uppercase tracking-wide" style={{ color: product.accent }}>
          Powered by {product.name}
        </p>
        <p className="mt-2 flex-1 text-xs leading-relaxed" style={{ color: "#CFC8E8", opacity: 0.7 }}>
          {category.description}
        </p>

        {category.comingSoon ? (
          <span className="mt-4 rounded-full border px-4 py-2 text-center text-xs font-medium" style={{ borderColor: "rgba(185,140,255,0.25)", color: "#CFC8E8", opacity: 0.6 }}>
            Coming Soon
          </span>
        ) : native ? (
          <Link
            href={`/create/${category.slug}`}
            className="mt-4 rounded-full px-4 py-2 text-center text-xs font-medium"
            style={{ background: `linear-gradient(135deg, ${product.accent}, #FF7EB6)`, color: "#0B0A14" }}
          >
            Create {category.name} Wish
          </Link>
        ) : (
          <a
            href={category.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-center text-xs font-medium"
            style={{ borderColor: `${product.accent}55`, color: product.accent }}
          >
            Create on {product.name} <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
