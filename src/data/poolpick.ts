export type ValueChainStep = {
  id: string;
  step: string;
  title: string;
  summary: string;
  description: string;
};

export const valueChainSteps: ValueChainStep[] = [
  {
    id: "design",
    step: "STEP 1",
    title: "3D 시뮬레이션 설계",
    summary: "부지 정보와 원하는 스타일을 입력하면 3D 모델로 먼저 확인합니다.",
    description:
      "현재 부지 사진과 원하는 수영장의 크기, 형태, 설비 옵션을 입력하면 3D 모델링을 통해 완공 후 모습을 미리 시뮬레이션합니다.",
  },
  {
    id: "quote",
    step: "STEP 2",
    title: "자동 견적 비교",
    summary: "3D 설계 데이터를 기준으로 여러 시공업체의 예상 견적을 비교합니다.",
    description:
      "동일한 설계 데이터를 기준으로 산출된 견적이기 때문에 업체별 가격 차이가 어디서 발생하는지 더 쉽게 확인할 수 있습니다.",
  },
  {
    id: "match",
    step: "STEP 3",
    title: "시공업체 매칭",
    summary: "포트폴리오와 시공 실적을 공개한 업체들의 경쟁 입찰로 연결합니다.",
    description:
      "시공 실적, 포트폴리오, 고객 후기를 확인한 뒤 최소~최대 견적 범위 안에서 원하는 업체를 직접 선택할 수 있습니다.",
  },
  {
    id: "manage",
    step: "STEP 4",
    title: "계약 & 시공 관리",
    summary: "단계별 결제와 실시간 진행 공유로 시공 과정을 투명하게 확인합니다.",
    description:
      "계약 이후에는 공정 단계에 맞춘 결제 일정과 진행 상황을 함께 확인하며 시공을 진행할 수 있습니다.",
  },
  {
    id: "maintain",
    step: "STEP 5",
    title: "유지보수 & 부품 스토어",
    summary: "필터, 히트펌프, 모래여과재 등 필요한 부품을 정기적으로 구매할 수 있습니다.",
    description:
      "시공 이후에도 소모품과 부품을 필요할 때마다, 또는 정기적으로 구매하며 수영장을 꾸준히 관리할 수 있습니다.",
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

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
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
    title: "시공 & 사후관리",
    description: "계약부터 준공, 이후 유지보수 부품 구매까지 풀픽 안에서 이어집니다.",
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
    name: "시공 매칭 & 관리",
    price: "계약 성사 시 수수료",
    description: "검증된 시공업체와의 계약, 진행 관리, 사후 유지보수까지 연결합니다.",
    features: ["시공업체 매칭", "단계별 결제·진행 관리", "유지보수·부품 스토어 연계"],
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
    question: "시공 후 유지보수 부품은 어디서 구매하나요?",
    answer:
      "풀픽의 유지보수·부품 스토어에서 필터, 히트펌프, 모래여과재 등을 필요할 때마다 구매할 수 있습니다.",
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
    after: "유지보수·부품 구매까지 한 곳에서 연결",
  },
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
    title: "계약부터 유지보수까지 한 곳에서",
    description: "시공 계약, 진행 관리, 이후 부품 구매까지 풀픽 안에서 이어집니다.",
  },
];
