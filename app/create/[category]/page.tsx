import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getCategory, isNative, PRODUCTS } from "@/lib/categories";
import { WiszWizard } from "@/components/create/WiszWizard";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CreateCategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const NATIVE_SLUGS = [
    "good-morning", "good-night", "mothers-day", "fathers-day",
    "wedding", "new-baby", "get-well-soon", "good-luck",
    "housewarming", "diwali", "sinhala-tamil-new-year",
  ] as const;
  if (category.product === "wiszme" && (NATIVE_SLUGS as readonly string[]).includes(slug)) {
    return <WiszWizard category={slug as (typeof NATIVE_SLUGS)[number]} />;
  }

  // External product category — WiszMe doesn't recreate BirthzMe/UzMe/
  // DatezMe/FeztMe's creator; it sends the user to the real one.
  const product = PRODUCTS[category.product];
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center"
      style={{ background: "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)", color: "#CFC8E8" }}
    >
      <span className="text-4xl">{category.emoji}</span>
      <h1 className="mt-4 font-serif text-2xl">{category.name}</h1>
      <p className="mt-2 text-sm" style={{ color: "#CFC8E8", opacity: 0.75 }}>
        Powered by {product.name} — {category.description}
      </p>
      <a
        href={category.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
        style={{ background: `linear-gradient(135deg, ${product.accent}, #FF7EB6)`, color: "#0B0A14" }}
      >
        Create on {product.name} <ExternalLink size={16} />
      </a>
      <Link href="/" className="mt-6 text-xs underline" style={{ color: "#CFC8E8" }}>
        ← Back to WiszMe
      </Link>
    </main>
  );
}
