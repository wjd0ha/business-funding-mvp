import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { hasNaverEmailConfig, verifyNaverEmail } from "@/lib/naver-email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasNaverEmailConfig()) {
    return NextResponse.json({ configured: false, verified: false }, { status: 503 });
  }
  try {
    await verifyNaverEmail();
    return NextResponse.json({ configured: true, verified: true, sent: false });
  } catch (error) {
    const smtpError = error as { code?: string; responseCode?: number };
    const reason =
      smtpError.code === "EAUTH" || smtpError.responseCode === 535 || smtpError.responseCode === 534
        ? "authentication"
        : ["ECONNECTION", "ETIMEDOUT", "ESOCKET", "EDNS"].includes(smtpError.code ?? "")
          ? "connection"
          : "unknown";
    return NextResponse.json({ configured: true, verified: false, sent: false, reason }, { status: 503 });
  }
}
