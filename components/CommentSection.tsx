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
    if (!trimmedContent) { setMessage("댓글 내용을 입력해 주세요."); return; }
    if (!canComment) { setMessage("로그인 후 댓글을 작성할 수 있습니다."); return; }
    startTransition(async () => {
      const result = await createAction(trimmedContent);
      setComments(result.comments);
      setMessage(result.error ?? null);
      if (!result.error) setContent("");
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
    <section
      aria-label="댓글"
      className="border-t border-border pt-6 space-y-4"
    >
      {/* 헤더 */}
      <div>
        <h2 className="text-lg font-bold tracking-normal">
          댓글 {comments.length > 0 && <span className="text-primary">{comments.length}</span>}
        </h2>
      </div>

      {/* 입력 폼 — 로그인한 경우만 완전히 표시 */}
      {canComment ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            aria-label="댓글 내용 입력"
            value={content}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(e) => { setContent(e.target.value); setMessage(null); }}
            placeholder="댓글을 입력하세요"
            disabled={isPending}
            className="min-h-24 resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {content.length} / {MAX_COMMENT_LENGTH}
            </p>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "처리 중..." : "댓글 등록"}
            </Button>
          </div>
        </form>
      ) : (
        /* 비로그인: 안내 문구만 표시, 입력창/카운터/버튼 없음 */
        <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          로그인 후 댓글을 작성할 수 있습니다.
        </p>
      )}

      {/* 에러 메시지 */}
      {message && (
        <p className="text-sm text-destructive">{message}</p>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-border bg-background p-4 space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{comment.authorName}</p>
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
                    className="shrink-0"
                  >
                    삭제
                  </Button>
                )}
              </div>
              <p className="whitespace-pre-line break-words text-sm leading-6">
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
  if (!value) return "방금 전";
  const parts = Object.fromEntries(
    commentDateFormatter.formatToParts(new Date(value)).map((p) => [p.type, p.value])
  );
  return `${parts.year}년 ${Number(parts.month)}월 ${Number(parts.day)}일 ${parts.hour}:${parts.minute}`;
}
