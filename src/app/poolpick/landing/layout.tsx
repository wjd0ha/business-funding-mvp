import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 3D 수영장 견적 신청 | 풀픽 PoolPick",
  description:
    "부지 정보를 남기면 3D 시뮬레이션과 시공업체 견적 비교를 무료로 받아보세요.",
};

export default function PoolPickLandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
