"use client";

import { useState } from "react";
import Link from "next/link";

export default function UnsubscribePage() {
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");
  async function unsubscribe() {
    setState("pending");
    const token = new URLSearchParams(window.location.search).get("token");
    const response = await fetch("/api/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
    setState(response.ok ? "done" : "error");
  }
  return <main className="grid min-h-screen place-items-center bg-[#f5f8fc] p-5"><div className="soft-card w-full max-w-md p-8 text-center"><p className="eyebrow">BIZFIT ALERT</p><h1 className="mt-3 text-2xl font-black">맞춤 알림 수신 해지</h1><p className="mt-4 text-sm leading-6 text-[#68768d]">이메일 알림 수신을 중단합니다. 이미 발송된 메일은 회수되지 않습니다.</p>{state === "done" ? <p className="mt-6 rounded-lg bg-[#e6f8f2] p-4 font-bold text-[#08795a]">수신 해지가 완료되었습니다.</p> : <button onClick={unsubscribe} disabled={state === "pending"} className="mt-6 w-full rounded-xl bg-[var(--navy)] py-4 font-black text-white">{state === "pending" ? "처리 중…" : "알림 수신 해지하기"}</button>}{state === "error" && <p className="mt-3 text-sm font-bold text-[#9a3030]">유효한 해지 링크인지 확인해주세요.</p>}<Link href="/" className="mt-5 inline-block text-sm font-bold text-[var(--blue)]">홈으로 돌아가기</Link></div></main>;
}
