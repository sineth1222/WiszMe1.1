import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { GoodMorningTemplate } from "@/components/templates/GoodMorningTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "good-morning") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Good Morning Surprise Was Made For You ☀️",
    description: "Someone made something special for you.",
    openGraph: {
      title: "A Good Morning Surprise Was Made For You ☀️",
      description: "Someone made something special for you.",
      images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined,
    },
  };
}

export default async function GoodMorningPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "good-morning") notFound();

  return (
    <>
      <WishEventTracker wishId={wish.id} />
      <GoodMorningTemplate wish={wish} />
    </>
  );
}
