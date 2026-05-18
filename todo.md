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
- [x] `npm.cmd run lint` 통과
- [x] `npm.cmd run build` 통과
- [x] 로컬 응답 확인: `/`, `/login`, `/signup`, `/posts`
- [x] 보호 라우트 리다이렉트 확인: `/posts/new`, `/mypage`

## 남은 필수 확인

- [ ] Supabase 대시보드 Email Provider 설정 확인
- [ ] Supabase URL Configuration에 로컬/배포 URL 확인
- [ ] 브라우저에서 실제 회원가입 테스트
- [ ] 브라우저에서 실제 로그인 테스트
- [ ] 로그인 상태에서 `/posts/new` 글 작성 테스트
- [ ] 작성한 글의 상세 페이지 확인
- [ ] 로그아웃 후 보호 라우트 접근 차단 확인
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
- [ ] Ch10: 검색 기능
- [ ] Ch11: RLS 정책 적용
- [ ] Ch12: 이미지 업로드와 Supabase Storage 연결

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
