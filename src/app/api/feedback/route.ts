import { NextRequest, NextResponse } from "next/server";
import { appendRow, hasSheetsConfig } from "@/lib/google-sheets";

const categories = new Set(["개선 제안", "불편·오류", "공고 제보", "기타 문의"]);
const pages = new Set(["home", "prep-map"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "invalid origin" }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 5000) return NextResponse.json({ error: "too large" }, { status: 413 });
  if (!hasSheetsConfig()) return NextResponse.json({ error: "storage unavailable" }, { status: 503 });
  try {
    const body = await request.json();
    if (body.website) return NextResponse.json({ ok: true }, { status: 201 });
    const category = String(body.category || "");
    const page = String(body.page || "");
    const sessionId = String(body.sessionId || "");
    const message = String(body.message || "").trim();
    if (!categories.has(category) || !pages.has(page) || !uuid.test(sessionId) || message.length < 10 || message.length > 1000 || body.consent !== true) {
      return NextResponse.json({ error: "invalid feedback" }, { status: 400 });
    }
    await appendRow("events", {
      id: crypto.randomUUID(), created_at: new Date().toISOString(), session_id: sessionId,
      type: "feedback_submit", meta: { category, page, message },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "feedback storage failed" }, { status: 503 });
  }
}
