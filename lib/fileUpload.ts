export const ATTACHMENT_BUCKET = "post-attachments";
export const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
export const MAX_ATTACHMENT_SIZE_LABEL = "5MB";

const allowedExtensions = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "pdf",
  "doc",
  "docx",
  "hwp",
  "hwpx",
  "txt",
] as const;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.hancom.hwp",
  "application/x-hwp",
  "application/vnd.hancom.hwpx",
  "application/x-hwpx",
  "text/plain",
]);

const blockedExtensions = new Set([
  "exe",
  "msi",
  "bat",
  "cmd",
  "com",
  "scr",
  "ps1",
  "sh",
  "js",
  "mjs",
  "vbs",
  "jar",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
]);

export type SelectedUpload = {
  id: string;
  file: File;
  previewUrl: string | null;
};

export function getAllowedFileDescription() {
  return `${allowedExtensions.join(", ")} · 최대 ${MAX_ATTACHMENT_SIZE_LABEL}`;
}

export function validateUploadFile(file: File): string | null {
  const extension = getFileExtension(file.name);

  if (!extension) {
    return "확장자가 없는 파일은 업로드할 수 없습니다.";
  }

  if (blockedExtensions.has(extension)) {
    return "실행 파일, 스크립트 파일, 압축 파일은 업로드할 수 없습니다.";
  }

  if (!allowedExtensions.includes(extension as (typeof allowedExtensions)[number])) {
    return "허용되지 않은 파일 형식입니다.";
  }

  if (file.type && !allowedMimeTypes.has(file.type)) {
    return "파일 형식이 허용 목록과 일치하지 않습니다.";
  }

  if (file.size > MAX_ATTACHMENT_SIZE) {
    return `파일 용량은 ${MAX_ATTACHMENT_SIZE_LABEL} 이하만 가능합니다.`;
  }

  return null;
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export function isImageAttachment(fileType: string) {
  return fileType.startsWith("image/");
}

export function buildAttachmentPath(
  userId: string,
  postId: string,
  fileName: string
) {
  const extension = getFileExtension(fileName);
  const safeName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9가-힣._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  const baseName = safeName || "file";
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${userId}/${postId}/${uniquePart}-${baseName}.${extension}`;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
