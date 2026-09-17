import { NextResponse } from "next/server";
import { getImageKitAuthParams } from "@/lib/imagekit";

export async function GET() {
  try {
    const auth = getImageKitAuthParams();
    return NextResponse.json(auth);
  } catch {
    return NextResponse.json({ error: "Upload is not configured" }, { status: 500 });
  }
}
