import { createServerSupabase } from "@/lib/supabase/server";
import type { WiszWish } from "@/types/wisz";

export async function getWishBySlug(slug: string): Promise<WiszWish | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("wisz_wishes").select("*").eq("slug", slug).single();

  if (error || !data) return null;

  return {
    id: data.id,
    creatorId: data.creator_id,
    slug: data.slug,
    category: data.category,
    template: data.template,
    recipientName: data.recipient_name,
    recipientNickname: data.recipient_nickname ?? undefined,
    senderName: data.sender_name,
    mainMessage: data.main_message,
    mainPhotoUrl: data.main_photo_url,
    memories: data.memories ?? [],
    musicUrl: data.music_url,
    musicType: data.music_type,
    accentColor: data.accent_color ?? undefined,
    hasWatermark: data.has_watermark ?? true,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
