import Link from "next/link";
import { PoolPickFooter } from "@/components/poolpick/PoolPickFooter";
import {
  faqItems,
  journeySteps,
  painPoints,
  pillars,
  pricingPlans,
  subscriptionHighlights,
  trustCriteria,
} from "@/data/poolpick";

const navLinks = [
  { href: "#pillars", label: "핵심 가치" },
  { href: "#subscription", label: "구독 관리" },
  { href: "#network", label: "시공업체 매칭" },
  { href: "#pricing", label: "요금 안내" },
  { href: "#faq", label: "FAQ" },
];

export default function PoolPickHome() {
  return (
    <main className="min-h-screen bg-white text-[#0f3331]">
      <header className="sticky top-0 z-10 border-b border-[#ccfbf1] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/poolpick" className="flex items-center gap-2 text-lg font-black text-[#0f3331]">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#0d9488] text-sm font-black text-white">
              PP
            </span>
            풀픽 <span className="text-[#0d9488]">PoolPick</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#3f5c57] lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[#0d9488]">
                {link.label}
              </a>
            ))}
          </nav>
          <Link
            href="/poolpick/landing"
            className="shrink-0 rounded-md bg-[#fb7185] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(251,113,133,0.32)] transition hover:bg-[#f43f5e]"
          >
            무료 3D 견적 받기
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full bg-[#ccfbf1] px-3 py-1 text-xs font-black text-[#0d9488] ring-1 ring-[#99f6e4]">
            3D 시뮬레이션 · 견적 비교 · 구독형 유지보수
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-[#0f3331] sm:text-5xl">
            내 마당의 수영장,
            <br />
            짓기 전부터 관리까지
            <br />
            한 흐름으로
          </h1>
          <p className="mt-5 text-base leading-7 text-[#3f5c57] sm:text-lg">
            마당, 펜션, 글램핑장에 들어갈 수영장을 3D로 미리 보고, 검증된
            시공업체의 견적을 비교하고, 완공 후에는 정수기 렌탈처럼 부품과
            관리를 이어가세요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/poolpick/landing"
              className="rounded-md bg-[#fb7185] px-6 py-4 text-center text-base font-black text-white shadow-[0_12px_24px_rgba(251,113,133,0.32)] transition hover:bg-[#f43f5e]"
            >
              무료 3D 시뮬레이션 신청
            </Link>
            <a
              href="#pillars"
              className="rounded-md border border-[#99f6e4] bg-white px-6 py-4 text-center text-base font-black text-[#0f766e] transition hover:border-[#0d9488] hover:text-[#0d9488]"
            >
              풀픽 서비스 살펴보기
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-[#99f6e4] bg-gradient-to-br from-[#0d9488] via-[#14b8a6] to-[#5eead4] p-6 shadow-[0_24px_60px_rgba(13,148,136,0.22)]">
            <div className="absolute inset-6 rounded-lg border-2 border-white/40" />
            <span className="relative inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#0f766e]">
              3D Preview
            </span>
            <p className="relative mt-16 text-lg font-black text-white">
              부지 정보 입력 → 3D 모델 자동 생성
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-[#f0fdfa] p-3 text-center ring-1 ring-[#ccfbf1]">
              <p className="text-lg font-black text-[#0d9488]">3D</p>
              <p className="text-xs font-bold text-[#3f5c57]">시뮬레이션</p>
            </div>
            <div className="rounded-lg bg-[#f0fdfa] p-3 text-center ring-1 ring-[#ccfbf1]">
              <p className="text-lg font-black text-[#0d9488]">비교</p>
              <p className="text-xs font-bold text-[#3f5c57]">견적</p>
            </div>
            <div className="rounded-lg bg-[#f0fdfa] p-3 text-center ring-1 ring-[#ccfbf1]">
              <p className="text-lg font-black text-[#0d9488]">구독</p>
              <p className="text-xs font-bold text-[#3f5c57]">유지보수</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points (bento) */}
      <section className="bg-[#f0fdfa] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">WHY POOLPICK</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              수영장 시공, 이런 점이 막막하셨다면
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point, index) => (
              <div
                key={point.title}
                className="rounded-lg border border-[#ccfbf1] bg-white p-5 shadow-[0_10px_28px_rgba(13,148,136,0.06)]"
              >
                <span className="text-xs font-black text-[#5eead4]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-base font-black text-[#0f3331] sm:text-lg">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#3f5c57]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section id="pillars" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">3 PILLARS</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              풀픽을 떠받치는 3가지 핵심 가치
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#3f5c57] sm:text-base">
              짓기 전 확인, 합리적인 비교, 그리고 끝나지 않는 관리.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="flex flex-col rounded-2xl border border-[#ccfbf1] bg-white p-6 shadow-[0_14px_32px_rgba(13,148,136,0.08)]"
              >
                <span className="inline-flex w-fit rounded-md bg-[#ccfbf1] px-2.5 py-1 text-xs font-black text-[#0f766e]">
                  {pillar.badge}
                </span>
                <h3 className="mt-4 text-xl font-black leading-snug text-[#0f3331]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#3f5c57]">
                  {pillar.summary}
                </p>
                <ul className="mt-4 grid gap-2 border-t border-[#ccfbf1] pt-4">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm font-bold text-[#3f5c57]">
                      <span className="mt-0.5 text-[#0d9488]">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coway-style subscription */}
      <section id="subscription" className="bg-[#0f3331] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#5eead4]">SUBSCRIPTION CARE</p>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              수영장도 정수기처럼, 구독형으로 관리하세요
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              시공이 끝나도 관리는 계속됩니다. 필터·부품 정기 배송과 점검
              일정을 풀픽이 함께 챙깁니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subscriptionHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-white/10 bg-white/5 p-5"
              >
                <h3 className="text-base font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="process" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">HOW IT WORKS</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              이용 프로세스
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

      {/* Trust network */}
      <section id="network" className="bg-[#f0fdfa] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-[#0d9488]">CONTRACTOR NETWORK</p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-[#0f3331] sm:text-3xl">
                검증된 시공업체와
                <br />
                투명하게 비교하고 선택하세요
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#3f5c57] sm:text-base">
                풀픽은 시공업체를 단순히 연결하는 데서 그치지 않습니다. 시공
                실적, 견적 범위, 고객 후기를 함께 공개해 어떤 기준으로
                업체를 선택할지 판단할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {trustCriteria.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-[#ccfbf1] bg-white p-5 shadow-[0_10px_28px_rgba(13,148,136,0.06)]"
                >
                  <h3 className="text-base font-black text-[#0f3331]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#3f5c57]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">PRICING</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              필요한 만큼만, 부담 없이
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border bg-white p-6 shadow-[0_10px_28px_rgba(13,148,136,0.06)] ${
                  plan.highlighted ? "border-[#0d9488] ring-2 ring-[#99f6e4]" : "border-[#ccfbf1]"
                }`}
              >
                <h3 className="text-lg font-black text-[#0f3331]">{plan.name}</h3>
                <p className="mt-2 text-2xl font-black text-[#0d9488]">{plan.price}</p>
                <p className="mt-3 text-sm leading-6 text-[#3f5c57]">
                  {plan.description}
                </p>
                <ul className="mt-5 grid gap-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm font-bold text-[#3f5c57]"
                    >
                      <span className="mt-0.5 text-[#0d9488]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#f0fdfa] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0d9488]">FAQ</p>
            <h2 className="mt-3 text-2xl font-black text-[#0f3331] sm:text-3xl">
              자주 묻는 질문
            </h2>
          </div>

          <div className="mt-10 grid gap-3">
            {faqItems.map((item) => (
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
            지금 바로 무료 3D 시뮬레이션을 신청하세요
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
            부지 정보만 남기면 3D 모델과 예상 견적 비교까지 무료로 시작할 수
            있습니다.
          </p>
          <Link
            href="/poolpick/landing"
            className="mt-7 inline-flex rounded-md bg-white px-7 py-4 text-base font-black text-[#e11d48] shadow-[0_12px_24px_rgba(225,29,72,0.2)] transition hover:bg-[#fff1f2]"
          >
            무료 3D 견적 신청하기
          </Link>
        </div>
      </section>

      <PoolPickFooter
        notices={[
          "3D 시뮬레이션 결과와 가견적은 실제 부지 실측 결과에 따라 달라질 수 있습니다.",
          "시공업체 견적 및 계약은 각 업체와 고객 간의 별도 계약을 통해 진행됩니다.",
          "구독형 유지보수는 선택 사항이며, 세부 정책은 추후 안내될 수 있습니다.",
        ]}
      />
    </main>
  );
}
