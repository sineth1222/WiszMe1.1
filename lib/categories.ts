export type ProductId = "birthzme" | "uzme" | "datezme" | "feztme" | "wiszme";

export interface CategoryConfig {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  group: "celebrate" | "love" | "invitations" | "holidays" | "everyday";
  product: ProductId;
  /** External products: the real live site the "Create" CTA opens.
   * WiszMe-native categories (good-morning, good-night) leave this
   * undefined and route internally instead. */
  externalUrl?: string;
  /** Which teaser animation component to show in the preview card —
   * keyed by name rather than importing components directly here, so
   * this file stays framework-agnostic data. */
  teaser:
    | "birthday"
    | "romantic"
    | "date"
    | "holiday"
    | "sunrise"
    | "moon"
    | "flower"
    | "medal"
    | "rings"
    | "diya";
  /** Shown in the finder as a disabled "Coming Soon" card — announces
   * scope without pretending it's buildable yet. */
  comingSoon?: boolean;
}

/*export const PRODUCTS: Record<ProductId, { name: string; tagline: string; accent: string }> = {
  birthzme: { name: "BirthzMe", tagline: "Birthday experiences", accent: "#F0C674" },
  uzme: { name: "UzMe", tagline: "Romantic experiences", accent: "#FF7EB6" },
  datezme: { name: "DatezMe", tagline: "Date invitations", accent: "#B98CFF" },
  feztme: { name: "FeztMe", tagline: "Holiday experiences", accent: "#6FC8FF" },
  wiszme: { name: "WiszMe", tagline: "Everyday moments", accent: "#B98CFF" },
};*/
export const PRODUCTS: Record<
  ProductId,
  { name: string; tagline: string; accent: string; logoUrl?: string }
> = {
  birthzme: {
    name: "BirthzMe",
    tagline: "Birthday experiences",
    accent: "#F0C674",
    logoUrl: "/logos/birthzme.png",
  },
  uzme: {
    name: "UzMe",
    tagline: "Romantic experiences",
    accent: "#FF7EB6",
    logoUrl: "/logos/uzme.png",
  },
  datezme: {
    name: "DatezMe",
    tagline: "Date invitations",
    accent: "#B98CFF",
    logoUrl: "/logos/datezme.png",
  },
  feztme: {
    name: "FeztMe",
    tagline: "Holiday experiences",
    accent: "#6FC8FF",
    logoUrl: "/logos/feztme.png",
  },
  wiszme: { name: "WizhMe", tagline: "Everyday moments", accent: "#B98CFF" },
};

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "birthday",
    name: "Birthday",
    emoji: "🎂",
    description:
      "Create an unforgettable birthday surprise with photos, messages and interactive scenes.",
    group: "celebrate",
    product: "birthzme",
    externalUrl: "https://birthzme.vercel.app/",
    teaser: "birthday",
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    emoji: "❤️",
    description:
      "Turn your relationship memories into an interactive romantic experience.",
    group: "love",
    product: "uzme",
    externalUrl: "https://uzme.vercel.app/",
    teaser: "romantic",
  },
  {
    slug: "valentine",
    name: "Valentine",
    emoji: "💘",
    description: "Say it in a way they'll never forget.",
    group: "love",
    product: "uzme",
    externalUrl: "https://uzme.vercel.app/",
    teaser: "romantic",
  },
  {
    slug: "special-date",
    name: "Special Date",
    emoji: "🌹",
    description: "Turn one unforgettable memory into a beautiful surprise.",
    group: "love",
    product: "uzme",
    externalUrl: "https://uzme.vercel.app/",
    teaser: "romantic",
  },
  {
    slug: "just-because",
    name: "Just Because",
    emoji: "💕",
    description: "Sometimes love doesn't need a reason.",
    group: "love",
    product: "uzme",
    externalUrl: "https://uzme.vercel.app/",
    teaser: "romantic",
  },
  {
    slug: "date-invitation",
    name: "Date Invitation",
    emoji: "💌",
    description: "Create a playful interactive invitation for your next date.",
    group: "invitations",
    product: "datezme",
    externalUrl: "https://datez-me.vercel.app/",
    teaser: "date",
  },
  {
    slug: "new-year",
    name: "New Year",
    emoji: "🎆",
    description: "Cinematic New Year wishes with countdowns and fireworks.",
    group: "holidays",
    product: "feztme",
    externalUrl: "https://fezt-me.vercel.app/",
    teaser: "holiday",
  },
  {
    slug: "christmas",
    name: "Christmas",
    emoji: "🎄",
    description: "Magical Christmas wishes with gifts, snow and memories.",
    group: "holidays",
    product: "feztme",
    externalUrl: "https://fezt-me.vercel.app/",
    teaser: "holiday",
  },
  {
    slug: "good-morning",
    name: "Good Morning",
    emoji: "☀️",
    description:
      "Start someone's day with a beautiful interactive morning surprise.",
    group: "everyday",
    product: "wiszme",
    teaser: "sunrise",
  },
  {
    slug: "good-night",
    name: "Good Night",
    emoji: "🌙",
    description:
      "Send them into the night with a personalized digital surprise.",
    group: "everyday",
    product: "wiszme",
    teaser: "moon",
  },
  {
    slug: "mothers-day",
    name: "Mother's Day",
    emoji: "🌷",
    description:
      "Tap open a bouquet, one flower at a time, each holding a little thank you.",
    group: "celebrate",
    product: "wiszme",
    teaser: "flower",
  },
  {
    slug: "fathers-day",
    name: "Father's Day",
    emoji: "🏅",
    description:
      "Award them the appreciation they deserve, wrapped in a small ceremony.",
    group: "celebrate",
    product: "wiszme",
    teaser: "medal",
  },
  {
    slug: "wedding",
    name: "Wedding",
    emoji: "💍",
    description: "Celebrate the two of them starting their forever.",
    group: "celebrate",
    product: "wiszme",
    teaser: "rings",
  },
  {
    slug: "new-baby",
    name: "New Baby",
    emoji: "👶",
    description: "Welcome the newest member of the family.",
    group: "celebrate",
    product: "wiszme",
    teaser: "flower",
  },
  {
    slug: "get-well-soon",
    name: "Get Well Soon",
    emoji: "🩹",
    description: "A little encouragement while they recover.",
    group: "everyday",
    product: "wiszme",
    teaser: "flower",
  },
  {
    slug: "good-luck",
    name: "Good Luck",
    emoji: "🍀",
    description: "Cheer them on before the big moment.",
    group: "everyday",
    product: "wiszme",
    teaser: "medal",
  },
  {
    slug: "housewarming",
    name: "Housewarming",
    emoji: "🏡",
    description: "Welcome them to their new home.",
    group: "celebrate",
    product: "wiszme",
    teaser: "sunrise",
  },
  {
    slug: "diwali",
    name: "Diwali",
    emoji: "🪔",
    description: "Light up their festival with a personal wish.",
    group: "holidays",
    product: "wiszme",
    teaser: "diya",
  },
  {
    slug: "sinhala-tamil-new-year",
    name: "Sinhala & Tamil New Year",
    emoji: "🌾",
    description: "A festive wish for the traditional new year.",
    group: "holidays",
    product: "wiszme",
    teaser: "diya",
  },
];

export function getCategory(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isNative(category: CategoryConfig): boolean {
  return category.product === "wiszme";
}

export const GROUP_LABELS: Record<
  CategoryConfig["group"],
  { name: string; emoji: string }
> = {
  celebrate: { name: "Celebrate", emoji: "🎉" },
  love: { name: "Love", emoji: "❤️" },
  invitations: { name: "Invitations", emoji: "💌" },
  holidays: { name: "Holidays", emoji: "🎆" },
  everyday: { name: "Everyday", emoji: "☀️" },
};
