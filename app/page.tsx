import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const routes = [
  {
    href: "/posts",
    title: "포스트 목록",
    description: "전체 포스트를 카드 형태로 확인합니다.",
  },
  {
    href: "/posts/new",
    title: "포스트 작성",
    description: "새 포스트를 작성하고 목록으로 이동합니다.",
  },
  {
    href: "/login",
    title: "로그인",
    description: "사용자 로그인을 위한 기본 화면입니다.",
  },
  {
    href: "/mypage",
    title: "마이페이지",
    description: "내 정보와 활동 요약을 보여주는 화면입니다.",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-sm font-medium text-[var(--primary)]">홈 (/)</p>
        <h1 className="text-3xl font-bold tracking-normal">웹페이지 구조</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          요청한 App Router 구조에 맞춰 홈, 포스트 목록, 포스트 상세, 포스트
          작성, 로그인, 마이페이지 라우트를 구성했습니다.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>라우트 트리</CardTitle>
          <CardDescription>현재 웹페이지의 주요 경로입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg bg-[var(--muted)] p-4 text-sm leading-7 text-[var(--foreground)]">
{`홈 (/)
├── 포스트 목록 (/posts)
│   ├── 포스트 상세 (/posts/[id])
│   └── 포스트 작성 (/posts/new)
├── 로그인 (/login)
└── 마이페이지 (/mypage)`}
          </pre>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <Card key={route.href}>
            <CardHeader>
              <CardTitle>{route.title}</CardTitle>
              <CardDescription>{route.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={route.href}
                className={buttonVariants({ variant: "outline" })}
              >
                이동하기
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
