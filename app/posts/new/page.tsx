"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import FileUploadField from "@/components/FileUploadField";
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
import { createClient } from "@/lib/supabase/client";

export default function NewPostPage() {
  // Ch9의 useAuth()로 현재 로그인 사용자 확인
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<SelectedUpload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 인증 로딩 중
  if (loading) {
    return (
      <Card className="rounded-lg shadow-sm">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">확인 중...</p>
        </CardContent>
      </Card>
    );
  }

  // 비로그인 상태 안내
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
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setError(null);

    // Ch8의 lib/supabase/client.ts (createBrowserClient) 사용
    // user_id는 폼 입력값이 아닌 useAuth()의 user.id를 사용
    const supabase = createClient();
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
      setSubmitting(false);
      setError(insertError.message);
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
      setError(`글은 저장됐지만 첨부파일 업로드에 실패했습니다. ${attachmentError}`);
      return;
    }

    for (const item of files) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }

    // 성공 후 새 글 상세 페이지로 이동
    router.push(`/posts/${data.id}`);
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>포스트 작성</CardTitle>
        <CardDescription>
          제목과 내용을 입력하면 새 포스트가 저장됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목
            </label>
            <Input
              id="title"
              name="title"
              required
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <FileUploadField
            files={files}
            disabled={submitting}
            onChange={setFiles}
            onError={setError}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={submitting}>
              {submitting ? "저장 중..." : "저장하기"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/posts">취소</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

async function uploadAttachments(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  userId: string,
  files: SelectedUpload[]
) {
  for (const item of files) {
    const storagePath = buildAttachmentPath(userId, postId, item.file.name);
    const { error: uploadError } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .upload(storagePath, item.file, {
        contentType: item.file.type || "application/octet-stream",
      });

    if (uploadError) {
      return `${item.file.name}: ${uploadError.message}`;
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
      return `${item.file.name}: ${insertError.message}`;
    }
  }

  return null;
}
