import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bizfit 사업기회 레이더",
  description: "지역·업종·업력만 입력하면 내 사업이 확인해야 할 지원사업을 찾아드립니다.",
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
