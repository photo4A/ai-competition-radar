import { Badge } from "@/components/ui/badge";
import { REGION_LABEL } from "@/lib/labels";
import type { WatchSource } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

export function SourceCard({ source }: { source: WatchSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 border-b border-hairline py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-medium tracking-tight text-ink transition group-hover:text-lavender-hover">
            {source.name}
            <ArrowUpRight className="ml-1 inline size-3.5 opacity-50" />
          </h3>
          <Badge
            variant="outline"
            className="rounded-md border-hairline bg-surface-2 text-ink-subtle"
          >
            {REGION_LABEL[source.region]}
          </Badge>
        </div>
        <p className="text-sm text-ink-subtle">{source.focus}</p>
      </div>
      <p className="shrink-0 text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
        建议 {source.cadence}
      </p>
    </a>
  );
}
