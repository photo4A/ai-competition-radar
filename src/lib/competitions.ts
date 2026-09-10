import type { Competition, CompetitionsPayload } from "./types";
import { fetchAivsCompetitions } from "./aivs";
import { CURATED_COMPETITIONS } from "./curated";
import { fetchDevpostAiCompetitions } from "./devpost";
import { daysUntil, isPublishedToday } from "./labels";
import { WATCH_SOURCES } from "./sources";

function statusRank(status: Competition["status"]): number {
  switch (status) {
    case "open":
      return 0;
    case "upcoming":
      return 1;
    case "watch":
      return 2;
    default:
      return 3;
  }
}

function sortCompetitions(items: Competition[]): Competition[] {
  return [...items].sort((a, b) => {
    const sr = statusRank(a.status) - statusRank(b.status);
    if (sr !== 0) return sr;
    const ac = a.coverImage ? 0 : 1;
    const bc = b.coverImage ? 0 : 1;
    if (ac !== bc) return ac - bc;
    const ad = a.deadline ?? "9999-12-31";
    const bd = b.deadline ?? "9999-12-31";
    if (ad !== bd) return ad.localeCompare(bd);
    return a.title.localeCompare(b.title, "zh");
  });
}

function dedupe(items: Competition[]): Competition[] {
  const byUrl = new Map<string, Competition>();
  for (const item of items) {
    const key = item.url.replace(/\/$/, "").toLowerCase();
    const existing = byUrl.get(key);
    if (!existing) {
      byUrl.set(key, item);
      continue;
    }
    const preferNew =
      (!existing.coverImage && item.coverImage) ||
      (!existing.deadline && item.deadline) ||
      (existing.source === "Devpost" && item.source !== "Devpost");
    if (preferNew) byUrl.set(key, item);
  }
  return [...byUrl.values()];
}

export async function getCompetitionsPayload(opts?: {
  fresh?: boolean;
}): Promise<CompetitionsPayload> {
  const [aivs, devpost] = await Promise.all([
    fetchAivsCompetitions(opts),
    fetchDevpostAiCompetitions(opts),
  ]);

  const competitions = sortCompetitions(
    dedupe([...CURATED_COMPETITIONS, ...aivs.items, ...devpost.items]),
  );

  const openCount = competitions.filter((c) => c.status === "open").length;
  const dueSoonCount = competitions.filter((c) => {
    if (c.status === "ended") return false;
    const days = daysUntil(c.deadline);
    return days !== null && days >= 0 && days <= 7;
  }).length;
  const todayNewCount = competitions.filter(
    (c) => c.status !== "ended" && isPublishedToday(c.publishedAt),
  ).length;

  const errors = [aivs.error, devpost.error].filter(Boolean) as string[];

  return {
    updatedAt: new Date().toISOString(),
    feedUpdatedAt: aivs.feedUpdatedAt,
    competitions,
    sources: WATCH_SOURCES,
    liveCount: aivs.items.length + devpost.items.length,
    openCount,
    dueSoonCount,
    todayNewCount,
    errors: errors.length ? errors : undefined,
  };
}
