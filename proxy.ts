/**
 * proxy.ts — Next.js 16 라우트 보호 미들웨어
 *
 * Next.js 16에서는 기존 middleware.ts가 proxy.ts로 대체되었습니다.
 * (두 파일 동시 존재 시 빌드 에러: "Please use proxy.ts only")
 *
 * 역할: 비로그인 사용자의 보호 경로(/posts/new, /mypage) 접근 시
 *       /login으로 리다이렉트합니다.
 *
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  matcher: ["/posts/new", "/mypage/:path*"],
};
