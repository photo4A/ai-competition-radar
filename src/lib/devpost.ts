import type { Competition } from "./types";

const AI_HINTS = [
  "machine learning",
  "artificial intelligence",
  "ai",
  "llm",
  "agent",
  "generative",
  "nlp",
  "computer vision",
  "deep learning",
  "genai",
];

interface DevpostTheme {
  id: number;
  name: string;
}

interface DevpostHackathon {
  id: number;
  title: string;
  url: string;
  open_state: string;
  thumbnail_url?: string;
  time_left_to_submission?: string;
  submission_period_dates?: string;
  themes?: DevpostTheme[];
  prize_amount?: string;
  organization_name?: string;
  displayed_location?: { location?: string };
  registrations_count?: number;
  invite_only?: boolean;
}

function stripPrizeHtml(raw?: string): string | undefined {
  if (!raw) return undefined;
  const text = raw.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, "").trim();
  if (!text || text === "$0" || text === "0") return undefined;
  return text;
}

function absoluteThumb(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http")) return url;
  return undefined;
}

function isAiRelated(h: DevpostHackathon): boolean {
  const themes = (h.themes ?? []).map((t) => t.name.toLowerCase());
  if (themes.some((name) => AI_HINTS.some((hint) => name.includes(hint)))) {
    return true;
  }
  const blob = `${h.title} ${h.organization_name ?? ""}`.toLowerCase();
  return AI_HINTS.some((hint) => blob.includes(hint));
}

function mapStatus(openState: string): Competition["status"] {
  if (openState === "open") return "open";
  if (openState === "upcoming") return "upcoming";
  return "ended";
}

function mapHackathon(h: DevpostHackathon): Competition {
  const location = h.displayed_location?.location ?? "Online";
  const region: Competition["region"] =
    location.toLowerCase() === "online" ? "online" : "global";
  const themes = (h.themes ?? []).map((t) => t.name);
  const kind: Competition["kind"] = themes.some((t) => /agent/i.test(t))
    ? "agent"
    : "hackathon";

  return {
    id: `devpost-${h.id}`,
    title: h.title,
    url: h.url,
    summary: [
      h.organization_name ? `主办：${h.organization_name}` : null,
      h.submission_period_dates ? `赛程：${h.submission_period_dates}` : null,
      typeof h.registrations_count === "number"
        ? `已报名 ${h.registrations_count} 人`
        : null,
    ]
      .filter(Boolean)
      .join(" · "),
    region,
    kind,
    status: mapStatus(h.open_state),
    organizer: h.organization_name,
    prize: stripPrizeHtml(h.prize_amount),
    deadlineLabel: h.time_left_to_submission ?? h.submission_period_dates,
    source: "Devpost",
    tags: themes.length ? themes.slice(0, 4) : ["Hackathon"],
    live: true,
    platform: "devpost",
    participants: h.registrations_count,
    coverImage: absoluteThumb(h.thumbnail_url),
  };
}

async function fetchPage(
  page: number,
  status: "open" | "upcoming",
  fresh = false,
): Promise<DevpostHackathon[]> {
  const url = new URL("https://devpost.com/api/hackathons");
  url.searchParams.set("status", status);
  url.searchParams.set("order_by", "recently-added");
  url.searchParams.set("page", String(page));

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "AI-Competition-Radar/1.0",
    },
    ...(fresh
      ? { cache: "no-store" as const }
      : { next: { revalidate: 3600 } }),
  });
  if (!res.ok) throw new Error(`Devpost ${status} p${page}: HTTP ${res.status}`);
  const data = (await res.json()) as { hackathons?: DevpostHackathon[] };
  return data.hackathons ?? [];
}

export async function fetchDevpostAiCompetitions(opts?: {
  fresh?: boolean;
}): Promise<{
  items: Competition[];
  error?: string;
}> {
  try {
    const fresh = Boolean(opts?.fresh);
    const pages = await Promise.all([
      fetchPage(1, "open", fresh),
      fetchPage(2, "open", fresh),
      fetchPage(3, "open", fresh),
      fetchPage(1, "upcoming", fresh),
    ]);
    const seen = new Set<number>();
    const items: Competition[] = [];
    for (const batch of pages) {
      for (const h of batch) {
        if (seen.has(h.id) || !isAiRelated(h)) continue;
        seen.add(h.id);
        items.push(mapHackathon(h));
      }
    }
    return { items };
  } catch (err) {
    return {
      items: [],
      error: err instanceof Error ? err.message : "Devpost fetch failed",
    };
  }
}
