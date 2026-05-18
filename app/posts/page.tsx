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
import { Input } from "@/components/ui/input";
import { getPosts } from "@/lib/posts";
import type { Post } from "@/lib/posts";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let posts: Post[] = [];
  let fetchError = false;

  try {
    posts = await getPosts(query || undefined);
  } catch {
    fetchError = true;
  }

  // 에러 상태
  if (fetchError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-normal">포스트 목록</h1>
        <p className="text-sm text-muted-foreground">
          목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-normal">포스트 목록</h1>
          <p className="text-sm text-muted-foreground">
            작성된 포스트를 확인하고 상세 페이지로 이동할 수 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/posts/new">새 포스트 작성</Link>
        </Button>
      </section>

      <form action="/posts" method="GET" className="flex gap-2">
        <Input
          name="q"
          defaultValue={query}
          placeholder="제목 또는 내용 검색"
          className="max-w-xs"
        />
        <Button type="submit" variant="outline">검색</Button>
        {query && (
          <Button asChild variant="ghost">
            <Link href="/posts">초기화</Link>
          </Button>
        )}
      </form>

      {query && (
        <p className="text-sm text-muted-foreground">
          &ldquo;{query}&rdquo; 검색 결과 {posts.length}건
        </p>
      )}

      {/* 빈 상태 */}
      {posts.length === 0 ? (
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>
              {query ? "검색 결과가 없습니다" : "아직 포스트가 없습니다"}
            </CardTitle>
            <CardDescription>
              {query
                ? "다른 검색어를 입력해 보세요."
                : "로그인 후 첫 번째 포스트를 작성해 보세요."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} className="rounded-lg shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-lg bg-accent px-2 py-1 text-accent-foreground">
                    {post.category}
                  </span>
                  <span>{post.date || "기록"}</span>
                </div>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>작성자: {post.author}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span>좋아요 {post.likeCount}</span>
                    <span>싫어요 {post.dislikeCount}</span>
                    <span>댓글 {post.commentCount}</span>
                    <span>조회수 {post.viewCount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {/* 각 글은 /posts/[id]로 이동하는 링크 제공 */}
                <Button asChild variant="outline">
                  <Link href={`/posts/${post.id}`}>상세 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
