import { NextRequest, NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/radar-types";
import { supabaseRequest } from "@/lib/supabase-rest";

function cleanPhone(value?: string) {
  return value ? value.replace(/\D/g, "") : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadPayload;
    if (!body.email || !body.consentPrivacy || !body.consentService) {
      return NextResponse.json({ error: "필수 입력과 동의를 확인해주세요." }, { status: 400 });
    }

    const row = {
      id: crypto.randomUUID(),
      session_id: body.sessionId,
      name: body.name?.trim() || null,
      email: body.email.trim().toLowerCase(),
      phone: cleanPhone(body.phone),
      business_status: body.businessStatus,
      region: body.region,
      open_date: body.openDate || null,
      industry: body.industry,
      employees_band: body.employeesBand || null,
      interests: body.interests,
      consent_privacy: true,
      consent_service: true,
      consent_marketing: Boolean(body.consentMarketing),
      consent_version: "2026-09-19.v1",
      utm: body.utm ?? {},
    };

    await supabaseRequest<void>("alert_leads", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(row),
    });

    await Promise.allSettled([
      supabaseRequest("rpc/alert_match_lead", { method: "POST", body: JSON.stringify({ p_lead_id: row.id, p_session_id: body.sessionId }) }),
      supabaseRequest("alert_events", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ session_id: body.sessionId, lead_id: row.id, type: "alert_signup", meta: { source: "opportunity-radar" } }),
      }),
    ]);

    return NextResponse.json({ leadId: row.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "등록 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
