"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import { createClient } from "@/lib/supabase/client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

type AvatarUploadProps = {
  userId: string;
  currentAvatarUrl: string | null;
  updateAction: (avatarUrl: string) => Promise<void>;
};

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  updateAction,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus("error");
      setMessage("jpg, png, webp, gif 이미지만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setStatus("error");
      setMessage("파일 크기는 2MB 이하여야 합니다.");
      return;
    }

    setStatus("uploading");
    setMessage("");

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const path = `${userId}/avatar.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      setStatus("error");
      setMessage(getFriendlyErrorMessage(uploadError));
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    try {
      await updateAction(publicUrl);
      setPreview(publicUrl);
      setStatus("done");
      setMessage("프로필 이미지가 업데이트되었습니다.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(getFriendlyErrorMessage(error));
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-accent">
        {preview ? (
          <Image
            src={preview}
            alt="프로필 이미지"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl text-muted-foreground">
            👤
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        aria-label="프로필 이미지 파일 선택"
        className="hidden"
        onChange={handleChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={status === "uploading"}
        onClick={() => inputRef.current?.click()}
      >
        {status === "uploading" ? "업로드 중..." : "이미지 변경"}
      </Button>

      {message && (
        <p
          className={`text-xs ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
