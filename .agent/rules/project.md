# Project Rules — my-first-web

> 이 파일은 AI 에이전트(Antigravity, Claude Code, Codex 등)가 작업 시작 시 참고하는 프로젝트 규칙 모음이다.
> 항상 `context.md`와 `todo.md`를 함께 읽을 것.

---

## 기술 스택

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (`components/ui/` 경로)
- @supabase/supabase-js (교재 기준: 2.47.12 / 실제 설치: ^2.105.1)
- @supabase/ssr (교재 기준: 0.5.2 / 실제 설치: ^0.10.2)

## 버전 정책 (Version Policy)

- 교재 기준: Next.js 16.2.1, @supabase/supabase-js 2.47.12, @supabase/ssr 0.5.2
- 실제 package.json이 더 최신일 수 있다.
- 수업 프롬프트와 설명은 교재 기준으로 통일한다.
- 빌드 오류가 버전 차이에서 발생하면 package.json 기준으로 원인을 확인한다.

## 코딩 규칙

- Server Component 기본 사용. `"use client"`는 useState·useEffect·이벤트 핸들러·브라우저 API가 필요할 때만 추가.
- 라우트는 `app/` 안에서만 관리 (`pages/` 금지).
- `next/router` 금지 → `next/navigation` 사용.
- 데이터 요청은 Server Component에서 `async/await` 사용. `useEffect` fetch 금지.
- `<img>` 금지 → `next/image` 사용. `<a>` 금지 → `next/link` 사용.

## UI 규칙

- shadcn/ui 컴포넌트 우선 (Button, Card, Input, Dialog 등)
- 커스텀 컴포넌트는 `components/` 루트에 배치
- Tailwind 기본 컬러 직접 사용 금지 → CSS 변수(디자인 토큰) 사용
- Max width: `max-w-4xl mx-auto` / 반응형: `md:grid-cols-2`

## Supabase Auth 규칙 (Ch9)

- 이메일/비밀번호 인증만 사용. 소셜 로그인 없음.
- 로그인: `supabase.auth.signInWithPassword()` — 구버전 `auth.signIn()` 절대 금지.
- 환경변수 이름 변경 불가: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` 키는 클라이언트 코드에 절대 두지 않는다.
- 보호 라우트는 Next.js 16 기준 `proxy.ts`로 처리 (프로젝트 루트에 위치).
- Supabase 클라이언트:
  - 클라이언트 컴포넌트: `createBrowserClient` (`lib/supabase/client.ts`)
  - 서버 컴포넌트/Server Action: `createServerClient` (`lib/supabase/server.ts`)
- Supabase 대시보드 UI 안내는 2026년 5월 기준.

## 프로젝트 메모리 관리

- 작업 시작 전 반드시 `context.md`와 `todo.md`를 읽는다.
- 작업 중 완료·변경·새 이슈 발생 시 두 파일을 수시로 갱신한다.
- 작업 마무리 시 두 파일을 현재 상태에 맞게 업데이트한다.

## Supabase CRUD 규칙 (Ch10)

- `posts` 테이블 컬럼명 임의 변경 금지: `id`, `user_id`, `title`, `content`, `created_at`
- `user_id`는 폼·URL 입력으로 받지 말 것 — 반드시 서버에서 `user.id`를 코드로 삽입.
- `update`·`delete`에는 반드시 `.eq("id", postId)` 조건 필요.
- 작성자 UI 분기(수정/삭제 버튼)는 **UX**이며, 실제 보안은 Ch11 RLS가 담당한다.
- `lib/supabase/client.ts` 또는 `lib/supabase/server.ts` 사용. `@supabase/supabase-js` 직접 `createClient` 금지.
- 새 라이브러리 추가 금지 — 기존 스택으로 구현.

## 에러 처리와 UX 규칙 (Ch12)

- 사용자 화면에는 Supabase 원문 에러 코드, stack trace, `42501` 같은 내부 메시지를 그대로 보여주지 않는다.
- 개발자 확인용 원문 에러는 호출부에서 `console.error(error)`로 남긴다.
- 사용자 메시지는 `lib/error-message.ts`의 `getFriendlyErrorMessage()`를 우선 사용한다.
- 게시글 작성/수정 검증은 `lib/post-validation.ts` 기준을 공유한다: 제목 필수/2자 이상, 내용 필수/10자 이상.
- 로딩 상태는 App Router의 `loading.tsx`와 고정 크기 스켈레톤으로 처리한다.
- 새 라이브러리를 추가하기 전 기존 Tailwind/shadcn/ui로 해결 가능한지 먼저 확인한다.

## 현재 프로젝트 상태 (2026-05-20 기준)

- Ch8 완료: Supabase DB 연결·마이그레이션·Vercel 배포
- Ch9 완료: Supabase Auth 이메일 로그인/회원가입, `proxy.ts` 라우트 보호
- Ch10 완료: posts CRUD 연결, `updatePost()` 구현, 작성자 UI 분기
- Ch11 완료: posts RLS 정책 적용
- Ch12 A회차 완료: error/loading UI, 폼 검증, 사용자 메시지 변환 유틸 적용
- 참고 문서: `ARCHITECTURE.md` § 9 (Auth), § 10 (CRUD), § 11 (Ch12 UX)
- 다음 단계: Ch12 브라우저 화면 캡처와 Vercel 로그 확인
