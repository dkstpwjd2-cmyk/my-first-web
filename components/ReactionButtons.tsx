"use client";

import { useState, useTransition } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ReactionSummary, ReactionType } from "@/lib/reactions";

type ReactionButtonsProps = {
  initialSummary: ReactionSummary;
  canReact: boolean;
  action: (
    reaction: ReactionType
  ) => Promise<{ summary: ReactionSummary; error?: string }>;
};

export default function ReactionButtons({
  initialSummary,
  canReact,
  action,
}: ReactionButtonsProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick(reaction: ReactionType) {
    if (!canReact) {
      setMessage("로그인 후 반응할 수 있습니다.");
      return;
    }

    const previous = summary;
    setMessage(null);
    setSummary(getOptimisticSummary(previous, reaction));

    startTransition(async () => {
      const result = await action(reaction);
      setSummary(result.summary);
      setMessage(result.error ?? null);
    });
  }

  const isLikeActive = summary.currentUserReaction === "like";
  const isDislikeActive = summary.currentUserReaction === "dislike";

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant={isLikeActive ? "default" : "outline"}
          className="justify-start sm:justify-center"
          aria-pressed={isLikeActive}
          disabled={isPending}
          onClick={() => handleClick("like")}
        >
          <ThumbsUp aria-hidden="true" />
          좋아요 {summary.likeCount}
        </Button>
        <Button
          type="button"
          variant={isDislikeActive ? "destructive" : "outline"}
          className="justify-start sm:justify-center"
          aria-pressed={isDislikeActive}
          disabled={isPending}
          onClick={() => handleClick("dislike")}
        >
          <ThumbsDown aria-hidden="true" />
          싫어요 {summary.dislikeCount}
        </Button>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

function getOptimisticSummary(
  summary: ReactionSummary,
  reaction: ReactionType
): ReactionSummary {
  const next = { ...summary };
  const current = summary.currentUserReaction;

  if (current === reaction) {
    if (reaction === "like") {
      next.likeCount = Math.max(0, next.likeCount - 1);
    } else {
      next.dislikeCount = Math.max(0, next.dislikeCount - 1);
    }
    next.currentUserReaction = null;
    return next;
  }

  if (current === "like") {
    next.likeCount = Math.max(0, next.likeCount - 1);
  }

  if (current === "dislike") {
    next.dislikeCount = Math.max(0, next.dislikeCount - 1);
  }

  if (reaction === "like") {
    next.likeCount += 1;
  } else {
    next.dislikeCount += 1;
  }

  next.currentUserReaction = reaction;
  return next;
}
