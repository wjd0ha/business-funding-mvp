"use client";

import { useState } from "react";
import { questions } from "@/data/questions";
import { calculateResult, type Answers } from "@/lib/calculateResult";
import { RadarPanel } from "./RadarPanel";

const kakaoConsultUrl = "http://pf.kakao.com/_xlHHQxj/friend";
const kakaoOpenChatUrl = "https://m.site.naver.com/1em9H";

const axisStyles = {
  government: {
    bar: "bg-[#1062e5]",
    badge: "bg-[#eef5ff] text-[#003a8c] ring-[#cfe0ff]",
    card: "border-[#cfe0ff]",
  },
  private: {
    bar: "bg-[#013b7a]",
    badge: "bg-[#eff6ff] text-[#01295a] ring-[#c8dcff]",
    card: "border-[#c8dcff]",
  },
  alternative: {
    bar: "bg-[#64748b]",
    badge: "bg-[#f3f6fa] text-[#334155] ring-[#d9e0ea]",
    card: "border-[#d9e0ea]",
  },
};

const routeItems = {
  government: ["지원금", "정책자금", "보증 연계 자금"],
  private: ["은행권 자금", "보증부 대출", "매출 기반 금융"],
  alternative: [
    "정식 절차 기반 추가 자금 솔루션",
    "확인 가능한 절차 중심 검토",
    "현재 상황에 맞는 안전한 자금 방향 안내",
  ],
};

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isResultVisible, setIsResultVisible] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = isResultVisible
    ? 100
    : Math.round((answeredCount / questions.length) * 100);
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;

  function startSurvey() {
    setHasStarted(true);
    setIsResultVisible(false);
    setCurrentIndex(0);
  }

  function selectAnswer(optionId: string) {
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };

    setAnswers(nextAnswers);

    if (currentIndex === questions.length - 1) {
      setIsResultVisible(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  function goBack() {
    if (currentIndex === 0) {
      setHasStarted(false);
      return;
    }

    setCurrentIndex((index) => index - 1);
  }

  function resetSurvey() {
    setAnswers({});
    setCurrentIndex(0);
    setHasStarted(false);
    setIsResultVisible(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#050538]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3 rounded-lg border border-[#e4ebf7] bg-white px-4 py-3 shadow-[0_10px_30px_rgba(1,59,122,0.06)]">
          <div className="min-w-0">
            <h1 className="text-lg font-black text-[#050538] sm:text-xl">
              자금 루트 자가진단
            </h1>
            <p className="mt-1 text-xs font-bold leading-5 text-[#6b7890] sm:text-sm">
              사업자를 위한 자금 솔루션
            </p>
          </div>
          <div className="min-w-20 text-right">
            <p className="text-[11px] font-bold text-[#6b7890]">진행률</p>
            <p className="text-lg font-black text-[#1062e5]">{progress}%</p>
          </div>
        </header>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#edf3fb]">
          <div
            className="h-full rounded-full bg-[#1062e5] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!hasStarted && !isResultVisible && <IntroScreen onStart={startSurvey} />}

        {hasStarted && !isResultVisible && currentQuestion && (
          <section className="grid flex-1 items-center gap-5 py-6 lg:grid-cols-[0.78fr_1fr] lg:gap-8 lg:py-10">
            <aside className="rounded-lg border border-[#e4ebf7] bg-[#f8fbff] p-5 shadow-[0_16px_40px_rgba(1,59,122,0.07)] sm:p-6">
              <div className="inline-flex rounded-md bg-[#1062e5] px-3 py-2 text-sm font-black text-white">
                {currentIndex + 1} / {questions.length}
              </div>
              <p className="mt-5 text-sm font-black text-[#1062e5]">
                사업자 자금 적합도 체크
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-[#050538] sm:text-3xl">
                {currentQuestion.title}
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-[#596579]">
                {currentQuestion.subtitle}
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-md border border-[#cbd8ea] bg-white px-4 py-3 text-sm font-black text-[#013b7a] transition hover:border-[#1062e5] hover:text-[#1062e5]"
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={resetSurvey}
                  className="rounded-md px-4 py-3 text-sm font-black text-[#6b7890] transition hover:bg-white hover:text-[#013b7a]"
                >
                  처음부터
                </button>
              </div>
            </aside>

            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectAnswer(option.id)}
                    className={`group min-h-20 rounded-lg border bg-white p-4 text-left shadow-[0_10px_28px_rgba(1,59,122,0.06)] transition hover:-translate-y-0.5 hover:border-[#1062e5] hover:shadow-[0_16px_36px_rgba(16,98,229,0.12)] sm:min-h-24 sm:p-5 ${
                      isSelected
                        ? "border-[#1062e5] ring-2 ring-[#cfe0ff]"
                        : "border-[#e4ebf7]"
                    }`}
                  >
                    <span className="flex items-center gap-3 sm:gap-4">
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-[#1062e5] bg-[#1062e5]"
                            : "border-[#b9c8dc] bg-white group-hover:border-[#1062e5]"
                        }`}
                      >
                        <span
                          className={`size-2.5 rounded-full bg-white ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </span>
                      <span>
                        <span className="block text-[15px] font-black leading-6 text-[#050538] sm:text-lg">
                          {option.label}
                        </span>
                        {option.helper && (
                          <span className="mt-1 block text-sm font-bold leading-5 text-[#6b7890]">
                            {option.helper}
                          </span>
                        )}
                        {option.description && (
                          <span className="mt-2 block text-sm font-medium leading-6 text-[#596579]">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {isResultVisible && (
          <>
            <ResultScreen answers={answers} onRestart={resetSurvey} />
            <RadarPanel answers={answers} />
          </>
        )}
      </section>
    </main>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[1fr_0.86fr] lg:gap-8 lg:py-10">
      <div className="rounded-lg border border-[#e4ebf7] bg-[#f8fbff] p-5 shadow-[0_18px_50px_rgba(1,59,122,0.08)] sm:p-8">
        <p className="text-sm font-black text-[#1062e5]">
          사업자를 위한 자금 솔루션
        </p>
        <h2 className="mt-4 text-3xl font-black leading-tight text-[#050538] sm:text-5xl">
          내 상황에서 가능한 자금 루트를 확인해보세요
        </h2>
        <p className="mt-5 text-base leading-7 text-[#596579] sm:text-lg">
          몇 가지 간단한 질문에 답하면 현재 사업 상태를 기준으로 지원금,
          정책자금, 민간자금, 추가 자금 방향 중 우선 검토할 방향을 제안합니다.
        </p>
        <p className="mt-4 text-sm leading-6 text-[#6b7890] sm:text-base">
          복잡한 조건을 모두 외울 필요는 없습니다. 간단한 자가진단을 통해 지금
          검토 가능한 자금 방향을 먼저 확인해보세요.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onStart}
            className="rounded-md bg-[#1062e5] px-6 py-4 text-base font-black text-white shadow-[0_12px_24px_rgba(16,98,229,0.24)] transition hover:bg-[#013b7a]"
          >
            무료 자금 진단 시작하기
          </button>
          <a
            href={kakaoConsultUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[#cbd8ea] bg-white px-6 py-4 text-center text-base font-black text-[#013b7a] transition hover:border-[#1062e5] hover:text-[#1062e5]"
          >
            카카오톡 개별상담
          </a>
        </div>
      </div>

      <div className="grid gap-3">
        {[
          ["지원금 활용 가능성", "지원금, 정책자금, 보증 연계 자금"],
          ["민간자금 가능성", "은행권, 보증부 대출, 매출 기반 금융"],
          ["추가 자금 검토 필요도", "제도권 금융 외 정식 절차 기반 추가 검토"],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-lg border border-[#e4ebf7] bg-white p-5 shadow-[0_12px_30px_rgba(1,59,122,0.06)]"
          >
            <p className="text-lg font-black text-[#050538]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[#596579]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultScreen({
  answers,
  onRestart,
}: {
  answers: Answers;
  onRestart: () => void;
}) {
  const result = calculateResult(answers);
  const primaryLabel = result.axes.find((axis) => axis.axis === result.primaryAxis)?.label;

  return (
    <section className="flex flex-1 flex-col justify-center gap-5 py-6 lg:gap-6 lg:py-10">
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1fr]">
        <div className="rounded-lg border border-[#e4ebf7] bg-[#f8fbff] p-5 shadow-[0_18px_50px_rgba(1,59,122,0.08)] sm:p-7">
          <p className="text-sm font-black text-[#1062e5]">진단 결과</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-[#050538] sm:text-4xl">
            {result.summary}
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-[#596579]">
            {result.recommendation}
          </p>
        </div>

        <div className="rounded-lg border border-[#e4ebf7] bg-white p-5 shadow-[0_12px_30px_rgba(1,59,122,0.06)] sm:p-7">
          <p className="text-sm font-black text-[#6b7890]">우선 검토 축</p>
          <p className="mt-2 text-2xl font-black text-[#013b7a]">
            {primaryLabel}
          </p>
            <p className="mt-3 text-sm leading-6 text-[#596579]">
            간이 진단은 큰 방향을 확인하는 단계입니다. 실제 가능 여부는 업력,
            매출, 신용 상태, 사업 목적, 기존 대출 여부를 함께 보며 구체적으로
            확인하는 것이 좋습니다.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {result.axes.map((axis) => (
          <article
            key={axis.axis}
            className={`rounded-lg border bg-white p-5 shadow-[0_12px_30px_rgba(1,59,122,0.06)] ${axisStyles[axis.axis].card}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-[#050538]">{axis.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#596579]">
                  {axis.description}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-black ring-1 ${axisStyles[axis.axis].badge}`}
              >
                {axis.level}
              </span>
            </div>
            <div className="mt-5">
              <div className="flex items-end justify-between">
                <p className="text-sm font-bold text-[#6b7890]">적합도</p>
                <p className="text-3xl font-black text-[#050538]">{axis.percent}%</p>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#edf3fb]">
                <div
                  className={`h-full rounded-full ${axisStyles[axis.axis].bar}`}
                  style={{ width: `${axis.percent}%` }}
                />
              </div>
            </div>
            <ul className="mt-5 grid gap-2">
              {routeItems[axis.axis].map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-[#f8fbff] px-3 py-2 text-sm font-bold text-[#40506a]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-[#e4ebf7] bg-white p-5 shadow-[0_12px_30px_rgba(1,59,122,0.06)] sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <p className="text-sm font-black text-[#1062e5]">
              현재 상황에 맞는 방향은 추가 확인이 필요할 수 있습니다
            </p>
            <p className="mt-3 text-sm leading-6 text-[#596579] sm:text-base sm:leading-7">
              이번 진단은 현재 상황에서 검토 가능한 방향을 간단히 정리한
              결과입니다. 실제 자금 가능 여부는 아래 내용을 함께 확인해야 보다
              현실적인 방향을 정리할 수 있습니다.
            </p>
            <ul className="mt-3 grid gap-1 text-sm leading-6 text-[#596579] sm:text-base">
              <li>- 업력</li>
              <li>- 매출 구조</li>
              <li>- 신용 상태</li>
              <li>- 기존 대출 현황</li>
              <li>- 사업 목적</li>
              <li>- 현재 운영 상황</li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-[#596579] sm:text-base sm:leading-7">
              단순히 하나의 상품을 추천하기보다, 현재 상황을 복합적으로 검토해
              가능한 방향을 함께 정리해보세요.
            </p>
          </div>

          <div className="grid gap-3">
            <a
              href={kakaoConsultUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#fee500] px-5 py-4 text-center text-base font-black text-[#181600] shadow-sm transition hover:bg-[#f6dc00]"
            >
              카카오톡 개별상담 받기
            </a>
            <div>
              <a
                href={kakaoOpenChatUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full justify-center rounded-md bg-[#1062e5] px-5 py-4 text-center text-base font-black text-white transition hover:bg-[#013b7a]"
              >
                지원금·정책자금 정보 받아보기
              </a>
              <p className="mt-2 text-center text-xs font-bold leading-5 text-[#6b7890]">
                실시간 지원금·정책자금·사업자 자금 정보 공유 중
                <br />
                참여코드: 1300
              </p>
            </div>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-md border border-[#cbd8ea] bg-white px-5 py-3 text-sm font-black text-[#013b7a] transition hover:border-[#1062e5] hover:text-[#1062e5]"
            >
              다시 진단하기
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-[#f8fbff] p-4">
          <ul className="grid gap-2 text-xs leading-5 text-[#596579] sm:text-sm sm:leading-6">
            <li>
              - 본 진단은 간이 자가진단이며, 실제 지원 가능 여부·한도·금리·진행
              결과는 기관 및 개인/사업자 조건에 따라 달라질 수 있습니다.
            </li>
            <li>
              - 추가 자금 방향은 지원금 및 제도권 금융 검토 후, 현재 상황에 따라
              확인 가능한 절차 기반으로 안내합니다.
            </li>
            <li>
              - 불법·비공식 자금은 안내하지 않습니다.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
