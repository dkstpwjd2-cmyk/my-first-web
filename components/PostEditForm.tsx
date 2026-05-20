"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import FormActions from "@/components/FormActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  hasPostFormErrors,
  validatePostForm,
  type PostFormErrors,
} from "@/lib/post-validation";

type PostEditFormProps = {
  postId: string;
  initialTitle: string;
  initialContent: string;
  pageMessage: string | null;
  action: (formData: FormData) => void | Promise<void>;
};

export default function PostEditForm({
  postId,
  initialTitle,
  initialContent,
  pageMessage,
  action,
}: PostEditFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [fieldErrors, setFieldErrors] = useState<PostFormErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const nextErrors = validatePostForm(title, content);
    setFieldErrors(nextErrors);

    if (hasPostFormErrors(nextErrors)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} noValidate className="space-y-5">
      {pageMessage && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {pageMessage}
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
          value={title}
          placeholder="제목을 입력하세요"
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
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
          value={content}
          placeholder="내용을 입력하세요"
          aria-invalid={Boolean(fieldErrors.content)}
          aria-describedby={fieldErrors.content ? "content-error" : undefined}
          onChange={(event) => {
            setContent(event.target.value);
            setFieldErrors((prev) => ({ ...prev, content: undefined }));
          }}
        />
        {fieldErrors.content && (
          <p id="content-error" className="text-sm text-destructive">
            {fieldErrors.content}
          </p>
        )}
      </div>

      <FormActions>
        <SubmitButton />
        <Button asChild type="button" variant="outline">
          <Link href={`/posts/${postId}`}>취소</Link>
        </Button>
      </FormActions>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : "수정 저장"}
    </Button>
  );
}
