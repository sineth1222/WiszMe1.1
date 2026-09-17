import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { AvuruduTemplate } from "@/components/templates/AvuruduTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "sinhala-tamil-new-year") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A New Year Surprise Was Made For You 🌾",
    description: "Someone made something special for you.",
    openGraph: { title: "A New Year Surprise Was Made For You 🌾", description: "Someone made something special for you.", images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined },
  };
}

export default async function AvuruduPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "sinhala-tamil-new-year") notFound();
  return (<><WishEventTracker wishId={wish.id} /><AvuruduTemplate wish={wish} /></>);
}
