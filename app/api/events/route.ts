import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

const ALLOWED_EVENTS = ["opened", "music_started", "interaction", "message_revealed", "completed"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { wishId, eventType } = body;

  if (!wishId || !ALLOWED_EVENTS.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  await supabase.from("wisz_events").insert({ wish_id: wishId, event_type: eventType });

  if (eventType === "opened") {
    await supabase.from("wisz_wishes").update({ status: "opened" }).eq("id", wishId).eq("status", "published");
  }
  if (eventType === "completed") {
    await supabase.from("wisz_wishes").update({ status: "completed" }).eq("id", wishId);
  }

  return NextResponse.json({ ok: true });
}
