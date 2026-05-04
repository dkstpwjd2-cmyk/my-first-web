# TODO - my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] AGENTS.md / CODEX.md 프로젝트 작업 지침 작성
- [x] 작업 시작/진행/종료 시 `context.md`와 `todo.md`를 관리하는 규칙 추가
- [x] shadcn/ui 기본 컴포넌트 준비 (`Button`, `Card`, `Input`, `Textarea`)
- [x] Tailwind CSS 4 전역 스타일 및 디자인 토큰 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [x] 포스트 기본 데이터 파일 작성 (`lib/posts.ts`)
- [x] Supabase 프로젝트 생성
- [x] 데이터베이스 스키마 작성
- [ ] 깨진 한글 문구 복구

## 2단계: 핵심 기능 (Ch9~10)

- [x] 포스트 목록 페이지 기본 구조
- [x] 포스트 상세 페이지 UI
- [x] 새 포스트 작성 화면 기본 폼
- [x] 회원가입 페이지 (`/signup`)
- [ ] 포스트 목록 검색 컴포넌트 연결
- [ ] 포스트 상세 페이지 데이터 연결 정리
- [ ] 포스트 작성 실제 저장 처리
- [ ] 포스트 삭제 동작 통일
- [ ] 포스트 수정 기능
- [ ] 로그인/회원가입 실제 인증 연결
- [x] `npm.cmd run build` 통과

## 3단계: 고급 기능 (Ch11~12)

- [ ] 마이페이지 실사용자 데이터 연결
- [ ] 댓글 기능
- [ ] 이미지 업로드
- [ ] 카테고리 필터
- [ ] Supabase Auth 연결
- [ ] Supabase Storage 연결

## 현재 확인된 이슈

- [x] `app/posts/posts-client.tsx` 및 search-bar import 오류 → 파일 자체가 삭제되어 실제 오류 없음 (확인 완료)
- [ ] 포스트 목록은 외부 API를 우선 사용하고, 상세 페이지는 `lib/posts.ts` 데이터를 사용해서 데이터 소스가 다름
- [ ] PowerShell에서는 `npm` 대신 `npm.cmd` 사용 필요
- [x] 빌드 실패: `next/font/google`이 네트워크 제한 환경에서 Geist 폰트를 가져오지 못함

## 진행률: 13/28 (46%)

## 2026-04-27 Check Log

- [x] shadcn/ui install verification: files, aliases, CSS tokens, lint, and TypeScript all passed.
- [ ] Production build still needs a network-independent font setup or network access because `next/font/google` cannot fetch Geist in the current environment.

## 2026-04-27 UI Application Log

- [x] Applied shadcn/ui Card/Button/Input/Dialog to the blog pages while preserving the current route/data flow.
- [x] Verified with `npm.cmd run lint`.
- [x] Verified with `npx.cmd tsc --noEmit`.
- [x] Confirmed `/posts`, `/posts/new`, and `/posts/1` return HTTP 200 on the running dev server.

## 2026-04-27 Theme Log

- [x] Refined shadcn/ui theme variables in `app/globals.css` for a bright, clean personal blog.
- [x] Kept the existing CSS structure and changed only theme variable values.
- [x] Verified with `npm.cmd run lint`.
- [x] Verified with `npx.cmd tsc --noEmit`.
- [x] Confirmed `/posts` returns HTTP 200 on the running dev server.

## 2026-04-27 Instruction Log

- [x] Added `Design Tokens` and `Component Rules` to `.github/copilot-instructions.md`.
- [x] Applied the same design/component rules to `AGENTS.md`, `CODEX.md`, and `CLAUDE.md`.
- [x] Confirmed the updated instruction files contain readable UTF-8 Korean text.

## 2026-04-27 Save Log

- [x] Prepared current project work for commit.
- [x] Excluded local dev server logs with `.gitignore`.
- [x] Commit current work.
- [x] Push commit to `origin`.

## 2026-04-29 Ch7 Architecture Log

- [x] Created `ARCHITECTURE.md`: page map, 3 user flows, component hierarchy, DB schema (profiles + posts).
- [x] Created `app/signup/page.tsx` with shadcn/ui Card + Input + Button.
- [x] Generated 2 AI wireframes (home card grid + post creation form).
- [x] Updated `context.md` with Ch7 session summary.
- [x] Updated `todo.md` progress (13/28, 46%).

## 2026-05-04 Ch8 Supabase Log

- [x] Verified `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Verified `supabase/migrations/` contains schema for `profiles` and `posts`.
- [x] Verified `lib/supabase/client.ts` is implemented using `@supabase/ssr`.
- [x] `npm run build` passed successfully.
