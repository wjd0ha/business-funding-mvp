import { NextRequest, NextResponse } from "next/server";
import { profileFromAnswers, scoreNotice, type Answers } from "@/lib/radar";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function supabaseHeaders() {
  return {
    apikey: supabaseKey ?? "",
    Authorization: `Bearer ${supabaseKey ?? ""}`,
    "Content-Type": "application/json",
  };
}

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "레이더 연결 환경변수가 설정되지 않았습니다." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const answers = (body.answers ?? {}) as Answers;
    const profile = profileFromAnswers(answers, body.region || "전국");

    if (body.action === "lead") {
      const lead = body.lead ?? {};
      if (!lead.email || !lead.region || !lead.industry || !lead.consentPrivacy || !lead.consentService) {
        return NextResponse.json({ error: "이메일, 지역, 업종과 필수 동의가 필요합니다." }, { status: 400 });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/alert_leads`, {
        method: "POST",
        headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({
          email: lead.email,
          name: lead.name || null,
          phone: lead.phone || null,
          business_status: profile.businessStatus,
          region: lead.region,
          industry: lead.industry,
          interests: ["government_funding", "policy_fund"],
          consent_privacy: true,
          consent_service: true,
          consent_marketing: Boolean(lead.consentMarketing),
          consent_version: "2026-09-19",
          utm: { source: "bizfit-radar-preview" },
        }),
      });

      if (!response.ok) {
        return NextResponse.json({ error: "신청 정보를 저장하지 못했습니다." }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/alert_notices?select=id,title,org,category,regions,target_status,industries,apply_end,expected_window,support_summary,summary,url,notice_type&is_active=eq.true&order=apply_end.asc.nullslast&limit=120`,
      { headers: supabaseHeaders(), next: { revalidate: 300 } },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "공고를 불러오지 못했습니다." }, { status: 502 });
    }

    const notices = (await response.json()) as Parameters<typeof scoreNotice>[0][];
    const matches = notices
      .map((notice) => scoreNotice(notice, profile))
      .filter((notice): notice is NonNullable<typeof notice> => Boolean(notice))
      .sort((a, b) => b.score - a.score || (a.apply_end ?? "9999").localeCompare(b.apply_end ?? "9999"))
      .slice(0, 8);

    return NextResponse.json({ profile, matches });
  } catch (error) {
    console.error("Radar API error", error);
    return NextResponse.json({ error: "레이더 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
