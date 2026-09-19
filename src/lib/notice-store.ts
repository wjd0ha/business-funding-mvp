import { parseList, readRows } from "@/lib/google-sheets";
import type { Notice } from "@/lib/radar-types";

export async function readRadarNotices(): Promise<Notice[]> {
  const rows = (await readRows("notices")).filter((row) => row.is_active !== "false" && row.source !== "sample");
  return rows.map((row) => ({
    id: row.id, source: row.source, sourceId: row.source_id || null,
    title: row.title, org: row.org || null, category: row.category || "사업화",
    alsoCategories: parseList(row.also_categories), regions: parseList(row.regions),
    targetStatus: parseList(row.target_status) as Notice["targetStatus"],
    minYears: row.min_years ? Number(row.min_years) : null,
    maxYears: row.max_years ? Number(row.max_years) : null,
    industries: parseList(row.industries),
    noticeType: row.notice_type === "expected" ? "expected" : "confirmed",
    applyStart: row.apply_start || null, applyEnd: row.apply_end || null,
    expectedWindow: row.expected_window || null, supportSummary: row.support_summary || null,
    summary: row.summary || null, url: row.url || null, checkNote: row.check_note || null,
  }));
}
