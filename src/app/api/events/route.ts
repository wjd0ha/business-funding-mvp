import { NextRequest, NextResponse } from "next/server";
import { appendRow, hasSheetsConfig } from "@/lib/google-sheets";

const allowedTypes = new Set(["notice_view", "notice_click", "notice_save", "alert_signup", "search"]);
export async function POST(request: NextRequest) {
  if (!hasSheetsConfig()) return NextResponse.json({ ok: false }, { status: 202 });
  try {
    const body = await request.json();
    const type = String(body.type || "");
    if (!allowedTypes.has(type)) return NextResponse.json({ ok: false }, { status: 400 });
    await appendRow("events", {
      id: crypto.randomUUID(), created_at: new Date().toISOString(),
      session_id: String(body.sessionId || "").slice(0, 100),
      notice_id: String(body.noticeId || "").slice(0, 100),
      type,
      meta: typeof body.meta === "object" && body.meta ? body.meta : {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
