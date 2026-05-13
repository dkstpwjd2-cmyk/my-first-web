"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    window.location.assign("/");
  }

  return (
    <header className="border-b border-border bg-card">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 px-6 py-4">
        <Link
          href="/"
          className="mr-auto text-base font-bold tracking-normal text-foreground"
        >
          My First Web
        </Link>

        <Link
          href="/posts"
          className={buttonVariants({ variant: "ghost", className: "h-9" })}
        >
          포스트
        </Link>

        {loading && (
          <span className="h-9 px-3 text-sm text-muted-foreground">...</span>
        )}

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
