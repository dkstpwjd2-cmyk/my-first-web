# Context - my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-05-04
- 완료된 챕터: Ch7 (아키텍처·UI), Ch8 (Supabase 연결·배포)
- 완료된 작업: 홈·포스트 목록·상세·작성·로그인·마이페이지·회원가입 7개 페이지, Supabase DB 마이그레이션, Vercel 배포
- 진행 중: 없음 (Ch9 대기)
- 미착수: 실제 Supabase Auth 연결, 실제 DB CRUD, 이미지 업로드, 글 수정·삭제 데이터 흐름

## 기술 결정 사항

- 프레임워크: Next.js 16.2.1 App Router
- React: 19.2.4
- 스타일링: Tailwind CSS 4
- UI 컴포넌트: shadcn/ui (`components/ui/` 사용)
- 데이터: 현재 `lib/posts.ts` 인메모리 데이터 사용 (Ch9~부터 Supabase로 교체 예정)
- Supabase: 프로젝트 `qxgutxeaolqbkjsfymiu` 연결 완료, `profiles`·`posts` 테이블 마이그레이션 완료
- Supabase 클라이언트: `@supabase/ssr`의 `createBrowserClient` 패턴 사용 (`lib/supabase/client.ts`)
- 인증: Supabase Auth 예정 (코드 미연결)
- 이미지: Supabase Storage 예정 (코드 미연결)
- 배포: Vercel (dkstpwjd2-2207s-projects/my-first-web), Supabase 환경변수 Production 등록 완료
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

## 2026-04-29 Ch7 아키텍처 설계서 보강

- `ARCHITECTURE.md` 신규 생성: 페이지 맵, 유저 플로우 3종(글 읽기·글 작성·마이페이지), 컴포넌트 계층, 데이터 모델(profiles + posts 테이블 + 1:N 관계) 포함.
- `app/signup/page.tsx` 신규 생성: 페이지 맵에 정의된 `/signup` 라우트를 shadcn/ui Card + Input + Button으로 구현.
- AI 와이어프레임 2장 생성: 홈 페이지(카드 목록) + 포스트 작성 페이지 (AI 이미지 생성).
- 현재 완료 페이지: `/`(홈), `/posts`(목록), `/posts/[id]`(상세), `/posts/new`(작성), `/login`(로그인), `/mypage`(마이페이지), `/signup`(회원가입) 총 7개.
- 데이터: 여전히 `lib/posts.ts` 인메모리 데이터 사용 (Supabase 연결은 Ch8 예정).
- 남은 이슈: `app/posts/posts-client.tsx`의 `search-bar` import 오류, 빌드 실패(폰트 네트워크) 미해결.

## 2026-04-29 Ch7 최종 저장 및 업로드

- `app/login/page.tsx`에 회원가입(CardFooter + Link→/signup) 추가 — 로그인↔회원가입 양방향 연결.
- `ARCHITECTURE.md` § 3에 AI 와이어프레임 섹션 삽입 (홈 + 포스트 작성 ASCII 다이어그램), 섹션 번호 재정렬(3→8).
- `todo.md`의 search-bar 이슈를 `[x]` 완료 처리 — 해당 파일이 이미 삭제되어 실제 오류 없음 확인.
- `git add` → `git commit 0f95389` → `git push origin master` 완료.
- 커밋 메시지: "Ch7: Add ARCHITECTURE.md, wireframe, signup page, login-signup link"

## 2026-05-04 Ch8 Supabase 연결 + Vercel 배포 완료

- Supabase 프로젝트 생성, `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`·`NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 완료.
- `profiles`, `posts` 테이블 스키마 작성 및 `supabase db push` 마이그레이션 완료.
- `@supabase/ssr`, `@supabase/supabase-js` 설치 및 `lib/supabase/client.ts`에 `createBrowserClient` 패턴 구현.
- `npm run build` 통과 (TypeScript 오류 없음, 9개 페이지 정적 생성).
- Vercel 환경변수 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) Production 등록 완료.
- `git push origin master` → Vercel 자동 배포 완료 (status: Ready, commit 04dedcc).
- `.env.local`이 `vercel link` 실수로 덮어써진 것을 Supabase 대시보드에서 키를 다시 받아 복구함.

## AI 모델 공통 작업 지침 (Claude Code · Codex · Antigravity · Copilot 등)

새 세션 시작 시 반드시 아래 두 파일을 먼저 읽을 것:

```
#file:context.md #file:ARCHITECTURE.md
```

현재 프로젝트 상태 요약 (세션 시작 시 AI에게 전달할 한 줄):
> Ch8 완료: Supabase 프로젝트 연결·마이그레이션·Vercel 배포까지 모두 완료.
> 다음은 Ch9 — 실제 Supabase DB에서 데이터를 읽어 포스트 목록·상세를 교체하는 작업.
> `@supabase/ssr`의 `createBrowserClient` 패턴으로 작업할 것.
