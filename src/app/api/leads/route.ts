import { NextRequest, NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/radar-types";
import { appendRow, hasSheetsConfig } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  if (!hasSheetsConfig()) return NextResponse.json({ error: "프리뷰 저장소가 아직 연결되지 않았습니다." }, { status: 503 });
  try {
    const body = (await request.json()) as LeadPayload & { website?: string };
    if (body.website) return NextResponse.json({ ok: true });
    const alertsLive = process.env.RADAR_EMAIL_ENABLED === "1";
    if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email) || !body.consentPrivacy || (alertsLive && !body.consentService) ||
        !/^[a-f0-9-]{36}$/i.test(body.sessionId || "") || !["pre","biz","re"].includes(body.businessStatus)) {
      return NextResponse.json({ error: "필수 입력과 동의를 확인해주세요." }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const row = {
      id, created_at: new Date().toISOString(), session_id: body.sessionId,
      name: (body.name || "").trim().slice(0, 80),
      email: body.email.trim().toLowerCase().slice(0, 254),
      phone: (body.phone || "").replace(/\D/g, "").slice(0, 20),
      business_status: body.businessStatus, region: String(body.region || "").slice(0, 60),
      open_date: body.openDate || "", industry: String(body.industry || "").slice(0, 80),
      employees_band: body.employeesBand || "", interests: body.interests || [],
      consent_privacy: true, consent_service: alertsLive && Boolean(body.consentService), consent_marketing: Boolean(body.consentMarketing),
      consent_version: "2026-09-19.v1", utm: body.utm || {}, status: alertsLive ? "active" : "preview",
      unsubscribe_token: crypto.randomUUID(),
    };
    await appendRow("leads", row);
    await appendRow("events", {
      id: crypto.randomUUID(), created_at: new Date().toISOString(), session_id: body.sessionId,
      lead_id: id, type: "alert_signup", meta: { source: "opportunity-radar" },
    }).catch(() => {});
    return NextResponse.json({ leadId: id });
  } catch {
    return NextResponse.json({ error: "등록 중 오류가 발생했습니다." }, { status: 500 });
  }
}
