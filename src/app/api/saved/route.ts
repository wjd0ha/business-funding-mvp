import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function POST(request: NextRequest) {
  try {
    const { leadId, noticeId, sessionId } = await request.json();
    if (!leadId || !noticeId) return NextResponse.json({ error: "알림 등록 후 저장할 수 있습니다." }, { status: 400 });
    await supabaseRequest("rpc/alert_save_notice", {
      method: "POST",
      body: JSON.stringify({ p_lead_id: leadId, p_notice_id: noticeId, p_session_id: sessionId }),
    });
    await Promise.allSettled([
      supabaseRequest("alert_events", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ session_id: sessionId || null, lead_id: leadId, notice_id: noticeId, type: "notice_save" }),
      }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "저장 실패" }, { status: 500 });
  }
}
