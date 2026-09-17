import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { WeddingTemplate } from "@/components/templates/WeddingTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "wedding") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Wedding Surprise Was Made For You 💍",
    description: "Someone made something special for you.",
    openGraph: { title: "A Wedding Surprise Was Made For You 💍", description: "Someone made something special for you.", images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined },
  };
}

export default async function WeddingPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "wedding") notFound();
  return (<><WishEventTracker wishId={wish.id} /><WeddingTemplate wish={wish} /></>);
}
