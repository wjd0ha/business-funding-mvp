"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { businessStatuses, industries, interests, regions, supportAreas, interestMatchesCategories } from "@/data/radar";
import { matchNotices } from "@/lib/matching";
import type { MatchResult, Notice, RadarProfile } from "@/lib/radar-types";

const emptyProfile: RadarProfile = { businessStatus: "", region: "", industry: "", openDate: null, employeesBand: "", interests: [] };
const steps = ["사업 형태와 지역", "업종과 업력", "지원 분야"];
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
  const [screen, setScreen] = useState<"intro" | "results">("intro");
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
    if (step === steps.length - 1) { setScreen("results"); window.scrollTo({ top: 0, behavior: "smooth" }); logEvent("result_view", sessionId); }
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
      {screen === "intro" && <>
        <Intro onStart={() => { document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" }); logEvent("survey_start", sessionId); }} count={notices.length} demo={noticeSource === "demo"} />
        <Survey step={step} profile={profile} choose={choose} onNext={next} onBack={() => setStep((value) => Math.max(0, value - 1))} candidateCount={activeMatches.length} interestCount={activeMatches.filter((notice) => interestMatchesCategories(profile.interests, [notice.category, ...notice.alsoCategories])).length} />
      </>}
      {screen === "results" && <Results profile={profile} matches={activeMatches} expected={expectedMatches} loading={loadingNotices} demo={noticeSource === "demo"} sessionId={sessionId} leadId={leadId} setLeadId={setLeadId} onRestart={() => { setStep(0); setScreen("intro"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

      <footer className="border-t border-[#dfe8f5] bg-white px-5 py-8 text-center text-xs leading-6 text-[#768298]">
        <p>© 2026 BIZFIT. All rights reserved. · 공고 내용과 신청 자격은 반드시 해당 기관의 최신 공고문을 확인해주세요.</p>
        <Link className="mt-1 inline-block font-bold text-[var(--blue)]" href="/admin">관리자 CRM</Link>
      </footer>
    </main>
  );
}

function Intro({ onStart, count, demo }: { onStart: () => void; count: number; demo: boolean }) {
  return <>
    <section className="relative overflow-hidden bg-[var(--navy)] text-white">
      <div className="radar-grid absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 text-center lg:px-8 lg:py-20">
        <p className="mx-auto inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-[#b6d1ff]">지역 · 업종 · 업력 · 지원 분야를 내 조건으로 연결</p>
        <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">내 사업에 맞는 지원사업,<br /><span className="text-[#83b5ff]">조건부터 맞춰 찾아보세요.</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#c8d7ee]">사업 형태와 소재 지역을 먼저 확인하고, 업종·업력·관심 분야를 더해 공고 후보를 좁혀드립니다. 결과에서는 어떤 조건이 맞았는지도 함께 보여드립니다.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={onStart} className="rounded-xl bg-[var(--blue)] px-7 py-4 text-base font-black shadow-[0_18px_45px_rgba(16,98,229,.38)] hover:bg-[#2674ed]">내 조건 입력하고 공고 찾기 →</button><Link href="/prep-map" className="rounded-xl border border-white/25 px-7 py-4 text-center font-bold text-[#dbe8fa] hover:bg-white/10">2027 준비지도 보기</Link></div>
        <p className="mt-4 text-xs text-[#a8bddc]">가입 없이 결과 확인 · 개인정보 입력은 관심 등록을 원할 때만</p>
        <div className="mx-auto mt-12 grid max-w-3xl gap-3 border-t border-white/15 pt-8 text-center sm:grid-cols-3">{[[demo ? "예시 공고" : "현재 수집 공고", count ? `${count.toLocaleString()}건` : "확인 중"], ["사업 지역", "17개 시·도"], ["지원 분야", "8개 큰 분야"]].map(([label, value]) => <div key={label} className="rounded-xl bg-white/5 p-3"><strong className="block text-2xl font-black text-white">{value}</strong><span className="mt-1 block text-xs text-[#b7c9e6]">{label}</span></div>)}</div>
        <p className="mt-4 text-xs text-[#9fb4d3]">표시 건수는 현재 비즈핏이 수집한 공고이며 기업마당 전체 공고 수가 아닙니다.</p>
      </div>
    </section>
    <section id="how" className="mx-auto max-w-7xl px-5 pt-16 lg:px-8"><p className="eyebrow">HOW BIZFIT WORKS</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">입력한 조건은 이렇게 결과에 반영됩니다</h2><div className="mt-5 grid gap-3 md:grid-cols-3">{[["01","지역·사업 형태","지역 제한과 예비·운영·재창업 대상을 먼저 구분합니다."],["02","업종·업력","수집 공고에 해당 조건이 명시된 경우 비교합니다. 불명확한 자격은 공고문에서 확인해야 합니다."],["03","지원 분야","금융·기술·인력·수출·내수·창업·경영·기타를 바탕으로 관심 분야를 우선 정렬합니다."]].map(([no,title,detail]) => <article key={no} className="soft-card p-5"><span className="text-xs font-black text-[var(--blue)]">{no}</span><h3 className="mt-3 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[#657187]">{detail}</p></article>)}</div></section>
  </>;
}

type SurveyProps = { step: number; profile: RadarProfile; choose: <K extends keyof RadarProfile>(key: K, value: RadarProfile[K]) => void; onNext: () => void; onBack: () => void; candidateCount: number; interestCount: number };
function Survey({ step, profile, choose, onNext, onBack, candidateCount, interestCount }: SurveyProps) {
  const canNext = [Boolean(profile.businessStatus && profile.region), Boolean(profile.industry), profile.interests.length > 0][step];
  function toggleInterest(item: string) {
    const current = profile.interests.filter((value) => value !== "잘 모르겠음");
    choose("interests", profile.interests.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }
  const statusLabel = businessStatuses.find((item) => item.value === profile.businessStatus)?.label;
  const industryLabel = industries.find(([value]) => value === profile.industry)?.[1];
  return <section id="wizard" className="scroll-mt-24 mx-auto max-w-5xl px-5 py-16 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">MY BUSINESS PROFILE</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">내 조건으로 공고 찾기</h2><p className="mt-2 text-sm text-[#657187]">3단계로 사업 조건을 입력하면 수집된 공고에서 확인할 후보를 보여드립니다.</p></div><span className="rounded-full bg-[#eaf2ff] px-4 py-2 text-sm font-black text-[var(--blue)]">{step + 1} / 3단계</span></div>
    <div className="mt-6 grid grid-cols-3 gap-2">{steps.map((name, index) => <div key={name}><div className={`h-2 rounded-full ${index <= step ? "bg-[var(--blue)]" : "bg-[#dfe8f5]"}`} /><span className={`mt-2 block text-xs font-bold ${index === step ? "text-[var(--blue)]" : "text-[#78869b]"}`}>{name}</span></div>)}</div>
    <div className="mt-7 rounded-3xl border border-[#d9e4f5] bg-white p-6 shadow-[0_24px_70px_rgba(4,31,77,.08)] sm:p-9">
      {step === 0 && <><h3 className="text-xl font-black">1. 사업 형태와 소재 지역</h3><p className="mt-2 text-sm leading-6 text-[#657187]">사업 대상과 지역 제한을 먼저 확인합니다. 소재지는 사업자등록지 기준으로 선택해주세요.</p><div className="mt-7"><h4 className="mb-3 text-sm font-black">사업 형태</h4><Options items={businessStatuses.map((item) => ({ value: item.value, title: item.label, detail: item.detail }))} selected={profile.businessStatus} onSelect={(value) => choose("businessStatus", value as RadarProfile["businessStatus"])} columns /></div><div className="mt-8"><h4 className="mb-3 text-sm font-black">사업자 소재 지역</h4><GridOptions items={regions} selected={profile.region} onSelect={(value) => choose("region", value)} /><p className="mt-3 text-xs leading-5 text-[#728098]">‘전국’은 지역 제한 없이 탐색하는 옵션입니다. 지역사업 신청 자격은 결과에서 다시 확인해야 합니다.</p></div></>}
      {step === 1 && <><h3 className="text-xl font-black">2. 업종과 업력</h3><p className="mt-2 text-sm leading-6 text-[#657187]">업종을 고르고, 운영 중인 사업자라면 개업일을 입력해주세요. 입력한 업력은 공고의 연차 조건과 비교합니다.</p><div className="mt-7"><h4 className="mb-3 text-sm font-black">주요 업종</h4><Options items={industries.map(([value, title]) => ({ value, title }))} selected={profile.industry} onSelect={(value) => choose("industry", value)} columns /></div><div className="mt-8 border-t border-[#e8eef8] pt-7"><label htmlFor="open-date" className="block text-sm font-black">개업일 <span className="font-medium text-[#728098]">(선택)</span></label><input id="open-date" type="date" value={profile.openDate ?? ""} onChange={(event) => choose("openDate", event.target.value || null)} className="mt-3 w-full max-w-sm rounded-xl border border-[#cbd8ea] px-4 py-3 outline-none focus:border-[var(--blue)]" /><p className="mt-2 text-xs leading-5 text-[#728098]">개업일을 비우면 업력 제한이 있는 공고는 원문 확인이 필요합니다.</p></div></>}
      {step === 2 && <><h3 className="text-xl font-black">3. 찾고 싶은 지원 분야</h3><p className="mt-2 text-sm leading-6 text-[#657187]">기업마당의 큰 분야를 참고해 골랐습니다. 복수 선택 가능하며, 관심 분야와 일치하는 공고를 결과에서 먼저 보여드립니다.</p><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{supportAreas.map((area) => { const selected = profile.interests.includes(area.label); return <button key={area.label} type="button" onClick={() => toggleInterest(area.label)} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-[var(--blue)] bg-[#edf5ff] ring-2 ring-[#1062e5]/10" : "border-[#d9e4f5] hover:border-[#86adf0]"}`}><span className="flex items-center justify-between"><strong className="text-lg">{area.label}</strong><span className={`grid size-5 place-items-center rounded-full text-xs ${selected ? "bg-[var(--blue)] text-white" : "border border-[#b9c8dd]"}`}>{selected ? "✓" : ""}</span></span><span className="mt-2 block text-xs text-[#657187]">{area.description}</span></button>; })}</div><div className="mt-8 border-t border-[#e8eef8] pt-7"><h4 className="text-sm font-black">세부 관심사로 더 좁히기 <span className="font-medium text-[#728098]">(선택)</span></h4><div className="mt-3 flex flex-wrap gap-2">{interests.map((item) => <button key={item} type="button" onClick={() => toggleInterest(item)} className={`rounded-full border px-3 py-2 text-sm font-bold ${profile.interests.includes(item) ? "border-[var(--blue)] bg-[#edf5ff] text-[var(--blue)]" : "border-[#d9e4f5] text-[#52627b] hover:border-[#86adf0]"}`}>{item}</button>)}</div><button type="button" onClick={() => choose("interests", ["잘 모르겠음"])} className={`mt-4 text-sm font-bold ${profile.interests.includes("잘 모르겠음") ? "text-[var(--blue)]" : "text-[#728098]"}`}>잘 모르겠어요 · 모든 분야 살펴보기</button></div></>}
      <div className="mt-8 rounded-2xl bg-[#f5f8fe] p-4"><p className="text-xs font-black text-[var(--blue)]">입력 조건과 연결</p><p className="mt-2 text-sm font-bold text-[#42536e]">{[statusLabel, profile.region && (profile.region === "전국" ? "전체 지역 탐색" : profile.region), industryLabel, profile.openDate && `${profile.openDate} 개업`, ...profile.interests].filter(Boolean).join(" · ") || "조건을 선택해 주세요"}</p><p className="mt-2 text-xs text-[#728098]">{profile.businessStatus && profile.region && profile.industry ? `현재 수집 공고 중 조건 후보 ${candidateCount}건 · 선택 분야 일치 ${interestCount}건. 최종 자격은 공고문 확인이 필요합니다.` : "사업 형태·지역·업종을 입력하면 공고 후보 수를 확인할 수 있습니다."}</p></div>
      <div className="mt-7 flex items-center justify-between border-t border-[#edf1f7] pt-6"><button type="button" disabled={step === 0} onClick={onBack} className="px-3 py-3 font-bold text-[#66738a] disabled:opacity-30">← 이전</button><button type="button" disabled={!canNext} onClick={onNext} className="rounded-xl bg-[var(--blue)] px-7 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-35">{step === 2 ? "내 조건에 맞는 공고 보기" : "다음 단계"} →</button></div>
    </div>
  </section>;
}

function Options({ items, selected, onSelect, columns = false }: { items: Array<{ value: string; title: string; detail?: string }>; selected: string; onSelect: (value: string) => void; columns?: boolean }) {
  return <div className={`grid gap-3 ${columns ? "sm:grid-cols-2" : ""}`}>{items.map((item) => <button key={item.value} onClick={() => onSelect(item.value)} className={`option-card ${selected === item.value ? "option-selected" : ""}`}><span className="radio-dot"><span /></span><span><strong className="block text-left text-lg">{item.title}</strong>{item.detail && <small className="mt-1 block text-left leading-5 text-[#718096]">{item.detail}</small>}</span></button>)}</div>;
}
function GridOptions({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (value: string) => void }) {
  return <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">{items.map((item) => <button key={item} onClick={() => onSelect(item)} className={`rounded-xl border px-2 py-4 font-black transition ${selected === item ? "border-[var(--blue)] bg-[#edf5ff] text-[var(--blue)] ring-2 ring-[#1062e5]/15" : "border-[#dfe8f5] hover:border-[#86adf0]"}`}>{item}</button>)}</div>;
}

function Results({ profile, matches, expected, loading, demo, sessionId, leadId, setLeadId, onRestart }: { profile: RadarProfile; matches: MatchResult[]; expected: MatchResult[]; loading: boolean; demo: boolean; sessionId: string; leadId: string | null; setLeadId: (value: string) => void; onRestart: () => void }) {
  const [visible, setVisible] = useState(6);
  const [saved, setSaved] = useState<string[]>([]);
  const [area, setArea] = useState("전체");
  const [query, setQuery] = useState("");
  const focused = matches.filter((item) => interestMatchesCategories(profile.interests, [item.category, ...item.alsoCategories]));
  const urgent = matches.filter((item) => item.dday != null && item.dday >= 0 && item.dday <= 7).length;
  const counts = supportAreas.map((item) => ({ label: item.label, count: matches.filter((notice) => item.categories.some((category) => [notice.category, ...notice.alsoCategories].includes(category))).length }));
  const displayed = matches.filter((notice) => {
    const categories = [notice.category, ...notice.alsoCategories];
    const areaMatch = area === "전체" || supportAreas.find((item) => item.label === area)?.categories.some((category) => categories.includes(category));
    const keyword = query.trim().toLocaleLowerCase();
    const queryMatch = !keyword || [notice.title, notice.org, notice.summary].some((value) => value?.toLocaleLowerCase().includes(keyword));
    return areaMatch && queryMatch;
  });
  const statusLabel = businessStatuses.find((item) => item.value === profile.businessStatus)?.label;
  const industryLabel = industries.find(([value]) => value === profile.industry)?.[1];
  async function save(noticeId: string) { if (!leadId) return document.getElementById("alert-form")?.scrollIntoView({ behavior: "smooth" }); const response = await fetch("/api/saved", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId, noticeId, sessionId }) }); if (response.ok) setSaved((items) => [...items, noticeId]); }
  return <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
    <div className="overflow-hidden rounded-3xl bg-[var(--navy)] p-7 text-white sm:p-10"><div className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-sm font-black tracking-[.16em] text-[#74aaff]">MY OPPORTUNITY RADAR</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">내 조건으로 확인할 공고 <span className="text-[#8dbaff]">{matches.length}건</span></h1><p className="mt-3 text-sm leading-6 text-[#b6c8e4]">{demo ? "예시 데이터로 화면을 살펴보는 중입니다." : "현재 수집 공고 중 기본 조건을 통과한 후보입니다. 최종 지원 자격은 공고문에서 확인해주세요."}</p></div><button onClick={onRestart} className="rounded-xl border border-white/25 px-4 py-3 text-sm font-black hover:bg-white/10">조건 다시 설정</button></div><div className="mt-6 flex flex-wrap gap-2">{[statusLabel, profile.region === "전국" ? "전체 지역 탐색" : profile.region, industryLabel, profile.openDate && `${profile.openDate} 개업`, ...profile.interests].filter(Boolean).map((item) => <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#e3eeff]">{item}</span>)}</div><div className="mt-6 grid gap-3 border-t border-white/15 pt-5 sm:grid-cols-3">{[[matches.length, "조건 후보"], [focused.length, "선택 분야 일치"], [urgent, "7일 내 마감"]].map(([value, label]) => <div key={String(label)} className="rounded-xl bg-white/10 px-4 py-3"><strong className="text-2xl">{value}</strong><span className="ml-2 text-xs text-[#b6c8e4]">{label}</span></div>)}</div></div>
    <div className="mt-7 rounded-2xl border border-[#d9e4f5] bg-white p-4 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row"><input aria-label="공고 검색" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(6); }} placeholder="공고명·기관명·키워드 검색" className="min-w-0 flex-1 rounded-xl border border-[#d9e4f5] px-4 py-3 text-sm outline-none focus:border-[var(--blue)]" /><span className="self-center text-xs font-bold text-[#728098]">수집된 공고에서 검색</span></div><div className="mt-4 flex flex-wrap gap-2">{[{ label: "전체", count: matches.length }, ...counts].map((item) => <button key={item.label} type="button" onClick={() => { setArea(item.label); setVisible(6); }} className={`rounded-full border px-3 py-2 text-xs font-black ${area === item.label ? "border-[var(--blue)] bg-[var(--blue)] text-white" : "border-[#d9e4f5] bg-[#f8fbff] text-[#52627b] hover:border-[#86adf0]"}`}>{item.label} {item.count}</button>)}</div><p className="mt-3 text-xs leading-5 text-[#728098]">분야는 비즈핏 탐색 분류이며, 공고 원문의 세부 자격과 다를 수 있습니다.</p></div>
    <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_330px]"><div><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">{demo ? "예시 공고" : "지금 확인할 공고"}</h2><span className="text-sm font-bold text-[#63738c]">{displayed.length}건 표시</span></div>{focused.length === 0 && matches.length > 0 && profile.interests[0] !== "잘 모르겠음" && <p className="mt-3 rounded-xl bg-[#edf4ff] px-4 py-3 text-sm text-[#3d5d92]">선택 분야와 직접 일치한 공고는 아직 없습니다. 다른 조건이 맞는 후보를 함께 보여드립니다.</p>}{loading ? <div className="soft-card mt-5 p-10 text-center text-[#68768d]">공고 데이터를 불러오는 중입니다…</div> : displayed.length === 0 ? <div className="soft-card mt-5 p-10 text-center"><strong className="text-xl">이 조건의 공고가 아직 없어요.</strong><p className="mt-2 text-sm text-[#68768d]">분야나 검색어를 바꾸거나, 조건을 다시 설정해보세요.</p></div> : <div className="mt-5 grid gap-4">{displayed.slice(0, visible).map((notice) => <NoticeCard key={notice.id} notice={notice} saved={saved.includes(notice.id)} onSave={() => save(notice.id)} sessionId={sessionId} leadId={leadId} demo={demo} />)}{visible < displayed.length && <button className="rounded-xl border border-[#cbd8ea] bg-white py-4 font-black text-[var(--blue)]" onClick={() => setVisible((value) => value + 6)}>공고 더 보기 ({displayed.length - visible})</button>}</div>}{expected.length > 0 && <div className="mt-12"><p className="eyebrow">PREPARE NEXT</p><h2 className="mt-2 text-2xl font-black">곧 준비할 사업기회</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{expected.slice(0, 4).map((notice) => <article key={notice.id} className="soft-card p-5"><span className="rounded-md bg-[#fff6db] px-2 py-1 text-xs font-black text-[#8d6200]">예상 공고</span><h3 className="mt-4 font-black">{notice.title}</h3><p className="mt-2 text-sm leading-6 text-[#68768d]">{notice.summary}</p><p className="mt-4 text-xs font-bold text-[var(--blue)]">{notice.expectedWindow || "일정 확인 필요"}</p></article>)}</div></div>}</div>{demo ? <aside className="h-fit rounded-2xl border border-[#f0d683] bg-[#fff9e6] p-6 text-sm leading-6 text-[#795300]">실제 공고 수집과 개발 DB 연결 후 맞춤 알림 신청이 열립니다.</aside> : <LeadForm profile={profile} sessionId={sessionId} leadId={leadId} setLeadId={setLeadId} matchCount={matches.length} />}</div>
  </section>;
}

function NoticeCard({ notice, saved, onSave, sessionId, leadId, demo }: { notice: MatchResult; saved: boolean; onSave: () => void; sessionId: string; leadId: string | null; demo: boolean }) {
  const fieldMatched = notice.reasons.some((reason) => reason.startsWith("관심 분야 일치"));
  return <article className="soft-card p-6"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ${fieldMatched ? "bg-[#e6f8f2] text-[#08795a]" : "bg-[#fff6db] text-[#8d6200]"}`}>{fieldMatched ? "선택 분야 일치" : "추가 확인 후보"}</span><span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-black text-[var(--blue)]">{notice.category}</span>{!demo && notice.dday != null && <span className={`ml-auto text-sm font-black ${notice.dday <= 7 ? "text-[#e24848]" : "text-[#68768d]"}`}>{notice.dday === 0 ? "오늘 마감" : `D-${notice.dday}`}</span>}</div><h3 className="mt-4 text-xl font-black leading-7">{notice.title}</h3><p className="mt-1 text-sm font-bold text-[#778399]">{notice.org}</p>{notice.supportSummary && <p className="mt-4 rounded-xl bg-[#f7faff] px-4 py-3 text-sm font-bold text-[#334764]">{notice.supportSummary}</p>}<ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{notice.reasons.map((reason) => <li key={reason} className="text-xs font-bold text-[#4d5f78]">✓ {reason}</li>)}</ul><p className="mt-4 text-sm leading-6 text-[#68768d]">{notice.summary}</p>{!demo && <div className="mt-5 flex gap-2"><button onClick={onSave} className={`rounded-lg border px-4 py-3 text-sm font-black ${saved ? "border-[#20b486] bg-[#ecfaf5] text-[#08795a]" : "border-[#cbd8ea] text-[#506078]"}`}>{saved ? "✓ 저장됨" : "☆ 공고 저장"}</button>{notice.url && <a href={notice.url} target="_blank" rel="noreferrer" onClick={() => logEvent("notice_click", sessionId, notice.id, leadId ?? undefined)} className="flex-1 rounded-lg bg-[var(--navy)] px-4 py-3 text-center text-sm font-black text-white">공고문 확인 →</a>}</div>}</article>;
}

function LeadForm({ profile, sessionId, leadId, setLeadId, matchCount }: { profile: RadarProfile; sessionId: string; leadId: string | null; setLeadId: (value: string) => void; matchCount: number }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", privacy: false, marketing: false }); const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle"); const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) { event.preventDefault(); setState("sending"); const params = new URLSearchParams(window.location.search); const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...profile, sessionId, name: form.name, email: form.email, phone: form.phone, consentPrivacy: form.privacy, consentService: alertsLive && form.privacy, consentMarketing: form.marketing, utm: Object.fromEntries([...params.entries()].filter(([key]) => key.startsWith("utm_"))) }) }); const data = await response.json(); if (response.ok) { setLeadId(data.leadId); setState("done"); } else { setMessage(data.error || "등록하지 못했습니다."); setState("error"); } }
  if (leadId || state === "done") return <aside id="alert-form" className="h-fit rounded-2xl border border-[#a9dfcd] bg-[#effaf6] p-6 lg:sticky lg:top-24"><span className="grid size-11 place-items-center rounded-full bg-[#20b486] text-xl text-white">✓</span><h2 className="mt-5 text-xl font-black">{alertsLive ? "맞춤 알림 신청 완료" : "프리뷰 관심 등록 완료"}</h2><p className="mt-3 text-sm leading-6 text-[#557064]">{alertsLive ? "새 공고와 저장한 공고의 마감 알림을 보내드릴 준비가 됐습니다." : "관심 등록이 저장됐습니다. 프리뷰에서는 이메일을 보내지 않으며, 정식 알림은 다시 신청해야 합니다."}</p></aside>;
  return <aside id="alert-form" className="h-fit rounded-2xl bg-[var(--navy)] p-6 text-white lg:sticky lg:top-24"><span className="text-xs font-black tracking-[.14em] text-[#70a9ff]">{alertsLive ? "FREE ALERT" : "PREVIEW INTEREST"}</span><h2 className="mt-3 text-2xl font-black">{alertsLive ? <>다음 공고를<br />놓치지 마세요.</> : <>프리뷰 관심을<br />남겨주세요.</>}</h2><p className="mt-3 text-sm leading-6 text-[#aebfda]">{alertsLive ? `현재 조건 ${matchCount}건을 저장하고 신규 공고·D-7·D-3 알림을 받아보세요.` : `현재 조건 ${matchCount}건을 확인했습니다. 관심 등록과 공고 저장만 가능하며 메일은 발송하지 않습니다.`}</p><form className="mt-6 grid gap-3" onSubmit={submit}><input aria-label="이름" placeholder="이름 (선택)" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="form-input" /><input aria-label="이메일" type="email" required placeholder="이메일 (필수)" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="form-input" /><input aria-label="휴대폰" inputMode="tel" placeholder="휴대폰 (선택)" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="form-input" /><label className="mt-2 flex gap-2 text-xs leading-5 text-[#c3d0e4]"><input required type="checkbox" checked={form.privacy} onChange={(event) => setForm({ ...form, privacy: event.target.checked })} /> <span>{alertsLive ? "맞춤 알림 제공을 위한 개인정보 수집·이용에 동의합니다. (필수)" : "프리뷰 관심 등록을 위한 개인정보 수집·이용에 동의합니다. (필수)"}</span></label><label className="flex gap-2 text-xs leading-5 text-[#c3d0e4]"><input type="checkbox" checked={form.marketing} onChange={(event) => setForm({ ...form, marketing: event.target.checked })} /> <span>비즈핏 교육·상담·이벤트 안내를 받습니다. (선택)</span></label>{state === "error" && <p className="rounded-lg bg-[#ffdddd] px-3 py-2 text-xs font-bold text-[#8d2020]">{message}</p>}<button disabled={state === "sending"} className="mt-2 rounded-xl bg-[var(--blue)] px-5 py-4 font-black disabled:opacity-60">{state === "sending" ? "등록 중…" : (alertsLive ? "무료 맞춤 알림 받기" : "프리뷰 관심 등록하기")}</button></form><p className="mt-3 text-center text-[11px] text-[#859ab9]">{alertsLive ? "언제든 수신 해지할 수 있습니다." : "정식 알림은 별도 신청이 필요합니다."}</p></aside>;
}
