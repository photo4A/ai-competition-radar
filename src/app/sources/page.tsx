import { SourceCard } from "@/components/source-card";
import { WATCH_SOURCES } from "@/lib/sources";
import Link from "next/link";

export default function SourcesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-ink-subtle transition hover:text-ink">
        ← 返回雷达
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        盯盘网址全集
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-subtle">
        想持续跟踪新赛，把这些入口加进浏览器书签。首页雷达会自动聚合 aivs.one
        公开封面赛事与 Devpost AI 黑客松。
      </p>
      <div className="mt-8 rounded-xl border border-hairline bg-surface-1 px-4 sm:px-6">
        {WATCH_SOURCES.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </main>
  );
}
