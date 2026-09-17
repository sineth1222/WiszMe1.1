import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { buildUniqueSlug } from "@/lib/slug";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();

  const category = body.category as string;
  const template = body.template as string;
  const recipientName = String(body.recipientName ?? "").trim();
  const senderName = String(body.senderName ?? "").trim();
  const mainMessage = String(body.mainMessage ?? "").trim();

  const VALID_CATEGORIES = [
    "good-morning", "good-night", "mothers-day", "fathers-day",
    "wedding", "new-baby", "get-well-soon", "good-luck",
    "housewarming", "diwali", "sinhala-tamil-new-year",
  ];
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!recipientName || recipientName.length > 60) {
    return NextResponse.json({ error: "Recipient's name is required (max 60 chars)." }, { status: 400 });
  }
  if (!senderName || senderName.length > 60) {
    return NextResponse.json({ error: "Your name is required (max 60 chars)." }, { status: 400 });
  }
  if (!mainMessage || mainMessage.length > 3000) {
    return NextResponse.json({ error: "A message is required (max 3000 chars)." }, { status: 400 });
  }

  const slug = await buildUniqueSlug(recipientName, async (candidate) => {
    const { data } = await supabase.from("wisz_wishes").select("id").eq("slug", candidate).maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from("wisz_wishes")
    .insert({
      creator_id: user.id,
      slug,
      category,
      template,
      recipient_name: recipientName,
      recipient_nickname: body.recipientNickname || null,
      sender_name: senderName,
      main_message: mainMessage,
      main_photo_url: body.mainPhotoUrl || null,
      memories: body.memories ?? [],
      music_url: body.musicUrl || null,
      music_type: body.musicType || null,
      accent_color: body.accentColor || null,
      has_watermark: true,
      status: "published",
    })
    .select("id, slug, category")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not create the wish." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, slug: data.slug, category: data.category });
}
