import { NextRequest, NextResponse } from "next/server";
import { appendRow, parseList, readRows, updateRow } from "@/lib/google-sheets";
import { readRadarNotices } from "@/lib/notice-store";
import { matchNotices } from "@/lib/matching";
import type { Notice, RadarProfile } from "@/lib/radar-types";
import { hasNaverEmailConfig, sendNaverEmail } from "@/lib/naver-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] || char);
}
function safeUrl(value: string | null | undefined) {
  try { const url = new URL(value || ""); return ["http:", "https:"].includes(url.protocol) ? url.toString() : null; }
  catch { return null; }
}
function daysLeft(date: string | null | undefined, today: string) {
  if (!date) return null;
  return Math.round((new Date(`${date}T00:00:00+09:00`).getTime() - new Date(`${today}T00:00:00+09:00`).getTime()) / 86_400_000);
}
function message(name: string, notice: Notice, kind: string, appUrl: string, token: string) {
  const link = safeUrl(notice.url);
  const heading = kind === "new" ? "새로운 맞춤 사업기회" : "관심 공고 마감 알림";
  return `<div style="max-width:620px;margin:auto;font-family:Arial,sans-serif;color:#102040"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(name || "대표")}님, 아래 공고를 확인해 주세요.</p><h2>${escapeHtml(notice.title)}</h2><p>${escapeHtml(notice.org || "지원기관")} · ${escapeHtml(notice.applyEnd || "마감일 확인 필요")}</p><p>${escapeHtml(notice.supportSummary || "신청 자격과 일정은 최신 공고문을 확인해주세요.")}</p>${link ? `<p><a href="${escapeHtml(link)}">공고문 확인</a></p>` : ""}<p><a href="${escapeHtml(appUrl)}">비즈핏 사업기회 레이더</a></p><p style="font-size:12px;color:#667"><a href="${escapeHtml(appUrl)}/unsubscribe?token=${encodeURIComponent(token)}">알림 수신 해지</a></p></div>`;
}

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET || "";
  if (secret.length < 24 || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
    const [leads, saved, notifications, notices] = await Promise.all([
      readRows("leads"), readRows("saved"), readRows("notifications"), readRadarNotices(),
    ]);
    const noticeById = new Map(notices.map((notice) => [notice.id, notice]));
    const notificationKey = (row: Record<string, string>) => `${row.lead_id}|${row.notice_id}|${row.kind}`;
    // SMTP has no provider-side idempotency key. Ambiguous failures need manual review.
    const sentKeys = new Set(notifications.filter((row) => ["sent", "sending", "failed"].includes(row.status)).map(notificationKey));
    const priorByKey = new Map(notifications.map((row, index) => [notificationKey(row), { row, index }]));
    const enabled = process.env.RADAR_EMAIL_ENABLED === "1" && hasNaverEmailConfig() && Boolean(safeUrl(process.env.APP_URL));
    let queued = 0, sent = 0, failed = 0;
    for (const lead of leads.filter((row) => row.status === "active" && row.consent_service === "true").slice(0, 100)) {
      const profile: RadarProfile = {
        businessStatus: lead.business_status as RadarProfile["businessStatus"],
        region: lead.region, industry: lead.industry, openDate: lead.open_date || null,
        employeesBand: lead.employees_band || "", interests: parseList(lead.interests),
      };
      const matching = matchNotices(profile, notices).filter((notice) => notice.noticeType === "confirmed" && notice.applyStart === today);
      const targets: { notice: Notice; kind: string }[] = matching.map((notice) => ({ notice, kind: "new" }));
      for (const record of saved.filter((row) => row.lead_id === lead.id)) {
        const notice = noticeById.get(record.notice_id);
        const days = daysLeft(notice?.applyEnd, today);
        if (notice && (days === 7 || days === 3)) targets.push({ notice, kind: `deadline-${days}` });
      }
      for (const { notice, kind } of targets) {
        const key = `${lead.id}|${notice.id}|${kind}`;
        if (sentKeys.has(key)) continue;
        sentKeys.add(key);
        queued++;
        // A dry run must not reserve the notification key or write to the sheet.
        if (!enabled) continue;
        const previous = priorByKey.get(key);
        const record = previous?.row || {
          id: crypto.randomUUID(), created_at: new Date().toISOString(),
          lead_id: lead.id, notice_id: notice.id, kind,
          scheduled_at: new Date().toISOString(), status: "sending",
        };
        if (previous) await updateRow("notifications", previous.index + 2, { ...record, status: "sending" });
        else await appendRow("notifications", record);
        let providerId = "", error = "";
        try {
          providerId = await sendNaverEmail({
            to: lead.email,
            subject: kind === "new" ? "[비즈핏] 새로운 맞춤 사업기회" : `[비즈핏] 관심 공고 마감 D-${kind.split("-")[1]}`,
            html: message(lead.name, notice, kind, safeUrl(process.env.APP_URL)!, lead.unsubscribe_token),
          });
        } catch {
          error = "smtp request failed; review before retry";
        }
        const rowIndex = previous ? previous.index + 2 : (await readRows("notifications")).findIndex((row) => row.id === record.id) + 2;
        if (rowIndex >= 2) await updateRow("notifications", rowIndex, {
          ...record, status: error ? "failed" : "sent",
          sent_at: error ? "" : new Date().toISOString(),
          provider_id: providerId, error,
        });
        if (error) failed++; else sent++;
      }
    }
    return NextResponse.json({ queued, sent, failed, mode: enabled ? "send" : "dry-run" });
  } catch {
    return NextResponse.json({ error: "alert job failed" }, { status: 500 });
  }
}

// Vercel Cron invokes GET on the isolated project's production deployment.
export const GET = POST;
