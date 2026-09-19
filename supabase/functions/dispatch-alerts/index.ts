import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type QueueRow = { id: number; lead_id: string; kind: string; notice_ids: string[]; subject: string | null };
type Lead = { name: string | null; email: string; unsubscribe_token: string };
type Notice = { id: string; title: string; org: string | null; apply_end: string | null; support_summary: string | null; url: string | null };

const cors = { "Content-Type": "application/json" };

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] || char);
}

function renderEmail(lead: Lead, notices: Notice[], appUrl: string) {
  const cards = notices.map((notice) => `<div style="border:1px solid #dfe8f5;border-radius:12px;padding:18px;margin:12px 0"><div style="font-size:12px;color:#1062e5;font-weight:700">${escapeHtml(notice.org || "지원기관")}${notice.apply_end ? ` · ${escapeHtml(notice.apply_end)} 마감` : ""}</div><h3 style="margin:8px 0;color:#050538">${escapeHtml(notice.title)}</h3><p style="margin:0;color:#596579;line-height:1.6">${escapeHtml(notice.support_summary || "상세 지원내용은 최신 공고문에서 확인해주세요.")}</p>${notice.url ? `<a href="${encodeURI(notice.url)}" style="display:inline-block;margin-top:12px;color:#1062e5;font-weight:700">공고 확인 →</a>` : ""}</div>`).join("");
  return `<div style="max-width:620px;margin:auto;font-family:Arial,sans-serif;color:#050538"><div style="background:#050538;padding:24px;border-radius:16px 16px 0 0;color:white"><b style="letter-spacing:.15em">BIZFIT</b><h1 style="font-size:24px;margin:12px 0 0">${escapeHtml(lead.name || "대표")}님께 맞는 사업기회</h1></div><div style="padding:24px;background:#fff">${cards}<a href="${appUrl}" style="display:block;text-align:center;background:#1062e5;color:white;text-decoration:none;padding:15px;border-radius:10px;font-weight:700;margin-top:20px">전체 사업기회 보기</a><p style="font-size:11px;color:#8994a7;line-height:1.6;margin-top:24px">실제 신청 자격과 일정은 해당 기관의 최신 공고문을 확인해주세요.<br><a href="${appUrl}/unsubscribe?token=${lead.unsubscribe_token}" style="color:#8994a7">알림 수신 해지</a></p></div></div>`;
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: cors });
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("ALERT_FROM_EMAIL") || "Bizfit <alerts@bizfit.co.kr>";
  const appUrl = Deno.env.get("APP_URL") || "https://bizfit-website.vercel.app";
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  await supabase.rpc("queue_alert_notifications", { p_today: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" }) });
  const { data: queue, error } = await supabase.from("alert_notifications").select("id,lead_id,kind,notice_ids,subject").eq("status", "draft").order("created_at").limit(50);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });
  if (!resendKey) return new Response(JSON.stringify({ queued: queue?.length || 0, sent: 0, mode: "dry-run", reason: "RESEND_API_KEY is not configured" }), { headers: cors });

  let sent = 0;
  for (const item of (queue || []) as QueueRow[]) {
    const [{ data: lead }, { data: notices }] = await Promise.all([
      supabase.from("alert_leads").select("name,email,unsubscribe_token").eq("id", item.lead_id).single<Lead>(),
      supabase.from("alert_notices").select("id,title,org,apply_end,support_summary,url").in("id", item.notice_ids).returns<Notice[]>(),
    ]);
    if (!lead || !notices?.length) { await supabase.from("alert_notifications").update({ status: "skipped", error: "missing lead or notice" }).eq("id", item.id); continue; }
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [lead.email], subject: item.subject || "[비즈핏] 맞춤 사업기회", html: renderEmail(lead, notices, appUrl) }) });
    const result = await response.json();
    if (response.ok) { sent++; await supabase.from("alert_notifications").update({ status: "sent", sent_at: new Date().toISOString(), gmail_id: result.id || null }).eq("id", item.id); }
    else await supabase.from("alert_notifications").update({ status: "failed", error: JSON.stringify(result).slice(0, 1000) }).eq("id", item.id);
  }
  return new Response(JSON.stringify({ queued: queue?.length || 0, sent }), { headers: cors });
});
