import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import AttachmentList from "@/components/AttachmentList";
import CommentSection from "@/components/CommentSection";
import ReactionButtons from "@/components/ReactionButtons";
import ShareButton from "@/components/ShareButton";
import ViewCounter from "@/components/ViewCounter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
      // 삭제 실패 시 사용자에게 안내 (500 에러 대신 페이지로 돌아감)
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

  // 없는 글이면 Next.js 404 페이지로 처리
  if (!post) {
    notFound();
  }

  // 현재 로그인 사용자 조회 — 작성자 UI 분기에 사용
  // 이 if 문은 UX(버튼 표시)이며, 실제 보안은 Ch11 RLS에서 처리한다.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthor =
    !post?.isPractice && !!user && user.id === post?.user_id;
  const [attachments, comments] = await Promise.all([
    getAttachments(post.id),
    getComments(post.id),
  ]);

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-lg bg-accent px-2 py-1 text-accent-foreground">
            {post.category}
          </span>
          <span>{post.date || "기록"}</span>
        </div>
        <CardTitle className="text-3xl">{post.title}</CardTitle>
        <CardDescription>
          작성자: {post.author} · 댓글 {post.commentCount}
        </CardDescription>
        <ViewCounter
          postId={post.id}
          initialCount={post.viewCount}
          action={incrementViewAction.bind(null, post.id)}
        />
      </CardHeader>
      <CardContent>
        {/* 실패 시 URL ?error= 파라미터로 전달된 에러 메시지 */}
        {pageError && (
          <p className="mb-2 text-sm text-destructive">{decodeURIComponent(pageError)}</p>
        )}
        <div className="whitespace-pre-line leading-7 text-foreground">
          {post.content}
        </div>
        <AttachmentList attachments={attachments} />
        <div className="mt-6 border-t border-border pt-4">
          <ReactionButtons
            initialSummary={{
              likeCount: post.likeCount,
              dislikeCount: post.dislikeCount,
              currentUserReaction: post.currentUserReaction,
            }}
            canReact={!!user}
            action={toggleReactionAction.bind(null, post.id)}
          />
        </div>
        <CommentSection
          initialComments={comments}
          canComment={!!user}
          createAction={createCommentAction.bind(null, post.id)}
          deleteAction={deleteCommentAction.bind(null, post.id)}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>
        <ShareButton title={post.title} path={`/posts/${post.id}`} />

        {/* 작성자에게만 수정/삭제 UI 표시. 실제 보안은 Ch11 RLS에서 처리한다. */}
        {isAuthor && (
          <Button asChild variant="outline">
            <Link href={`/posts/${post.id}/edit`}>수정</Link>
          </Button>
        )}

        {isAuthor && (
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive">
                삭제
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>포스트를 삭제할까요?</DialogTitle>
                <DialogDescription>
                  삭제하면 목록에서 바로 사라집니다. 이 작업은 되돌릴 수 없습니다.
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
      </CardFooter>
    </Card>
  );
}
