import { NextRequest, NextResponse } from "next/server";
import { appendRow, hasSheetsConfig } from "@/lib/google-sheets";

const allowedTypes = new Set(["page_view", "survey_start", "survey_step", "result_view", "notice_view", "notice_click", "notice_save", "alert_signup", "search", "filter_change", "feedback_open"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const pages = new Set(["home", "prep-map"]);

export async function POST(request: NextRequest) {
  if (!hasSheetsConfig()) return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  try {
    const body = await request.json();
    const type = String(body.type || "");
    const sessionId = String(body.sessionId || "");
    if (!allowedTypes.has(type) || !uuid.test(sessionId)) return NextResponse.json({ error: "invalid event" }, { status: 400 });
    const supplied = body.meta && typeof body.meta === "object" && !Array.isArray(body.meta) ? body.meta : {};
    const meta: Record<string, string | number | boolean> = {};
    if (pages.has(supplied.page)) meta.page = supplied.page;
    if (type === "survey_step" && Number.isInteger(supplied.step) && supplied.step >= 1 && supplied.step <= 3) meta.step = supplied.step;
    if (type === "result_view" && Number.isInteger(supplied.count) && supplied.count >= 0) meta.count = supplied.count;
    if (type === "search") {
      meta.has_query = supplied.has_query === true;
      if (Number.isInteger(supplied.result_count) && supplied.result_count >= 0) meta.result_count = supplied.result_count;
    }
    if (type === "filter_change" && typeof supplied.area === "string") meta.area = supplied.area.slice(0, 30);
    await appendRow("events", {
      id: crypto.randomUUID(), created_at: new Date().toISOString(), session_id: sessionId,
      notice_id: String(body.noticeId || "").slice(0, 100), type, meta,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "event storage failed" }, { status: 503 });
  }
}
