import Link from "next/link";
import { revalidatePath } from "next/cache";

import AvatarUpload from "@/components/AvatarUpload";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUserPostCount } from "@/lib/posts";
import { getProfile, updateAvatarUrl } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

async function updateAvatarAction(avatarUrl: string) {
  "use server";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  await updateAvatarUrl(user.id, avatarUrl);
  revalidatePath("/mypage");
}

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [postCount, profile] = await Promise.all([
    getCurrentUserPostCount(),
    user ? getProfile(user.id) : null,
  ]);

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
          <CardContent className="space-y-4 text-sm">
            {user && (
              <AvatarUpload
                userId={user.id}
                currentAvatarUrl={profile?.avatar_url ?? null}
                updateAction={updateAvatarAction}
              />
            )}
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
