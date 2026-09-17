import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { HousewarmingTemplate } from "@/components/templates/HousewarmingTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "housewarming") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Housewarming Surprise Was Made For You 🏡",
    description: "Someone made something special for you.",
    openGraph: { title: "A Housewarming Surprise Was Made For You 🏡", description: "Someone made something special for you.", images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined },
  };
}

export default async function HousewarmingPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "housewarming") notFound();
  return (<><WishEventTracker wishId={wish.id} /><HousewarmingTemplate wish={wish} /></>);
}
