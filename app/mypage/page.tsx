import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUserPostCount } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const postCount = await getCurrentUserPostCount();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-normal">마이페이지</h1>
        <p className="text-sm text-muted-foreground">
          내 계정 정보와 작성한 포스트 수를 확인합니다.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>현재 로그인한 계정 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>이메일: {user?.email ?? "-"}</p>
            <p className="break-all text-muted-foreground">
              사용자 ID: {user?.id ?? "-"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle>활동 요약</CardTitle>
            <CardDescription>내가 작성한 포스트 수입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold text-primary">{postCount}</p>
            <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
              포스트 보러가기
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
