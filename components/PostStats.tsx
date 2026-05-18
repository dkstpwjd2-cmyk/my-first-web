import { Eye, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";

type PostStatsProps = {
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  viewCount: number;
};

export default function PostStats({
  likeCount,
  dislikeCount,
  commentCount,
  viewCount,
}: PostStatsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{likeCount}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{dislikeCount}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{commentCount}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{viewCount}</span>
      </span>
    </div>
  );
}
