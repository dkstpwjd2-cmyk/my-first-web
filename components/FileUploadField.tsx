"use client";

import { ImageIcon, Paperclip, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatFileSize,
  getAllowedFileDescription,
  isImageFile,
  type SelectedUpload,
  validateUploadFile,
} from "@/lib/fileUpload";

type FileUploadFieldProps = {
  files: SelectedUpload[];
  disabled?: boolean;
  onChange: (files: SelectedUpload[]) => void;
  onError: (message: string | null) => void;
};

export default function FileUploadField({
  files,
  disabled,
  onChange,
  onError,
}: FileUploadFieldProps) {
  function handleFiles(nextFiles: FileList | null) {
    if (!nextFiles) return;

    const accepted: SelectedUpload[] = [];

    for (const file of Array.from(nextFiles)) {
      const error = validateUploadFile(file);

      if (error) {
        onError(`${file.name}: ${error}`);
        continue;
      }

      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        previewUrl: isImageFile(file) ? URL.createObjectURL(file) : null,
      });
    }

    if (accepted.length > 0) {
      onChange([...files, ...accepted]);
      onError(null);
    }
  }

  function removeFile(id: string) {
    const target = files.find((file) => file.id === id);

    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }

    onChange(files.filter((file) => file.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="attachments" className="text-sm font-medium">
          첨부파일
        </label>
        <input
          id="attachments"
          type="file"
          multiple
          disabled={disabled}
          accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.hwp,.hwpx,.txt,image/jpeg,image/png,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
          onChange={(event) => handleFiles(event.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          허용 형식: {getAllowedFileDescription()}
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {files.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3"
            >
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt={`${item.file.name} 미리보기`}
                  className="h-16 w-16 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
                  {isImageFile(item.file) ? <ImageIcon /> : <Paperclip />}
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => removeFile(item.id)}
                >
                  <X aria-hidden="true" />
                  제거
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
