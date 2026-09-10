export type CompetitionRegion = "cn" | "global" | "online";

export type CompetitionKind =
  | "hackathon"
  | "application"
  | "agent"
  | "algorithm"
  | "aigc"
  | "platform";

export type CompetitionStatus = "open" | "upcoming" | "watch" | "ended";

export interface Competition {
  id: string;
  title: string;
  url: string;
  summary: string;
  region: CompetitionRegion;
  kind: CompetitionKind;
  status: CompetitionStatus;
  organizer?: string;
  prize?: string;
  deadline?: string;
  deadlineLabel?: string;
  source: string;
  tags: string[];
  publishedAt?: string;
  live?: boolean;
  platform?: string;
  participants?: number;
  /** Absolute cover image URL when available. */
  coverImage?: string;
}

export interface WatchSource {
  id: string;
  name: string;
  url: string;
  cadence: string;
  focus: string;
  region: CompetitionRegion;
}

export interface CompetitionsPayload {
  updatedAt: string;
  feedUpdatedAt?: string;
  competitions: Competition[];
  sources: WatchSource[];
  liveCount: number;
  openCount: number;
  dueSoonCount: number;
  todayNewCount: number;
  errors?: string[];
}
