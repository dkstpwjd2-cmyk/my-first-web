import Link from "next/link";

import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import PostMeta from "@/components/PostMeta";
import PostStats from "@/components/PostStats";
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

  if (fetchError) {
    return (
      <div className="space-y-6">
        <PageHeader title="포스트 목록" />
        <EmptyState
          title="목록을 불러오지 못했습니다"
          description="잠시 후 다시 시도해 주세요."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 + 작성 버튼 */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="포스트 목록"
          description="작성된 포스트를 확인하고 상세 페이지로 이동할 수 있습니다."
        />
        <Button asChild className="shrink-0">
          <Link href="/posts/new">새 포스트 작성</Link>
        </Button>
      </section>

      {/* 검색 폼 */}
      <form action="/posts" method="GET" className="flex flex-wrap gap-2">
        <Input
          name="q"
          defaultValue={query}
          placeholder="제목 또는 내용 검색"
          className="max-w-xs"
          aria-label="게시글 검색"
        />
        <Button type="submit" variant="outline">
          검색
        </Button>
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

      {/* 게시글 그리드 */}
      {posts.length === 0 ? (
        <EmptyState
          title={query ? "검색 결과가 없습니다" : "아직 포스트가 없습니다"}
          description={
            query
              ? "다른 검색어를 입력해 보세요."
              : "로그인 후 첫 번째 포스트를 작성해 보세요."
          }
        />
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col rounded-lg shadow-sm"
            >
              <CardHeader className="flex-1 space-y-2 pb-3">
                <PostMeta category={post.category} date={post.date} />
                <CardTitle className="line-clamp-2 break-words text-base leading-snug">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 break-words">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pb-3 pt-0">
                <p className="text-xs text-muted-foreground">
                  작성자: {post.author}
                </p>
                <PostStats
                  likeCount={post.likeCount}
                  dislikeCount={post.dislikeCount}
                  commentCount={post.commentCount}
                  viewCount={post.viewCount}
                />
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Button asChild variant="outline" size="sm">
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
