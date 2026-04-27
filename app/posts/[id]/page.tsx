import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePostById, getPostById } from "@/lib/posts";

async function deletePostAction(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    deletePostById(id);
    revalidatePath("/posts");
    revalidatePath(`/posts/${id}`);
  }

  redirect("/posts");
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const post = getPostById(numericId);

  if (!post) {
    return (
      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle>포스트를 찾을 수 없습니다</CardTitle>
          <CardDescription>
            요청한 포스트가 삭제되었거나 존재하지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/posts">목록으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-lg bg-accent px-2 py-1 text-accent-foreground">
            {post.category}
          </span>
          <span>{post.date}</span>
        </div>
        <CardTitle className="text-3xl">{post.title}</CardTitle>
        <CardDescription>작성자 {post.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line leading-7 text-foreground">
          {post.content}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/posts">목록으로 돌아가기</Link>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="destructive">
              삭제
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>포스트를 삭제할까요?</DialogTitle>
              <DialogDescription>
                삭제하면 목록에서 바로 사라집니다. 이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={String(post.id)} />
                <Button type="submit" variant="destructive">
                  삭제하기
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
