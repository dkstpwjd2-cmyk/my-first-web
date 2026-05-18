# Context - my-first-web 프로젝트 상태

## 현재 상태

- 마지막 업데이트: 2026-05-18
- 완료 챕터: Ch7 아키텍처/UI, Ch8 Supabase 연결/배포, Ch9 Supabase Auth, Ch10 Supabase CRUD (목록/상세/작성/수정/삭제)
- 기술 스택: Next.js 16.2.1 App Router, React 19.2.4, Tailwind CSS 4, shadcn/ui, Supabase
- 인증: Supabase Auth 이메일/비밀번호
- 보호 라우트: `proxy.ts`에서 `/posts/new`, `/mypage`를 보호하고 비로그인 사용자를 `/login`으로 보냄
- 데이터: 게시글 목록/상세/작성/수정/삭제가 Supabase `posts` 테이블을 사용하도록 연결됨
- 빌드: `npm run build` Exit code 0 (TypeScript 오류 없음)

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

- 브라우저에서 실제 계정으로 글 작성 → 수정 → 삭제 흐름 확인 (④⑤⑥ 시나리오)
- Ch11: RLS 정책 적용 (SELECT / INSERT / UPDATE / DELETE)
- Ch12: 이미지 업로드 (Supabase Storage)

## 2026-05-18 Ch10 CRUD 완성

- `Post` 타입에 `user_id?: string` 필드 추가 (Ch11 RLS 보안의 선행 단계인 UI 분기용)
- `lib/posts.ts` Supabase 쿼리에 `user_id` 컬럼 추가
- `updatePost(id, { title, content })` 함수 추가: `.eq("id", id).eq("user_id", user.id)` 조건 포함
- `app/posts/[id]/page.tsx`: 서버에서 현재 사용자 조회 후 `isAuthor` 판별, 작성자에게만 수정/삭제 버튼 표시
- `app/posts/[id]/edit/page.tsx` 신규 생성: 비작성자 redirect, Server Action으로 updatePost() 호출
- 이 UI 분기는 UX이며, 실제 보안은 Ch11 RLS에서 DB 정책으로 처리한다.
- 검증:
  - `npm.cmd run build`: 통과 (Exit code: 0)
  - 빌드 라우트 목록에 `ƒ /posts/[id]/edit` 확인됨

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

## 2026-05-13 Practice post restoration

- Restored the three Ch5/Ch7 practice posts in `lib/posts.ts` as read-only posts while keeping Supabase-backed posts for Ch8/Ch9.
- Practice posts now appear on `/posts` and `/posts/1`, `/posts/2`, `/posts/3` without requiring rows in the Supabase `posts` table.
- Practice posts hide the delete button so the fixed lesson content is not treated like user-created DB content.
- Added a UUID guard before Supabase detail/delete queries so lesson routes such as `/posts/999` render the not-found UI instead of a 500.
- Confirmed `docs/ch01a.md` through `docs/ch09a.md` still have no changes.
- Verification after restoration:
  - `npm.cmd run lint`: passed
  - `npm.cmd run build`: passed
  - `/posts`: 200 and contains all three practice post titles
  - `/posts/1`: 200, contains the original first post content, and has no delete button
  - `/posts/999`: 200 with the not-found message
  - Non-login `/posts/new`, `/mypage`: 307 -> `/login`
