import { NextRequest, NextResponse } from "next/server";
import { appendRow, hasSheetsConfig, readRows } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  if (!hasSheetsConfig()) return NextResponse.json({ error: "프리뷰 저장소가 아직 연결되지 않았습니다." }, { status: 503 });
  try {
    const { leadId, noticeId, sessionId } = await request.json();
    if (![leadId, noticeId, sessionId].every((value) => typeof value === "string" && value.length < 150)) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }
    const [leads, notices, saved] = await Promise.all([readRows("leads"), readRows("notices"), readRows("saved")]);
    if (!leads.some((row) => row.id === leadId && row.session_id === sessionId && row.status === "active") ||
        !notices.some((row) => row.id === noticeId)) {
      return NextResponse.json({ error: "등록 정보 또는 공고를 확인해주세요." }, { status: 403 });
    }
    if (!saved.some((row) => row.lead_id === leadId && row.notice_id === noticeId)) {
      await appendRow("saved", { id: crypto.randomUUID(), created_at: new Date().toISOString(), lead_id: leadId, notice_id: noticeId, session_id: sessionId });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
