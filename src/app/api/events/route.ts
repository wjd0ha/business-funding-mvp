import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await supabaseRequest("alert_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        session_id: String(body.sessionId || "").slice(0, 100) || null,
        lead_id: body.leadId || null,
        notice_id: String(body.noticeId || "").slice(0, 64) || null,
        type: String(body.type || "unknown").slice(0, 40),
        meta: typeof body.meta === "object" && body.meta ? body.meta : {},
      }),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
