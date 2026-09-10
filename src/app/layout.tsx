import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "赛讯 Radar · AI 比赛雷达",
  description:
    "一眼看清报名中的 AI 比赛：封面卡片、奖励、截止日、今日新增。聚合 aivs.one 与 Devpost。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${sans.variable} ${mono.variable} dark h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
