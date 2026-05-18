"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PostComment } from "@/lib/comments";

const MAX_COMMENT_LENGTH = 500;
const commentDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

type CommentActionResult = {
  comments: PostComment[];
  error?: string;
};

type CommentSectionProps = {
  initialComments: PostComment[];
  canComment: boolean;
  createAction: (content: string) => Promise<CommentActionResult>;
  deleteAction: (commentId: string) => Promise<CommentActionResult>;
};

export default function CommentSection({
  initialComments,
  canComment,
  createAction,
  deleteAction,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setMessage("댓글 내용을 입력해 주세요.");
      return;
    }

    if (!canComment) {
      setMessage("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

    startTransition(async () => {
      const result = await createAction(trimmedContent);
      setComments(result.comments);
      setMessage(result.error ?? null);

      if (!result.error) {
        setContent("");
      }
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      const result = await deleteAction(commentId);
      setComments(result.comments);
      setMessage(result.error ?? null);
    });
  }

  return (
    <section className="mt-6 border-t border-border pt-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-normal">댓글</h2>
          <p className="text-sm text-muted-foreground">
            {comments.length}개의 댓글이 있습니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={content}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(event) => {
            setContent(event.target.value);
            setMessage(null);
          }}
          placeholder={
            canComment
              ? "댓글을 입력하세요"
              : "로그인 후 댓글을 작성할 수 있습니다"
          }
          disabled={!canComment || isPending}
          className="min-h-28"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {content.length}/{MAX_COMMENT_LENGTH}
          </p>
          <Button type="submit" disabled={!canComment || isPending}>
            {isPending ? "처리 중..." : "댓글 등록"}
          </Button>
        </div>
      </form>

      {message && <p className="mt-3 text-sm text-destructive">{message}</p>}

      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCommentDate(comment.createdAt)}
                  </p>
                </div>
                {comment.canDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(comment.id)}
                  >
                    삭제
                  </Button>
                )}
              </div>
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-6">
                {comment.content}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function formatCommentDate(value: string) {
  if (!value) {
    return "방금 전";
  }

  const parts = Object.fromEntries(
    commentDateFormatter
      .formatToParts(new Date(value))
      .map((part) => [part.type, part.value])
  );

  return `${parts.year}년 ${Number(parts.month)}월 ${Number(parts.day)}일 ${parts.hour}:${parts.minute}`;
}
