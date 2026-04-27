# Context - my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-27
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록 기본 구조, 포스트 상세 페이지 UI, 새 글 작성 화면 기본 폼
- 진행 중: 포스트 목록 검색 기능, 포스트 상세 데이터 연결, 글 작성/삭제 데이터 흐름 정리
- 미착수: 마이페이지, 로그인 페이지, 인증 연결, 이미지 업로드, 글 수정 페이지

## 기술 결정 사항

- 프레임워크: Next.js 16.2.1 App Router
- React: 19.2.4
- 스타일링: Tailwind CSS 4
- UI 컴포넌트: shadcn/ui (`components/ui/` 사용)
- 데이터: 현재는 `lib/posts.ts`의 인메모리 데이터 사용
- 인증: Supabase Auth 예정이나 현재 코드에는 미연결
- 이미지: Supabase Storage 사용 예정이나 현재 코드에는 미연결
- 작업 관리: 작업 시작 전 `context.md`와 `todo.md`를 참고하고, 작업 중/종료 시 두 파일을 현재 상태로 갱신

## 해결된 이슈

- shadcn/ui 기본 컴포넌트 구조가 `components/ui/`에 준비됨
- 루트 레이아웃에 네비게이션과 푸터가 연결됨
- 포스트 상세 페이지에서 삭제 server action 구조가 추가됨
- `npm.cmd run lint` 통과 확인
- `AGENTS.md`와 `CODEX.md`에 프로젝트 메모리 관리 규칙 추가

## 알게 된 점

- PowerShell에서 `npm` 실행 시 실행 정책 때문에 `npm.ps1`이 막힐 수 있으므로 `npm.cmd`를 사용하면 됨
- 현재 `npm.cmd run build`는 실패함
- 빌드 실패 원인은 `app/posts/posts-client.tsx`에서 import하는 `@/app/components/search-bar` 파일이 없기 때문임
- 목록 페이지는 외부 API 데이터를 먼저 사용하고, 상세 페이지는 `lib/posts.ts` 데이터를 사용해서 데이터 소스가 서로 다름
- 여러 파일의 한글 문구가 인코딩 문제로 깨져 있어 복구가 필요함
- App Router 프로젝트이므로 `pages/` 라우터를 만들지 않고 `app/` 안에서 라우트를 관리해야 함

## 2026-04-27 shadcn/ui check

- Verified `components.json`, `components/ui/*`, `lib/utils.ts`, and `app/globals.css` are present and aligned with shadcn/ui + Tailwind CSS 4.
- `npm.cmd run lint` passed.
- `npx.cmd tsc --noEmit` passed.
- `npm.cmd run build` failed only because `next/font/google` could not fetch Geist from Google Fonts in the restricted network environment; no shadcn/ui install issue was found.

## 2026-04-27 shadcn/ui blog application

- Applied shadcn/ui `Card` to the posts list and post detail surfaces.
- Replaced post navigation/write/delete controls with shadcn/ui `Button`.
- Kept the new post form on server actions and used shadcn/ui `Input` for text fields.
- Added a shadcn/ui `Dialog` confirmation before deleting a post.
- `npm.cmd run lint` and `npx.cmd tsc --noEmit` passed.
- Local dev server responded with HTTP 200 for `/posts`, `/posts/new`, and `/posts/1`.

## 2026-04-27 blog theme tokens

- Updated `app/globals.css` shadcn/ui tokens for a bright, readable personal blog style.
- Set a soft bright background, white cards/popovers, dark blue-gray foreground text, muted blue-gray secondary surfaces, and a calm blue primary action color.
- Kept the existing CSS structure and `@theme inline` mapping unchanged.
- `npm.cmd run lint` and `npx.cmd tsc --noEmit` passed.
- Local dev server responded with HTTP 200 for `/posts`.

## 2026-04-27 AI instruction design rules

- Added clear `Design Tokens` and `Component Rules` sections to `.github/copilot-instructions.md`.
- Mirrored the same rules into `AGENTS.md`, `CODEX.md`, and `CLAUDE.md` so Copilot, Codex, and Claude follow the same UI guidance.
- Rewrote the instruction files with readable UTF-8 Korean text where previous content appeared mojibake in the terminal.

## 2026-04-27 save and upload

- Committed current project work as `c6dfad0` with message `Apply shadcn blog UI and project instructions`.
- Pushed `master` to `origin`.
- Added `next-dev.log` and `next-dev.err` to `.gitignore` because they are local dev server logs, not project source.
