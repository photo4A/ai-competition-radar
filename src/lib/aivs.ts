import type { Competition } from "./types";

interface AivsEvent {
  id: string;
  name: string;
  category?: string;
  format?: string;
  mode?: string;
  platform?: string;
  organizer?: string;
  url: string;
  tracks?: string[];
  desc?: string;
  cover?: string | null;
  regStart?: string | null;
  deadline?: string | null;
  prizePool?: string | null;
  participants?: number | null;
  archived?: boolean | null;
  remoteStatus?: string | null;
  rewardSummary?: {
    primaryLabel?: string;
    secondaryLabel?: string;
  } | null;
}

interface AivsPayload {
  updatedAt?: string;
  events?: AivsEvent[];
}

function absoluteCover(cover?: string | null): string | undefined {
  if (!cover) return undefined;
  if (cover.startsWith("http://") || cover.startsWith("https://")) return cover;
  if (cover.startsWith("//")) return `https:${cover}`;
  return `https://aivs.one${cover.startsWith("/") ? "" : "/"}${cover}`;
}

function mapKind(event: AivsEvent): Competition["kind"] {
  const cat = (event.category ?? "").toLowerCase();
  const format = (event.format ?? "").toLowerCase();
  const blob = `${event.name} ${event.desc ?? ""} ${(event.tracks ?? []).join(" ")}`;
  if (/黑客松|hackathon/i.test(blob) || format.includes("hack")) return "hackathon";
  if (/智能体|agent/i.test(blob)) return "agent";
  if (cat === "project") return "application";
  return "aigc";
}

function mapStatus(event: AivsEvent, today: string): Competition["status"] {
  if (event.archived) return "ended";
  const remote = (event.remoteStatus ?? "").toLowerCase();
  const deadline = event.deadline?.slice(0, 10);
  const regStart = event.regStart?.slice(0, 10);
  if (deadline && deadline < today) return "ended";
  if (
    ["ended", "closed", "finished", "awarding", "announced"].includes(remote) &&
    (!deadline || deadline < today)
  ) {
    return "ended";
  }
  if (regStart && regStart > today) return "upcoming";
  return "open";
}

function mapEvent(event: AivsEvent, today: string): Competition {
  const prize =
    event.rewardSummary?.primaryLabel ||
    (event.prizePool && event.prizePool !== "—" ? event.prizePool : undefined);

  return {
    id: `aivs-${event.id}`,
    title: event.name,
    url: event.url,
    summary:
      event.desc?.trim() ||
      `${event.organizer ?? event.platform ?? "平台"} AI 创作/开发赛事`,
    region: event.mode === "offline" ? "cn" : "online",
    kind: mapKind(event),
    status: mapStatus(event, today),
    organizer: event.organizer ?? event.platform,
    prize,
    deadline: event.deadline?.slice(0, 10) || undefined,
    deadlineLabel: event.deadline
      ? `截止 ${event.deadline.slice(0, 10)}`
      : undefined,
    source: "aivs.one",
    tags: [
      event.platform,
      ...(event.tracks ?? []).slice(0, 3),
      event.mode === "online" ? "线上" : event.mode,
    ].filter(Boolean) as string[],
    publishedAt: event.regStart
      ? `${event.regStart.slice(0, 10)}T00:00:00.000Z`
      : undefined,
    live: true,
    platform: event.platform,
    participants:
      typeof event.participants === "number" ? event.participants : undefined,
    coverImage: absoluteCover(event.cover),
  };
}

export async function fetchAivsCompetitions(opts?: {
  fresh?: boolean;
}): Promise<{
  items: Competition[];
  feedUpdatedAt?: string;
  error?: string;
}> {
  try {
    const res = await fetch("https://aivs.one/data/competitions.json", {
      headers: {
        Accept: "application/json",
        "User-Agent": "AI-Competition-Radar/1.0",
      },
      ...(opts?.fresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600 } }),
    });
    if (!res.ok) throw new Error(`aivs.one HTTP ${res.status}`);
    const data = (await res.json()) as AivsPayload;
    const today = new Date().toISOString().slice(0, 10);
    const items = (data.events ?? [])
      .filter((e) => Boolean(e?.id && e?.name && e?.url))
      .map((e) => mapEvent(e, today));
    return { items, feedUpdatedAt: data.updatedAt };
  } catch (err) {
    return {
      items: [],
      error: err instanceof Error ? err.message : "aivs.one fetch failed",
    };
  }
}
