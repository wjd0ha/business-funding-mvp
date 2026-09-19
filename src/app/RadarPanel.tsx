"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Answers } from "@/lib/calculateResult";
import type { RadarMatch } from "@/lib/radar";

export function RadarPanel({ answers }: { answers: Answers }) {
  const [matches, setMatches] = useState<RadarMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", phone: "", region: "전국", industry: "all", consentMarketing: false });

  useEffect(() => {
    fetch("/api/radar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "공고를 불러오지 못했습니다.");
        setMatches(data.matches);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [answers]);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/radar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lead", answers, lead: { ...form, consentPrivacy: true, consentService: true } }),
    });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "신청 정보를 저장하지 못했습니다."); return; }
    setSubmitted(true);
  }

  return (
    <section className="mt-5 rounded-lg border border-[#cfe0ff] bg-[#f8fbff] p-5 shadow-[0_18px_50px_rgba(1,59,122,0.08)] sm:p-7">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div><p className="text-sm font-black text-[#1062e5]">Bizfit 사업기회 레이더</p><h3 className="mt-2 text-2xl font-black text-[#050538]">지금 확인할 만한 공고를 찾았습니다</h3></div>
        <p className="text-sm font-bold text-[#6b7890]">조건 기반 상위 {matches.length}건</p>
      </div>
      {loading && <p className="mt-5 text-sm text-[#596579]">공고를 맞춰보고 있습니다…</p>}
      {error && <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
      {!loading && !error && matches.length === 0 && <p className="mt-5 text-sm text-[#596579]">현재 조건에 맞는 공고가 없습니다. 지역과 업종을 넓혀 다시 확인해보세요.</p>}
      <div className="mt-5 grid gap-3">
        {matches.map((match) => <article key={match.id} className="rounded-md border border-[#e4ebf7] bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-[#1062e5]">적합도 {match.score}% · {match.category}</p><h4 className="mt-1 font-black text-[#050538]">{match.title}</h4></div>{match.apply_end && <span className="shrink-0 text-xs font-bold text-[#6b7890]">마감 {match.apply_end}</span>}</div><p className="mt-2 text-sm leading-6 text-[#596579]">{match.support_summary || match.summary || "지원 내용을 확인해보세요."}</p><p className="mt-2 text-xs font-bold text-[#6b7890]">{match.reasons.join(" · ") || "기본 조건을 바탕으로 선별"}</p>{match.url && <a href={match.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-black text-[#1062e5] hover:underline">공고 원문 확인 →</a>}</article>)}
      </div>
      <div className="mt-6 border-t border-[#e4ebf7] pt-6">
        {submitted ? <p className="rounded-md bg-emerald-50 p-4 text-sm font-black text-emerald-700">신청이 저장되었습니다. 새 공고가 맞으면 안내드릴 수 있도록 준비했습니다.</p> : <form onSubmit={submitLead} className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2"><p className="text-base font-black text-[#050538]">새 공고 알림을 받아보시겠어요?</p><p className="mt-1 text-sm text-[#596579]">이메일만 남겨도 됩니다. 상담 신청이 아니라 공고 알림용입니다.</p></div><input required type="email" placeholder="이메일" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-md border border-[#cbd8ea] px-3 py-3 text-sm" /><input placeholder="이름 (선택)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-[#cbd8ea] px-3 py-3 text-sm" /><input placeholder="지역 (예: 서울)" value={form.region === "전국" ? "" : form.region} onChange={(e) => setForm({ ...form, region: e.target.value || "전국" })} className="rounded-md border border-[#cbd8ea] px-3 py-3 text-sm" /><select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="rounded-md border border-[#cbd8ea] px-3 py-3 text-sm"><option value="all">업종 선택</option><option value="digital">기술·온라인·전문 서비스</option><option value="service">일반 매장·서비스·도소매</option><option value="manufacturing">제조·장비·시설</option></select><label className="flex items-center gap-2 text-xs text-[#596579] sm:col-span-2"><input type="checkbox" checked={form.consentMarketing} onChange={(e) => setForm({ ...form, consentMarketing: e.target.checked })} /> 선택: 마케팅 정보도 받기</label><button className="rounded-md bg-[#1062e5] px-5 py-3 text-sm font-black text-white transition hover:bg-[#013b7a] sm:col-span-2">새 공고 알림 신청하기</button></form>}
      </div>
    </section>
  );
}
