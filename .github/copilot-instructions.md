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

## File & Naming Conventions

- 컴포넌트 파일명: PascalCase (e.g. `PostCard.tsx`)
- 라우트 폴더명: kebab-case (e.g. `app/blog-post/page.tsx`)
- 커스텀 훅: `use` 접두사 + camelCase (e.g. `usePostList.ts`)

## Data Fetching

- 데이터 요청은 Server Component에서 `async/await` + `fetch` 사용
- 클라이언트에서 `useEffect`로 데이터 요청 금지
- 로딩 상태는 `app/` 안의 `loading.tsx` 파일로 처리

## Supabase Auth Rules (Ch9)

- 이메일/비밀번호 인증만 사용한다. 소셜 로그인은 추가하지 않는다.
- 로그인은 `supabase.auth.signInWithPassword()` 사용. 구버전 `auth.signIn()` 사용 금지.
- 환경변수 이름 고정: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` 키는 클라이언트 코드에 절대 두지 않는다.
- 보호 라우트는 `middleware.ts`로 처리한다 (`pages/` 라우터 미들웨어 금지).
- Supabase 클라이언트: `@supabase/ssr`의 `createBrowserClient` (클라이언트) / `createServerClient` (서버) 패턴 사용.
- Supabase 대시보드 메뉴 안내는 2026년 5월 기준이다.

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless `useState`, `useEffect`, event handlers, or browser APIs are actually needed.
- Do not use `<img>`; use `next/image` (`Image` component) instead.
- Do not use `<a>`; use `next/link` (`Link` component) instead.
- Do not fetch data with `useEffect`; fetch in Server Components instead.
- Do not use `supabase.auth.signIn()` (deprecated); use `supabase.auth.signInWithPassword()` instead.
- Do not expose `service_role` key in any client-side code or public env variables.
