import type {
  CompetitionKind,
  CompetitionRegion,
  CompetitionStatus,
} from "./types";

export const REGION_LABEL: Record<CompetitionRegion, string> = {
  cn: "国内",
  global: "国际",
  online: "线上",
};

export const KIND_LABEL: Record<CompetitionKind, string> = {
  hackathon: "黑客松",
  application: "应用创新",
  agent: "智能体",
  algorithm: "算法",
  aigc: "AIGC 创作",
  platform: "平台",
};

export const STATUS_LABEL: Record<CompetitionStatus, string> = {
  open: "报名中",
  upcoming: "即将开始",
  watch: "持续关注",
  ended: "已结束",
};

export function formatUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Shanghai",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDeadlineDot(deadline?: string): string | null {
  if (!deadline) return null;
  const [y, m, d] = deadline.slice(0, 10).split("-");
  if (!y || !m || !d) return deadline;
  return `${y}.${m}.${d}`;
}

export function daysUntil(deadline?: string): number | null {
  if (!deadline) return null;
  const end = new Date(`${deadline.slice(0, 10)}T23:59:59+08:00`);
  if (Number.isNaN(end.getTime())) return null;
  return Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function deadlineUrgencyLabel(deadline?: string): string | null {
  const days = daysUntil(deadline);
  if (days === null) return null;
  if (days < 0) return "已截止";
  if (days === 0) return "今天截止";
  if (days === 1) return "明天截止";
  if (days <= 7) return `剩 ${days} 天`;
  return null;
}

export function isClosingSoon(deadline?: string): boolean {
  const days = daysUntil(deadline);
  return days !== null && days >= 0 && days <= 7;
}

export function isPublishedToday(publishedAt?: string): boolean {
  if (!publishedAt) return false;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Shanghai",
  });
  return publishedAt.slice(0, 10) === today;
}

/** Newly listed contests: published within the last N Shanghai calendar days. */
export function isFreshlyPublished(
  publishedAt?: string,
  withinDays = 3,
): boolean {
  if (!publishedAt) return false;
  const day = publishedAt.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Shanghai",
  });
  const start = new Date(`${day}T00:00:00+08:00`);
  const end = new Date(`${today}T00:00:00+08:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  const diffDays = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays >= 0 && diffDays <= withinDays;
}

export function platformLabel(platform?: string, organizer?: string): string {
  return platform || organizer || "AI 赛事";
}
