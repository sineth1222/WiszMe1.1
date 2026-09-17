"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { PRODUCTS, type ProductId } from "@/lib/categories";
import { PRODUCT_PREVIEWS } from "@/lib/productPreviews";

interface ProductPreviewModalProps {
  productId: ProductId;
  onClose: () => void;
}

export function ProductPreviewModal({
  productId,
  onClose,
}: ProductPreviewModalProps) {
  const product = PRODUCTS[productId];
  const demos = PRODUCT_PREVIEWS[productId];
  const [selected, setSelected] = useState(demos[0] ?? null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl border"
        style={{ borderColor: `${product.accent}44`, background: "#141127" }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "rgba(185,140,255,0.15)" }}
        >
          <p
            className="font-serif text-lg font-semibold"
            style={{ color: product.accent }}
          >
            {product.name} — Preview
          </p>
          <button onClick={onClose} aria-label="Close">
            <X size={18} color="#CFC8E8" />
          </button>
        </div>

        {demos.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <p className="text-sm" style={{ color: "#CFC8E8", opacity: 0.75 }}>
              No demo link is set up for {product.name} yet.
            </p>
            <a
              href={`https://${productId}.vercel.app/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-medium"
              style={{ background: product.accent, color: "#0B0A14" }}
            >
              Visit {product.name} <ExternalLink size={12} />
            </a>
          </div>
        ) : (
          <>
            {/* which category's demo to view — only shown when a product has more than one */}
            {demos.length > 1 && (
              <div
                className="flex gap-2 px-5 py-3"
                style={{ borderBottom: "1px solid rgba(185,140,255,0.1)" }}
              >
                {demos.map((d) => (
                  <button
                    key={d.url}
                    onClick={() => setSelected(d)}
                    className="rounded-full border px-3 py-1.5 text-xs font-medium"
                    style={{
                      borderColor:
                        selected?.url === d.url
                          ? product.accent
                          : "rgba(185,140,255,0.25)",
                      color:
                        selected?.url === d.url ? product.accent : "#CFC8E8",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}

            <div
              className="relative flex-1 overflow-hidden bg-black"
              style={{ minHeight: 420 }}
            >
              {selected && (
                <iframe
                  key={selected.url}
                  src={selected.url}
                  className="h-full w-full"
                  style={{ minHeight: 420, border: "none" }}
                  title={`${product.name} preview`}
                />
              )}
            </div>

            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: "1px solid rgba(185,140,255,0.1)" }}
            >
              <p
                className="text-[11px]"
                style={{ color: "#CFC8E8", opacity: 0.5 }}
              >
                Live preview from {product.name}
              </p>
              {selected && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: product.accent }}
                >
                  Open Full Preview <ExternalLink size={12} />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
