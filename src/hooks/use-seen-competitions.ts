"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ai-radar-seen-ids-v1";
const INIT_KEY = "ai-radar-initialized-v1";

export function useSeenCompetitions(ids: string[]) {
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const initialized = localStorage.getItem(INIT_KEY);
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      const next = new Set(parsed);
      if (!initialized) {
        ids.forEach((id) => next.add(id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        localStorage.setItem(INIT_KEY, "1");
      }
      setSeen(next);
    } catch {
      setSeen(new Set(ids));
    } finally {
      setReady(true);
    }
  }, [ids]);

  const markAllSeen = useCallback(() => {
    const next = new Set(seen);
    ids.forEach((id) => next.add(id));
    setSeen(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  }, [ids, seen]);

  const isNew = useCallback(
    (id: string) => ready && !seen.has(id),
    [ready, seen],
  );

  const newCount = ready ? ids.filter((id) => !seen.has(id)).length : 0;

  return { isNew, newCount, markAllSeen, ready };
}
