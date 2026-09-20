import { NextRequest, NextResponse } from "next/server";
import { isAdmin, isVercelPreviewAdmin } from "@/lib/admin-auth";
import { parseList, readRows, updateRow } from "@/lib/google-sheets";

function parseMeta(value: string) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch { return {} as Record<string, unknown>; }
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const [leadRows, notices, events, notifications] = await Promise.all([
      readRows("leads"), readRows("notices"), readRows("events", "A:Z"), readRows("notifications"),
    ]);
    const recent = events.filter((row) => Date.parse(row.created_at) >= Date.now() - 7 * 86400_000);
    const eventTypes = ["page_view", "survey_start", "result_view", "notice_click", "notice_save", "search", "feedback_open", "feedback_submit"];
    const activity = Object.fromEntries(eventTypes.map((type) => [type, recent.filter((row) => row.type === type).length]));
    const feedbacks = events.filter((row) => row.type === "feedback_submit").slice(-100).reverse().map((row) => {
      const meta = parseMeta(row.meta);
      return {
        id: row.id, created_at: row.created_at,
        category: String(meta.category || "기타"), page: String(meta.page || ""),
        message: String(meta.message || ""),
      };
    });
    return NextResponse.json({
      authMode: isVercelPreviewAdmin() ? "vercel-preview" : "password",
      leads: leadRows.slice(-200).reverse().map((row) => ({
        ...row, interests: parseList(row.interests), consent_marketing: row.consent_marketing === "true",
      })),
      noticeCount: notices.filter((row) => row.is_active !== "false").length,
      eventCount: events.length,
      uniqueSessions7d: new Set(recent.map((row) => row.session_id).filter(Boolean)).size,
      activity,
      feedbacks,
      recentActivity: events.filter((row) => row.type !== "feedback_submit").slice(-50).reverse().map((row) => ({
        id: row.id, created_at: row.created_at, type: row.type, page: String(parseMeta(row.meta).page || ""),
      })),
      queueCount: notifications.filter((row) => row.status === "draft").length,
    });
  } catch {
    return NextResponse.json({ error: "시트를 읽지 못했습니다." }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status } = await request.json();
  if (typeof id !== "string" || !["preview","active","reviewing","contacted","closed","unsubscribed"].includes(status)) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const rows = await readRows("leads");
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  await updateRow("leads", index + 2, { ...rows[index], status });
  return NextResponse.json({ ok: true });
}
