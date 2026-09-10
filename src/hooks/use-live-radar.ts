"use client";

import type { CompetitionsPayload } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 60_000;

export type LiveRadarState = CompetitionsPayload & {
  checking: boolean;
  liveOn: boolean;
  lastCheckedAt: string | null;
  nextCheckInSec: number;
  checkError: string | null;
  checkNow: () => void;
  setLiveOn: (on: boolean) => void;
};

export function useLiveRadar(initial: CompetitionsPayload): LiveRadarState {
  const [payload, setPayload] = useState(initial);
  const [checking, setChecking] = useState(false);
  const [liveOn, setLiveOn] = useState(true);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(
    initial.updatedAt,
  );
  const [nextCheckInSec, setNextCheckInSec] = useState(POLL_MS / 1000);
  const [checkError, setCheckError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const checkNow = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    setCheckError(null);
    try {
      const res = await fetch("/api/competitions?fresh=1", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`检查失败 HTTP ${res.status}`);
      const data = (await res.json()) as CompetitionsPayload & {
        checkedAt?: string;
      };
      setPayload(data);
      setLastCheckedAt(data.checkedAt ?? data.updatedAt);
      setNextCheckInSec(POLL_MS / 1000);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "实时检查失败");
    } finally {
      inFlight.current = false;
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    setPayload(initial);
    setLastCheckedAt(initial.updatedAt);
  }, [initial]);

  useEffect(() => {
    if (!liveOn) return;

    const countdown = window.setInterval(() => {
      setNextCheckInSec((s) => Math.max(0, s - 1));
    }, 1000);

    const poll = window.setInterval(() => {
      void checkNow();
    }, POLL_MS);

    return () => {
      window.clearInterval(countdown);
      window.clearInterval(poll);
    };
  }, [liveOn, checkNow]);

  return {
    ...payload,
    checking,
    liveOn,
    lastCheckedAt,
    nextCheckInSec: liveOn ? nextCheckInSec : 0,
    checkError,
    checkNow: () => {
      void checkNow();
    },
    setLiveOn,
  };
}
