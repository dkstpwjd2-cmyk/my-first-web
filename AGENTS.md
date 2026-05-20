## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)
- @supabase/supabase-js (교재 기준: 2.47.12 / 실제 설치: ^2.105.1)
- @supabase/ssr (교재 기준: 0.5.2 / 실제 설치: ^0.10.2)

## Version Policy

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## Design Tokens

- Primary color: shadcn/ui --primary (어두운 파란색 계열)
- Background: --background (흰색)
- Card: shadcn/ui Card 컴포넌트 사용 (rounded-lg shadow-sm)
- Spacing: 컨텐츠 간격 space-y-6, 카드 내부 p-6
- Max width: max-w-4xl mx-auto (메인 컨텐츠)
- 반응형: md 이상 2열 그리드, 모바일 1열

## Component Rules

- UI 컴포넌트는 shadcn/ui 사용 (components/ui/)
- Button, Card, Input, Dialog 등 shadcn/ui 컴포넌트 우선
- 커스텀 컴포넌트는 components/ 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용

## Supabase Auth Rules (Ch9)

- 이메일/비밀번호 인증만 사용한다. 소셜 로그인은 추가하지 않는다.
- 로그인은 `supabase.auth.signInWithPassword()` 사용. 구버전 `auth.signIn()` 사용 금지.
- 환경변수 이름 고정: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` 키는 클라이언트 코드에 절대 두지 않는다.
- 보호 라우트는 Next.js 16 기준 `proxy.ts`로 처리한다.
- Supabase 클라이언트: `createBrowserClient` (클라이언트) / `createServerClient` (서버) 패턴 사용.

## Supabase CRUD Rules (Ch10)

- `posts` 테이블 컬럼명을 임의 변경 금지: `id`, `user_id`, `title`, `content`, `created_at`
- `user_id`는 입력값(폼·URL)으로 받지 말 것 — 반드시 서버에서 `user.id`를 코드로 삽입.
- `update`·`delete`에는 반드시 `.eq("id", postId)` 조건 필요.
- 작성자 UI 분기(수정/삭제 버튼 표시)는 **UX**이며, 실제 보안은 Ch11 RLS가 담당한다.
- `lib/supabase/client.ts` (`createBrowserClient`) 또는 `lib/supabase/server.ts` (`createServerClient`) 를 사용. `@supabase/supabase-js`에서 직접 `createClient` 생성 금지.
- 새 라이브러리 추가 금지 — 기존 스택으로 구현.

## Supabase RLS Rules (Ch11)

- 보안은 클라이언트 if문이나 버튼 숨김으로 처리하지 않는다. 작성자 UI 분기는 UX이며, 실제 권한 강제는 Supabase RLS가 담당한다.
- RLS SQL은 Supabase SQL Editor에만 직접 실행하지 말고 `supabase/migrations/` 마이그레이션 파일로 남긴다.
- `posts` 정책 기준:
  - SELECT: 누구나 읽기 가능
  - INSERT: 로그인 사용자만 본인 `user_id`로 작성 가능 (`auth.uid() = user_id`)
  - UPDATE: 작성자만 수정 가능, `USING`과 `WITH CHECK` 둘 다 필요
  - DELETE: 작성자만 삭제 가능
- `service_role` 키는 RLS를 우회하므로 클라이언트 코드와 공개 환경변수에서 절대 사용하지 않는다.
- Ch11 마이그레이션 파일: `supabase/migrations/20260520020609_add_posts_rls.sql`

## Error & UX Rules (Ch12)

- 사용자 화면에 Supabase 원문 에러 코드, stack trace, `42501` 같은 내부 메시지를 그대로 노출하지 않는다.
- 개발자 추적을 위해 원문 에러는 호출부에서 `console.error(error)`로 남긴다.
- 사용자 메시지는 `lib/error-message.ts`의 `getFriendlyErrorMessage()` 변환 규칙을 우선 사용한다.
- 게시글 폼 검증은 `lib/post-validation.ts` 기준을 공유한다: 제목 필수/2자 이상, 내용 필수/10자 이상.
- 로딩 UI는 App Router의 `loading.tsx` 파일과 고정 크기 스켈레톤으로 처리한다.
- 새 라이브러리를 추가하기 전에는 기존 Tailwind/shadcn/ui로 해결 가능한지 먼저 확인하고 이유를 설명한다.

## Verification Rules (Ch13)

- 확인하지 않은 항목은 통과로 쓰지 말고 `확인 필요`로 남긴다.
- 코드리뷰 우선순위는 보안 > 데이터 정확성 > UX > 성능 순서로 본다.
- Playwright 테스트 계정은 `TEST_EMAIL`, `TEST_PASSWORD` 환경변수로만 받으며 코드에 직접 쓰지 않는다.
- E2E는 행복 경로와 거절 경로를 함께 둔다.
- 배포 검증에서 Vercel CLI가 보여주는 환경변수 이름은 통과로 볼 수 있지만, 실제 값 일치 여부는 대시보드 눈검증 전까지 `확인 필요`로 둔다.
- Ch13에서는 Playwright 추가가 허용되며, 그 외 새 라이브러리는 기존 스택으로 해결할 수 없는 이유가 있을 때만 추가한다.

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.
- Do not use `supabase.auth.signIn()` (deprecated); use `supabase.auth.signInWithPassword()` instead.
- Do not expose `service_role` key in any client-side code or public env variables.
- Do not show raw Supabase errors, `42501`, stack traces, or RLS internals to users.
- Do not remove `console.error` when replacing user-facing error messages.
- Do not rename `posts` columns (`authorId`, `body`, `users` 등 금지) — use Ch8 schema as-is.
- Do not treat client-side `isAuthor` check as security — Ch11 RLS handles actual authorization.
- Do not add `update`/`delete` without `.eq("id", postId)` condition.

## Project Memory

- 작업 시작 전에 `context.md`와 `todo.md`를 먼저 참고한다.
- 작업 중 완료/변경/새 이슈가 생기면 `todo.md`와 `context.md`를 수시로 갱신한다.
- 업로드, 저장, 종료인 작업 마무리 시점에는 두 파일을 현재 상태에 맞게 업데이트한다.
- `context.md`에는 프로젝트 상태, 기술 결정, 해결된 이슈, 새로 알게 된 점을 기록한다.
- `todo.md`에는 단계별 작업 목록, 진행률, 현재 확인된 이슈를 기록한다.
