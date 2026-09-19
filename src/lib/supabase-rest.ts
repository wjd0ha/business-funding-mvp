import type { Notice } from "@/lib/radar-types";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseKey);
}

export async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<T> {
  if (!hasSupabaseConfig()) throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken || supabaseKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase ${response.status}: ${message}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

type NoticeRow = {
  id: string;
  source: string;
  source_id: string | null;
  title: string;
  org: string | null;
  category: string;
  also_categories: string[];
  regions: string[];
  target_status: Notice["targetStatus"];
  min_years: number | null;
  max_years: number | null;
  industries: string[];
  notice_type: Notice["noticeType"];
  apply_start: string | null;
  apply_end: string | null;
  expected_window: string | null;
  support_summary: string | null;
  summary: string | null;
  url: string | null;
  check_note: string | null;
};

export function mapNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    source: row.source,
    sourceId: row.source_id,
    title: row.title,
    org: row.org,
    category: row.category,
    alsoCategories: row.also_categories ?? [],
    regions: row.regions ?? ["전국"],
    targetStatus: row.target_status ?? [],
    minYears: row.min_years,
    maxYears: row.max_years,
    industries: row.industries ?? ["all"],
    noticeType: row.notice_type,
    applyStart: row.apply_start,
    applyEnd: row.apply_end,
    expectedWindow: row.expected_window,
    supportSummary: row.support_summary,
    summary: row.summary,
    url: row.url,
    checkNote: row.check_note,
  };
}
