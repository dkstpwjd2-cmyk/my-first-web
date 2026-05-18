import Link from "next/link";

import EmptyState from "@/components/EmptyState";
import PostMeta from "@/components/PostMeta";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();
  const latestPosts = posts.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* 히어로 */}
      <section className="space-y-4 border-b border-border pb-8">
        <p className="text-sm font-medium text-primary">개인 블로그</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-normal">
          배운 것과 일상을 차분하게 기록합니다.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          My First Web은 수업에서 배운 웹 기술과 일상의 생각을 정리하는
          블로그입니다. 읽기 좋은 글과 꾸준한 기록에 집중합니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/posts" className={buttonVariants()}>
            포스트 보러가기
          </Link>
          <Link href="/posts/new" className={buttonVariants({ variant: "outline" })}>
            새 글 작성
          </Link>
        </div>
      </section>

      {/* 최근 포스트 */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-normal">최근 포스트</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              최근에 작성된 글을 먼저 보여줍니다.
            </p>
          </div>
          <Link
            href="/posts"
            className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            전체 보기
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <EmptyState
            title="아직 포스트가 없습니다"
            description="로그인 후 첫 번째 글을 작성해 보세요."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {latestPosts.map((post) => (
              <Card key={post.id} className="flex flex-col rounded-lg shadow-sm">
                <CardHeader className="space-y-2 pb-3">
                  <PostMeta category={post.category} date={post.date} />
                  <CardTitle className="line-clamp-2 break-words text-base leading-snug">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 break-words">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <div className="flex-1" />
                <CardContent className="pt-2 pb-3">
                  <Link
                    href={`/posts/${post.id}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    상세 보기
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
