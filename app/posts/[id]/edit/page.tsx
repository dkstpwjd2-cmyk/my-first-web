import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import AttachmentManager from "@/components/AttachmentManager";
import FormActions from "@/components/FormActions";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

  if (!post || post.isPractice) {
    notFound();
  }

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
        redirect(
          `/posts/${id}/edit?error=수정%EC%97%90%20%EC%8B%A4%ED%8C%A8%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4`
        );
      }
    }

    redirect(`/posts/${id}/edit`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="포스트 수정" description="제목과 내용을 수정한 뒤 저장하기를 누르세요." />

      <Card className="rounded-lg shadow-sm">
        <CardContent className="pt-6">
          <form action={updatePostAction} className="space-y-5">
            {pageError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {decodeURIComponent(pageError)}
              </p>
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
                className="min-h-72"
                defaultValue={post.content}
                placeholder="내용을 입력하세요"
              />
            </div>

            <FormActions>
              <Button type="submit">수정 저장</Button>
              <Button asChild type="button" variant="outline">
                <Link href={`/posts/${id}`}>취소</Link>
              </Button>
            </FormActions>
          </form>

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
