import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { readRows } from "@/lib/google-sheets";

function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const events = await readRows("events", "A:Z");
    const columns = ["id", "created_at", "session_id", "notice_id", "type", "meta"];
    const csv = "\uFEFF" + [columns.join(","), ...events.map((row) => columns.map((key) => csvCell(row[key] || "")).join(","))].join("\r\n");
    return new NextResponse(csv, { headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bizfit-events.csv"',
      "Cache-Control": "no-store",
    } });
  } catch {
    return NextResponse.json({ error: "export failed" }, { status: 503 });
  }
}
