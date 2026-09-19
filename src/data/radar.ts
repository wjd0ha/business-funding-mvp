import type { BusinessStatus, Notice } from "@/lib/radar-types";

export const regions = [
  "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종",
  "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export const businessStatuses: Array<{ value: BusinessStatus; label: string; detail: string }> = [
  { value: "pre", label: "예비창업", detail: "사업자등록 전이거나 창업을 준비 중이에요" },
  { value: "biz", label: "사업자 운영 중", detail: "현재 사업자등록 후 사업을 운영 중이에요" },
  { value: "re", label: "재창업 준비", detail: "폐업 경험이 있고 다시 시작을 준비 중이에요" },
];

export const industries = [
  ["food", "음식·식품"], ["retail", "도소매"], ["service", "서비스"],
  ["mfg", "제조"], ["education", "교육"], ["content", "콘텐츠"],
  ["it", "IT·플랫폼"], ["agri", "농식품"], ["etc", "기타"],
] as const;

export const interests = [
  "사업화", "정책자금", "판로·마케팅", "AI·디지털", "인건비·고용",
  "시설·장비", "교육·컨설팅", "수출", "R&D", "잘 모르겠음",
];

export const fallbackNotices: Notice[] = [
  {
    id: "demo-01", source: "demo", title: "소상공인 온라인 판로지원", org: "소상공인시장진흥공단",
    category: "판로·마케팅", alsoCategories: [], regions: ["전국"], targetStatus: ["biz"],
    industries: ["all"], noticeType: "confirmed", applyEnd: "2026-10-08",
    supportSummary: "입점·방송 제작비 일부 지원", summary: "온라인 기획전 입점과 라이브커머스 제작을 지원합니다.",
    url: "https://www.bizinfo.go.kr/",
  },
  {
    id: "demo-02", source: "demo", title: "경기도 소상공인 디지털 전환 지원", org: "경기도경제과학진흥원",
    category: "AI·디지털", alsoCategories: [], regions: ["경기"], targetStatus: ["biz"],
    industries: ["food", "retail", "service", "etc"], noticeType: "confirmed", applyEnd: "2026-10-02",
    supportSummary: "스마트 기기·온라인 주문 시스템 도입비 일부", summary: "매장 디지털 전환과 온라인 주문 시스템 도입을 지원합니다.",
    url: "https://www.bizinfo.go.kr/",
  },
  {
    id: "demo-03", source: "demo", title: "예비창업패키지", org: "창업진흥원",
    category: "사업화", alsoCategories: [], regions: ["전국"], targetStatus: ["pre"],
    industries: ["all"], noticeType: "expected", expectedWindow: "통상 연초 공고",
    summary: "사업계획서와 고객 검증 근거를 미리 준비해 두세요.", url: "https://www.k-startup.go.kr/",
  },
];
