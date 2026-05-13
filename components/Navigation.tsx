"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-6 py-4">
        {/* 로고 */}
        <Link
          href="/"
          className="mr-auto text-base font-bold tracking-normal text-[var(--foreground)]"
        >
          My First Web
        </Link>

        {/* 공통 링크: 포스트 목록 */}
        <Link
          href="/posts"
          className={buttonVariants({ variant: "ghost", className: "h-9" })}
        >
          포스트
        </Link>

        {/* 로딩 중 */}
        {loading && (
          <span className="h-9 px-3 text-sm text-[var(--muted-foreground)]">
            ...
          </span>
        )}

        {/* 로그인 상태 */}
        {!loading && user && (
          <>
            <Link
              href="/posts/new"
              className={buttonVariants({ variant: "default", className: "h-9" })}
            >
              글쓰기
            </Link>
            <Link
              href="/mypage"
              className={buttonVariants({ variant: "ghost", className: "h-9" })}
            >
              마이페이지
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleSignOut}
            >
              로그아웃
            </Button>
          </>
        )}

        {/* 비로그인 상태 */}
        {!loading && !user && (
          <>
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", className: "h-9" })}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({ variant: "default", className: "h-9" })}
            >
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
