"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { businessStatuses, industries, interests, regions } from "@/data/radar";
import { matchNotices } from "@/lib/matching";
import type { MatchResult, Notice, RadarProfile } from "@/lib/radar-types";

const emptyProfile: RadarProfile = { businessStatus: "pre", region: "경기", industry: "service", openDate: null, employeesBand: "1인", interests: [] };
const steps = ["현재 상태", "사업 지역", "업종", "개업일", "직원 규모", "관심 분야"];
const alertsLive = process.env.NEXT_PUBLIC_RADAR_EMAIL_ENABLED === "1";

function getSessionId() {
  const stored = window.localStorage.getItem("bizfit-radar-session");
  if (stored) return stored;
  const created = crypto.randomUUID();
  window.localStorage.setItem("bizfit-radar-session", created);
  return created;
}

async function logEvent(type: string, sessionId: string, noticeId?: string, leadId?: string) {
  await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, sessionId, noticeId, leadId }) }).catch(() => undefined);
}

export default function Home() {
  const [screen, setScreen] = useState<"intro" | "survey" | "results">("intro");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<RadarProfile>(emptyProfile);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeSource, setNoticeSource] = useState("demo");
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    queueMicrotask(() => setSessionId(getSessionId()));
    fetch("/api/notices").then((response) => response.json()).then((data) => { setNotices(data.notices ?? []); setNoticeSource(data.source ?? "demo"); }).finally(() => setLoadingNotices(false));
  }, []);

  const matches = useMemo(() => matchNotices(profile, notices), [profile, notices]);
  const activeMatches = matches.filter((notice) => notice.noticeType === "confirmed");
  const expectedMatches = matches.filter((notice) => notice.noticeType === "expected");

  function choose<K extends keyof RadarProfile>(key: K, value: RadarProfile[K]) { setProfile((current) => ({ ...current, [key]: value })); }
  function next() {
    if (step === steps.length - 1) { setScreen("results"); logEvent("result_view", sessionId); }
    else setStep((value) => value + 1);
  }

  return (
    <main className="min-h-screen bg-[var(--mist)] text-[var(--navy)]">
      <header className="sticky top-0 z-30 border-b border-[#dfe8f5] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button className="flex items-center gap-3 text-left" onClick={() => setScreen("intro")}>
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--navy)] text-lg font-black text-white">B</span>
            <span><strong className="block tracking-[0.18em]">BIZFIT</strong><small className="text-[#66738a]">사업기회 레이더</small></span>
          </button>
          <div className="flex items-center gap-3 text-xs font-bold text-[#66738a]"><Link href="/prep-map" className="rounded-lg bg-[#edf4ff] px-3 py-2 text-[var(--blue)]">2027 준비지도</Link><span className="hidden sm:inline">{noticeSource === "demo" ? "예시 모드" : "기업마당 공고 연동"}</span><span className={`size-2 rounded-full ${noticeSource === "demo" ? "bg-[#e5a626]" : "bg-[#20b486] shadow-[0_0_0_5px_rgba(32,180,134,.12)]"}`} /></div>
        </div>
      </header>

      {noticeSource === "demo" && <div className="bg-[#fff6db] px-5 py-2 text-center text-xs font-bold text-[#795300]">프리뷰 예시 공고입니다. 실제 모집 여부를 나타내지 않으며, 공식 수집 연동 전까지 알림을 신청하지 마세요.</div>}
      {noticeSource !== "demo" && !alertsLive && <div className="bg-[#fff6db] px-5 py-2 text-center text-xs font-bold text-[#795300]">프리뷰 운영 중 · 공고 조회와 관심 등록은 가능하지만 이메일 알림은 아직 발송하지 않습니다. 정식 알림은 다시 신청해야 합니다.</div>}
      {screen === "intro" && <Intro onStart={() => { setScreen("survey"); logEvent("survey_start", sessionId); }} count={notices.length} demo={noticeSource === "demo"} />}
      {screen === "survey" && <Survey step={step} profile={profile} choose={choose} onNext={next} onBack={() => step === 0 ? setScreen("intro") : setStep((value) => value - 1)} />}
      {screen === "results" && <Results profile={profile} matches={activeMatches} expected={expectedMatches} loading={loadingNotices} demo={noticeSource === "demo"} sessionId={sessionId} leadId={leadId} setLeadId={setLeadId} onRestart={() => { setStep(0); setScreen("survey"); }} />}

      <footer className="border-t border-[#dfe8f5] bg-white px-5 py-8 text-center text-xs leading-6 text-[#768298]">
        <p>Bizfit 사업기회 레이더 · 공고 내용과 신청 자격은 반드시 해당 기관의 최신 공고문을 확인해주세요.</p>
        <Link className="mt-1 inline-block font-bold text-[var(--blue)]" href="/admin">관리자 CRM</Link>
      </footer>
    </main>
  );
}

function Intro({ onStart, count, demo }: { onStart: () => void; count: number; demo: boolean }) {
  return <>
    <section className="relative overflow-hidden bg-[var(--navy)] text-white">
      <div className="radar-grid absolute inset-0 opacity-35" /><div className="absolute -right-20 top-12 size-80 rounded-full bg-[#1268ff]/25 blur-3xl" />
      <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold"><span className="size-2 rounded-full bg-[#64e4bb]" /> {demo ? "프리뷰 화면을 살펴보세요" : "새 공고를 확인해요"}</span>
          <h1 className="mt-7 text-4xl font-black leading-[1.12] tracking-tight sm:text-6xl">내 사업에 맞는 지원사업,<br /><span className="text-[#70a9ff]">매번 검색하지 마세요.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c8d7ee]">지역·업종·업력 등 6가지 정보만 알려주시면 지금 확인할 사업과 곧 준비할 사업기회를 한 번에 정리해드립니다.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={onStart} className="rounded-xl bg-[var(--blue)] px-7 py-4 text-base font-black shadow-[0_18px_45px_rgba(16,98,229,.38)] transition hover:-translate-y-0.5 hover:bg-[#2674ed]">1분 무료 조회 시작하기 →</button><a href="#how" className="rounded-xl border border-white/20 px-7 py-4 text-center font-bold text-[#dbe8fa] hover:bg-white/10">이용 방법 보기</a></div>
          <p className="mt-4 text-sm text-[#91a7c8]">가입 없이 결과 먼저 확인 · 알림 신청은 선택</p>
        </div>
        <div className="relative mx-auto w-full max-w-lg"><div className="radar-orbit mx-auto grid aspect-square w-[min(88vw,470px)] place-items-center rounded-full border border-[#70a9ff]/30"><div className="grid size-[72%] place-items-center rounded-full border border-[#70a9ff]/25"><div className="grid size-[52%] place-items-center rounded-full border border-[#70a9ff]/25 bg-[#1268ff]/10"><div className="text-center"><strong className="block text-5xl font-black">{count || "—"}</strong><span className="mt-1 block text-sm text-[#9bb9e4]">{demo ? "예시 공고" : "확인 가능한 공고"}</span></div></div></div>{["사업화", "정책자금", "AI·디지털", "판로"].map((item, index) => <span key={item} className={`radar-chip radar-chip-${index}`}>{item}</span>)}</div></div>
      </div>
    </section>
    <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="max-w-2xl"><p className="eyebrow">HOW IT WORKS</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">검색이 아니라, 내 조건으로 먼저 거릅니다</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{[["01", "사업정보 입력", "사업 상태·지역·업종·업력 등 핵심 정보만 간단히 입력합니다."], ["02", "조건별 자동 매칭", "지역·업력·업종·관심분야를 기준으로 관련 공고를 점수화합니다."], ["03", "신규 기회 알림", "원하면 새 공고와 저장한 공고의 D-7·D-3 알림을 이메일로 받습니다."]].map(([no, title, text]) => <article key={no} className="soft-card p-7"><span className="text-sm font-black text-[var(--blue)]">{no}</span><h3 className="mt-8 text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-[#657187]">{text}</p></article>)}</div></section>
  </>;
}

type SurveyProps = { step: number; profile: RadarProfile; choose: <K extends keyof RadarProfile>(key: K, value: RadarProfile[K]) => void; onNext: () => void; onBack: () => void };
function Survey({ step, profile, choose, onNext, onBack }: SurveyProps) {
  const complete = Math.round(((step + 1) / steps.length) * 100);
  const canNext = step !== 5 || profile.interests.length > 0;
  return <section className="mx-auto min-h-[760px] max-w-5xl px-5 py-12 lg:px-8"><div className="flex items-end justify-between"><div><p className="eyebrow">MY BUSINESS PROFILE</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">{steps[step]}</h1></div><strong className="text-2xl text-[var(--blue)]">{complete}%</strong></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dfe8f5]"><div className="h-full rounded-full bg-[var(--blue)] transition-all" style={{ width: `${complete}%` }} /></div><div className="mt-10 rounded-3xl border border-[#dfe8f5] bg-white p-6 shadow-[0_24px_70px_rgba(4,31,77,.08)] sm:p-10">
    {step === 0 && <Options items={businessStatuses.map((item) => ({ value: item.value, title: item.label, detail: item.detail }))} selected={profile.businessStatus} onSelect={(value) => choose("businessStatus", value as RadarProfile["businessStatus"])} />}
    {step === 1 && <GridOptions items={regions} selected={profile.region} onSelect={(value) => choose("region", value)} />}
    {step === 2 && <Options items={industries.map(([value, title]) => ({ value, title }))} selected={profile.industry} onSelect={(value) => choose("industry", value)} columns />}
    {step === 3 && <div className="mx-auto max-w-xl"><p className="text-sm leading-6 text-[#657187]">운영 중인 사업자라면 개업일을 입력해주세요. 예비·재창업 준비자는 건너뛸 수 있습니다.</p><input type="date" value={profile.openDate ?? ""} onChange={(event) => choose("openDate", event.target.value || null)} className="mt-6 w-full rounded-2xl border border-[#cbd8ea] px-5 py-4 text-lg font-bold outline-none focus:border-[var(--blue)] focus:ring-4 focus:ring-[#1062e5]/10" /><button onClick={() => choose("openDate", null)} className="mt-4 text-sm font-bold text-[var(--blue)]">해당 없음 / 나중에 확인</button></div>}
    {step === 4 && <Options items={["1인", "2~4명", "5~9명", "10명 이상"].map((title) => ({ value: title, title }))} selected={profile.employeesBand} onSelect={(value) => choose("employeesBand", value)} columns />}
    {step === 5 && <div><p className="mb-5 text-sm leading-6 text-[#657187]">복수 선택할 수 있어요. 관심분야가 매칭 순위에 가장 크게 반영됩니다.</p><div className="grid gap-3 sm:grid-cols-2">{interests.map((item) => { const selected = profile.interests.includes(item); return <button key={item} onClick={() => choose("interests", selected ? profile.interests.filter((x) => x !== item) : [...profile.interests, item])} className={`option-card ${selected ? "option-selected" : ""}`}><span className="check-dot">{selected ? "✓" : ""}</span><strong>{item}</strong></button>; })}</div></div>}
    <div className="mt-10 flex items-center justify-between border-t border-[#edf1f7] pt-6"><button onClick={onBack} className="px-3 py-3 font-bold text-[#66738a]">← 이전</button><button disabled={!canNext} onClick={onNext} className="rounded-xl bg-[var(--navy)] px-7 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-35">{step === 5 ? "내 사업기회 보기" : "다음"} →</button></div>
  </div></section>;
}

function Options({ items, selected, onSelect, columns = false }: { items: Array<{ value: string; title: string; detail?: string }>; selected: string; onSelect: (value: string) => void; columns?: boolean }) {
  return <div className={`grid gap-3 ${columns ? "sm:grid-cols-2" : ""}`}>{items.map((item) => <button key={item.value} onClick={() => onSelect(item.value)} className={`option-card ${selected === item.value ? "option-selected" : ""}`}><span className="radio-dot"><span /></span><span><strong className="block text-left text-lg">{item.title}</strong>{item.detail && <small className="mt-1 block text-left leading-5 text-[#718096]">{item.detail}</small>}</span></button>)}</div>;
}
function GridOptions({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (value: string) => void }) {
  return <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">{items.map((item) => <button key={item} onClick={() => onSelect(item)} className={`rounded-xl border px-2 py-4 font-black transition ${selected === item ? "border-[var(--blue)] bg-[#edf5ff] text-[var(--blue)] ring-2 ring-[#1062e5]/15" : "border-[#dfe8f5] hover:border-[#86adf0]"}`}>{item}</button>)}</div>;
}

function Results({ profile, matches, expected, loading, demo, sessionId, leadId, setLeadId, onRestart }: { profile: RadarProfile; matches: MatchResult[]; expected: MatchResult[]; loading: boolean; demo: boolean; sessionId: string; leadId: string | null; setLeadId: (value: string) => void; onRestart: () => void }) {
  const [visible, setVisible] = useState(3); const [saved, setSaved] = useState<string[]>([]);
  const high = matches.filter((item) => item.fit === "high").length; const urgent = matches.filter((item) => item.dday != null && item.dday >= 0 && item.dday <= 7).length;
  async function save(noticeId: string) { if (!leadId) return document.getElementById("alert-form")?.scrollIntoView({ behavior: "smooth" }); const response = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, noticeId, sessionId }) }); if (response.ok) setSaved((items) => [...items, noticeId]); }
  return <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="overflow-hidden rounded-3xl bg-[var(--navy)] p-7 text-white sm:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-sm font-black tracking-[.16em] text-[#74aaff]">RADAR RESULT</p><h1 className="mt-3 text-3xl font-black sm:text-5xl">현재 조건과 관련 있는<br />사업기회를 찾았습니다.</h1><p className="mt-4 text-[#b6c8e4]">{demo ? "예시 데이터로 화면을 살펴보는 중입니다." : "공식 공고문 확인이 필요한 사업기회를 보여드려요."}</p></div><div className="grid grid-cols-3 gap-3 text-center">{[[matches.length, demo ? "예시 일치" : "모집·확인"], [high, "관련도 높음"], [urgent, "마감 D-7"]].map(([value, label]) => <div key={String(label)} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4"><strong className="block text-3xl">{value}</strong><span className="mt-1 block text-xs text-[#aebfda]">{label}</span></div>)}</div></div></div><div className="mt-9 grid gap-7 lg:grid-cols-[1fr_330px]"><div><div className="flex items-center justify-between"><h2 className="text-2xl font-black">{demo ? "예시 공고" : "지금 확인할 공고"}</h2><button onClick={onRestart} className="text-sm font-bold text-[var(--blue)]">조건 다시 입력</button></div>{loading ? <div className="soft-card mt-5 p-10 text-center text-[#68768d]">공고 데이터를 불러오는 중입니다…</div> : matches.length === 0 ? <div className="soft-card mt-5 p-10 text-center"><strong className="text-xl">조건에 정확히 맞는 공고가 아직 없어요.</strong><p className="mt-2 text-[#68768d]">알림을 신청하면 새 공고가 들어왔을 때 다시 찾아드릴게요.</p></div> : <div className="mt-5 grid gap-4">{matches.slice(0, visible).map((notice) => <NoticeCard key={notice.id} notice={notice} saved={saved.includes(notice.id)} onSave={() => save(notice.id)} sessionId={sessionId} leadId={leadId} demo={demo} />)}{visible < matches.length && <button className="rounded-xl border border-[#cbd8ea] bg-white py-4 font-black text-[var(--blue)]" onClick={() => setVisible((value) => value + 5)}>공고 더 보기 ({matches.length - visible})</button>}</div>}{expected.length > 0 && <div className="mt-12"><p className="eyebrow">PREPARE NEXT</p><h2 className="mt-2 text-2xl font-black">곧 준비할 사업기회</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{expected.slice(0, 4).map((notice) => <article key={notice.id} className="soft-card p-5"><span className="rounded-md bg-[#fff6db] px-2 py-1 text-xs font-black text-[#8d6200]">예상 공고</span><h3 className="mt-4 font-black">{notice.title}</h3><p className="mt-2 text-sm leading-6 text-[#68768d]">{notice.summary}</p><p className="mt-4 text-xs font-bold text-[var(--blue)]">{notice.expectedWindow || "일정 확인 필요"}</p></article>)}</div></div>}</div>{demo ? <aside className="h-fit rounded-2xl border border-[#f0d683] bg-[#fff9e6] p-6 text-sm leading-6 text-[#795300]">실제 공고 수집과 개발 DB 연결 후 맞춤 알림 신청이 열립니다.</aside> : <LeadForm profile={profile} sessionId={sessionId} leadId={leadId} setLeadId={setLeadId} matchCount={matches.length} />}</div></section>;
}

function NoticeCard({ notice, saved, onSave, sessionId, leadId, demo }: { notice: MatchResult; saved: boolean; onSave: () => void; sessionId: string; leadId: string | null; demo: boolean }) {
  return <article className="soft-card p-6"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ${notice.fit === "high" ? "bg-[#e6f8f2] text-[#08795a]" : "bg-[#fff6db] text-[#8d6200]"}`}>{notice.fit === "high" ? "관련도 높음" : "확인 추천"}</span><span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-black text-[var(--blue)]">{notice.category}</span>{!demo && notice.dday != null && <span className={`ml-auto text-sm font-black ${notice.dday <= 7 ? "text-[#e24848]" : "text-[#68768d]"}`}>{notice.dday === 0 ? "오늘 마감" : `D-${notice.dday}`}</span>}</div><h3 className="mt-4 text-xl font-black leading-7">{notice.title}</h3><p className="mt-1 text-sm font-bold text-[#778399]">{notice.org}</p>{notice.supportSummary && <p className="mt-4 rounded-xl bg-[#f7faff] px-4 py-3 text-sm font-bold text-[#334764]">{notice.supportSummary}</p>}<ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{notice.reasons.map((reason) => <li key={reason} className="text-xs font-bold text-[#4d5f78]">✓ {reason}</li>)}</ul><p className="mt-4 text-sm leading-6 text-[#68768d]">{notice.summary}</p>{!demo && <div className="mt-5 flex gap-2"><button onClick={onSave} className={`rounded-lg border px-4 py-3 text-sm font-black ${saved ? "border-[#20b486] bg-[#ecfaf5] text-[#08795a]" : "border-[#cbd8ea] text-[#506078]"}`}>{saved ? "✓ 저장됨" : "☆ 공고 저장"}</button>{notice.url && <a href={notice.url} target="_blank" rel="noreferrer" onClick={() => logEvent("notice_click", sessionId, notice.id, leadId ?? undefined)} className="flex-1 rounded-lg bg-[var(--navy)] px-4 py-3 text-center text-sm font-black text-white">공고문 확인 →</a>}</div>}</article>;
}

function LeadForm({ profile, sessionId, leadId, setLeadId, matchCount }: { profile: RadarProfile; sessionId: string; leadId: string | null; setLeadId: (value: string) => void; matchCount: number }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", privacy: false, marketing: false }); const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle"); const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) { event.preventDefault(); setState("sending"); const params = new URLSearchParams(window.location.search); const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...profile, sessionId, name: form.name, email: form.email, phone: form.phone, consentPrivacy: form.privacy, consentService: alertsLive && form.privacy, consentMarketing: form.marketing, utm: Object.fromEntries([...params.entries()].filter(([key]) => key.startsWith("utm_"))) }) }); const data = await response.json(); if (response.ok) { setLeadId(data.leadId); setState("done"); } else { setMessage(data.error || "등록하지 못했습니다."); setState("error"); } }
  if (leadId || state === "done") return <aside id="alert-form" className="h-fit rounded-2xl border border-[#a9dfcd] bg-[#effaf6] p-6 lg:sticky lg:top-24"><span className="grid size-11 place-items-center rounded-full bg-[#20b486] text-xl text-white">✓</span><h2 className="mt-5 text-xl font-black">{alertsLive ? "맞춤 알림 신청 완료" : "프리뷰 관심 등록 완료"}</h2><p className="mt-3 text-sm leading-6 text-[#557064]">{alertsLive ? "새 공고와 저장한 공고의 마감 알림을 보내드릴 준비가 됐습니다." : "관심 등록이 저장됐습니다. 프리뷰에서는 이메일을 보내지 않으며, 정식 알림은 다시 신청해야 합니다."}</p></aside>;
  return <aside id="alert-form" className="h-fit rounded-2xl bg-[var(--navy)] p-6 text-white lg:sticky lg:top-24"><span className="text-xs font-black tracking-[.14em] text-[#70a9ff]">{alertsLive ? "FREE ALERT" : "PREVIEW INTEREST"}</span><h2 className="mt-3 text-2xl font-black">{alertsLive ? <>다음 공고를<br />놓치지 마세요.</> : <>프리뷰 관심을<br />남겨주세요.</>}</h2><p className="mt-3 text-sm leading-6 text-[#aebfda]">{alertsLive ? `현재 조건 ${matchCount}건을 저장하고 신규 공고·D-7·D-3 알림을 받아보세요.` : `현재 조건 ${matchCount}건을 확인했습니다. 관심 등록과 공고 저장만 가능하며 메일은 발송하지 않습니다.`}</p><form className="mt-6 grid gap-3" onSubmit={submit}><input aria-label="이름" placeholder="이름 (선택)" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="form-input" /><input aria-label="이메일" type="email" required placeholder="이메일 (필수)" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="form-input" /><input aria-label="휴대폰" inputMode="tel" placeholder="휴대폰 (선택)" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="form-input" /><label className="mt-2 flex gap-2 text-xs leading-5 text-[#c3d0e4]"><input required type="checkbox" checked={form.privacy} onChange={(event) => setForm({ ...form, privacy: event.target.checked })} /> <span>{alertsLive ? "맞춤 알림 제공을 위한 개인정보 수집·이용에 동의합니다. (필수)" : "프리뷰 관심 등록을 위한 개인정보 수집·이용에 동의합니다. (필수)"}</span></label><label className="flex gap-2 text-xs leading-5 text-[#c3d0e4]"><input type="checkbox" checked={form.marketing} onChange={(event) => setForm({ ...form, marketing: event.target.checked })} /> <span>비즈핏 교육·상담·이벤트 안내를 받습니다. (선택)</span></label>{state === "error" && <p className="rounded-lg bg-[#ffdddd] px-3 py-2 text-xs font-bold text-[#8d2020]">{message}</p>}<button disabled={state === "sending"} className="mt-2 rounded-xl bg-[var(--blue)] px-5 py-4 font-black disabled:opacity-60">{state === "sending" ? "등록 중…" : (alertsLive ? "무료 맞춤 알림 받기" : "프리뷰 관심 등록하기")}</button></form><p className="mt-3 text-center text-[11px] text-[#859ab9]">{alertsLive ? "언제든 수신 해지할 수 있습니다." : "정식 알림은 별도 신청이 필요합니다."}</p></aside>;
}
