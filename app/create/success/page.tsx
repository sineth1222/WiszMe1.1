import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ShareButtons } from "@/components/shared/ShareButtons";

interface SuccessPageProps {
  searchParams: Promise<{ slug?: string; category?: string }>;
}

export default async function CreateSuccessPage({ searchParams }: SuccessPageProps) {
  const { slug, category } = await searchParams;
  if (!slug || !category) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: wish } = await supabase.from("wisz_wishes").select("recipient_name, creator_id").eq("slug", slug).single();

  if (!wish || !user || wish.creator_id !== user.id) notFound();

  const link = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + `/${category}/${slug}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center" style={{ background: "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)" }}>
      <h1 className="font-serif text-3xl" style={{ color: "#CFC8E8" }}>Your Wish Is Ready ✨</h1>
      <p className="mt-2 mb-8 text-sm" style={{ color: "#CFC8E8", opacity: 0.8 }}>
        For {wish.recipient_name} — share this link whenever you&apos;re ready.
      </p>
      <ShareButtons link={link} recipientName={wish.recipient_name} />
      <div className="mt-10 flex gap-4 text-xs">
        <Link href={`/${category}/${slug}`} style={{ color: "#B98CFF" }}>Open Preview</Link>
        <Link href="/dashboard" style={{ color: "#CFC8E8" }}>Go to Dashboard</Link>
      </div>
    </main>
  );
}
