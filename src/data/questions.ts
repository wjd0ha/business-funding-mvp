export type FundingAxis = "government" | "private" | "alternative";

export type QuestionOption = {
  id: string;
  label: string;
  helper?: string;
  description?: string;
  score: Record<FundingAxis, number>;
};

export type Question = {
  id: string;
  title: string;
  subtitle: string;
  options: QuestionOption[];
};

export const questions: Question[] = [
  {
    id: "business_stage",
    title: "사업을 시작한 지 얼마나 되셨나요?",
    subtitle: "운영 기간에 따라 먼저 확인해볼 수 있는 지원금과 자금 방향이 달라질 수 있습니다.",
    options: [
      {
        id: "pre",
        label: "아직 준비 중이거나 곧 시작할 예정",
        description: "초기 준비 단계에서는 시작 자금, 지원금, 사업 방향 정리를 함께 보는 것이 도움이 됩니다.",
        score: { government: 4, private: 1, alternative: 2 },
      },
      {
        id: "early",
        label: "운영한 지 3년 이내",
        description: "초기 사업자는 지원금과 정책자금 검토 폭이 비교적 넓을 수 있습니다.",
        score: { government: 4, private: 2, alternative: 1 },
      },
      {
        id: "growth",
        label: "3년 넘게 운영 중",
        description: "운영 이력이 있으면 매출 흐름을 바탕으로 민간자금까지 함께 볼 수 있습니다.",
        score: { government: 2, private: 4, alternative: 1 },
      },
    ],
  },
  {
    id: "revenue",
    title: "최근 1년 매출은 어느 정도인가요?",
    subtitle: "매출 규모를 보면 지금 상황에서 현실적으로 검토할 수 있는 자금 방향을 좁힐 수 있습니다.",
    options: [
      {
        id: "none",
        label: "아직 매출이 거의 없음",
        description: "매출보다 사업 준비도와 앞으로의 계획을 중심으로 확인하는 방향이 적합할 수 있습니다.",
        score: { government: 4, private: 0, alternative: 3 },
      },
      {
        id: "under_100m",
        label: "1억원 미만",
        description: "작은 매출이라도 꾸준한 흐름이 있다면 운영자금 방향을 함께 검토할 수 있습니다.",
        score: { government: 3, private: 2, alternative: 2 },
      },
      {
        id: "over_100m",
        label: "1억원 이상",
        description: "매출 자료를 바탕으로 한도, 상환 부담, 자금 목적을 함께 살펴보기 좋습니다.",
        score: { government: 2, private: 4, alternative: 1 },
      },
    ],
  },
  {
    id: "profitability",
    title: "요즘 사업 자금 흐름은 어떤가요?",
    subtitle: "수익과 지출 흐름을 보면 당장 필요한 자금의 성격을 더 쉽게 구분할 수 있습니다.",
    options: [
      {
        id: "loss",
        label: "지출이 매출보다 큰 편",
        description: "당장 필요한 운영자금과 비용 구조를 함께 확인해 무리 없는 방향을 찾는 것이 중요합니다.",
        score: { government: 3, private: 1, alternative: 4 },
      },
      {
        id: "break_even",
        label: "매출과 지출이 비슷한 편",
        description: "작은 자금 보완으로 흐름이 좋아질 수 있어 목적과 시점을 함께 보는 것이 좋습니다.",
        score: { government: 3, private: 3, alternative: 2 },
      },
      {
        id: "profit",
        label: "남는 금액이 꾸준히 있는 편",
        description: "상환 여력을 설명하기 쉬워 민간자금이나 성장 자금 검토에 유리할 수 있습니다.",
        score: { government: 2, private: 5, alternative: 0 },
      },
    ],
  },
  {
    id: "credit",
    title: "현재 자금 진행에 가장 걸리는 부분은 무엇인가요?",
    subtitle: "불안한 부분을 먼저 확인하면 무리한 방향보다 가능한 선택지부터 볼 수 있습니다.",
    options: [
      {
        id: "stable",
        label: "특별히 걸리는 부분이 없음",
        description: "기본 조건이 안정적이면 지원금, 정책자금, 민간자금을 폭넓게 비교해볼 수 있습니다.",
        score: { government: 3, private: 5, alternative: 0 },
      },
      {
        id: "thin",
        label: "매출이나 준비 자료가 부족함",
        description: "부족한 자료를 보완하면서 현재 가능한 방향부터 차근차근 정리하는 것이 좋습니다.",
        score: { government: 4, private: 2, alternative: 2 },
      },
      {
        id: "issue",
        label: "연체나 신용 이슈가 걱정됨",
        description: "바로 가능한 방향과 먼저 정리해야 할 부분을 나누어 보는 것이 도움이 됩니다.",
        score: { government: 1, private: 0, alternative: 5 },
      },
    ],
  },
  {
    id: "collateral",
    title: "담보나 보증 도움을 받을 수 있나요?",
    subtitle: "담보나 보증이 부족해도 다른 방향을 함께 확인해볼 수 있습니다.",
    options: [
      {
        id: "enough",
        label: "활용할 수 있는 담보나 보증이 있음",
        description: "담보나 보증 여력이 있으면 선택 가능한 자금 방향이 넓어질 수 있습니다.",
        score: { government: 2, private: 5, alternative: 0 },
      },
      {
        id: "some",
        label: "일부는 가능할 것 같음",
        description: "가능한 범위를 먼저 확인하고 부족한 부분은 다른 자금 방향으로 보완할 수 있습니다.",
        score: { government: 4, private: 3, alternative: 1 },
      },
      {
        id: "none",
        label: "거의 없거나 잘 모르겠음",
        description: "담보가 없어도 매출, 업력, 자금 목적에 따라 다른 검토 방향이 있을 수 있습니다.",
        score: { government: 3, private: 1, alternative: 4 },
      },
    ],
  },
  {
    id: "funding_goal",
    title: "자금은 어디에 가장 필요하신가요?",
    subtitle: "자금이 필요한 이유에 따라 지원금, 정책자금, 민간자금 중 먼저 볼 방향이 달라집니다.",
    options: [
      {
        id: "r_and_d",
        label: "새로운 시도, 개발, 마케팅, 채용",
        description: "성장 목적이 분명하면 지원금이나 정책자금과 연결해볼 여지가 있습니다.",
        score: { government: 5, private: 1, alternative: 1 },
      },
      {
        id: "working_capital",
        label: "운영비, 재고, 매장 운영, 거래처 지급",
        description: "일상 운영에 필요한 자금은 매출 흐름과 상환 부담을 함께 보는 경우가 많습니다.",
        score: { government: 2, private: 4, alternative: 2 },
      },
      {
        id: "urgent",
        label: "급한 납부나 단기 현금흐름 보완",
        description: "필요 시점이 가까우면 빠르게 확인 가능한 방향과 부담을 함께 정리해야 합니다.",
        score: { government: 0, private: 1, alternative: 5 },
      },
    ],
  },
  {
    id: "urgency",
    title: "언제쯤 자금이 필요하신가요?",
    subtitle: "필요한 시점에 따라 여유 있게 준비할 방향과 빠르게 확인할 방향이 달라집니다.",
    options: [
      {
        id: "month_3",
        label: "3개월 이상 여유 있음",
        description: "준비 시간이 있으면 지원금과 정책자금까지 차분히 확인해볼 수 있습니다.",
        score: { government: 5, private: 2, alternative: 0 },
      },
      {
        id: "month_1",
        label: "1개월 안",
        description: "지원금과 민간자금을 함께 보되, 준비 속도와 가능성을 현실적으로 나눠보는 것이 좋습니다.",
        score: { government: 2, private: 4, alternative: 2 },
      },
      {
        id: "week_2",
        label: "2주 안",
        description: "빠른 확인이 필요한 상황이라 가능한 방향과 부담되는 방향을 먼저 구분하는 것이 중요합니다.",
        score: { government: 0, private: 2, alternative: 5 },
      },
    ],
  },
  {
    id: "documents",
    title: "기본 자료는 어느 정도 준비되어 있나요?",
    subtitle: "매출자료, 통장내역, 사업자등록증처럼 기본 자료가 있으면 자금 방향을 더 빠르게 확인할 수 있습니다.",
    options: [
      {
        id: "ready",
        label: "대부분 준비되어 있음",
        description: "자료가 준비되어 있으면 상담이나 자금 검토를 더 빠르게 진행할 수 있습니다.",
        score: { government: 5, private: 4, alternative: 0 },
      },
      {
        id: "partial",
        label: "일부만 있음",
        description: "부족한 자료를 확인하면서 지금 가능한 방향과 추가 준비할 부분을 나눠볼 수 있습니다.",
        score: { government: 3, private: 2, alternative: 2 },
      },
      {
        id: "none",
        label: "거의 준비되지 않음",
        description: "먼저 필요한 기본 자료부터 정리하면 이후 자금 방향을 더 쉽게 확인할 수 있습니다.",
        score: { government: 1, private: 1, alternative: 4 },
      },
    ],
  },
  {
    id: "industry",
    title: "현재 어떤 형태로 사업을 운영하고 있나요?",
    subtitle: "업종과 사업 형태에 따라 검토 가능한 지원금과 자금 방향이 달라질 수 있습니다.",
    options: [
      {
        id: "digital_service",
        label: "기술·온라인·전문 서비스 기반 사업",
        helper: "IT, 플랫폼, 콘텐츠, 교육, 마케팅 등",
        description: "초기 지원금이나 성장형 자금 검토 가능성이 상대적으로 넓은 편입니다.",
        score: { government: 5, private: 3, alternative: 0 },
      },
      {
        id: "store_service",
        label: "일반 매장·서비스·도소매 중심 사업",
        helper: "카페, 음식점, 미용, 판매업 등",
        description: "운영자금, 시설, 매출 기반 자금 방향을 함께 검토하는 경우가 많습니다.",
        score: { government: 2, private: 4, alternative: 1 },
      },
      {
        id: "manufacturing_facility",
        label: "제조·장비·시설 운영 중심 사업",
        helper: "생산, 제작, 설비 운영 등",
        description: "시설, 장비, 운영 관련 자금과 정책자금 연계 가능성을 함께 보는 경우가 있습니다.",
        score: { government: 4, private: 4, alternative: 1 },
      },
      {
        id: "undecided",
        label: "아직 방향을 정하지 못했거나 준비 단계",
        description: "현재 상황에 맞는 시작 방향부터 함께 정리해볼 수 있습니다.",
        score: { government: 2, private: 1, alternative: 3 },
      },
    ],
  },
  {
    id: "existing_debt",
    title: "기존 대출 부담은 어떤가요?",
    subtitle: "이미 이용 중인 자금이 있다면 새 자금보다 정리 순서와 부담 수준을 함께 보는 것이 좋습니다.",
    options: [
      {
        id: "low",
        label: "부담이 크지 않음",
        description: "기존 부담이 낮으면 새로운 자금 방향을 비교적 여유 있게 검토할 수 있습니다.",
        score: { government: 3, private: 5, alternative: 0 },
      },
      {
        id: "medium",
        label: "관리 가능한 수준",
        description: "월 상환 부담과 새 자금 필요성을 함께 보고 무리 없는 범위를 찾는 것이 좋습니다.",
        score: { government: 3, private: 3, alternative: 2 },
      },
      {
        id: "high",
        label: "매달 상환 부담이 큰 편",
        description: "추가 자금보다 현재 부담을 어떻게 정리할지 함께 보는 것이 먼저일 수 있습니다.",
        score: { government: 1, private: 0, alternative: 5 },
      },
    ],
  },
];
