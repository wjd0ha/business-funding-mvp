import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { hasNaverEmailConfig, verifyNaverEmail } from "@/lib/naver-email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasNaverEmailConfig()) {
    return NextResponse.json({ configured: false, verified: false }, { status: 503 });
  }
  try {
    await verifyNaverEmail();
    return NextResponse.json({ configured: true, verified: true, sent: false });
  } catch {
    return NextResponse.json({ configured: true, verified: false, sent: false }, { status: 503 });
  }
}
