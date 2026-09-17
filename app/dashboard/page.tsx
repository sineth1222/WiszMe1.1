import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { WishCard } from "@/components/dashboard/WishCard";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard");

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
  const { data: wishes } = await supabase
    .from("wisz_wishes")
    .select("id, slug, category, recipient_name, status, created_at")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="relative min-h-screen px-4 py-10" style={{ background: "radial-gradient(ellipse at 50% -10%, #241B3D 0%, #141127 55%, #0B0A14 100%)" }}>
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest" style={{ color: "#B98CFF", opacity: 0.8 }}>Dashboard</p>
            <h1 className="font-serif text-3xl font-bold" style={{ color: "#CFC8E8" }}>Hi {profile?.display_name || "there"} 👋</h1>
          </div>
          <SignOutButton />
        </div>

        <Link href="/#finder" className="mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:scale-[1.02]" style={{ background: "linear-gradient(135deg,#B98CFF,#FF7EB6)", color: "#0B0A14" }}>
          <Plus size={18} /> Create a new wish
        </Link>

        <p className="mt-6 text-xs" style={{ color: "#CFC8E8", opacity: 0.6 }}>
          This dashboard shows WiszMe-native wishes (Good Morning / Good Night). Wishes created on BirthzMe, UzMe, DatezMe or FeztMe live on those sites' own dashboards.
        </p>

        <div className="mt-6 space-y-4">
          {(!wishes || wishes.length === 0) && (
            <p className="rounded-2xl border border-dashed p-8 text-center text-sm" style={{ borderColor: "rgba(185,140,255,0.3)", color: "#CFC8E8", opacity: 0.8 }}>
              No wishes yet. Create your first one above ✨
            </p>
          )}
          {wishes?.map((w) => (
            <WishCard key={w.id} id={w.id} slug={w.slug} category={w.category} recipientName={w.recipient_name} status={w.status} createdAt={w.created_at} />
          ))}
        </div>
      </div>
    </main>
  );
}
