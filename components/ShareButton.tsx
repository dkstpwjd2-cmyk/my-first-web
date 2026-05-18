"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  title: string;
  path: string;
};

export default function ShareButton({ title, path }: ShareButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleShare() {
    setMessage(null);

    const url = getShareUrl(path);

    try {
      if (canUseNativeShare()) {
        await navigator.share({ title, text: title, url });
        setMessage("공유창을 열었습니다.");
        return;
      }

      await copyToClipboard(url);
      setMessage("링크가 복사되었습니다.");
    } catch (error) {
      if (isAbortError(error)) {
        setMessage(null);
        return;
      }

      setMessage("링크 공유에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="outline"
        className="justify-start sm:justify-center"
        onClick={handleShare}
      >
        <Share2 aria-hidden="true" />
        공유
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

function getShareUrl(path: string) {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

function canUseNativeShare() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  );
}

async function copyToClipboard(value: string) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function" &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(value);
    return;
  }

  copyWithTextarea(value);
}

function copyWithTextarea(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy failed");
  }
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
