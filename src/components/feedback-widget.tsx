"use client";

import { useEffect, useState } from "react";
import { getRadarSessionId, trackEvent, trackPageView } from "@/lib/client-analytics";

type Page = "home" | "prep-map";
const categories = ["개선 제안", "불편·오류", "공고 제보", "기타 문의"] as const;

export default function FeedbackWidget({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<(typeof categories)[number]>("개선 제안");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<"idle" | "done" | "error">("idle");

  useEffect(() => { trackPageView(page); }, [page]);

  function openPanel() {
    setOpen(true);
    setResult("idle");
    trackEvent("feedback_open", undefined, undefined, undefined, { page });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || message.trim().length < 10 || sending) return;
    setSending(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message: message.trim(), page, sessionId: getRadarSessionId(), consent, website: "" }),
      });
      if (!response.ok) throw new Error("feedback failed");
      setMessage("");
      setConsent(false);
      setResult("done");
    } catch {
      setResult("error");
    } finally {
      setSending(false);
    }
  }

  return <div className="fixed bottom-4 right-4 z-40 w-[min(370px,calc(100vw-32px))] sm:bottom-6 sm:right-6">
    {open ? <section role="dialog" aria-label="개선 의견 접수" className="max-h-[min(75vh,620px)] overflow-y-auto rounded-2xl border border-[#cbdaf0] bg-white p-5 text-[#09224a] shadow-[0_22px_70px_rgba(4,31,77,.24)]">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-[var(--blue)]">BIZFIT FEEDBACK</p><h2 className="mt-1 text-lg font-black">의견을 들려주세요</h2><p className="mt-1 text-xs leading-5 text-[#657187]">불편한 점과 필요한 기능을 다음 개선 때 검토하겠습니다.</p></div><button type="button" aria-label="의견 창 닫기" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-xl text-[#657187] hover:bg-[#f0f4fa]">×</button></div>
      {result === "done" ? <div className="mt-5 rounded-xl bg-[#ecfaf5] p-4 text-sm leading-6 text-[#08795a]"><strong className="block">의견이 접수됐습니다.</strong>다음 업데이트를 준비할 때 함께 검토하겠습니다.<button type="button" onClick={() => setOpen(false)} className="mt-3 block font-black underline">닫기</button></div> : <form onSubmit={submit} className="mt-5 grid gap-3"><label className="text-xs font-black" htmlFor="feedback-category">의견 종류</label><select id="feedback-category" value={category} onChange={(event) => setCategory(event.target.value as (typeof categories)[number])} className="rounded-lg border border-[#cbd8ea] bg-white px-3 py-2.5 text-sm">{categories.map((item) => <option key={item}>{item}</option>)}</select><label className="text-xs font-black" htmlFor="feedback-message">내용</label><textarea id="feedback-message" required minLength={10} maxLength={1000} rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="어떤 점을 개선하면 좋을까요? (10자 이상)" className="resize-y rounded-lg border border-[#cbd8ea] px-3 py-2.5 text-sm outline-none focus:border-[var(--blue)]" /><p className="text-right text-[11px] text-[#75839a]">{message.length}/1000자</p><p className="rounded-lg bg-[#f3f7fd] px-3 py-2 text-xs leading-5 text-[#596b84]">의견은 관리자만 확인합니다. 연락처·비밀번호 등 개인정보는 적지 마세요. 답변 기능은 아직 없습니다.</p><label className="flex items-start gap-2 text-xs leading-5 text-[#52627b]"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" /><span>입력한 의견과 임시 이용 세션을 서비스 개선 목적으로 저장·검토하는 데 동의합니다.</span></label>{result === "error" && <p role="alert" className="text-xs font-bold text-[#a63333]">접수하지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}<button type="submit" disabled={sending || !consent || message.trim().length < 10} className="rounded-xl bg-[var(--blue)] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">{sending ? "접수 중…" : "의견 보내기"}</button></form>}
    </section> : <button type="button" onClick={openPanel} className="ml-auto flex items-center gap-2 rounded-full bg-[var(--blue)] px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_32px_rgba(16,98,229,.35)] hover:bg-[#2674ed]"><span aria-hidden="true">✦</span> 개선 의견 보내기</button>}
  </div>;
}
