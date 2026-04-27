## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)

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

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless `useState`, `useEffect`, event handlers, or browser APIs are actually needed.
- Do not use `<img>`; use `next/image` (`Image` component) instead.
- Do not use `<a>`; use `next/link` (`Link` component) instead.
- Do not fetch data with `useEffect`; fetch in Server Components instead.
