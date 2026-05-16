import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사업자를 위한 자금 솔루션",
  description: "간단한 답변으로 사업 상황에 맞는 자금 루트를 제안합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
