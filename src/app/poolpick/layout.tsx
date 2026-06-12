import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "풀픽 PoolPick | 3D 시뮬레이션 기반 수영장 설계·시공 비교 플랫폼",
  description:
    "부지 정보를 입력하면 3D로 수영장을 미리 확인하고, 검증된 시공업체의 견적 비교·매칭부터 계약, 유지보수까지 한 번에 관리하세요.",
};

export default function PoolPickLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
