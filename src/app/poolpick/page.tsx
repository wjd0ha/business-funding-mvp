import Link from "next/link";
import { PoolPickFooter } from "@/components/poolpick/PoolPickFooter";
import {
  faqItems,
  painPoints,
  pricingPlans,
  processSteps,
  trustCriteria,
  valueChainSteps,
} from "@/data/poolpick";

const navLinks = [
  { href: "#service", label: "서비스 소개" },
  { href: "#process", label: "이용 프로세스" },
  { href: "#network", label: "시공업체 매칭" },
  { href: "#pricing", label: "요금 안내" },
  { href: "#faq", label: "FAQ" },
];

export default function PoolPickHome() {
  return (
    <main className="min-h-screen bg-white text-[#0b2540]">
      <header className="sticky top-0 z-10 border-b border-[#e3f2fb] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/poolpick" className="flex items-center gap-2 text-lg font-black text-[#0b2540]">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#0ea5e9] text-sm font-black text-white">
              PP
            </span>
            풀픽 <span className="text-[#0ea5e9]">PoolPick</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#41566b] lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[#0ea5e9]">
                {link.label}
              </a>
            ))}
          </nav>
          <Link
            href="/poolpick/landing"
            className="shrink-0 rounded-md bg-[#0ea5e9] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(14,165,233,0.28)] transition hover:bg-[#0284c7]"
          >
            무료 3D 견적 받기
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full bg-[#e6f7ff] px-3 py-1 text-xs font-black text-[#0284c7] ring-1 ring-[#bfe6fb]">
            3D 시뮬레이션 기반 수영장 설계·시공 비교 플랫폼
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-[#0b2540] sm:text-5xl">
            수영장, 짓기 전에
            <br />
            3D로 먼저 확인하세요
          </h1>
          <p className="mt-5 text-base leading-7 text-[#5b6b7c] sm:text-lg">
            마당, 펜션, 글램핑장에 들어갈 수영장을 3D로 시뮬레이션하고, 검증된
            시공업체의 견적을 한눈에 비교해보세요.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/poolpick/landing"
              className="rounded-md bg-[#0ea5e9] px-6 py-4 text-center text-base font-black text-white shadow-[0_12px_24px_rgba(14,165,233,0.28)] transition hover:bg-[#0284c7]"
            >
              무료 3D 시뮬레이션 신청
            </Link>
            <a
              href="#service"
              className="rounded-md border border-[#bfe6fb] bg-white px-6 py-4 text-center text-base font-black text-[#0369a1] transition hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
            >
              풀픽 서비스 살펴보기
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-[#cdeefb] bg-gradient-to-br from-[#e6f7ff] to-white p-6 shadow-[0_24px_60px_rgba(14,165,233,0.16)] sm:p-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#0ea5e9] via-[#38bdf8] to-[#7dd3fc]">
              <div className="absolute inset-6 rounded-lg border-2 border-white/40" />
              <div className="absolute inset-10 rounded-md border border-white/30" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#0284c7]">
                3D Preview
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-[#f0f9ff] p-3">
                <p className="text-lg font-black text-[#0ea5e9]">3D</p>
                <p className="text-xs font-bold text-[#5b6b7c]">시뮬레이션</p>
              </div>
              <div className="rounded-lg bg-[#f0f9ff] p-3">
                <p className="text-lg font-black text-[#0ea5e9]">비교</p>
                <p className="text-xs font-bold text-[#5b6b7c]">견적</p>
              </div>
              <div className="rounded-lg bg-[#f0f9ff] p-3">
                <p className="text-lg font-black text-[#0ea5e9]">매칭</p>
                <p className="text-xs font-bold text-[#5b6b7c]">시공업체</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="bg-[#f8fdff] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">WHY POOLPICK</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              수영장 시공, 이런 점이 막막하셨다면
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {painPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-lg border border-[#e3f2fb] bg-white p-5 shadow-[0_10px_28px_rgba(14,165,233,0.06)]"
              >
                <h3 className="text-base font-black text-[#0b2540] sm:text-lg">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6b7c]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core service / value chain */}
      <section id="service" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">CORE SERVICE</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              풀픽 하나로 설계부터 유지보수까지
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5b6b7c] sm:text-base">
              수영장을 만드는 모든 과정을 하나의 흐름으로 연결합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {valueChainSteps.map((item) => (
              <div
                key={item.id}
                className="flex flex-col rounded-lg border border-[#e3f2fb] bg-white p-5 shadow-[0_10px_28px_rgba(14,165,233,0.06)]"
              >
                <span className="inline-flex w-fit rounded-md bg-[#e6f7ff] px-2.5 py-1 text-xs font-black text-[#0284c7]">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-black leading-snug text-[#0b2540]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6b7c]">
                  {item.summary}
                </p>
                <p className="mt-3 text-xs leading-5 text-[#9fb2c4]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-[#f8fdff] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">HOW IT WORKS</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              이용 프로세스
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

      {/* Trust network */}
      <section id="network" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-[#0ea5e9]">CONTRACTOR NETWORK</p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-[#0b2540] sm:text-3xl">
                검증된 시공업체와
                <br />
                투명하게 비교하고 선택하세요
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5b6b7c] sm:text-base">
                풀픽은 시공업체를 단순히 연결하는 데서 그치지 않습니다. 시공
                실적, 견적 범위, 고객 후기를 함께 공개해 어떤 기준으로
                업체를 선택할지 판단할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {trustCriteria.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-[#e3f2fb] bg-white p-5 shadow-[0_10px_28px_rgba(14,165,233,0.06)]"
                >
                  <h3 className="text-base font-black text-[#0b2540]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5b6b7c]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#f8fdff] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">PRICING</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              필요한 만큼만, 부담 없이
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border bg-white p-6 shadow-[0_10px_28px_rgba(14,165,233,0.06)] ${
                  plan.highlighted ? "border-[#0ea5e9] ring-2 ring-[#bfe6fb]" : "border-[#e3f2fb]"
                }`}
              >
                <h3 className="text-lg font-black text-[#0b2540]">{plan.name}</h3>
                <p className="mt-2 text-2xl font-black text-[#0ea5e9]">{plan.price}</p>
                <p className="mt-3 text-sm leading-6 text-[#5b6b7c]">
                  {plan.description}
                </p>
                <ul className="mt-5 grid gap-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm font-bold text-[#41566b]"
                    >
                      <span className="mt-0.5 text-[#0ea5e9]">✓</span>
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
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-black text-[#0ea5e9]">FAQ</p>
            <h2 className="mt-3 text-2xl font-black text-[#0b2540] sm:text-3xl">
              자주 묻는 질문
            </h2>
          </div>

          <div className="mt-10 grid gap-3">
            {faqItems.map((item) => (
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
            지금 바로 무료 3D 시뮬레이션을 신청하세요
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/90 sm:text-base">
            부지 정보만 남기면 3D 모델과 예상 견적 비교까지 무료로 시작할 수
            있습니다.
          </p>
          <Link
            href="/poolpick/landing"
            className="mt-7 inline-flex rounded-md bg-white px-7 py-4 text-base font-black text-[#0284c7] shadow-[0_12px_24px_rgba(2,132,199,0.24)] transition hover:bg-[#f0f9ff]"
          >
            무료 3D 견적 신청하기
          </Link>
        </div>
      </section>

      <PoolPickFooter
        notices={[
          "3D 시뮬레이션 결과와 가견적은 실제 부지 실측 결과에 따라 달라질 수 있습니다.",
          "시공업체 견적 및 계약은 각 업체와 고객 간의 별도 계약을 통해 진행됩니다.",
          "본 페이지는 서비스 소개를 위한 페이지로, 세부 정책은 추후 안내될 수 있습니다.",
        ]}
      />
    </main>
  );
}
