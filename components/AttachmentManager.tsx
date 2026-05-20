"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import FileUploadField from "@/components/FileUploadField";
import { Button } from "@/components/ui/button";
import type { PostAttachment } from "@/lib/attachments";
import {
  ATTACHMENT_BUCKET,
  buildAttachmentPath,
  type SelectedUpload,
} from "@/lib/fileUpload";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import { createClient } from "@/lib/supabase/client";

type AttachmentManagerProps = {
  postId: string;
  userId: string;
  initialAttachments: PostAttachment[];
};

export default function AttachmentManager({
  postId,
  userId,
  initialAttachments,
}: AttachmentManagerProps) {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [files, setFiles] = useState<SelectedUpload[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  function setSuccess(msg: string) {
    setIsError(false);
    setMessage(msg);
  }

  function setErrorMsg(msg: string) {
    setIsError(true);
    setMessage(msg);
  }

  async function uploadFiles() {
    if (files.length === 0) {
      setErrorMsg("업로드할 파일을 선택해 주세요.");
      return;
    }

    setBusy(true);
    setMessage(null);

    const supabase = createClient();
    const uploaded: PostAttachment[] = [];

    for (const item of files) {
      const storagePath = buildAttachmentPath(userId, postId, item.file.name);
      const { error: uploadError } = await supabase.storage
        .from(ATTACHMENT_BUCKET)
        .upload(storagePath, item.file, {
          contentType: item.file.type || "application/octet-stream",
        });

      if (uploadError) {
        console.error(uploadError);
        setErrorMsg(`${item.file.name}: ${getFriendlyErrorMessage(uploadError)}`);
        setBusy(false);
        return;
      }

      const { data, error: insertError } = await supabase
        .from("post_attachments")
        .insert({
          post_id: postId,
          user_id: userId,
          storage_path: storagePath,
          file_name: item.file.name,
          file_type: item.file.type || "application/octet-stream",
          file_size: item.file.size,
        })
        .select("id, post_id, file_name, file_type, file_size, storage_path, created_at")
        .single();

      if (insertError) {
        await supabase.storage.from(ATTACHMENT_BUCKET).remove([storagePath]);
        console.error(insertError);
        setErrorMsg(`${item.file.name}: ${getFriendlyErrorMessage(insertError)}`);
        setBusy(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(ATTACHMENT_BUCKET).getPublicUrl(storagePath);

      uploaded.push({
        id: data.id,
        postId: data.post_id,
        fileName: data.file_name,
        fileType: data.file_type,
        fileSize: data.file_size,
        storagePath,
        publicUrl,
        isImage: data.file_type.startsWith("image/"),
        createdAt: data.created_at ?? "",
      });
    }

    for (const item of files) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }

    setAttachments([...attachments, ...uploaded]);
    setFiles([]);
    setSuccess("첨부파일을 업로드했습니다.");
    setBusy(false);
  }

  async function deleteAttachment(attachment: PostAttachment) {
    setBusy(true);
    setMessage(null);

    const supabase = createClient();

    if (attachment.storagePath) {
      const { error: removeError } = await supabase.storage
        .from(ATTACHMENT_BUCKET)
        .remove([attachment.storagePath]);

      if (removeError) {
        console.error(removeError);
        setErrorMsg(getFriendlyErrorMessage(removeError));
        setBusy(false);
        return;
      }
    }

    const { error: deleteMetaError } = await supabase
      .from("post_attachments")
      .delete()
      .eq("id", attachment.id)
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (deleteMetaError) {
      console.error(deleteMetaError);
      setErrorMsg(getFriendlyErrorMessage(deleteMetaError));
      setBusy(false);
      return;
    }

    setAttachments(attachments.filter((item) => item.id !== attachment.id));
    setSuccess("첨부파일을 삭제했습니다.");
    setBusy(false);
  }

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div>
        <h2 className="text-xl font-bold tracking-normal">첨부파일</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          기존 첨부파일을 확인하고 새 파일을 추가할 수 있습니다.
        </p>
      </div>

      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <a
                href={attachment.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 truncate text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {attachment.fileName}
              </a>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => deleteAttachment(attachment)}
              >
                <Trash2 aria-hidden="true" />
                삭제
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          첨부파일이 없습니다.
        </p>
      )}

      <FileUploadField
        files={files}
        disabled={busy}
        onChange={setFiles}
        onError={(nextMessage) => {
          if (nextMessage) {
            setErrorMsg(nextMessage);
          } else {
            setMessage(null);
          }
        }}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {message && (
        <p className={`text-sm ${isError ? "text-destructive" : "text-muted-foreground"}`}>
          {message}
        </p>
      )}
        <Button type="button" disabled={busy || files.length === 0} onClick={uploadFiles}>
          {busy ? "처리 중..." : "첨부파일 업로드"}
        </Button>
      </div>
    </section>
  );
}
