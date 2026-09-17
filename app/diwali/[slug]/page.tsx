import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { DiwaliTemplate } from "@/components/templates/DiwaliTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "diwali") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Diwali Surprise Was Made For You 🪔",
    description: "Someone made something special for you.",
    openGraph: { title: "A Diwali Surprise Was Made For You 🪔", description: "Someone made something special for you.", images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined },
  };
}

export default async function DiwaliPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "diwali") notFound();
  return (<><WishEventTracker wishId={wish.id} /><DiwaliTemplate wish={wish} /></>);
}
