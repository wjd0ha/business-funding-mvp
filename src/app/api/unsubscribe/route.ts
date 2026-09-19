import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest } from "@/lib/supabase-rest";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (typeof token !== "string" || !/^[a-f0-9-]{36}$/i.test(token)) return NextResponse.json({ error: "invalid token" }, { status: 400 });
    const updated = await supabaseRequest<boolean>("rpc/alert_unsubscribe", {
      method: "POST",
      body: JSON.stringify({ p_token: token }),
    });
    if (!updated) return NextResponse.json({ error: "invalid token" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unsubscribe failed" }, { status: 500 });
  }
}
