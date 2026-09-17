import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWishBySlug } from "@/lib/wishes";
import { MothersDayTemplate } from "@/components/templates/MothersDayTemplate";
import { WishEventTracker } from "@/components/shared/WishEventTracker";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "mothers-day") return { title: "Surprise not found — WiszMe" };
  return {
    title: "A Mother's Day Surprise Was Made For You 🌷",
    description: "Someone made something special for you.",
    openGraph: {
      title: "A Mother's Day Surprise Was Made For You 🌷",
      description: "Someone made something special for you.",
      images: wish.mainPhotoUrl ? [wish.mainPhotoUrl] : undefined,
    },
  };
}

export default async function MothersDayPage({ params }: PageProps) {
  const { slug } = await params;
  const wish = await getWishBySlug(slug);
  if (!wish || wish.category !== "mothers-day") notFound();

  return (
    <>
      <WishEventTracker wishId={wish.id} />
      <MothersDayTemplate wish={wish} />
    </>
  );
}
