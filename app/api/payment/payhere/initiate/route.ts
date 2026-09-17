import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { generatePayHereHash } from "@/lib/payhere";

// Fixed price for removing the watermark — change to whatever you charge.
const WATERMARK_REMOVAL_PRICE = 300; // LKR
const CURRENCY = "LKR";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { wishId } = await req.json();
  if (!wishId) {
    return NextResponse.json({ error: "Missing wishId" }, { status: 400 });
  }

  const { data: wish, error } = await supabase
    .from("wisz_wishes")
    .select("id, slug, category, creator_id")
    .eq("id", wishId)
    .eq("creator_id", user.id)
    .single();

  if (error || !wish) {
    return NextResponse.json({ error: "Wish not found" }, { status: 404 });
  }

  const orderId = `wm-${wish.id}-${Date.now()}`;
  const hash = generatePayHereHash({ orderId, amount: WATERMARK_REMOVAL_PRICE, currency: CURRENCY });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return NextResponse.json({
    merchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
    orderId,
    amount: WATERMARK_REMOVAL_PRICE,
    currency: CURRENCY,
    hash,
    returnUrl: `${siteUrl}/create/success?slug=${wish.slug}&category=${wish.category}`,
    cancelUrl: `${siteUrl}/create/success?slug=${wish.slug}&category=${wish.category}`,
    notifyUrl: `${siteUrl}/api/payment/payhere/notify`,
  });
}
