import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import AttachmentList from "@/components/AttachmentList";
import CommentSection from "@/components/CommentSection";
import PostMeta from "@/components/PostMeta";
import ReactionButtons from "@/components/ReactionButtons";
import ShareButton from "@/components/ShareButton";
import ViewCounter from "@/components/ViewCounter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAttachments } from "@/lib/attachments";
import { createComment, deleteComment, getComments } from "@/lib/comments";
import { deletePostById, getPostById } from "@/lib/posts";
import { togglePostReaction } from "@/lib/reactions";
import type { ReactionType } from "@/lib/reactions";
import { createClient } from "@/lib/supabase/server";
import { incrementPostView } from "@/lib/views";

async function deletePostAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  let redirectTo = "/posts";
  if (id) {
    try {
      await deletePostById(id);
      revalidatePath("/posts");
      revalidatePath(`/posts/${id}`);
    } catch {
      redirectTo = `/posts/${id}?error=삭제%EC%97%90%20%EC%8B%A4%ED%8C%A8%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4`;
    }
  }
  redirect(redirectTo);
}

async function toggleReactionAction(id: string, reaction: ReactionType) {
  "use server";
  const result = await togglePostReaction(id, reaction);
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  return result;
}

async function createCommentAction(id: string, content: string) {
  "use server";
  const result = await createComment(id, content);
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  return result;
}

async function deleteCommentAction(id: string, commentId: string) {
  "use server";
  const result = await deleteComment(id, commentId);
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  return result;
}

async function incrementViewAction(id: string) {
  "use server";
  const result = await incrementPostView(id);
  revalidatePath(`/posts/${id}`);
  return result;
}

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: pageError } = await searchParams;
  const post = await getPostById(id);

  if (!post) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthor = !post?.isPractice && !!user && user.id === post?.user_id;

  const [attachments, comments] = await Promise.all([
    getAttachments(post.id),
    getComments(post.id),
  ]);

  return (
    <Card className="rounded-lg shadow-sm">
      {/* ── 헤더: 메타 / 제목 / 작성자·조회수 ── */}
      <CardHeader className="space-y-3 pb-4">
        <PostMeta category={post.category} date={post.date} />
        <CardTitle className="break-words text-2xl leading-snug sm:text-3xl">
          {post.title}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>작성자: {post.author}</span>
          <span aria-hidden="true">·</span>
          <ViewCounter
            postId={post.id}
            initialCount={post.viewCount}
            action={incrementViewAction.bind(null, post.id)}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 에러 안내 */}
        {pageError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {decodeURIComponent(pageError)}
          </p>
        )}

        {/* 본문 */}
        <div className="whitespace-pre-line break-words leading-7 text-foreground">
          {post.content}
        </div>

        {/* 첨부파일 */}
        <AttachmentList attachments={attachments} />

        {/* ── 액션 바: 반응 + 네비게이션을 한 영역에 통합 ── */}
        <section
          aria-label="게시글 액션"
          className="rounded-lg border border-border bg-muted/20 px-4 py-4 space-y-3"
        >
          {/* 좋아요/싫어요 */}
          <ReactionButtons
            initialSummary={{
              likeCount: post.likeCount,
              dislikeCount: post.dislikeCount,
              currentUserReaction: post.currentUserReaction,
            }}
            canReact={!!user}
            action={toggleReactionAction.bind(null, post.id)}
          />

          {/* 구분선 */}
          <div className="border-t border-border" />

          {/* 목록 / 공유 / 수정 / 삭제 */}
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/posts">← 목록으로</Link>
            </Button>
            <ShareButton title={post.title} path={`/posts/${post.id}`} />
            {isAuthor && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/posts/${post.id}/edit`}>수정</Link>
              </Button>
            )}
            {isAuthor && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm">
                    삭제
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>포스트를 삭제할까요?</DialogTitle>
                    <DialogDescription>
                      삭제하면 목록에서 바로 사라집니다. 이 작업은 되돌릴 수
                      없습니다.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        취소
                      </Button>
                    </DialogClose>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <Button type="submit" variant="destructive">
                        삭제하기
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </section>

        {/* ── 댓글 ── */}
        <CommentSection
          initialComments={comments}
          canComment={!!user}
          createAction={createCommentAction.bind(null, post.id)}
          deleteAction={deleteCommentAction.bind(null, post.id)}
        />
      </CardContent>
    </Card>
  );
}
