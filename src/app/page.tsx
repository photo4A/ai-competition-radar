import { RadarBoard } from "@/components/radar-board";
import { getCompetitionsPayload } from "@/lib/competitions";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const payload = await getCompetitionsPayload();

  return (
    <main className="flex-1">
      <header className="sticky top-0 z-20 border-b border-hairline/80 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-ink"
          >
            赛讯 <span className="text-lavender">Radar</span>
          </Link>
          <nav className="flex items-center gap-5 text-[13px] text-ink-subtle">
            <a href="#list" className="transition hover:text-ink">
              赛事
            </a>
            <a href="#sources" className="transition hover:text-ink">
              盯盘
            </a>
            <Link href="/sources" className="transition hover:text-ink">
              入口
            </Link>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              网页实时检查
            </span>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
        <div className="max-w-3xl">
          <p className="text-[12px] font-medium tracking-[0.18em] text-lavender uppercase">
            Live Web Radar
          </p>
          <h1 className="mt-3 text-[34px] leading-[1.08] font-semibold tracking-[-0.04em] text-ink sm:text-[48px]">
            网页版 AI 比赛雷达
            <br />
            每分钟自动检查
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-subtle sm:text-base">
            打开本页即可盯盘：自动轮询 aivs.one 与 Devpost，封面、奖励、截止日同屏扫完。也可随时点「马上查一次」。
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-[13px]">
            <a
              href="#list"
              className="rounded-lg bg-lavender px-3.5 py-2 font-medium text-white transition hover:bg-lavender-hover"
            >
              浏览报名中赛事
            </a>
            <span className="rounded-lg border border-hairline bg-surface-1 px-3.5 py-2 font-medium text-ink-muted">
              今日新增 {payload.todayNewCount}
            </span>
            {!process.env.VERCEL ? (
              <span className="rounded-lg border border-hairline bg-surface-1 px-3.5 py-2 font-mono text-[12px] text-ink-subtle">
                本地：http://127.0.0.1:43127
              </span>
            ) : (
              <span className="rounded-lg border border-hairline bg-surface-1 px-3.5 py-2 text-[12px] text-ink-subtle">
                已部署 · 关掉 Cursor 也能打开
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <RadarBoard initial={payload} />
      </section>
    </main>
  );
}
