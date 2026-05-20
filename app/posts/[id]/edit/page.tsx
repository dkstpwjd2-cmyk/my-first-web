import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import AttachmentManager from "@/components/AttachmentManager";
import PageHeader from "@/components/PageHeader";
import PostEditForm from "@/components/PostEditForm";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { getAttachments } from "@/lib/attachments";
import {
  getFriendlyErrorMessage,
  getSafeUserMessage,
} from "@/lib/error-message";
import { hasPostFormErrors, validatePostForm } from "@/lib/post-validation";
import { getPostById, updatePost } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: pageError } = await searchParams;
  const pageErrorMessage = getSafeUserMessage(pageError);
  const post = await getPostById(id);

  if (!post || post.isPractice) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== post.user_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">수정 권한이 없습니다</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          이 게시글의 작성자만 수정할 수 있습니다.
          <br />
          작성자 계정으로 다시 로그인한 뒤 시도해 주세요.
        </p>
        <Link
          href={`/posts/${id}`}
          className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4"
        >
          ← 게시글로 돌아가기
        </Link>
      </div>
    );
  }

  const attachments = await getAttachments(id);

  async function updatePostAction(formData: FormData) {
    "use server";

    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const validationErrors = validatePostForm(title, content);

    if (hasPostFormErrors(validationErrors)) {
      redirect(
        `/posts/${id}/edit?error=${encodeURIComponent(
          validationErrors.title ??
            validationErrors.content ??
            "입력값을 확인해주세요."
        )}`
      );
    }

    try {
      await updatePost(id, { title, content });
    } catch (error) {
      console.error(error);
      redirect(
        `/posts/${id}/edit?error=${encodeURIComponent(
          getFriendlyErrorMessage(error)
        )}`
      );
    }

    revalidatePath("/posts");
    revalidatePath(`/posts/${id}`);
    redirect(`/posts/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="포스트 수정" description="제목과 내용을 수정한 뒤 저장하기를 누르세요." />

      <Card className="rounded-lg shadow-sm">
        <CardContent className="pt-6">
          <PostEditForm
            postId={id}
            initialTitle={post.title}
            initialContent={post.content}
            pageMessage={pageErrorMessage}
            action={updatePostAction}
          />

          {/* 첨부파일 관리 - 폼과 분리된 독립 영역 */}
          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <AttachmentManager
              postId={id}
              userId={user.id}
              initialAttachments={attachments}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
