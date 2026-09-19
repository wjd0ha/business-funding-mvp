export type BusinessStatus = "pre" | "biz" | "re";

export type RadarProfile = {
  businessStatus: BusinessStatus | "";
  region: string;
  industry: string;
  openDate: string | null;
  employeesBand: string;
  interests: string[];
};

export type Notice = {
  id: string;
  source: string;
  sourceId?: string | null;
  title: string;
  org?: string | null;
  category: string;
  alsoCategories: string[];
  regions: string[];
  targetStatus: BusinessStatus[];
  minYears?: number | null;
  maxYears?: number | null;
  industries: string[];
  noticeType: "confirmed" | "expected";
  applyStart?: string | null;
  applyEnd?: string | null;
  expectedWindow?: string | null;
  supportSummary?: string | null;
  summary?: string | null;
  url?: string | null;
  checkNote?: string | null;
};

export type MatchResult = Notice & {
  score: number;
  fit: "high" | "check";
  reasons: string[];
  dday: number | null;
};

export type LeadPayload = RadarProfile & {
  sessionId: string;
  name?: string;
  email: string;
  phone?: string;
  consentPrivacy: boolean;
  consentService: boolean;
  consentMarketing: boolean;
  utm?: Record<string, string>;
};
