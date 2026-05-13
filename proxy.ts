import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * proxy.ts — 프로젝트 루트에 위치 (Next.js 16.2.1에서 middleware.ts → proxy.ts로 변경)
 * 비로그인 사용자가 보호 라우트에 접근하면 /login으로 리다이렉트.
 * 권한 검사(내 글만 수정 등)는 Ch11 RLS에서 처리.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 확인 — 반드시 getUser()를 사용 (getSession()은 검증 없음)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호 라우트: 비로그인이면 /login으로 이동
  const protectedPaths = ["/posts/new", "/mypage"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/posts/new",
    "/mypage/:path*",
  ],
};
