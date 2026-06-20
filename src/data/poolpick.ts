export type Pillar = {
  id: string;
  badge: string;
  title: string;
  summary: string;
  points: string[];
};

export const pillars: Pillar[] = [
  {
    id: "simulate",
    badge: "PILLAR 1",
    title: "3D 시뮬레이션",
    summary: "짓기 전에 내 마당에 들어올 수영장을 3D로 먼저 봅니다.",
    points: [
      "부지 사진 + 원하는 크기/스타일 입력",
      "완공 후 모습을 3D 모델로 미리 확인",
      "설비·옵션을 바꿔보며 비교",
    ],
  },
  {
    id: "compare",
    badge: "PILLAR 2",
    title: "투명 견적 비교",
    summary: "같은 설계 기준으로 여러 업체의 견적을 한 화면에서 비교합니다.",
    points: [
      "동일 3D 설계 데이터 기준 견적 산출",
      "최소~최대 견적 범위 공개",
      "업체별 포트폴리오·후기 함께 확인",
    ],
  },
  {
    id: "subscribe",
    badge: "PILLAR 3",
    title: "구독형 유지보수",
    summary: "완공 이후에도 정수기 렌탈처럼 부품·관리를 이어갑니다.",
    points: [
      "필터, 모래여과재 등 소모품 정기 배송",
      "히트펌프·펌프 점검 일정 관리",
      "필요할 때 단건 구매도 가능",
    ],
  },
];

export type PainPoint = {
  title: string;
  description: string;
};

export const painPoints: PainPoint[] = [
  {
    title: "견적마다 금액 차이가 큰 이유를 모르겠어요",
    description: "같은 수영장인데도 업체마다 견적 차이가 커서 적정가를 판단하기 어렵습니다.",
  },
  {
    title: "완공 후 모습이 상상과 다를까 걱정돼요",
    description: "도면이나 설명만으로는 실제 완성된 모습을 가늠하기 쉽지 않습니다.",
  },
  {
    title: "어떤 시공업체를 믿어야 할지 모르겠어요",
    description: "업체는 많지만 시공 실적과 후기를 한눈에 비교할 곳이 마땅치 않습니다.",
  },
  {
    title: "시공 후 관리까지 챙기기 번거로워요",
    description: "필터, 펌프 같은 부품을 어디서 구매해야 할지 매번 다시 찾아봐야 합니다.",
  },
];

export type SubscriptionHighlight = {
  title: string;
  description: string;
};

export const subscriptionHighlights: SubscriptionHighlight[] = [
  {
    title: "정기 소모품 배송",
    description: "필터·모래여과재 같은 소모품을 교체 주기에 맞춰 정기적으로 받아볼 수 있습니다.",
  },
  {
    title: "점검 일정 관리",
    description: "히트펌프, 순환펌프 등 주요 설비의 점검 시점을 미리 안내받습니다.",
  },
  {
    title: "필요할 때 단건 구매",
    description: "구독이 부담스럽다면 필요한 시점에 부품만 단건으로 구매할 수도 있습니다.",
  },
  {
    title: "관리 이력 한곳에서 확인",
    description: "교체·점검 이력을 누적해 다음 시공·관리 계획에 참고할 수 있습니다.",
  },
];

export type JourneyStep = {
  step: string;
  title: string;
  description: string;
};

export const journeySteps: JourneyStep[] = [
  {
    step: "01",
    title: "정보 입력",
    description: "부지 사진과 원하는 크기, 스타일, 예산을 입력합니다.",
  },
  {
    step: "02",
    title: "3D 미리보기",
    description: "입력한 정보를 바탕으로 3D 시뮬레이션 결과와 예상 견적을 확인합니다.",
  },
  {
    step: "03",
    title: "견적 비교 & 업체 매칭",
    description: "검증된 시공업체들의 견적을 비교하고 원하는 업체를 선택합니다.",
  },
  {
    step: "04",
    title: "시공 & 구독 관리",
    description: "계약부터 준공, 이후 구독형 유지보수까지 풀픽 안에서 이어집니다.",
  },
];

export type TrustCriterion = {
  title: string;
  description: string;
};

export const trustCriteria: TrustCriterion[] = [
  {
    title: "시공 실적 검증",
    description: "최근 시공 사례와 포트폴리오를 확인한 업체와 함께합니다.",
  },
  {
    title: "투명한 견적 범위 공개",
    description: "프로젝트별 최소~최대 견적 범위를 미리 공개해 비교 기준을 제공합니다.",
  },
  {
    title: "고객 후기 기반 평가",
    description: "이전 고객의 후기와 평가를 바탕으로 시공업체를 안내합니다.",
  },
];

export type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "3D 시뮬레이션",
    price: "무료",
    description: "부지 정보를 입력하고 나만의 수영장을 3D로 미리 확인합니다.",
    features: ["3D 모델 시뮬레이션", "예상 가견적 확인", "원하는 스타일·설비 옵션 비교"],
  },
  {
    name: "상세 설계 & 견적 비교",
    price: "실측 기반",
    description: "현장 실측 후 상세 설계와 시공업체별 정확한 견적을 비교합니다.",
    features: ["현장 실측 기반 설계", "시공업체별 견적 비교표", "시공 계약 시 설계비 차감"],
    highlighted: true,
  },
  {
    name: "구독형 유지보수",
    price: "월 구독 또는 단건 구매",
    description: "시공 완료 후 필터·부품 정기 배송과 점검 일정 관리를 이용합니다.",
    features: ["소모품 정기 배송", "설비 점검 일정 안내", "단건 구매도 가능"],
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "3D 시뮬레이션은 정말 무료인가요?",
    answer:
      "네. 부지 정보와 원하는 스타일을 입력하면 3D 모델과 예상 가견적까지 무료로 확인할 수 있습니다.",
  },
  {
    question: "시공업체는 어떻게 검증되나요?",
    answer:
      "시공 실적, 포트폴리오, 고객 후기를 기준으로 확인한 업체들과 함께하며, 최소~최대 견적 범위를 투명하게 공개합니다.",
  },
  {
    question: "견적을 비교한 후 꼭 계약해야 하나요?",
    answer:
      "아니요. 견적 비교와 3D 시뮬레이션 확인까지는 의무가 아니며, 마음에 드는 업체가 있을 때만 계약을 진행하면 됩니다.",
  },
  {
    question: "구독형 유지보수는 꼭 가입해야 하나요?",
    answer:
      "아니요. 구독은 선택입니다. 필요할 때마다 필터, 히트펌프 부품 등을 단건으로 구매하실 수도 있습니다.",
  },
  {
    question: "어떤 지역, 어떤 형태의 수영장에 이용할 수 있나요?",
    answer:
      "주택 마당, 펜션, 글램핑장 등 다양한 부지의 야외·실내 수영장 신축 및 리모델링 문의에 활용할 수 있습니다.",
  },
];

export type ComparisonRow = {
  label: string;
  before: string;
  after: string;
};

export const comparisonRows: ComparisonRow[] = [
  {
    label: "견적 확인",
    before: "업체별로 따로 연락하고 며칠씩 기다려야 함",
    after: "3D 설계 기반 견적을 한 화면에서 비교",
  },
  {
    label: "완공 모습",
    before: "도면과 설명만으로 상상해야 함",
    after: "3D 시뮬레이션으로 미리 확인",
  },
  {
    label: "업체 선택",
    before: "후기·실적을 비교할 곳이 마땅치 않음",
    after: "포트폴리오·시공 실적이 공개된 업체 중 선택",
  },
  {
    label: "사후관리",
    before: "완공 후 별도로 부품·관리 업체를 찾아야 함",
    after: "구독형 정기 배송 또는 단건 구매로 연결",
  },
];

export type PoolTypeOption = {
  value: string;
  label: string;
  description: string;
};

export const poolTypeOptions: PoolTypeOption[] = [
  { value: "outdoor", label: "야외 수영장", description: "마당, 정원 등 외부 공간" },
  { value: "indoor", label: "실내 수영장", description: "실내·전천후 공간" },
  { value: "glamping", label: "글램핑·캠핑장", description: "운영 시설용 수영장" },
  { value: "etc", label: "기타", description: "리모델링, 기타 형태" },
];

export type LandingHighlight = {
  title: string;
  description: string;
};

export const landingHighlights: LandingHighlight[] = [
  {
    title: "3D 시뮬레이션 무료 제공",
    description: "내 부지에 맞춘 수영장 3D 모델을 무료로 먼저 확인합니다.",
  },
  {
    title: "여러 시공업체 견적 한 번에 비교",
    description: "동일한 설계 기준으로 산출된 견적을 비교해 합리적인 선택을 돕습니다.",
  },
  {
    title: "시공 후엔 구독형 관리로 연결",
    description: "계약·시공 이후 필터·부품 정기 배송까지 풀픽 안에서 이어집니다.",
  },
];
