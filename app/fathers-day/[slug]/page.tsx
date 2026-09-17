import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { FathersDayTemplate } from "@/components/templates/FathersDayTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "fathers-day") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Father's Day Surprise Was Made For You 🏅",
    description: "Someone made something special for you.",
    openGraph: {
      title: "A Father's Day Surprise Was Made For You 🏅",
      description: "Someone made something special for you.",
      images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined,
    },
  };
}

export default async function FathersDayPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "fathers-day") notFound();

  return (
    <>
      <WishEventTracker wishId={wish.id} />
      <FathersDayTemplate wish={wish} />
    </>
  );
}
