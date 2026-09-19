"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Lead = {
  id: string; created_at: string; name: string; email: string; phone: string;
  business_status: string; region: string; industry: string; interests: string[];
  status: string; consent_marketing: boolean;
};
const statusLabel: Record<string, string> = { preview: "프리뷰 관심", active: "신규", reviewing: "검토중", contacted: "연락완료", closed: "종료", unsubscribed: "수신해지" };

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"password" | "vercel-preview">("password");
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counts, setCounts] = useState({ noticeCount: 0, eventCount: 0, queueCount: 0 });
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
    if (response.status === 401) { setAuthenticated(false); setLoading(false); return; }
    const result = await response.json();
    if (!response.ok) { setError(result.error || "데이터를 읽지 못했습니다."); setLoading(false); return; }
    setAuthenticated(true); setAuthMode(result.authMode); setLeads(result.leads); setCounts(result); setError(""); setLoading(false);
  }, []);
  useEffect(() => { queueMicrotask(() => { void load(); }); }, [load]);
  async function login(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setPassword("");
    if (!response.ok) { setError("로그인 정보를 확인해주세요."); return; }
    await load();
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); setLeads([]); }
  async function changeStatus(id: string, status: string) {
    const response = await fetch("/api/admin/dashboard", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) { setError("상태를 변경하지 못했습니다."); return; }
    setLeads((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
  }
  if (loading) return <main className="grid min-h-screen place-items-center bg-[var(--navy)] text-white">관리자 화면을 불러오는 중…</main>;
  if (!authenticated) return <main className="grid min-h-screen place-items-center bg-[var(--navy)] px-5"><form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"><p className="eyebrow">BIZFIT ADMIN</p><h1 className="mt-3 text-3xl font-black">사업기회 CRM</h1><p className="mt-3 text-sm leading-6 text-[#68768d]">관리자 비밀번호로 로그인합니다.</p><div className="mt-7 grid gap-3"><input type="password" required autoComplete="current-password" placeholder="관리자 비밀번호" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-[#cbd8ea] px-4 py-3 outline-none focus:border-[var(--blue)]" />{error && <p className="text-sm font-bold text-[#aa3030]">{error}</p>}<button className="mt-2 rounded-xl bg-[var(--blue)] py-4 font-black text-white">로그인</button><Link href="/" className="py-2 text-center text-sm font-bold text-[#68768d]">← 사용자 화면으로</Link></div></form></main>;
  return <main className="min-h-screen bg-[#f4f7fb] text-[var(--navy)]"><header className="border-b border-[#dfe8f5] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"><div><Link href="/" className="text-sm font-black tracking-[.16em]">BIZFIT</Link><h1 className="mt-1 text-xl font-black">사업기회 CRM</h1></div>{authMode === "vercel-preview" ? <span className="text-xs font-bold text-[#68768d]">Vercel 로그인으로 보호됨</span> : <button onClick={logout} className="rounded-lg border border-[#cbd8ea] px-3 py-2 text-xs font-bold">로그아웃</button>}</div></header><section className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[[leads.length, "전체 리드"], [counts.noticeCount, "활성 공고"], [counts.eventCount, "누적 행동"], [counts.queueCount, "발송 대기"]].map(([value, label]) => <article key={String(label)} className="soft-card p-5"><span className="text-xs font-bold text-[#778399]">{label}</span><strong className="mt-3 block text-3xl">{value}</strong></article>)}</div><div className="mt-7 overflow-hidden rounded-2xl border border-[#dfe8f5] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#e8eef7] px-5 py-4"><div><h2 className="font-black">리드 목록</h2><p className="mt-1 text-xs text-[#778399]">최근 등록 순 · 연락 상태를 관리합니다.</p></div><button onClick={load} className="rounded-lg bg-[#edf4ff] px-3 py-2 text-xs font-black text-[var(--blue)]">새로고침</button></div>{error && <p className="m-5 rounded-lg bg-[#fff1f1] p-4 text-sm font-bold text-[#9a3030]">{error}</p>}<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#f8faff] text-xs text-[#657187]"><tr>{["등록일", "고객", "사업 조건", "관심분야", "마케팅", "상태"].map((item) => <th key={item} className="px-5 py-3 font-black">{item}</th>)}</tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-t border-[#edf1f7]"><td className="px-5 py-4 text-xs text-[#68768d]">{new Date(lead.created_at).toLocaleDateString("ko-KR")}</td><td className="px-5 py-4"><strong className="block">{lead.name || "이름 없음"}</strong><span className="mt-1 block text-xs text-[#68768d]">{lead.email}</span>{lead.phone && <span className="block text-xs text-[#68768d]">{lead.phone}</span>}</td><td className="px-5 py-4"><span className="font-bold">{lead.region} · {lead.industry}</span><span className="mt-1 block text-xs text-[#68768d]">{lead.business_status}</span></td><td className="max-w-[260px] px-5 py-4 text-xs leading-5 text-[#506078]">{lead.interests?.join(", ")}</td><td className="px-5 py-4">{lead.consent_marketing ? "동의" : "미동의"}</td><td className="px-5 py-4"><select aria-label="리드 상태" value={lead.status} onChange={(event) => changeStatus(lead.id, event.target.value)} className="rounded-lg border border-[#cbd8ea] bg-white px-3 py-2 font-bold">{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div>{leads.length === 0 && !error && <p className="p-12 text-center text-[#778399]">아직 등록된 리드가 없습니다.</p>}</div></section></main>;
}
