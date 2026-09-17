import type { ProductId } from "@/lib/categories";

export interface DemoLink {
  label: string;
  url: string;
}

/**
 * Real, working demo links per product. Add entries here as you get
 * real slugs from each product's database — never fabricate a slug,
 * since a fake one would just 404 for the visitor.
 */
export const PRODUCT_PREVIEWS: Record<ProductId, DemoLink[]> = {
  feztme: [
    {
      label: "New Year",
      url: "https://fezt-me.vercel.app/new-year/joe-gpjnvn",
    },
    {
      label: "Christmas",
      url: "https://fezt-me.vercel.app/christmas/alex-zj3r27",
    },
  ],
  birthzme: [
    {
      label: "Birthday",
      url: "https://birthzme.vercel.app/birthday/alex-28-pqgg5g",
    },
  ],
  uzme: [
    {
      label: "Anniversary",
      url: "https://uzme.vercel.app/anniversary/anni-alex-a7xwqb",
    },
    {
      label: "Special date",
      url: "https://uzme.vercel.app/special-date/spec-alexi-vcrr2n",
    },
    {
      label: "Valentine",
      url: "https://uzme.vercel.app/valentine/vale-alexi-5guyyp",
    },
    {
      label: "Just Because",
      url: "https://uzme.vercel.app/love/just-alex-m9zsvq",
    },
  ],
  datezme: [
    {
      label: "Date Invitation",
      url: "https://datez-me.vercel.app/invite/alexi-7gfbr",
    },
  ],
  wiszme: [],
};
