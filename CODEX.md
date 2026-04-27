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

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

## Project Memory

- 작업 시작 전에 `context.md`와 `todo.md`를 먼저 참고한다.
- 작업 중 완료/변경/새 이슈가 생기면 `todo.md`와 `context.md`를 수시로 갱신한다.
- 업로드, 저장, 종료처럼 작업을 마무리하는 시점에는 두 파일을 현재 상태에 맞게 업데이트한다.
- `context.md`에는 프로젝트 상태, 기술 결정, 해결된 이슈, 새로 알게 된 점을 기록한다.
- `todo.md`에는 단계별 작업 목록, 진행률, 현재 확인된 이슈를 기록한다.
