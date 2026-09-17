import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { GetWellSoonTemplate } from "@/components/templates/GetWellSoonTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "get-well-soon") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Get Well Soon Surprise Was Made For You 🌼",
    description: "Someone made something special for you.",
    openGraph: { title: "A Get Well Soon Surprise Was Made For You 🌼", description: "Someone made something special for you.", images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined },
  };
}

export default async function GetWellSoonPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "get-well-soon") notFound();
  return (<><WishEventTracker wishId={wish.id} /><GetWellSoonTemplate wish={wish} /></>);
}
