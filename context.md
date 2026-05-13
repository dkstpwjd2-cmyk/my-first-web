# Context - my-first-web 프로젝트 상태

## 현재 상태

- 마지막 업데이트: 2026-05-13
- 완료 챕터: Ch7 아키텍처/UI, Ch8 Supabase 연결/배포 준비, Ch9 Supabase Auth
- 기술 스택: Next.js 16.2.1 App Router, React 19.2.4, Tailwind CSS 4, shadcn/ui, Supabase
- 인증: Supabase Auth 이메일/비밀번호
- 보호 라우트: `proxy.ts`에서 `/posts/new`, `/mypage`를 보호하고 비로그인 사용자를 `/login`으로 보냄
- 데이터: 게시글 목록/상세/작성/삭제가 Supabase `posts` 테이블을 사용하도록 변경됨
- 빌드: `next/font/google` 제거로 네트워크 없는 환경에서도 `npm.cmd run build` 통과

## 최근 수정 사항

- 깨진 한글 UI 문구를 주요 화면에서 복구함:
  - `app/page.tsx`
  - `app/posts/page.tsx`
  - `app/posts/[id]/page.tsx`
  - `app/posts/new/page.tsx`
  - `app/login/page.tsx`
  - `app/signup/page.tsx`
  - `app/mypage/page.tsx`
  - `components/Navigation.tsx`
- `app/layout.tsx`에서 `next/font/google`의 Geist 의존성을 제거함.
- `lib/posts.ts`를 인메모리 데이터 대신 Supabase 서버 클라이언트 기반 함수로 교체함.
- 글 작성 전 `profiles` 행을 `upsert`하여 `posts.user_id -> profiles.id` 외래 키 실패를 방지함.
- `contexts/AuthContext.tsx`, `lib/auth.ts`, `lib/supabase/server.ts`, `proxy.ts`의 깨진 주석/문구를 정리함.

## 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- 로컬 dev 서버: `http://localhost:3000`
- 응답 확인:
  - `/`: 200
  - `/login`: 200
  - `/signup`: 200
  - `/posts`: 200
  - 비로그인 `/posts/new`: 307 -> `/login`
  - 비로그인 `/mypage`: 307 -> `/login`

## 남은 작업

- Supabase 대시보드에서 Email Provider와 URL Configuration을 실제 배포 URL 기준으로 확인
- 실제 브라우저에서 회원가입 -> 로그인 -> 글 작성 -> 글 상세 -> 로그아웃 흐름 확인
- Ch10 이후 작업: 글 수정, 검색, 이미지 업로드, RLS 정책

## 2026-05-13 Auth redirect follow-up

- Issue checked: user appeared logged in on the client but `/posts/new` still redirected to `/login`.
- Cause is likely cookie/server-state synchronization after client-side login navigation, not the protected-route condition itself.
- Updated login success and logout to use full page navigation so the browser sends the latest Supabase auth cookies to `proxy.ts`.
- Verified after the change: `npm.cmd run lint` passed and `npm.cmd run build` passed.

## 2026-05-13 Commercial-grade design pass

- Upgraded the blog UI for a calmer final-project/commercial feel without changing the Supabase/Auth/proxy logic.
- Reworked the home page from a route map into an editorial landing page with latest posts and archive count.
- Refined the posts list, detail page, write form, login, signup, my page, navigation, layout, footer, and theme tokens.
- Kept the class design within the existing stack: Next.js App Router, Tailwind CSS, shadcn/ui components, Supabase.
- Verification after the design pass:
  - `npm.cmd run lint`: passed
  - `npm.cmd run build`: passed
  - `/`, `/posts`, `/login`, `/signup`: 200
  - 비로그인 `/posts/new`, `/mypage`: 307 -> `/login`

## 2026-05-13 Design direction correction

- User feedback: the commercial/editorial design direction felt worse than the previous design.
- Adjusted the UI back toward a simpler Korean personal-blog style while keeping the functional fixes.
- Confirmed `docs/ch01a.md` through `docs/ch09a.md` were not changed.
- Removed leftover English section labels from app screens.
- Verification after correction:
  - `npm.cmd run lint`: passed
  - `npm.cmd run build`: passed
  - `/`, `/posts`, `/login`: 200
  - 비로그인 `/posts/new`: 307 -> `/login`
