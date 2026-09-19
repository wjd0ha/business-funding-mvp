"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase-browser";

type Lead = {
  id: string; created_at: string; name: string | null; email: string; phone: string | null;
  business_status: string; region: string; industry: string; interests: string[]; status: string;
  consent_marketing: boolean;
};

const statusLabel: Record<string, string> = { active: "신규", reviewing: "검토중", contacted: "연락완료", closed: "종료", unsubscribed: "수신해지", bounced: "반송" };

export default function AdminPage() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [noticeCount, setNoticeCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [leadResult, noticeResult, eventResult, queueResult] = await Promise.all([
      supabase.from("alert_leads").select("id,created_at,name,email,phone,business_status,region,industry,interests,status,consent_marketing").order("created_at", { ascending: false }).limit(200),
      supabase.from("alert_notices").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("alert_events").select("id", { count: "exact", head: true }),
      supabase.from("alert_notifications").select("id", { count: "exact", head: true }).eq("status", "draft"),
    ]);
    if (leadResult.error) { setError("관리자 권한이 없거나 DB 정책이 아직 적용되지 않았습니다."); return; }
    setLeads((leadResult.data ?? []) as Lead[]);
    setNoticeCount(noticeResult.count ?? 0); setEventCount(eventResult.count ?? 0); setQueueCount(queueResult.count ?? 0); setError("");
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [supabase]);
  useEffect(() => { if (user) queueMicrotask(() => load()); }, [user, load]);

  async function changeStatus(id: string, status: string) {
    const { error: updateError } = await supabase.from("alert_leads").update({ status }).eq("id", id);
    if (updateError) return setError("상태를 변경하지 못했습니다.");
    setLeads((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
  }

  if (!user) return <AdminLogin supabase={supabase} />;

  return <main className="min-h-screen bg-[#f4f7fb] text-[var(--navy)]">
    <header className="border-b border-[#dfe8f5] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><div><Link href="/" className="text-sm font-black tracking-[.16em]">BIZFIT</Link><h1 className="mt-1 text-xl font-black">사업기회 CRM</h1></div><div className="flex items-center gap-3"><span className="hidden text-xs text-[#68768d] sm:inline">{user.email}</span><button onClick={() => supabase.auth.signOut()} className="rounded-lg border border-[#cbd8ea] px-3 py-2 text-xs font-bold">로그아웃</button></div></div></header>
    <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[[leads.length, "전체 리드"], [noticeCount, "활성 공고"], [eventCount, "누적 행동"], [queueCount, "발송 대기"]].map(([value, label]) => <article key={String(label)} className="soft-card p-5"><span className="text-xs font-bold text-[#778399]">{label}</span><strong className="mt-3 block text-3xl">{value}</strong></article>)}</div>
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#dfe8f5] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#e8eef7] px-5 py-4"><div><h2 className="font-black">리드 목록</h2><p className="mt-1 text-xs text-[#778399]">최근 등록 순 · 연락 상태를 바로 관리합니다.</p></div><button onClick={load} className="rounded-lg bg-[#edf4ff] px-3 py-2 text-xs font-black text-[var(--blue)]">새로고침</button></div>{error && <p className="m-5 rounded-lg bg-[#fff1f1] p-4 text-sm font-bold text-[#9a3030]">{error}</p>}<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#f8faff] text-xs text-[#657187]"><tr>{["등록일", "고객", "사업 조건", "관심분야", "마케팅", "상태"].map((item) => <th key={item} className="px-5 py-3 font-black">{item}</th>)}</tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-t border-[#edf1f7]"><td className="px-5 py-4 text-xs text-[#68768d]">{new Date(lead.created_at).toLocaleDateString("ko-KR")}</td><td className="px-5 py-4"><strong className="block">{lead.name || "이름 없음"}</strong><span className="mt-1 block text-xs text-[#68768d]">{lead.email}</span>{lead.phone && <span className="block text-xs text-[#68768d]">{lead.phone}</span>}</td><td className="px-5 py-4"><span className="font-bold">{lead.region} · {lead.industry}</span><span className="mt-1 block text-xs text-[#68768d]">{lead.business_status}</span></td><td className="max-w-[260px] px-5 py-4 text-xs leading-5 text-[#506078]">{lead.interests?.join(", ")}</td><td className="px-5 py-4">{lead.consent_marketing ? "동의" : "미동의"}</td><td className="px-5 py-4"><select aria-label="리드 상태" value={lead.status} onChange={(event) => changeStatus(lead.id, event.target.value)} className="rounded-lg border border-[#cbd8ea] bg-white px-3 py-2 font-bold"><option value="active">{statusLabel.active}</option><option value="reviewing">{statusLabel.reviewing}</option><option value="contacted">{statusLabel.contacted}</option><option value="closed">{statusLabel.closed}</option><option value="unsubscribed">{statusLabel.unsubscribed}</option></select></td></tr>)}</tbody></table></div>{leads.length === 0 && !error && <p className="p-12 text-center text-[#778399]">아직 등록된 리드가 없습니다.</p>}</div>
    </section>
  </main>;
}

function AdminLogin({ supabase }: { supabase: ReturnType<typeof createBrowserSupabase> }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState("");
  async function login(event: React.FormEvent) { event.preventDefault(); const { error } = await supabase.auth.signInWithPassword({ email, password }); setMessage(error ? "로그인 정보 또는 관리자 권한을 확인해주세요." : ""); }
  return <main className="grid min-h-screen place-items-center bg-[var(--navy)] px-5"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><p className="eyebrow">BIZFIT ADMIN</p><h1 className="mt-3 text-3xl font-black">관리자 CRM 로그인</h1><p className="mt-3 text-sm leading-6 text-[#68768d]">Supabase 관리자 계정으로 로그인합니다.</p><div className="mt-7 grid gap-3"><input type="email" required placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-[#cbd8ea] px-4 py-3 outline-none focus:border-[var(--blue)]" /><input type="password" required placeholder="비밀번호" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-[#cbd8ea] px-4 py-3 outline-none focus:border-[var(--blue)]" />{message && <p className="text-sm font-bold text-[#aa3030]">{message}</p>}<button className="mt-2 rounded-xl bg-[var(--blue)] py-4 font-black text-white">로그인</button><Link href="/" className="py-2 text-center text-sm font-bold text-[#68768d]">← 사용자 화면으로</Link></div></form></main>;
}
