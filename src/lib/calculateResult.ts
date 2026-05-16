import { questions, type FundingAxis } from "@/data/questions";

export type Answers = Record<string, string>;

export type AxisResult = {
  axis: FundingAxis;
  label: string;
  score: number;
  percent: number;
  level: "낮음" | "보통" | "높음";
  description: string;
};

export type DiagnosisResult = {
  axes: AxisResult[];
  primaryAxis: FundingAxis;
  summary: string;
  recommendation: string;
};

const axisLabels: Record<FundingAxis, string> = {
  government: "지원금 활용 가능성",
  private: "민간자금 가능성",
  alternative: "추가 자금 검토 필요도",
};

const descriptions: Record<FundingAxis, string> = {
  government: "현재 사업 상태에서 활용 가능한 지원금과 정책자금 방향을 먼저 확인해볼 수 있습니다.",
  private: "매출 흐름과 기존 대출 부담을 함께 보며 민간자금 방향을 검토해볼 수 있습니다.",
  alternative: "지원금과 제도권 금융 외에 현재 상황에서 추가로 확인할 자금 방향이 있을 수 있습니다.",
};

const summaries: Record<FundingAxis, string> = {
  government: "지원금과 정책자금 방향을 먼저 확인해볼 만한 상태입니다.",
  private: "민간자금 방향을 우선 확인해볼 만한 상태입니다.",
  alternative: "현재 상황에서 추가로 검토 가능한 자금 방향 확인이 필요합니다.",
};

const recommendations: Record<FundingAxis, string> = {
  government: "업력, 매출, 업종, 자금 사용 목적을 함께 보고 지금 확인 가능한 지원금과 정책자금이 있는지 살펴보는 것이 좋습니다.",
  private: "최근 매출 흐름, 기존 대출 부담, 자금 목적을 함께 보며 현실적으로 이용 가능한 민간자금 방향을 비교해보는 단계가 좋습니다.",
  alternative: "현재 상황에서는 정식 절차 기반의 추가 자금 솔루션을 함께 확인해볼 수 있습니다. 한 가지 방향만 보기보다 전체 상황을 같이 정리하는 것이 좋습니다.",
};

const maxScores = questions.reduce(
  (totals, question) => {
    const axisMax = question.options.reduce(
      (max, option) => ({
        government: Math.max(max.government, option.score.government),
        private: Math.max(max.private, option.score.private),
        alternative: Math.max(max.alternative, option.score.alternative),
      }),
      { government: 0, private: 0, alternative: 0 },
    );

    return {
      government: totals.government + axisMax.government,
      private: totals.private + axisMax.private,
      alternative: totals.alternative + axisMax.alternative,
    };
  },
  { government: 0, private: 0, alternative: 0 },
);

function getLevel(percent: number): AxisResult["level"] {
  if (percent >= 70) return "높음";
  if (percent >= 40) return "보통";
  return "낮음";
}

export function calculateResult(answers: Answers): DiagnosisResult {
  const scores: Record<FundingAxis, number> = {
    government: 0,
    private: 0,
    alternative: 0,
  };

  questions.forEach((question) => {
    const selectedOption = question.options.find((option) => option.id === answers[question.id]);

    if (!selectedOption) {
      return;
    }

    scores.government += selectedOption.score.government;
    scores.private += selectedOption.score.private;
    scores.alternative += selectedOption.score.alternative;
  });

  const axes = (Object.keys(scores) as FundingAxis[]).map((axis) => {
    const percent = Math.round((scores[axis] / maxScores[axis]) * 100);

    return {
      axis,
      label: axisLabels[axis],
      score: scores[axis],
      percent,
      level: getLevel(percent),
      description: descriptions[axis],
    };
  });

  const primaryAxis = axes.reduce((best, current) =>
    current.percent > best.percent ? current : best,
  ).axis;

  return {
    axes,
    primaryAxis,
    summary: summaries[primaryAxis],
    recommendation: recommendations[primaryAxis],
  };
}
