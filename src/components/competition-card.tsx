"use client";

import {
  deadlineUrgencyLabel,
  formatDeadlineDot,
  isClosingSoon,
  isFreshlyPublished,
  isPublishedToday,
  KIND_LABEL,
  platformLabel,
  STATUS_LABEL,
} from "@/lib/labels";
import type { Competition } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Heart, Users } from "lucide-react";

const PLACEHOLDER_TONES = [
  "from-[#1a1b3a] via-[#2a2d6b] to-[#5e6ad2]",
  "from-[#1b2430] via-[#243044] to-[#3d4f6f]",
  "from-[#201820] via-[#3a2438] to-[#6b4a72]",
  "from-[#14241c] via-[#1d3a2a] to-[#27a644]",
  "from-[#18181b] via-[#27272a] to-[#52525b]",
];

function toneFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 997;
  }
  return PLACEHOLDER_TONES[hash % PLACEHOLDER_TONES.length];
}

export function CompetitionCard({
  competition,
  isNew,
}: {
  competition: Competition;
  isNew: boolean;
}) {
  const closingSoon =
    competition.status !== "ended" && isClosingSoon(competition.deadline);
  const urgency = deadlineUrgencyLabel(competition.deadline);
  const deadlineDot = formatDeadlineDot(competition.deadline);
  const todayNew = isNew || isPublishedToday(competition.publishedAt);
  const freshlyPublished =
    !todayNew &&
    competition.status !== "ended" &&
    isFreshlyPublished(competition.publishedAt, 3);
  const platform = platformLabel(competition.platform, competition.organizer);
  const tags = (() => {
    const seen = new Set<string>();
    const out: string[] = [];
    const normalize = (value: string) => {
      const raw = value.trim().toLowerCase().replace(/\s+/g, "");
      if (!raw) return "";
      if (raw === "agent" || raw === "智能体") return "agent";
      if (raw === "hackathon" || raw === "黑客松" || raw === "黑客松")
        return "hackathon";
      return raw;
    };
    for (const raw of [
      KIND_LABEL[competition.kind],
      ...competition.tags,
    ]) {
      const tag = raw?.trim();
      if (!tag) continue;
      const key = normalize(tag);
      if (!key || key === normalize(platform)) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(tag);
      if (out.length >= 3) break;
    }
    return out;
  })();

  return (
    <a
      href={competition.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-surface-1 transition duration-200 hover:border-hairline-strong hover:bg-surface-2",
        todayNew && "ring-1 ring-lavender/70",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {competition.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={competition.coverImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-end bg-gradient-to-br p-4 text-ink",
              toneFor(competition.id),
            )}
          >
            <p className="line-clamp-3 text-[17px] font-medium leading-snug tracking-tight">
              {competition.title}
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {todayNew ? (
            <span className="rounded-md bg-lavender px-2 py-0.5 text-[11px] font-medium text-white">
              今日新增
            </span>
          ) : freshlyPublished ? (
            <span className="rounded-md bg-lavender/85 px-2 py-0.5 text-[11px] font-medium text-white">
              刚发布
            </span>
          ) : null}
          {closingSoon ? (
            <span className="rounded-md bg-warn px-2 py-0.5 text-[11px] font-medium text-black">
              即将截止
            </span>
          ) : competition.status === "open" ? (
            <span className="rounded-md bg-sky-500/90 px-2 py-0.5 text-[11px] font-medium text-white">
              {STATUS_LABEL.open}
            </span>
          ) : (
            <span className="rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-ink-muted backdrop-blur">
              {STATUS_LABEL[competition.status]}
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <span className="max-w-[7.5rem] truncate rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur-sm">
            {platform}
          </span>
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/45 text-ink-muted backdrop-blur-sm">
            <Heart className="size-3.5" />
          </span>
        </div>

        {typeof competition.participants === "number" &&
        competition.participants > 0 ? (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[11px] text-ink backdrop-blur-sm">
            <Users className="size-3" />
            {competition.participants.toLocaleString("zh-CN")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 min-h-[2.6rem] text-[15px] font-medium leading-snug tracking-tight text-ink">
            {competition.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={`${index}-${tag}`}
                className="rounded-full border border-hairline bg-surface-2 px-2 py-0.5 text-[11px] text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-hairline pt-3">
          <div className="min-w-0">
            <p className="text-[11px] text-ink-subtle">奖励</p>
            <p className="mt-0.5 truncate text-[13px] font-medium text-ink">
              {competition.prize || "待公布"}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[11px] text-ink-subtle">报名截止</p>
            <p className="mt-0.5 text-[13px] font-medium text-ink">
              {deadlineDot || competition.deadlineLabel || "见官网"}
            </p>
            {urgency && competition.status !== "ended" ? (
              <span className="mt-1 inline-flex rounded-full bg-warn/15 px-1.5 py-0.5 text-[10px] font-medium text-warn">
                {urgency}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </a>
  );
}
