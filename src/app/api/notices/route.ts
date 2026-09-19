import { NextResponse } from "next/server";
import { fallbackNotices } from "@/data/radar";
import { mapNotice, supabaseRequest } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await supabaseRequest<Parameters<typeof mapNotice>[0][]>(
      "alert_notices?select=*&is_active=eq.true&source=neq.sample&order=apply_end.asc.nullslast&limit=300",
    );
    return NextResponse.json({ notices: rows.length ? rows.map(mapNotice) : fallbackNotices, source: rows.length ? "supabase" : "demo" });
  } catch {
    return NextResponse.json({ notices: fallbackNotices, source: "demo" });
  }
}
