import { ATTACHMENT_BUCKET, isImageAttachment } from "@/lib/fileUpload";
import { createClient } from "@/lib/supabase/server";

export type PostAttachment = {
  id: string;
  postId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  publicUrl: string;
  isImage: boolean;
  createdAt: string;
};

type AttachmentRow = {
  id: string;
  post_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string | null;
};

export async function getAttachments(postId: string): Promise<PostAttachment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_attachments")
    .select("id, post_id, file_name, file_type, file_size, storage_path, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as AttachmentRow[]).map((row) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(ATTACHMENT_BUCKET).getPublicUrl(row.storage_path);

    return {
      id: row.id,
      postId: row.post_id,
      fileName: row.file_name,
      fileType: row.file_type,
      fileSize: row.file_size,
      storagePath: row.storage_path,
      publicUrl,
      isImage: isImageAttachment(row.file_type),
      createdAt: row.created_at ?? "",
    };
  });
}

export async function deleteAttachmentsForPost(postId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_attachments")
    .select("storage_path")
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const storagePaths = ((data ?? []) as Pick<AttachmentRow, "storage_path">[]).map(
    (row) => row.storage_path
  );

  if (storagePaths.length > 0) {
    const { error: removeError } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .remove(storagePaths);

    if (removeError) {
      throw new Error(removeError.message);
    }
  }

  const { error: deleteError } = await supabase
    .from("post_attachments")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }
}
