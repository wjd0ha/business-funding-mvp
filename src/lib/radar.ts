import type { Answers } from "./calculateResult";

export type RadarNotice = {
  id: string;
  title: string;
  org: string | null;
  category: string;
  regions: string[];
  target_status: string[];
  industries: string[];
  apply_end: string | null;
  expected_window: string | null;
  support_summary: string | null;
  summary: string | null;
  url: string | null;
  notice_type: "confirmed" | "expected";
};

export type RadarMatch = RadarNotice & {
  score: number;
  reasons: string[];
};

export type RadarProfile = {
  businessStatus: "pre" | "biz" | "re";
  industry: string;
  region: string;
};

export function profileFromAnswers(answers: Answers, region = "전국"): RadarProfile {
  const businessStage = answers.business_stage;
  const industryAnswer = answers.industry;

  return {
    businessStatus: businessStage === "pre" ? "pre" : businessStage === "growth" ? "re" : "biz",
    industry:
      industryAnswer === "digital_service"
        ? "digital"
        : industryAnswer === "manufacturing_facility"
          ? "manufacturing"
          : industryAnswer === "store_service"
            ? "service"
            : "all",
    region,
  };
}

function includesValue(values: string[] | null | undefined, value: string) {
  return (values ?? []).some((item) => item === value || item === "all" || item === "전국");
}

export function scoreNotice(notice: RadarNotice, profile: RadarProfile): RadarMatch | null {
  const reasons: string[] = [];
  let score = 40;

  if (includesValue(notice.target_status, profile.businessStatus)) {
    score += 25;
    reasons.push("사업 단계가 맞습니다");
  } else if (notice.target_status?.length) {
    score -= 20;
  }

  if (includesValue(notice.regions, profile.region)) {
    score += 20;
    reasons.push("지역 조건이 맞습니다");
  }

  if (includesValue(notice.industries, profile.industry)) {
    score += 15;
    reasons.push("업종 조건이 맞습니다");
  }

  if (score < 45) return null;
  return { ...notice, score: Math.min(score, 100), reasons };
}
