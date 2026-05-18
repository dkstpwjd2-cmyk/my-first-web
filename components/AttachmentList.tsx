import { FileText } from "lucide-react";

import type { PostAttachment } from "@/lib/attachments";
import { formatFileSize } from "@/lib/fileUpload";

type AttachmentListProps = {
  attachments: PostAttachment[];
};

export default function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border pt-6" aria-label="첨부파일">
      <h2 className="mb-3 text-base font-bold tracking-normal">첨부파일</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.publicUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${attachment.fileName} - 새 탭에서 열기`}
            className="group rounded-lg border border-border bg-background p-3 text-sm transition hover:bg-muted/50"
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
            <p className="break-all font-medium leading-snug">
              {attachment.fileName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatFileSize(attachment.fileSize)}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
