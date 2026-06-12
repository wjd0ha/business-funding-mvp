"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PoolPickFooter } from "@/components/poolpick/PoolPickFooter";
import {
  comparisonRows,
  faqItems,
  landingHighlights,
  processSteps,
} from "@/data/poolpick";

type LeadForm = {
  name: string;
  phone: string;
  region: string;
  poolType: string;
  message: string;
};

const initialForm: LeadForm = {
  name: "",
  phone: "",
  region: "",
  poolType: "outdoor",
  message: "",
};

const poolTypeOptions = [
  { value: "outdoor", label: "야외 수영장" },
  { value: "indoor", label: "실내 수영장" },
  { value: "glamping", label: "글램핑·캠핑장" },
  { value: "etc", label: "기타" },
];

export default function PoolPickLanding() {
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#0b2540]">
      {/* Hero + lead form */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-12 lg:px-8 lg:py-16">
        <div>
          <Link href="/poolpick" className="inline-flex items-center gap-2 text-sm font-black text-[#0284c7]">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#0ea5e9] text-xs font-black text-white">
              PP
            </span>
            풀픽 PoolPick
          </Link>
          <h1 className="mt-5 text-3xl font-black leading-tight text-[#0b2540] sm:text-5xl">
            내 마당의 수영장,
            <br />
            3D로 먼저 보고
            <br />
            견적까지 한 번에 비교하세요
          </h1>
          <p className="mt-5 text-base leading-7 text-[#5b6b7c] sm:text-lg">
            부지 정보를 남겨주시면 3D 시뮬레이션과 예상 견적 비교를 무료로
            준비해 드립니다.
          </p>
          <ul className="mt-6 grid gap-3">
            {landingHighlights.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-[#e3f2fb] bg-[#f8fdff] p-4"
              >
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-xs font-black text-white">
                  ✓
                </span>
                <span>
                  <span className="block text-sm font-black text-[#0b2540] sm:text-base">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[#5b6b7c]">
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="apply"
          className="rounded-2xl border border-[#cdeefb] bg-[#f8fdff] p-6 shadow-[0_20px_50px_rgba(14,165,233,0.14)] sm:p-8"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[#0ea5e9] text-2xl text-white">
                ✓
              </span>
              <h2 className="text-xl font-black text-[#0b2540]">신청이 접수되었습니다</h2>
              <p className="text-sm leading-6 text-[#5b6b7c]">
                남겨주신 정보를 바탕으로 3D 시뮬레이션과 예상 견적을 준비해
                빠르게 연락드리겠습니다.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-2 rounded-md border border-[#bfe6fb] bg-white px-5 py-3 text-sm font-black text-[#0369a1] transition hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
              >
                다른 정보로 다시 신청하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <h2 className="text-xl font-black text-[#0b2540]">무료 3D 견적 신청하기</h2>
              <p className="text-sm leading-6 text-[#5b6b7c]">
                아래 정보를 남겨주시면 3D 시뮬레이션과 견적 비교를 무료로
                도와드립니다.
              </p>

              <label className="grid gap-1.5 text-sm font-bold text-[#41566b]">
                이름
                <input
                  required
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="홍길동"
                  className="rounded-md border border-[#cdeefb] bg-white px-4 py-3 text-sm font-medium text-[#0b2540] outline-none transition focus:border-[#0ea5e9]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-bold text-[#41566b]">
                연락처
                <input
                  required
                  value={form.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  placeholder="010-0000-0000"
                  className="rounded-md border border-[#cdeefb] bg-white px-4 py-3 text-sm font-medium text-[#0b2540] outline-none transition focus:border-[#0ea5e9]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-bold text-[#41566b]">
                설치 예정 지역
                <input
                  required
                  value={form.region}
                  onChange={(event) => handleChange("region", event.target.value)}
                  placeholder="예) 경기도 가평군"
                  className="rounded-md border border-[#cdeefb] bg-white px-4 py-3 text-sm font-medium text-[#0b2540] outline-none transition focus:border-[#0ea5e9]"
                />
              </label>

              <label className="grid gap-1.5 text-sm font-bold text-[#41566b]">
                수영장 형태
                <select
                  value={form.poolType}
                  onChange={(event) => handleChange("poolType", event.target.value)}
                  className="rounded-md border border-[#cdeefb] bg-white px-4 py-3 text-sm font-medium text-[#0b2540] outline-none transition focus:border-[#0ea5e9]"
                >
                  {poolTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 text-sm font-bold text-[#41566b]">
                추가로 전달할 내용 (선택)
                <textarea
                  value={form.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  rows={3}
                  placeholder="원하는 크기, 예산, 일정 등을 적어주세요"
                  className="rounded-md border border-[#cdeefb] bg-white px-4 py-3 text-sm font-medium text-[#0b2540] outline-none transition focus:border-[#0ea5e9]"
                />
              </label>

              <button
                type="submit"
                className="rounded-md bg-[#0ea5e9] px-6 py-4 text-base font-black text-white shadow-[0_12px_24px_rgba(14,165,233,0.28)] transition hover:bg-[#0284c7]"
              >
                무료 3D 견적 신청하기
              </button>
              <p className="text-center text-xs font-bold text-[#9fb2c4]">
                신청 정보는 3D 시뮬레이션과 견적 안내 목적으로만 사용됩니다.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Before / After */}
      <section className="bg-[#f8fdff] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">BEFORE / AFTER</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              기존 방식과 이렇게 다릅니다
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#e3f2fb] bg-white">
            <div className="grid grid-cols-3 text-xs font-black text-[#0b2540] sm:text-sm">
              <div className="px-3 py-3 sm:px-4">구분</div>
              <div className="px-3 py-3 text-[#9fb2c4] sm:px-4">기존 방식</div>
              <div className="px-3 py-3 text-[#0ea5e9] sm:px-4">풀픽</div>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 border-t border-[#e3f2fb] text-xs leading-5 sm:text-sm sm:leading-6"
              >
                <div className="px-3 py-4 font-black text-[#0b2540] sm:px-4">
                  {row.label}
                </div>
                <div className="px-3 py-4 text-[#9fb2c4] sm:px-4">{row.before}</div>
                <div className="px-3 py-4 font-bold text-[#0b2540] sm:px-4">{row.after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">HOW IT WORKS</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              신청부터 시공까지, 이렇게 진행됩니다
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-lg border border-[#e3f2fb] bg-white p-5 shadow-[0_10px_28px_rgba(14,165,233,0.06)]"
              >
                <p className="text-2xl font-black text-[#0ea5e9]">{step.step}</p>
                <h3 className="mt-3 text-base font-black text-[#0b2540]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6b7c]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f8fdff] py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">FAQ</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              자주 묻는 질문
            </h2>
          </div>

          <div className="mt-10 grid gap-3">
            {faqItems.slice(0, 4).map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-[#e3f2fb] bg-white p-5 open:border-[#0ea5e9]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-black text-[#0b2540]">
                  {item.question}
                  <span className="ml-4 shrink-0 text-xl text-[#0ea5e9] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-[#5b6b7c]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0ea5e9] py-16">
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
            className="mt-7 inline-flex rounded-md bg-white px-7 py-4 text-base font-black text-[#0284c7] shadow-[0_12px_24px_rgba(2,132,199,0.24)] transition hover:bg-[#f0f9ff]"
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
