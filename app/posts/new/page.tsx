"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import FileUploadField from "@/components/FileUploadField";
import FormActions from "@/components/FormActions";
import PageHeader from "@/components/PageHeader";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  ATTACHMENT_BUCKET,
  buildAttachmentPath,
  type SelectedUpload,
} from "@/lib/fileUpload";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import {
  hasPostFormErrors,
  validatePostForm,
  type PostFormErrors,
} from "@/lib/post-validation";
import { createClient } from "@/lib/supabase/client";

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<SelectedUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<PostFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <Card className="rounded-lg shadow-sm">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">확인 중...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>
            포스트를 작성하려면 먼저 로그인해야 합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/login">로그인하러 가기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const nextErrors = validatePostForm(title, content);
    setFieldErrors(nextErrors);

    if (hasPostFormErrors(nextErrors)) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    // 이메일 인증 직후 첫 글 작성 시 profiles 행이 없으면 FK violation이 발생할 수 있다.
    const metadataName = user!.user_metadata?.name;
    const username =
      typeof metadataName === "string" && metadataName.trim()
        ? metadataName.trim().slice(0, 80)
        : user!.email?.split("@")[0]?.trim().slice(0, 80);
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: user!.id, ...(username ? { username } : {}) },
        { onConflict: "id" }
      );
    if (profileError) {
      console.error(profileError);
      setSubmitting(false);
      setError(getFriendlyErrorMessage(profileError));
      return;
    }

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        content: content.trim(),
        user_id: user!.id,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error(insertError);
      setSubmitting(false);
      setError(getFriendlyErrorMessage(insertError));
      return;
    }

    const attachmentError = await uploadAttachments(
      supabase,
      data.id,
      user!.id,
      files
    );

    setSubmitting(false);

    if (attachmentError) {
      console.error(attachmentError.cause);
      setError(
        `글은 저장됐지만 첨부파일 업로드에 실패했습니다. ${attachmentError.message}`
      );
      return;
    }

    for (const item of files) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }

    router.push(`/posts/${data.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="포스트 작성" description="제목과 내용을 입력하면 새 포스트가 저장됩니다." />

      <Card className="rounded-lg shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
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
                minLength={2}
                placeholder="제목을 입력하세요"
                value={title}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.title)}
                aria-describedby={fieldErrors.title ? "title-error" : undefined}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, title: undefined }));
                }}
              />
              {fieldErrors.title && (
                <p id="title-error" className="text-sm text-destructive">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                내용
              </label>
              <Textarea
                id="content"
                name="content"
                required
                minLength={10}
                className="min-h-72"
                placeholder="내용을 입력하세요"
                value={content}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.content)}
                aria-describedby={
                  fieldErrors.content ? "content-error" : undefined
                }
                onChange={(e) => {
                  setContent(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, content: undefined }));
                }}
              />
              {fieldErrors.content && (
                <p id="content-error" className="text-sm text-destructive">
                  {fieldErrors.content}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <FileUploadField
                files={files}
                disabled={submitting}
                onChange={setFiles}
                onError={setError}
              />
            </div>

            <FormActions>
              <Button type="submit" disabled={submitting}>
                {submitting ? "저장 중..." : "저장하기"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/posts">취소</Link>
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

async function uploadAttachments(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  userId: string,
  files: SelectedUpload[]
): Promise<{ message: string; cause: unknown } | null> {
  for (const item of files) {
    const storagePath = buildAttachmentPath(userId, postId, item.file.name);
    const { error: uploadError } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .upload(storagePath, item.file, {
        contentType: item.file.type || "application/octet-stream",
      });

    if (uploadError) {
      return {
        message: `${item.file.name}: ${getFriendlyErrorMessage(uploadError)}`,
        cause: uploadError,
      };
    }

    const { error: insertError } = await supabase
      .from("post_attachments")
      .insert({
        post_id: postId,
        user_id: userId,
        storage_path: storagePath,
        file_name: item.file.name,
        file_type: item.file.type || "application/octet-stream",
        file_size: item.file.size,
      });

    if (insertError) {
      await supabase.storage.from(ATTACHMENT_BUCKET).remove([storagePath]);
      return {
        message: `${item.file.name}: ${getFriendlyErrorMessage(insertError)}`,
        cause: insertError,
      };
    }
  }

  return null;
}
