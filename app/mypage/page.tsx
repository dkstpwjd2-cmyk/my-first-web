import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPosts } from "@/lib/posts";

export default function MyPage() {
  const posts = getPosts();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-normal">마이페이지</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          내 정보와 작성한 포스트 요약을 확인합니다.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>기본 사용자 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>이름: 안세정</p>
            <p>관심사: 일상, 운동, 학교생활</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>활동 요약</CardTitle>
            <CardDescription>현재 등록된 포스트 수입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-[var(--primary)]">
              {posts.length}
            </p>
            <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
              포스트 보러가기
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
