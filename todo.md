# TODO - my-first-web

## 완료

- [x] Next.js App Router 기본 페이지 구성
- [x] shadcn/ui 기본 컴포넌트 적용
- [x] Tailwind CSS 4 디자인 토큰 적용
- [x] Supabase 프로젝트 연결 및 환경변수 설정
- [x] Supabase `profiles`, `posts` 테이블 마이그레이션 작성
- [x] Supabase Auth 이메일/비밀번호 로그인 구현
- [x] `AuthProvider`와 `useAuth` 구현
- [x] 로그인/회원가입/로그아웃 UI 연결
- [x] `proxy.ts`로 `/posts/new`, `/mypage` 보호
- [x] 주요 화면 한글 깨짐 복구
- [x] `next/font/google` 제거로 로컬 빌드 실패 해결
- [x] 게시글 목록/상세/작성/삭제를 Supabase DB로 연결
- [x] 게시글 좋아요/싫어요 기능 추가
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과
- [x] 리뷰 후 `ensureProfile` 중복 제거 및 반응 저장 에러 처리 보강
- [x] Supabase 인증 사용자 기준 토글 시나리오 검증
- [x] Playwright 실제 UI 클릭/새로고침/목록 일관성 검증
- [x] 모바일 375px 반응 버튼 배치 검증
- [x] 로컬 응답 확인: `/`, `/login`, `/signup`, `/posts`
- [x] 보호 라우트 리다이렉트 확인: `/posts/new`, `/mypage`

## 남은 필수 확인

- [x] Supabase 대시보드 Email Provider 설정 확인
- [x] Supabase URL Configuration에 로컬/배포 URL 확인
- [x] 브라우저에서 실제 회원가입 테스트
- [x] 브라우저에서 실제 로그인 테스트
- [x] 로그인 상태에서 `/posts/new` 글 작성 테스트
- [x] 작성한 글의 상세 페이지 확인
- [x] 브라우저에서 좋아요/싫어요 토글 확인
- [x] 로그아웃 후 보호 라우트 접근 차단 확인
- [ ] Vercel 배포 후 같은 흐름 재검증

## 2026-05-13 추가 수정

- [x] 로그인 후 `router.push` 대신 전체 페이지 이동으로 Supabase 쿠키 동기화 보강
- [x] 로그아웃 후 전체 페이지 이동으로 서버/클라이언트 인증 상태 동기화
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-13 디자인 업그레이드

- [x] 홈 화면을 실제 블로그형 첫 화면으로 개편
- [x] 포스트 목록 카드 디자인 고급화
- [x] 포스트 상세 페이지를 읽기 좋은 문서형 레이아웃으로 개선
- [x] 글쓰기 폼 디자인 정리
- [x] 로그인/회원가입 화면 디자인 정리
- [x] 마이페이지 디자인 정리
- [x] 내비게이션/푸터/테마 토큰 정리
- [x] 디자인 변경 후 `npm.cmd run lint` 통과
- [x] 디자인 변경 후 `npm.cmd run build` 통과
- [x] 주요 라우트와 보호 라우트 응답 확인

## 2026-05-13 디자인 방향 재조정

- [x] 과한 상용형/영어 라벨 방향을 철회
- [x] 한국어 중심의 단정한 개인 블로그 톤으로 재정리
- [x] `docs/ch01a.md` ~ `docs/ch09a.md` 변경 없음 확인
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과
- [x] `/`, `/posts`, `/login`, 비로그인 `/posts/new` 응답 확인

## 이후 챕터 작업

- [x] Ch10: 글 수정 기능
- [x] 게시글 좋아요/싫어요 기능
- [x] 게시글 댓글 기능
- [x] 게시글 파일 업로드 기능
- [x] 게시글 공유 기능
- [x] Ch10: 검색 기능
- [x] Ch11: RLS 정책 적용
- [x] Ch12: 이미지 업로드와 Supabase Storage 연결

## 2026-05-18 Ch10 CRUD 쫐 하부 구현

- [x] `Post` 타입에 `user_id` 추가
- [x] `lib/posts.ts` Supabase 쿼리에 `user_id` 콜럼 선택
- [x] `updatePost()` 함수 구현 (`.eq("id").eq("user_id")` 조건 포함)
- [x] `/posts/[id]` 상세 페이지 작성자 UI 분기 (수정/삭제 버튼)
- [x] `/posts/[id]/edit` 수정 페이지 신규 생성
- [x] `npm.cmd run build` 통과

## 2026-05-18 Ch10 브라우저 + 터미널 검증 완료

- [x] `/posts` 목록 표시 확인
- [x] `/posts/[id]` 상세 표시 + `notFound()` 동작 확인 (`/posts/999` → 404)
- [x] 비로그인 `/posts/new` → middleware가 `/login` redirect
- [x] `isAuthor` 분기 — 작성자 수정/삭제 UI / 비작성자 숨김 (코드 검증)
- [x] `deletePostAction` → `redirect("/posts")` (코드 검증)
- [x] `npm run build` Exit code: 0
- [x] `git grep next/router|auth.signIn` — 검출 없음
- [x] `git grep service_role|sbp_` — 검출 없음
- [x] AI 실수 5개 항목 전부 이상 없음
- [x] Supabase CLI `● my-first-web` (Seoul, LINKED) 확인
- [x] GitHub push + Vercel 배포 (이 커밋)

## 2026-05-13 실습 글 복구

- [x] Ch5/Ch7에서 만든 기본 포스트 3개 복구
- [x] Supabase DB 글 목록과 실습 글 목록이 함께 보이도록 유지
- [x] `/posts/1`, `/posts/2`, `/posts/3` 상세 페이지 복구
- [x] 실습 글 삭제 버튼 숨김
- [x] `/posts/999` 같은 UUID가 아닌 상세 URL에서 500 대신 없는 글 화면 표시
- [x] `docs/ch01a.md` ~ `docs/ch09a.md` 변경 없음 확인
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과
- [x] `/posts`, `/posts/1`, `/posts/999`, 비로그인 `/posts/new`, `/mypage` 응답 확인

## 2026-05-18 좋아요/싫어요 기능 추가

- [x] `post_reactions` 마이그레이션 작성
- [x] 연결된 Supabase 원격 DB에 마이그레이션 적용
- [x] 같은 사용자 기준 `unique(post_id, user_id)`로 중복 반응 방지
- [x] 좋아요/싫어요 동시 적용 방지 및 상호 전환 구현
- [x] 같은 버튼 재클릭 시 반응 취소 구현
- [x] 게시글 상세 페이지에 좋아요/싫어요 버튼 추가
- [x] 게시글 목록 페이지에 좋아요/싫어요 수 표시
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-18 댓글 기능 추가

- [x] `post_comments` 마이그레이션 작성
- [x] 연결된 Supabase 원격 DB에 마이그레이션 적용
- [x] 댓글 목록/댓글 수 조회 함수 추가
- [x] 댓글 작성/삭제 함수 추가
- [x] 상세 페이지 댓글 섹션 컴포넌트 추가
- [x] 게시글 상세 페이지에 댓글 수 표시
- [x] 게시글 목록 페이지에 댓글 수 표시
- [x] 공백 댓글 차단 구현
- [x] 댓글 500자 제한 구현
- [x] XSS 방지를 위해 HTML 직접 렌더링 없이 텍스트 렌더링 확인
- [x] 본인 댓글만 삭제 가능하도록 RLS/쿼리 조건 적용
- [x] Playwright 실제 UI 작성/새로고침/삭제/목록 카운트 검증
- [x] 모바일 375px 댓글 입력창 배치 검증
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-18 파일 업로드 기능 추가

- [x] `post_attachments` 마이그레이션 작성
- [x] Supabase Storage `post-attachments` 버킷 생성/정책 적용
- [x] 연결된 Supabase 원격 DB에 마이그레이션 적용
- [x] 파일 검증 유틸 분리 (`lib/fileUpload.ts`)
- [x] 작성 화면 파일 선택/미리보기/업로드 연결
- [x] 수정 화면 기존 첨부파일 확인/삭제/추가 연결
- [x] 상세 화면 첨부파일 표시 연결
- [x] 위험 확장자 차단 구현
- [x] 파일 크기 5MB 제한 구현
- [x] 게시글 삭제 시 첨부파일 메타데이터와 Storage 객체 함께 삭제하도록 보강
- [x] Playwright 실제 UI 업로드/상세 표시/수정 삭제 검증
- [x] 모바일 375px 파일 입력 배치 검증
- [x] 검증용 임시 사용자/게시글/Storage 객체 정리 확인
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-18 공유 기능 추가

- [x] 상세 페이지 공유 버튼 컴포넌트 추가
- [x] Web Share API 지원 여부 안전 확인
- [x] 클립보드 복사 fallback 추가
- [x] HTTPS가 아닌 환경을 위한 textarea fallback 추가
- [x] 성공/실패 안내 메시지 추가
- [x] 게시글 제목과 URL 공유 데이터 반영
- [x] Playwright fallback 복사/실패 메시지 검증
- [x] 모바일 375px 공유 버튼 배치 검증
- [x] 콘솔 오류 없음 확인
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-18 조회수 기능 추가

- [x] `post_views` 마이그레이션 작성
- [x] 조회수 조회/증가 유틸 분리 (`lib/views.ts`)
- [x] 상세 페이지 조회수 컴포넌트 추가
- [x] 상세 페이지 진입 시 조회수 증가 Server Action 연결
- [x] localStorage 기반 게시글별 30분 중복 조회 제한 추가
- [x] localStorage 사용 불가 환경을 위한 메모리 fallback 추가
- [x] 게시글 목록 페이지 조회수 표시
- [x] 게시글 상세 페이지 조회수 표시
- [x] 존재하지 않는 글에서는 조회수 증가 컴포넌트가 렌더링되지 않도록 유지
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과
- [x] 원격 Supabase DB에 조회수 마이그레이션 적용 (`npx supabase db push --yes`)
- [x] DB 적용 후 실제 브라우저에서 증가/새로고침 중복 제한/목록 일관성 검증

## 2026-05-18 통합 품질 점검 수정

- [x] `revalidatePath` 과다 호출 제거 (`incrementViewAction` 조회수만 invalidate, 반응/댓글 홈 invalidate 제거)
- [x] `PostAttachment` 타입에 `storagePath` 추가, `getAttachments()` 반환에 포함
- [x] `AttachmentManager` URL 파싱 함수 제거, `attachment.storagePath` 직접 사용
- [x] `formatFileSize` `lib/fileUpload.ts`로 통합, `AttachmentList`·`FileUploadField` 중복 제거
- [x] `npm.cmd run build` 통과

## 2026-05-18 최종 품질 검증 (14개 항목)

- [x] `npm run build` Exit code 0 확인
- [x] TypeScript 오류 없음 확인
- [x] 미사용 import/변수 없음 확인
- [x] 검색 쿼리 특수문자 이스케이프 추가 (`lib/posts.ts`)
- [x] `app/posts/new/page.tsx` — posts insert 전 `profiles` upsert 추가로 FK violation 방지
- [x] `AvatarUpload.tsx` — 숨겨진 file input에 `aria-label` 추가
- [x] `AvatarUpload.tsx` — 확장자 소문자 정규화 (`.PNG` → `.png`)
- [x] `AttachmentManager.tsx` — 에러/성공 메시지 색상 구분
- [x] `AttachmentList.tsx` — 첨부파일 링크 `aria-label` 추가
- [x] 모든 버튼/입력창 label 또는 aria 속성 확인
- [x] `dangerouslySetInnerHTML` 미사용 확인 (댓글 XSS 안전)
- [x] 위험 파일 확장자 차단 확인 (`lib/fileUpload.ts`)
- [x] `localStorage` key 접두사 `my-first-web:post-view:` 충돌 없음 확인
- [x] 게시글 삭제 시 첨부파일 Storage + 메타데이터 함께 삭제 확인
- [x] `npm run build` Exit code 0 최종 확인

## 2026-05-19 작성자 표시 수정

- [x] DB 글 작성자가 고정값 `작성자`로 표시되는 원인 확인
- [x] 목록/상세 글 조회 시 `profiles.username`을 작성자명으로 반영
- [x] 기존 글에서 프로필 이름이 비어 있는 로그인 사용자 본인 글 fallback 추가
- [x] 로그인/회원가입 성공 시 프로필 이름 저장 보강
- [x] 새 글 작성 전 프로필에 회원가입 이름 또는 이메일 앞부분 저장
- [x] `npm.cmd run build` 통과
- [x] `npm.cmd run lint` 통과

## 2026-05-19 홈 화면 UI 조정

- [x] `새 글 작성` 링크를 버튼처럼 보이게 조정
- [x] 최근 포스트 카드 높이와 내부 빈 공간 축소
- [x] 짧은 카드가 같은 행의 긴 카드 높이에 맞춰 늘어나지 않도록 조정
- [x] `전체 보기`를 기존처럼 오른쪽 파란 텍스트 링크로 복원
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-19 홈 카드 수평 리듬 보정

- [x] 최근 포스트 카드 2개의 제목/요약/버튼 기준선 정렬
- [x] 글 길이가 달라도 요약은 2줄 기준으로 자연스럽게 보이도록 조정
- [x] `상세 보기` 버튼을 카드 하단에 맞춤
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과

## 2026-05-19 GitHub/Vercel 최신화

- [x] 로컬 작업 트리와 `origin/master` 커밋 상태 확인
- [x] `npm.cmd run build` 통과
- [x] `npm.cmd run lint` 통과
- [x] GitHub `master` push 완료
- [x] Vercel production 배포 확인 (`READY`)

## 2026-05-20 Ch11 RLS 실습

- [x] `context.md`, `todo.md`, `ARCHITECTURE.md` 상태 확인
- [x] Ch11 기준과 충돌하는 `ARCHITECTURE.md` 내용 정정
- [x] `AGENTS.md`, `CLAUDE.md`, `.agent/rules/project.md` 라우트 보호 파일 기준을 `proxy.ts`로 정정
- [x] Supabase CLI 버전 확인 (`npx.cmd supabase --version`)
- [x] Supabase 연결 프로젝트 확인 (`my-first-web`, `qxgutxeaolqbkjsfymiu`)
- [x] `npx.cmd supabase migration new add_posts_rls`로 마이그레이션 생성
- [x] `supabase/migrations/20260520020609_add_posts_rls.sql`에 posts RLS 정책 작성
- [x] `npx.cmd supabase db push --yes`로 원격 DB 적용
- [x] `npm.cmd run build` 재검증
- [x] `npm.cmd run lint` 재검증
- [x] 민감 키 grep 재검증
- [x] 비로그인 `/posts` 조회 200 확인
- [x] 비로그인 `/posts/new` 307 redirect 확인
- [x] anon REST INSERT 우회 시도 401 실패 확인
- [x] Ch11 실습 내용 정밀 리뷰 및 문서 미세 보완
- [ ] 사용자 A/B 교차 수정·삭제 브라우저 테스트 및 스크린샷 제출

## 2026-05-20 Ch11 마무리 체크리스트

- [x] posts RLS 마이그레이션 생성 (`20260520020609_add_posts_rls.sql`)
- [x] Supabase 원격 DB에 `db push` 적용
- [x] SELECT/INSERT/UPDATE/DELETE 정책 조건 검토
- [x] 비로그인 조회 및 작성 접근 차단 확인
- [x] anon REST INSERT 우회 차단 확인
- [x] 보안 키 노출 grep (`service_role`, `SUPABASE_SERVICE_ROLE`, `sb_secret_`, `sbp_`) 결과 없음
- [x] `npm.cmd run build` 통과
- [x] `npm.cmd run lint` 통과
- [x] GitHub 업로드 완료 (`30dcd4b Add Ch11 posts RLS migration`)
- [x] 사용자 A 본인 글 수정/삭제 성공 스크린샷
- [x] 사용자 B가 A 글 수정/삭제 실패 스크린샷
- [x] Supabase `posts` Policies 화면 스크린샷
- [x] Vercel 최신 배포 확인
- [x] Edit 페이지 redirect try-catch 버그 수정 (`app/posts/[id]/edit/page.tsx`)
- [x] 버그 수정 GitHub push (`4813443 Fix redirect in try-catch bug in edit post Server Action`)
- [x] Vercel production 재배포

## 2026-05-20 Ch12 A회차 에러 처리와 UX 개선

- [x] `context.md`, `todo.md`, `ARCHITECTURE.md`, 규칙 문서 상태 확인
- [x] 실패 케이스 정리: loading, empty, error, auth/session, permission denied, validation
- [x] `app/error.tsx` 추가 (`"use client"`, `console.error`, `reset()` 다시 시도 버튼)
- [x] `app/loading.tsx` 추가
- [x] `app/posts/loading.tsx` 목록 카드 스켈레톤 추가
- [x] `app/posts/[id]/loading.tsx` 상세 스켈레톤 추가
- [x] `app/posts/[id]/not-found.tsx` 없는 게시글 안내 추가
- [x] `lib/error-message.ts` Supabase/네트워크/RLS 에러 메시지 변환 유틸 추가
- [x] `lib/post-validation.ts` 제목/내용 폼 검증 규칙 추가
- [x] `/posts/new` 클라이언트 검증, 제출 중 비활성화, 원문 에러 로그 분리 적용
- [x] `/posts/[id]/edit` 클라이언트 검증 폼(`components/PostEditForm.tsx`)과 Server Action 검증 적용
- [x] 로그인/회원가입 원문 Auth 에러 노출 방지
- [x] 댓글/반응/조회수/첨부파일/프로필 이미지 에러 메시지와 개발자 로그 분리
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과
- [x] Ch12 grep 보안/구버전 API 재검증
- [x] `vercel env ls production`, `vercel logs` 확인
- [x] 로컬 dev 서버 HTTP 스모크 확인 (`/posts`, 없는 게시글, 비로그인 `/posts/new` redirect)
- [ ] 브라우저에서 로딩/빈 상태/없는 게시글/제목 없이 제출/RLS 권한 실패 화면 캡처

## 2026-05-20 Ch13 AI 결과 검증

- [x] `context.md`, `todo.md`, `ARCHITECTURE.md`, `AGENTS.md` 상태 확인
- [x] Playwright 설치 (`@playwright/test`)
- [x] `playwright.config.ts` 작성
- [x] `tests/auth-crud.spec.ts` 작성: 행복 경로 1개, 거절 경로 1개
- [x] `npm.cmd run build` 통과
- [x] `npm.cmd run lint` 통과
- [x] 보안 grep 3개 실행: 민감 키, 구버전 라우터/API, XSS 위험 패턴 결과 없음
- [x] `npm.cmd audit --omit=dev` 실행 및 취약점 확인 필요 항목 기록
- [x] Supabase CLI 버전과 연결 프로젝트 확인
- [x] Vercel CLI 버전, 배포 목록, env 이름, 로그 확인
- [x] Production URL HTTP 스모크 확인: `/` 200, `/posts` 200, `/posts/new` 307
- [x] Playwright 거절 경로 실행 통과
- [x] 검증 보고서 작성 (`docs/ch13-validation-report.md`)
- [ ] `TEST_EMAIL`, `TEST_PASSWORD` 설정 후 Playwright 행복 경로 실행
- [ ] Vercel 대시보드에서 env 실제 값 적용 대상 눈검증
- [ ] Supabase URL Configuration의 localhost/Vercel URL 눈검증
- [ ] Vercel 배포 URL에서 로그인/글 작성/로그아웃 수동 검증
- [ ] 사용자 A/B 교차 RLS 수정·삭제 차단 Ch13 재검증
- [ ] npm audit 취약점 처리 방향 결정(교재 버전 유지 여부 포함)
- [ ] 제출용 스크린샷/로그 정리
