import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import AttachmentManager from "@/components/AttachmentManager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAttachments } from "@/lib/attachments";
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
  const post = await getPostById(id);

  // 실습 글이거나 존재하지 않으면 404
  if (!post || post.isPractice) {
    notFound();
  }

  // 작성자 확인 — 비작성자는 상세 페이지로 이동
  // 이 리다이렉트는 UX이며, 실제 보안은 Ch11 RLS에서 처리한다.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== post.user_id) {
    redirect(`/posts/${id}`);
  }

  const attachments = await getAttachments(id);

  async function updatePostAction(formData: FormData) {
    "use server";

    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");

    if (title.trim() && content.trim()) {
      try {
        await updatePost(id, { title, content });
        revalidatePath("/posts");
        revalidatePath(`/posts/${id}`);
        redirect(`/posts/${id}`);
      } catch {
        // 수정 실패 시 사용자에게 안내
        redirect(`/posts/${id}/edit?error=수정%EC%97%90%20%EC%8B%A4%ED%8C%A8%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4`);
      }
    }

    redirect(`/posts/${id}/edit`);
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>포스트 수정</CardTitle>
        <CardDescription>
          제목과 내용을 수정한 뒤 저장하기를 누르세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updatePostAction} className="space-y-6">
          {/* 실패 시 URL ?error= 파라미터로 전달된 에러 메시지 */}
          {pageError && (
            <p className="text-sm text-destructive">{decodeURIComponent(pageError)}</p>
          )}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={post.title}
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              내용
            </label>
            <Textarea
              id="content"
              name="content"
              required
              className="min-h-64"
              defaultValue={post.content}
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit">수정 저장</Button>
            <Button asChild type="button" variant="outline">
              <Link href={`/posts/${id}`}>취소</Link>
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <AttachmentManager
            postId={id}
            userId={user.id}
            initialAttachments={attachments}
          />
        </div>
      </CardContent>
    </Card>
  );
}
