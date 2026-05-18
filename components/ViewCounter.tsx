"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

import type { ViewCountResult } from "@/lib/views";

const VIEW_COOLDOWN_MS = 30 * 60 * 1000;
const STORAGE_PREFIX = "my-first-web:post-view:";
const memoryViewedAt = new Map<string, number>();

type ViewCounterProps = {
  postId: string;
  initialCount: number;
  action: () => Promise<ViewCountResult>;
};

export default function ViewCounter({
  postId,
  initialCount,
  action,
}: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;

    if (!postId || !shouldIncrementView(postId)) {
      return;
    }

    markViewed(postId);

    action().then((result) => {
      if (cancelled) {
        return;
      }

      if (result.error) {
        clearViewed(postId);
        return;
      }

      setViewCount(result.viewCount);
    });

    return () => {
      cancelled = true;
    };
  }, [action, postId]);

  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" aria-hidden="true" />
      조회수 {viewCount}
    </span>
  );
}

function shouldIncrementView(postId: string) {
  const lastViewedAt = readViewedAt(postId);

  if (!lastViewedAt) {
    return true;
  }

  return Date.now() - lastViewedAt >= VIEW_COOLDOWN_MS;
}

function readViewedAt(postId: string) {
  const storageKey = getStorageKey(postId);

  try {
    const value = window.localStorage.getItem(storageKey);
    const timestamp = value ? Number(value) : 0;
    return Number.isFinite(timestamp) ? timestamp : 0;
  } catch {
    return memoryViewedAt.get(storageKey) ?? 0;
  }
}

function markViewed(postId: string) {
  const storageKey = getStorageKey(postId);
  const timestamp = Date.now();

  try {
    window.localStorage.setItem(storageKey, String(timestamp));
  } catch {
    memoryViewedAt.set(storageKey, timestamp);
  }
}

function clearViewed(postId: string) {
  const storageKey = getStorageKey(postId);

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    memoryViewedAt.delete(storageKey);
  }
}

function getStorageKey(postId: string) {
  return `${STORAGE_PREFIX}${postId}`;
}
