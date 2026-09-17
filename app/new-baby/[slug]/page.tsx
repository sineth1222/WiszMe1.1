import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { NewBabyTemplate } from "@/components/templates/NewBabyTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "new-baby") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A New Baby Surprise Was Made For You 👶",
    description: "Someone made something special for you.",
    openGraph: { title: "A New Baby Surprise Was Made For You 👶", description: "Someone made something special for you.", images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined },
  };
}

export default async function NewBabyPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "new-baby") notFound();
  return (<><WishEventTracker wishId={wish.id} /><NewBabyTemplate wish={wish} /></>);
}
