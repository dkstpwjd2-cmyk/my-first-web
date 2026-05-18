import { FileText } from "lucide-react";

import type { PostAttachment } from "@/lib/attachments";

type AttachmentListProps = {
  attachments: PostAttachment[];
};

export default function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 border-t border-border pt-6">
      <h2 className="text-xl font-bold tracking-normal">첨부파일</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border bg-background p-3 text-sm transition hover:bg-muted/50"
          >
            {attachment.isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attachment.publicUrl}
                alt={attachment.fileName}
                className="mb-3 aspect-video w-full rounded-md object-cover"
              />
            ) : (
              <div className="mb-3 flex aspect-video items-center justify-center rounded-md bg-muted text-muted-foreground">
                <FileText aria-hidden="true" />
              </div>
            )}
            <p className="truncate font-medium">{attachment.fileName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatFileSize(attachment.fileSize)}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)}KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
