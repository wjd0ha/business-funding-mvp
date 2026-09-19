import type { MatchResult, Notice, RadarProfile } from "@/lib/radar-types";
import { interestMatchesCategories } from "@/data/radar";

function businessYears(openDate: string | null) {
  if (!openDate) return null;
  const opened = new Date(`${openDate}T00:00:00`);
  if (Number.isNaN(opened.getTime())) return null;
  return Math.max(0, (Date.now() - opened.getTime()) / 31_556_952_000);
}

function daysUntil(date?: string | null) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const end = new Date(`${date}T23:59:59+09:00`).getTime();
  if (Number.isNaN(end)) return null;
  return Math.ceil((end - Date.now()) / 86_400_000);
}

export function matchNotices(profile: RadarProfile, notices: Notice[]): MatchResult[] {
  const years = businessYears(profile.openDate);

  return notices
    .filter((notice) => profile.businessStatus && notice.targetStatus.includes(profile.businessStatus))
    .filter((notice) => profile.region === "전국" || notice.regions.includes("전국") || notice.regions.includes(profile.region))
    .filter((notice) => notice.industries.includes("all") || notice.industries.includes(profile.industry))
    .filter((notice) => {
      if (years === null) return true;
      if (notice.minYears != null && years < notice.minYears) return false;
      if (notice.maxYears != null && years > notice.maxYears) return false;
      return true;
    })
    .filter((notice) => notice.noticeType === "expected" || daysUntil(notice.applyEnd) == null || daysUntil(notice.applyEnd)! >= 0)
    .map((notice) => {
      let score = 40;
      const reasons: string[] = [];
      const noticeCategories = [notice.category, ...notice.alsoCategories];
      const interestHit = interestMatchesCategories(profile.interests, noticeCategories);

      if (interestHit) {
        score += 25;
        reasons.push(`관심 분야 일치 · ${notice.category}`);
      }
      if (profile.region === "전국" && !notice.regions.includes("전국")) {
        reasons.push("지역 자격 확인 필요");
      } else if (!notice.regions.includes("전국")) {
        score += 15;
        reasons.push(`지역 일치 · ${profile.region}`);
      } else {
        score += 8;
        reasons.push("전국 대상");
      }
      if (!notice.industries.includes("all")) {
        score += 12;
        reasons.push("업종 조건 일치");
      }
      if (years !== null && (notice.minYears != null || notice.maxYears != null)) {
        score += 8;
        reasons.push("업력 조건 일치");
      }
      if (notice.noticeType === "expected") reasons.push("예상 공고 · 일정 재확인 필요");
      if (reasons.length < 2) reasons.push("기본 자격 조건 일치");

      score = Math.min(98, score);
      const needsCheck = Boolean(notice.checkNote) || (years === null && profile.businessStatus === "biz" && notice.maxYears != null);
      return { ...notice, score, fit: (score >= 65 && !needsCheck ? "high" : "check") as MatchResult["fit"], reasons, dday: daysUntil(notice.applyEnd) };
    })
    .sort((a, b) => b.score - a.score || (a.dday ?? 9999) - (b.dday ?? 9999));
}
