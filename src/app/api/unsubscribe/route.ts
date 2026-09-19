import { NextRequest, NextResponse } from "next/server";
import { readRows, updateRow } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (typeof token !== "string" || !/^[a-f0-9-]{36}$/i.test(token)) return NextResponse.json({ error: "invalid token" }, { status: 400 });
    const rows = await readRows("leads");
    const index = rows.findIndex((row) => row.unsubscribe_token === token);
    if (index < 0) return NextResponse.json({ error: "invalid token" }, { status: 404 });
    await updateRow("leads", index + 2, { ...rows[index], status: "unsubscribed" });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unsubscribe failed" }, { status: 500 });
  }
}
