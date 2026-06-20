"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PoolPickFooter } from "@/components/poolpick/PoolPickFooter";
import {
  comparisonRows,
  faqItems,
  journeySteps,
  landingHighlights,
  poolTypeOptions,
} from "@/data/poolpick";

type LeadForm = {
  poolType: string;
  region: string;
  name: string;
  phone: string;
  message: string;
};

const initialForm: LeadForm = {
  poolType: "",
  region: "",
  name: "",
  phone: "",
  message: "",
};

export default function PoolPickLanding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goToStep2() {
    if (!form.poolType || !form.region.trim()) return;
    setStep(2);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function resetForm() {
    setForm(initialForm);
    setStep(1);
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#0f3331]">
      {/* Hero + lead form */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <Link href="/poolpick" className="inline-flex items-center gap-2 text-sm font-black text-[#0d9488]">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#0d9488] text-xs font-black text-white">
              PP
            </span>
            풀픽 PoolPick
          </Link>
          <h1 className="mt-5 text-3xl font-black leading-tight text-[#0f3331] sm:text-5xl">
            내 마당의 수영장,
            <br />
            3D로 먼저 보고
            <br />
            구독형 관리까지 한 번에
          </h1>
          <p className="mt-5 text-base leading-7 text-[#3f5c57] sm:text-lg">
            몇 가지 정보만 남겨주시면 3D 시뮬레이션과 예상 견적 비교를 무료로
            준비해 드립니다.
          </p>
          <ul className="mt-6 grid gap-3">
            {landingHighlights.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-[#ccfbf1] bg-[#f0fdfa] p-4"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0d9488] text-xs font-black text-white">
                  ✓
                </span>
                <span>
                  <span className="block text-sm font-black text-[#0f3331] sm:text-base">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[#3f5c57]">
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="apply"
          className="rounded-2xl border border-[#99f6e4] bg-[#f0fdfa] p-6 shadow-[0_20px_50px_rgba(13,148,136,0.16)] sm:p-8"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#0d9488] text-2xl text-white">
                ✓
              </span>
              <h2 className="text-xl font-black text-[#0f3331]">신청이 접수되었습니다</h2>
              <p className="text-sm leading-6 text-[#3f5c57]">
                남겨주신 정보를 바탕으로 3D 시뮬레이션과 예상 견적을 준비해
                빠르게 연락드리겠습니다.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 rounded-md border border-[#99f6e4] bg-white px-5 py-3 text-sm font-black text-[#0f766e] transition hover:border-[#0d9488] hover:text-[#0d9488]"
              >
                다른 정보로 다시 신청하기
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="flex items-center gap-2 text-xs font-black text-[#0f766e]">
                <span className={`flex size-6 items-center justify-center rounded-full ${step === 1 ? "bg-[#0d9488] text-white" : "bg-[#ccfbf1] text-[#0f766e]"}`}>1</span>
                부지 정보
                <span className="h-px flex-1 bg-[#99f6e4]" />
                <span className={`flex size-6 items-center justify-center rounded-full ${step === 2 ? "bg-[#0d9488] text-white" : "bg-[#ccfbf1] text-[#0f766e]"}`}>2</span>
                연락처
              </div>

              {step === 1 ? (
                <div className="grid gap-4">
                  <h2 className="text-xl font-black text-[#0f3331]">어떤 수영장을 계획 중이신가요?</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {poolTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleChange("poolType", option.value)}
                        className={`rounded-lg border p-4 text-left transition ${
                          form.poolType === option.value
                            ? "border-[#0d9488] bg-white ring-2 ring-[#99f6e4]"
                            : "border-[#ccfbf1] bg-white hover:border-[#0d9488]"
                        }`}
                      >
                        <span className="block text-sm font-black text-[#0f3331]">{option.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-[#3f5c57]">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>

                  <label className="grid gap-1.5 text-sm font-bold text-[#3f5c57]">
                    설치 예정 지역
                    <input
                      required
                      value={form.region}
                      onChange={(event) => handleChange("region", event.target.value)}
                      placeholder="예) 경기도 가평군"
                      className="rounded-md border border-[#99f6e4] bg-white px-4 py-3 text-sm font-medium text-[#0f3331] outline-none transition focus:border-[#0d9488]"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={goToStep2}
                    disabled={!form.poolType || !form.region.trim()}
                    className="rounded-md bg-[#fb7185] px-6 py-4 text-base font-black text-white shadow-[0_12px_24px_rgba(251,113,133,0.32)] transition hover:bg-[#f43f5e] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    다음 단계로
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <h2 className="text-xl font-black text-[#0f3331]">연락처를 남겨주세요</h2>
                  <p className="text-sm leading-6 text-[#3f5c57]">
                    입력하신 부지 정보를 바탕으로 3D 시뮬레이션과 견적 비교를
                    준비해 연락드립니다.
                  </p>

                  <label className="grid gap-1.5 text-sm font-bold text-[#3f5c57]">
                    이름
                    <input
                      required
                      value={form.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      placeholder="홍길동"
                      className="rounded-md border border-[#99f6e4] bg-white px-4 py-3 text-sm font-medium text-[#0f3331] outline-none transition focus:border-[#0d9488]"
                    />
                  </label>

                  <label className="grid gap-1.5 text-sm font-bold text-[#3f5c57]">
                    연락처
                    <input
                      required
                      value={form.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      placeholder="010-0000-0000"
                      className="rounded-md border border-[#99f6e4] bg-white px-4 py-3 text-sm font-medium text-[#0f3331] outline-none transition focus:border-[#0d9488]"
                    />
                  </label>

                  <label className="grid gap-1.5 text-sm font-bold text-[#3f5c57]">
                    추가로 전달할 내용 (선택)
                    <textarea
                      value={form.message}
                      onChange={(event) => handleChange("message", event.target.value)}
                      rows={3}
                      placeholder="원하는 크기, 예산, 일정 등을 적어주세요"
                      className="rounded-md border border-[#99f6e4] bg-white px-4 py-3 text-sm font-medium text-[#0f3331] outline-none transition focus:border-[#0d9488]"
                    />
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-md border border-[#99f6e4] bg-white px-5 py-4 text-sm font-black text-[#0f766e] transition hover:border-[#0d9488]"
                    >
                      이전
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-[#fb7185] px-6 py-4 text-base font-black text-white shadow-[0_12px_24px_rgba(251,113,133,0.32)] transition hover:bg-[#f43f5e]"
                    >
                      무료 3D 견적 신청하기
                    </button>
                  </div>
                  <p className="text-center text-xs font-bold text-[#7c9c96]">
                    신청 정보는 3D 시뮬레이션과 견적 안내 목적으로만 사용됩니다.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Before / After */}
      <section className="bg-[#f0fdfa] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">BEFORE / AFTER</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              기존 방식과 이렇게 다릅니다
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#ccfbf1] bg-white">
            <div className="grid grid-cols-3 text-xs font-black text-[#0f3331] sm:text-sm">
              <div className="px-3 py-3 sm:px-4">구분</div>
              <div className="px-3 py-3 text-[#9bb8b3] sm:px-4">기존 방식</div>
              <div className="px-3 py-3 text-[#0d9488] sm:px-4">풀픽</div>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-t border-[#ccfbf1] text-xs leading-5 sm:text-sm sm:leading-6"
              >
                <div className="px-3 py-4 font-black text-[#0f3331] sm:px-4">
                  {row.label}
                </div>
                <div className="px-3 py-4 text-[#9bb8b3] sm:px-4">{row.before}</div>
                <div className="px-3 py-4 font-bold text-[#0f3331] sm:px-4">{row.after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">HOW IT WORKS</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              신청부터 시공까지, 이렇게 진행됩니다
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step) => (
              <div
                key={step.step}
                className="rounded-lg border border-[#ccfbf1] bg-white p-5 shadow-[0_10px_28px_rgba(13,148,136,0.06)]"
              >
                <p className="text-2xl font-black text-[#0d9488]">{step.step}</p>
                <h3 className="mt-3 text-base font-black text-[#0f3331]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#3f5c57]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f0fdfa] py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">FAQ</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              자주 묻는 질문
            </h2>
          </div>

          <div className="mt-10 grid gap-3">
            {faqItems.slice(0, 4).map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-[#ccfbf1] bg-white p-5 open:border-[#0d9488]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-black text-[#0f3331]">
                  {item.question}
                  <span className="ml-4 shrink-0 text-xl text-[#0d9488] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#3f5c57]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#fb7185] py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            지금 바로 무료 3D 견적을 신청하세요
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
            부지 정보만 남기면 3D 시뮬레이션과 시공업체 견적 비교를 무료로
            시작할 수 있습니다.
          </p>
          <a
            href="#apply"
            className="mt-7 inline-flex rounded-md bg-white px-7 py-4 text-base font-black text-[#e11d48] shadow-[0_12px_24px_rgba(225,29,72,0.2)] transition hover:bg-[#fff1f2]"
          >
            무료 3D 견적 신청하기
          </a>
        </div>
      </section>

      <PoolPickFooter
        notices={[
          "본 신청은 무료 3D 시뮬레이션 및 가견적 제공을 위한 사전 접수입니다.",
          "실제 시공 가능 여부와 정확한 비용은 현장 실측 이후 확정됩니다.",
          "남겨주신 연락처는 견적 안내 목적 외에는 사용되지 않습니다.",
        ]}
      />
    </main>
  );
}
