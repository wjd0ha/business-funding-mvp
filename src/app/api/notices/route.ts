import { NextResponse } from "next/server";
import { fallbackNotices } from "@/data/radar";
import { hasSheetsConfig } from "@/lib/google-sheets";
import { readRadarNotices } from "@/lib/notice-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSheetsConfig()) return NextResponse.json({ notices: fallbackNotices, source: "demo" });
  try {
    const notices = await readRadarNotices();
    return NextResponse.json({ notices, source: "google_sheets" });
  } catch {
    return NextResponse.json({ notices: fallbackNotices, source: "demo", warning: "live_sheet_unavailable" });
  }
}
