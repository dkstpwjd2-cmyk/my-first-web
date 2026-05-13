import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
import { createPost } from "@/lib/posts";

async function createPostAction(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");

  if (title.trim() && content.trim()) {
    const post = await createPost({ title, content });
    revalidatePath("/posts");
    redirect(`/posts/${post.id}`);
  }

  redirect("/posts/new");
}

export default function NewPostPage() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle>포스트 작성</CardTitle>
        <CardDescription>
          제목과 내용을 입력하면 새 포스트가 저장됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createPostAction} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              제목
            </label>
            <Input id="title" name="title" required placeholder="제목을 입력하세요" />
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
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit">저장하기</Button>
            <Button asChild type="button" variant="outline">
              <Link href="/posts">취소</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
