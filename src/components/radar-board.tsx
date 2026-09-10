"use client";

import { CompetitionCard } from "@/components/competition-card";
import { SourceCard } from "@/components/source-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLiveRadar } from "@/hooks/use-live-radar";
import { useSeenCompetitions } from "@/hooks/use-seen-competitions";
import {
  formatUpdatedAt,
  isFreshlyPublished,
  KIND_LABEL,
  REGION_LABEL,
  STATUS_LABEL,
} from "@/lib/labels";
import type {
  CompetitionKind,
  CompetitionRegion,
  CompetitionStatus,
  CompetitionsPayload,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCheck, Radio, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";

type StatusFilter = CompetitionStatus | "all" | "fresh";
type RegionFilter = CompetitionRegion | "all";
type KindFilter = CompetitionKind | "all";

export function RadarBoard({ initial }: { initial: CompetitionsPayload }) {
  const live = useLiveRadar(initial);
  const {
    competitions,
    sources,
    updatedAt,
    feedUpdatedAt,
    liveCount,
    openCount,
    dueSoonCount,
    todayNewCount,
    errors,
    checking,
    liveOn,
    lastCheckedAt,
    nextCheckInSec,
    checkError,
    checkNow,
    setLiveOn,
  } = live;

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("open");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [onlyToday, setOnlyToday] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  const ids = useMemo(() => competitions.map((c) => c.id), [competitions]);
  const { isNew, newCount, markAllSeen, ready } = useSeenCompetitions(ids);
  const shanghaiToday = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Shanghai",
  });

  const freshCount = useMemo(
    () =>
      competitions.filter(
        (c) =>
          c.status !== "ended" &&
          (isFreshlyPublished(c.publishedAt, 3) || (ready && isNew(c.id))),
      ).length,
    [competitions, ready, isNew],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return competitions.filter((c) => {
      if (status === "fresh") {
        const fresh =
          c.status !== "ended" &&
          (isFreshlyPublished(c.publishedAt, 3) || (ready && isNew(c.id)));
        if (!fresh) return false;
      } else if (status !== "all" && c.status !== status) {
        return false;
      }
      if (region !== "all" && c.region !== region) return false;
      if (kind !== "all" && c.kind !== kind) return false;
      if (onlyNew && ready && !isNew(c.id)) return false;
      if (onlyToday) {
        const publishedToday = c.publishedAt?.slice(0, 10) === shanghaiToday;
        if (!(isNew(c.id) || publishedToday)) return false;
      }
      if (!q) return true;
      const hay = [
        c.title,
        c.summary,
        c.source,
        c.organizer ?? "",
        c.platform ?? "",
        c.prize ?? "",
        c.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [
    competitions,
    query,
    status,
    region,
    kind,
    onlyNew,
    onlyToday,
    ready,
    isNew,
    shanghaiToday,
  ]);

  return (
    <div className="space-y-8">
      <LiveStatusBar
        checking={checking}
        liveOn={liveOn}
        lastCheckedAt={lastCheckedAt}
        nextCheckInSec={nextCheckInSec}
        checkError={checkError}
        onToggle={() => setLiveOn(!liveOn)}
        onCheckNow={checkNow}
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="报名中" value={String(openCount)} hint="现在就能参加" />
        <Stat
          label="7 天内截止"
          value={String(dueSoonCount)}
          hint="优先冲这些"
        />
        <Stat
          label="今日新增"
          value={String(Math.max(todayNewCount, newCount))}
          hint="实时检查会自动点亮"
        />
        <Stat
          label="实时源"
          value={String(liveCount)}
          hint={formatUpdatedAt(feedUpdatedAt || updatedAt)}
        />
      </section>

      {errors?.length ? (
        <p className="rounded-xl border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-warn">
          部分实时源暂时不可用：{errors.join("；")}。已有赛事仍可浏览。
        </p>
      ) : null}

      <section id="list" className="scroll-mt-24 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索赛事、平台、奖金、标签…"
              className="h-10 rounded-lg border-hairline bg-surface-1 pl-9 text-ink placeholder:text-ink-subtle"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={onlyToday ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setOnlyToday((v) => !v)}
            >
              今日新增
            </Button>
            <Button
              variant={onlyNew ? "default" : "outline"}
              size="sm"
              className="rounded-lg"
              onClick={() => setOnlyNew((v) => !v)}
            >
              相对上次新 {newCount > 0 ? `(${newCount})` : ""}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={markAllSeen}
              disabled={newCount === 0}
            >
              <CheckCheck className="size-4" />
              标为已读
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={checkNow}
              disabled={checking}
            >
              <RefreshCw
                className={cn("size-4", checking && "animate-spin")}
              />
              立即检查
            </Button>
          </div>
        </div>

        <FilterRow
          label="状态"
          value={status}
          onChange={(v) => setStatus(v as StatusFilter)}
          options={[
            { value: "all", label: "全部" },
            {
              value: "fresh",
              label: freshCount > 0 ? `刚发布 (${freshCount})` : "刚发布",
            },
            ...(
              ["open", "upcoming", "watch", "ended"] as CompetitionStatus[]
            ).map((s) => ({ value: s, label: STATUS_LABEL[s] })),
          ]}
        />
        <FilterRow
          label="地区"
          value={region}
          onChange={(v) => setRegion(v as RegionFilter)}
          options={[
            { value: "all", label: "全部" },
            ...(["cn", "online", "global"] as CompetitionRegion[]).map((r) => ({
              value: r,
              label: REGION_LABEL[r],
            })),
          ]}
        />
        <FilterRow
          label="类型"
          value={kind}
          onChange={(v) => setKind(v as KindFilter)}
          options={[
            { value: "all", label: "全部" },
            ...(
              [
                "aigc",
                "hackathon",
                "agent",
                "application",
                "algorithm",
                "platform",
              ] as CompetitionKind[]
            ).map((k) => ({ value: k, label: KIND_LABEL[k] })),
          ]}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-subtle">
            显示{" "}
            <span className="font-medium text-ink-muted">{filtered.length}</span>{" "}
            / {competitions.length} · 网页实时检查
          </p>
          <Badge
            variant="outline"
            className="rounded-md border-hairline bg-surface-1 text-ink-subtle"
          >
            数据 {formatUpdatedAt(updatedAt)}
          </Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-hairline bg-surface-1 px-6 py-16 text-center text-sm text-ink-subtle">
            没有匹配的赛事。试试清空筛选，或切换到「全部」状态。
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <CompetitionCard key={c.id} competition={c} isNew={isNew(c.id)} />
            ))}
          </div>
        )}
      </section>

      <section id="sources" className="scroll-mt-24 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-ink-subtle uppercase">
              Daily Watchlist
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              每日盯盘网址
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-ink-subtle">
              持续发现新赛，把这些入口加进书签。本页已自动聚合 aivs.one
              封面赛事与 Devpost AI 黑客松。
            </p>
          </div>
          <Badge
            variant="outline"
            className="rounded-md border-hairline bg-surface-1 text-ink-subtle"
          >
            {sources.length} 个入口
          </Badge>
        </div>
        <div className="rounded-xl border border-hairline bg-surface-1 px-4 sm:px-6">
          {sources.map((s) => (
            <SourceCard key={s.id} source={s} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LiveStatusBar({
  checking,
  liveOn,
  lastCheckedAt,
  nextCheckInSec,
  checkError,
  onToggle,
  onCheckNow,
}: {
  checking: boolean;
  liveOn: boolean;
  lastCheckedAt: string | null;
  nextCheckInSec: number;
  checkError: string | null;
  onToggle: () => void;
  onCheckNow: () => void;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-hairline bg-surface-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex size-8 items-center justify-center rounded-lg border border-hairline",
            liveOn ? "bg-lavender/15 text-lavender" : "text-ink-subtle",
          )}
        >
          <Radio className={cn("size-4", checking && "animate-pulse")} />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">
            {checking
              ? "正在检查 aivs.one / Devpost…"
              : liveOn
                ? "实时检查已开启"
                : "实时检查已暂停"}
          </p>
          <p className="mt-0.5 text-xs text-ink-subtle">
            {checkError
              ? checkError
              : liveOn
                ? `上次 ${lastCheckedAt ? formatUpdatedAt(lastCheckedAt) : "—"} · ${nextCheckInSec}s 后再次检查`
                : "打开后网页会每分钟自动拉最新比赛"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={liveOn ? "default" : "outline"}
          size="sm"
          className="rounded-lg"
          onClick={onToggle}
        >
          {liveOn ? "暂停检查" : "开启实时"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={onCheckNow}
          disabled={checking}
        >
          <RefreshCw className={cn("size-4", checking && "animate-spin")} />
          马上查一次
        </Button>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 px-4 py-3">
      <p className="text-[11px] font-medium tracking-[0.16em] text-ink-subtle uppercase">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-ink-subtle">{hint}</p>
    </div>
  );
}

function FilterRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-10 shrink-0 text-xs text-ink-subtle">{label}</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            value === opt.value
              ? "border-lavender bg-lavender text-white"
              : "border-hairline bg-surface-1 text-ink-muted hover:border-hairline-strong hover:text-ink",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
