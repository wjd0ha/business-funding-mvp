import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { parseList, readRows, updateRow } from "@/lib/google-sheets";

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const [leadRows, notices, events, notifications] = await Promise.all([
      readRows("leads"), readRows("notices"), readRows("events"), readRows("notifications"),
    ]);
    return NextResponse.json({
      leads: leadRows.slice(-200).reverse().map((row) => ({
        ...row, interests: parseList(row.interests), consent_marketing: row.consent_marketing === "true",
      })),
      noticeCount: notices.filter((row) => row.is_active !== "false").length,
      eventCount: events.length,
      queueCount: notifications.filter((row) => row.status === "draft").length,
    });
  } catch {
    return NextResponse.json({ error: "시트를 읽지 못했습니다." }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status } = await request.json();
  if (typeof id !== "string" || !["active","reviewing","contacted","closed","unsubscribed"].includes(status)) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const rows = await readRows("leads");
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  await updateRow("leads", index + 2, { ...rows[index], status });
  return NextResponse.json({ ok: true });
}
