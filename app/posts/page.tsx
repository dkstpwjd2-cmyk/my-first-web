import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPosts } from "@/lib/posts";

export default async function PostsPage() {
  const posts = getPosts();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-normal">포스트 목록</h1>
          <p className="text-sm text-muted-foreground">
            작성한 포스트를 확인하고 상세 페이지로 이동할 수 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/posts/new">새 포스트 작성</Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-lg shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-lg bg-accent px-2 py-1 text-accent-foreground">
                  {post.category}
                </span>
                <span>{post.date}</span>
              </div>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                작성자 {post.author}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={`/posts/${post.id}`}>상세 보기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
