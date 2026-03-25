# Copilot Instructions

## Tech Stack
- Next.js 16.2.1 (App Router ONLY)
- Tailwind CSS ^4 (`tailwindcss` + `@tailwindcss/postcss`)

## Coding Conventions
- 기본은 Server Component로 작성한다.
- 스타일링은 Tailwind CSS만 사용한다.
- 라우팅 구조는 App Router만 사용한다.

## Known AI Mistakes (반드시 피할 것)
- `next/router` 사용 금지. 반드시 `next/navigation`을 사용한다.
- Pages Router 사용 금지 (`pages/` 기반 패턴 금지).
- App Router에서 `params`를 사용할 때는 반드시 `await` 처리한다.
