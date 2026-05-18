# Context - my-first-web 프로젝트 상태

## 현재 상태

- 마지막 업데이트: 2026-05-18 (UI/UX 안정화 완료)
- 완료 챕터: Ch7~Ch12 전체 완료 (CRUD, Auth, 반응/댓글/파일/공유/조회수/검색/아바타, RLS)
- 기술 스택: Next.js 16.2.1 App Router, React 19.2.4, Tailwind CSS 4, shadcn/ui, Supabase
- 인증: Supabase Auth 이메일/비밀번호
- 보호 라우트: `proxy.ts`에서 `/posts/new`, `/mypage`를 보호하고 비로그인 사용자를 `/login`으로 보냄
- 데이터: 게시글 목록/상세/작성/수정/삭제가 Supabase `posts` 테이블을 사용하도록 연결됨
- 반응: 게시글 좋아요/싫어요는 Supabase `post_reactions` 테이블에 로그인 사용자별로 1개만 저장됨
- 댓글: 게시글 댓글은 Supabase `post_comments` 테이블에 로그인 사용자 기준으로 저장/삭제됨
- 첨부파일: 게시글 파일은 Supabase Storage `post-attachments` 버킷과 `post_attachments` 테이블에 저장됨
- 공유: 게시글 상세 페이지에서 Web Share API 또는 클립보드 fallback으로 현재 글 링크를 공유함
- 빌드: `npm run build` Exit code 0 (TypeScript 오류 없음)

## 최근 수정 사항

- 깨진 한글 UI 문구를 주요 화면에서 복구함:
  - `app/page.tsx`
  - `app/posts/page.tsx`
  - `app/posts/[id]/page.tsx`
  - `app/posts/new/page.tsx`
  - `app/login/page.tsx`
  - `app/signup/page.tsx`
  - `app/mypage/page.tsx`
  - `components/Navigation.tsx`
- `app/layout.tsx`에서 `next/font/google`의 Geist 의존성을 제거함.
- `lib/posts.ts`를 인메모리 데이터 대신 Supabase 서버 클라이언트 기반 함수로 교체함.
- 글 작성 전 `profiles` 행을 `upsert`하여 `posts.user_id -> profiles.id` 외래 키 실패를 방지함.
- `contexts/AuthContext.tsx`, `lib/auth.ts`, `lib/supabase/server.ts`, `proxy.ts`의 깨진 주석/문구를 정리함.

## 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- 로컬 dev 서버: `http://localhost:3000`
- 응답 확인:
  - `/`: 200
  - `/login`: 200
  - `/signup`: 200
  - `/posts`: 200
  - 비로그인 `/posts/new`: 307 -> `/login`
  - 비로그인 `/mypage`: 307 -> `/login`

## 남은 작업

- 브라우저에서 전체 기능 최종 검증 (좋아요/싫어요, 댓글, 파일업로드, 공유, 조회수, 검색, 아바타 업로드)

## 2026-05-18 좋아요/싫어요 기능 추가

### 생성/수정 파일 목록

| 파일 | 변경 | 내용 |
|---|---|---|
| `supabase/migrations/20260518053000_create_post_reactions.sql` | 신규 | `post_reactions` 테이블, 중복 방지 unique 제약, RLS 정책 추가 |
| `lib/reactions.ts` | 신규 | 반응 카운트 조회, 현재 사용자 반응 조회, 좋아요/싫어요 토글 함수 추가 |
| `lib/profiles.ts` | 신규 | `profiles` 행 보정 공통 함수 분리 |
| `components/ReactionButtons.tsx` | 신규 | 상세 페이지용 좋아요/싫어요 클라이언트 버튼과 즉시 UI 반영 |
| `lib/posts.ts` | 수정 | `Post` 타입에 반응 카운트/상태 추가, 목록/상세 조회 시 반응 요약 병합 |
| `app/posts/page.tsx` | 수정 | 게시글 목록 카드에 좋아요/싫어요 수 표시 |
| `app/posts/[id]/page.tsx` | 수정 | 상세 페이지에 반응 버튼 추가, Server Action으로 토글 처리 |

### 구현 메모

- `post_reactions.post_id`는 `text`로 두어 Supabase DB 글(UUID)과 기존 실습 글(`1`, `2`, `3`) 모두 반응 저장이 가능하다.
- `unique (post_id, user_id)`로 같은 사용자가 좋아요와 싫어요를 동시에 누를 수 없게 했다.
- 같은 버튼을 다시 누르면 삭제, 반대 버튼을 누르면 `upsert`로 반응이 전환된다.
- 비로그인 사용자는 상세 페이지에서 로그인 안내 메시지를 보고, DB에는 반응을 저장하지 않는다.
- 마이그레이션은 연결된 Supabase 원격 DB에 `supabase db push`로 적용 완료.
- 리뷰 후 `ensureProfile` 중복을 `lib/profiles.ts`로 분리하고, 프로필 보정 실패가 버튼 메시지로 돌아오게 보강했다.

### 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- Supabase 인증 사용자 기준 토글 시나리오 통과: 좋아요 증가/취소, 싫어요 증가, 좋아요↔싫어요 전환, 재로그인 후 유지
- Playwright 실제 UI 클릭 검증 통과: 로그인 후 `/posts/1` 좋아요 0→1, 새로고침 후 유지, `/posts` 목록에도 좋아요 1 표시
- `/posts` 200, `/posts/1` 200, 비로그인 `/posts/new` 307 확인
- Playwright 모바일 375px 확인: 가로 overflow 없음, 반응 버튼 세로 배치 정상

## 2026-05-18 댓글 기능 추가

### 생성/수정 파일 목록

| 파일 | 변경 | 내용 |
|---|---|---|
| `supabase/migrations/20260518061000_create_post_comments.sql` | 신규 | `post_comments` 테이블, 길이 제한, RLS 정책 추가 |
| `lib/comments.ts` | 신규 | 댓글 목록/댓글 수 조회, 작성, 삭제 함수 추가 |
| `components/CommentSection.tsx` | 신규 | 상세 페이지 댓글 목록/작성/삭제 UI 추가 |
| `lib/posts.ts` | 수정 | `Post` 타입에 `commentCount` 추가, 목록/상세 조회 시 댓글 수 병합 |
| `app/posts/page.tsx` | 수정 | 게시글 목록 카드에 댓글 수 표시 |
| `app/posts/[id]/page.tsx` | 수정 | 상세 페이지 댓글 수와 댓글 영역 추가 |

### 구현 메모

- `post_comments.post_id`는 `text`로 두어 Supabase DB 글(UUID)과 기존 실습 글(`1`, `2`, `3`) 모두 댓글 저장이 가능하다.
- 로그인 사용자의 `user_metadata.name` 또는 이메일 앞부분을 작성자 이름으로 저장한다.
- 댓글 내용은 `trim()` 후 저장하며, 공백 댓글과 500자 초과 댓글을 막는다.
- React 텍스트 렌더링만 사용하고 `dangerouslySetInnerHTML`을 쓰지 않아 댓글 HTML이 실행되지 않는다.
- 댓글 시간은 hydration mismatch를 피하기 위해 `Asia/Seoul` 24시간 포맷으로 고정했다.

### 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- Supabase 인증 사용자 기준 DB 시나리오 통과: 공백 댓글 차단, 저장, 재로그인 후 유지, 본인 댓글 삭제
- Playwright 실제 UI 검증 통과: 빈 댓글 차단, 댓글 작성 즉시 반영, 새로고침 후 유지, 목록 댓글 수 표시, 삭제 후 0개 반영
- XSS 검증: `<script>` 입력은 `&lt;script&gt;`로 렌더링되고 실제 `script` 노드 없음
- Playwright 모바일 375px 확인: 댓글 입력창 가로 overflow 없음

## 2026-05-18 파일 업로드 기능 추가

### 생성/수정 파일 목록

| 파일 | 변경 | 내용 |
|---|---|---|
| `supabase/migrations/20260518070000_create_post_attachments.sql` | 신규 | Storage 버킷, `post_attachments` 테이블, 파일 크기/형식 제한, RLS 정책 추가 |
| `lib/fileUpload.ts` | 신규 | 허용 확장자/MIME/용량 검증, Storage path 생성 유틸 |
| `lib/attachments.ts` | 신규 | 첨부파일 목록 조회, 게시글 삭제 시 첨부파일 정리 함수 |
| `components/FileUploadField.tsx` | 신규 | 작성/수정 공통 파일 선택, 검증, 이미지 미리보기 UI |
| `components/AttachmentList.tsx` | 신규 | 상세 페이지 첨부파일 표시 UI |
| `components/AttachmentManager.tsx` | 신규 | 수정 페이지 기존 첨부파일 확인/삭제/추가 UI |
| `app/posts/new/page.tsx` | 수정 | 글 작성 시 파일 선택, 미리보기, Storage 업로드, 메타데이터 저장 |
| `app/posts/[id]/edit/page.tsx` | 수정 | 수정 화면에 첨부파일 관리 영역 추가 |
| `app/posts/[id]/page.tsx` | 수정 | 상세 페이지 첨부파일 표시 |
| `lib/posts.ts` | 수정 | 게시글 삭제 시 첨부파일 Storage 객체와 메타데이터 함께 삭제 |

### 구현 메모

- 허용 확장자: `jpg`, `jpeg`, `png`, `webp`, `gif`, `pdf`, `doc`, `docx`, `hwp`, `hwpx`, `txt`.
- 차단 확장자: 실행 파일, 스크립트 파일, 압축 파일 계열(`exe`, `bat`, `ps1`, `js`, `zip`, `rar` 등).
- 파일 크기는 5MB 이하로 제한하며, 클라이언트 유틸/Storage bucket/table check로 중복 검증한다.
- Storage path는 `userId/postId/uuid-fileName.ext` 형태라 사용자별 삭제 정책과 충돌하지 않는다.
- 상세 페이지에서는 이미지는 미리보기, 문서는 파일명/다운로드 링크로 표시한다.
- 수정 페이지에서는 기존 첨부파일 확인, 삭제, 새 파일 추가가 가능하다.

### 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- Supabase 원격 DB에 Storage bucket/table/policy 마이그레이션 적용 완료
- Playwright 실제 UI 검증 통과: 위험 파일 `.exe` 차단 메시지 표시, 허용 이미지 `png` 미리보기 표시, 게시글 저장 후 상세 첨부파일 표시, 수정 화면 기존 첨부파일 표시/삭제
- Playwright 모바일 375px 확인: 파일 입력 가로 overflow 없음
- 콘솔 오류 없음
- 검증용 임시 사용자/게시글/Storage 객체 정리 완료

## 2026-05-18 공유 기능 추가

### 생성/수정 파일 목록

| 파일 | 변경 | 내용 |
|---|---|---|
| `components/ShareButton.tsx` | 신규 | Web Share API, clipboard, textarea fallback 기반 공유 버튼 |
| `app/posts/[id]/page.tsx` | 수정 | 상세 페이지 footer에 공유 버튼 추가 |

### 구현 메모

- `navigator.share` 지원 시 제목과 URL을 네이티브 공유창으로 전달한다.
- Web Share API가 없으면 `navigator.clipboard.writeText()`로 현재 게시글 URL을 복사한다.
- HTTPS가 아닌 환경이나 clipboard 미지원 환경에서는 임시 `textarea`와 `document.execCommand("copy")` fallback을 사용한다.
- 공유/복사 성공과 실패를 버튼 아래 메시지로 즉시 표시한다.
- 사용자가 네이티브 공유창을 취소한 `AbortError`는 실패로 표시하지 않는다.

### 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- Playwright 검증 통과: Web Share API 미지원 환경에서 URL 복사 메시지 표시 및 복사 URL 확인
- Playwright 검증 통과: clipboard/textarea fallback 실패 시 실패 메시지 표시
- Playwright 모바일 375px 확인: footer 공유 버튼 가로 overflow 없음
- 콘솔 오류 없음

## 2026-05-18 Ch10 CRUD 완성

### 생성/수정 파일 목록

| 파일 | 변경 | 내용 |
|---|---|---|
| `lib/posts.ts` | 수정 | `getPosts`, `getPostById`, `createPost`, `updatePost`, `deletePostById` Supabase 구현 |
| `app/posts/page.tsx` | 수정 | Supabase 목록 조회 + 에러 핸들링 |
| `app/posts/[id]/page.tsx` | 수정 | `notFound()`, `isAuthor` UI 분기, 삭제 Server Action + 에러 처리 |
| `app/posts/new/page.tsx` | 수정 | `"use client"`, `useAuth()`, 브라우저 클라이언트 insert |
| `app/posts/[id]/edit/page.tsx` | **신규** | 수정 폼, `updatePostAction`, 에러 처리 |

### Supabase 쿼리 패턴

```ts
// SELECT — 목록 (created_at 내림차순)
supabase.from("posts").select("id, title, content, created_at, user_id").order("created_at", { ascending: false })

// SELECT — 상세
supabase.from("posts").select("id, title, content, created_at, user_id").eq("id", id).single()

// INSERT — user_id는 폼 입력값이 아닌 코드에서 삽입
supabase.from("posts").insert({ title, content, user_id: user.id }).select("id").single()

// UPDATE — .eq("id") 필수
supabase.from("posts").update({ title, content }).eq("id", id).eq("user_id", user.id)

// DELETE — .eq("id") 필수
supabase.from("posts").delete().eq("id", id).eq("user_id", user.id)
```

### 작성자 UI 분기 패턴

```ts
// 서버 컴포넌트에서 isAuthor 판별 — UX 목적, 실제 보안은 Ch11 RLS
const { data: { user } } = await supabase.auth.getUser();
const isAuthor = !!user && user.id === post.user_id;

// JSX에서 조건부 렌더링
{isAuthor && <Button>수정</Button>}
{isAuthor && <Button variant="destructive">삭제</Button>}
// ※ 이 분기는 UX이며, 실제 보안은 Ch11 RLS에서 DB 정책으로 처리한다.
```

### 검증 결과

- `npm run build`: Exit code 0
- 브라우저: `/posts` 목록, `/posts/[id]` 상세, `notFound()`, 비로그인 `/posts/new` → redirect 확인
- grep: `next/router`, `auth.signIn`, `service_role` 패턴 미검출
- Vercel: Production 배포 완료 (Ready)

## 2026-05-13 Auth redirect follow-up

- Issue checked: user appeared logged in on the client but `/posts/new` still redirected to `/login`.
- Cause is likely cookie/server-state synchronization after client-side login navigation, not the protected-route condition itself.
- Updated login success and logout to use full page navigation so the browser sends the latest Supabase auth cookies to `proxy.ts`.
- Verified after the change: `npm.cmd run lint` passed and `npm.cmd run build` passed.

## 2026-05-13 Commercial-grade design pass

- Upgraded the blog UI for a calmer final-project/commercial feel without changing the Supabase/Auth/proxy logic.
- Reworked the home page from a route map into an editorial landing page with latest posts and archive count.
- Refined the posts list, detail page, write form, login, signup, my page, navigation, layout, footer, and theme tokens.
- Kept the class design within the existing stack: Next.js App Router, Tailwind CSS, shadcn/ui components, Supabase.
- Verification after the design pass:
  - `npm.cmd run lint`: passed
  - `npm.cmd run build`: passed
  - `/`, `/posts`, `/login`, `/signup`: 200
  - 비로그인 `/posts/new`, `/mypage`: 307 -> `/login`

## 2026-05-13 Design direction correction

- User feedback: the commercial/editorial design direction felt worse than the previous design.
- Adjusted the UI back toward a simpler Korean personal-blog style while keeping the functional fixes.
- Confirmed `docs/ch01a.md` through `docs/ch09a.md` were not changed.
- Removed leftover English section labels from app screens.
- Verification after correction:
  - `npm.cmd run lint`: passed
  - `npm.cmd run build`: passed
  - `/`, `/posts`, `/login`: 200

## 2026-05-13 Practice post restoration

- Restored the three Ch5/Ch7 practice posts in `lib/posts.ts` as read-only posts while keeping Supabase-backed posts for Ch8/Ch9.
- Practice posts now appear on `/posts` and `/posts/1`, `/posts/2`, `/posts/3` without requiring rows in the Supabase `posts` table.
- Practice posts hide the delete button so the fixed lesson content is not treated like user-created DB content.
- Added a UUID guard before Supabase detail/delete queries so lesson routes such as `/posts/999` render the not-found UI instead of a 500.
- Confirmed `docs/ch01a.md` through `docs/ch09a.md` still have no changes.
- Verification after restoration:
  - `npm.cmd run lint`: passed
  - `npm.cmd run build`: passed
  - `/posts`: 200 and contains all three practice post titles
  - `/posts/1`: 200, contains the original first post content, and has no delete button
  - `/posts/999`: 200 with the not-found message
  - Non-login `/posts/new`, `/mypage`: 307 -> `/login`

## 2026-05-18 조회수 기능 추가

### 생성/수정 파일 목록

| 파일 | 변경 | 내용 |
|---|---|---|
| `supabase/migrations/20260518073000_create_post_views.sql` | 신규 | `post_views` 테이블, 읽기 RLS, `increment_post_view()` RPC 추가 |
| `lib/views.ts` | 신규 | 조회수 목록 조회, 단일 조회, 증가 함수 추가 |
| `components/ViewCounter.tsx` | 신규 | 상세 페이지 진입 시 조회수 증가와 30분 localStorage 중복 제한 처리 |
| `lib/posts.ts` | 수정 | `Post.viewCount` 추가, 목록/상세 조회 시 조회수 요약 병합 |
| `app/posts/page.tsx` | 수정 | 게시글 목록 카드에 조회수 표시 |
| `app/posts/[id]/page.tsx` | 수정 | 상세 페이지에 조회수 표시 및 증가 Server Action 연결 |

### 구현 메모

- 조회수 누적값은 Supabase `post_views` 테이블에 저장한다.
- `post_id`는 `text`로 두어 Supabase DB 글 UUID와 기존 실습 글 `1`, `2`, `3`을 모두 지원한다.
- 상세 페이지가 실제 존재하는 글을 찾은 뒤에만 `ViewCounter`가 렌더링되므로 없는 글에서는 증가 로직이 실행되지 않는다.
- 같은 브라우저에서 같은 게시글은 localStorage 기준 30분에 1회만 증가한다.
- localStorage를 사용할 수 없는 환경에서는 현재 런타임 메모리 fallback으로 같은 탭 내 중복 증가를 줄인다.
- React Strict Mode나 빠른 재렌더 상황에서 중복 호출되지 않도록 서버 호출 전에 localStorage에 조회 시각을 먼저 기록한다.
- 추후 DB 구조를 바꿀 때는 `lib/views.ts`의 조회/증가 함수만 교체하면 UI 변경을 줄일 수 있다.

### 검증 결과

- `npm.cmd run lint`: 통과
- `npm.cmd run build`: 통과
- 원격 Supabase DB에 `npx supabase db push --yes`로 마이그레이션 적용 완료
- 브라우저 증가/새로고침 중복 제한/목록 일관성 검증: 로컬 확인 필요 (DB는 반영됨)

## 2026-05-18 검색 기능 추가 (Ch10)

| 파일 | 변경 | 내용 |
|---|---|---|
| `lib/posts.ts` | 수정 | `getPosts(query?)` — Supabase `.or(ilike)` + 실습 글 클라이언트 필터 |
| `app/posts/page.tsx` | 수정 | `searchParams.q` 수신, 검색 폼 UI, 결과 건수 표시, 빈 상태 문구 분기 |

- 검색어는 `?q=` URL 파라미터로 전달, Server Component 내 `<form method="GET">`으로 처리
- `npm.cmd run build` 통과

## 2026-05-18 RLS 정책 적용 (Ch11)

| 파일 | 변경 | 내용 |
|---|---|---|
| `supabase/migrations/20260518090000_add_rls_policies.sql` | 신규 | `profiles`, `posts` 테이블 RLS 활성화 + SELECT/INSERT/UPDATE/DELETE 정책 |

- `profiles`: SELECT 공개, INSERT/UPDATE 본인(`auth.uid() = id`)
- `posts`: SELECT 공개, INSERT/UPDATE/DELETE 본인(`auth.uid() = user_id`)
- `post_reactions`, `post_comments`, `post_attachments`, `post_views` RLS는 각 테이블 마이그레이션에서 이미 적용
- `npx supabase db push --yes` 완료

## 2026-05-18 프로필 이미지 업로드 (Ch12)

| 파일 | 변경 | 내용 |
|---|---|---|
| `supabase/migrations/20260518100000_create_avatars_storage.sql` | 신규 | `avatars` 버킷(공개), Storage RLS(본인 폴더만 쓰기) |
| `lib/profiles.ts` | 수정 | `getProfile()`, `updateAvatarUrl()` 추가 |
| `components/AvatarUpload.tsx` | 신규 | 아바타 업로드 클라이언트 컴포넌트 (2MB 제한, 이미지 미리보기) |
| `app/mypage/page.tsx` | 수정 | AvatarUpload 렌더링 + `updateAvatarAction` Server Action |

- Storage path: `{userId}/avatar.{ext}`, `upsert: true`로 교체
- 공개 URL에 `?t=timestamp` 캐시버스터 적용
- `npx supabase db push --yes` 완료
- `npm.cmd run build` 통과

## 2026-05-18 통합 품질 점검 수정

좋아요/싫어요·댓글·파일 업로드·공유·조회수 전체 기능 코드 리뷰 후 3개 버그 수정.

| 파일 | 변경 | 내용 |
|---|---|---|
| `app/posts/[id]/page.tsx` | 수정 | `incrementViewAction`에서 `revalidatePath("/")`, `revalidatePath("/posts")` 제거; 반응/댓글 액션에서도 `revalidatePath("/")` 제거 |
| `lib/attachments.ts` | 수정 | `PostAttachment` 타입에 `storagePath` 필드 추가, `getAttachments()` 반환값에 포함 |
| `components/AttachmentManager.tsx` | 수정 | `getStoragePathFromPublicUrl()` URL 파싱 함수 제거, `attachment.storagePath` 직접 사용; `uploaded.push`에 `storagePath` 포함 |
| `lib/fileUpload.ts` | 수정 | `formatFileSize()` 유틸 함수 추가 및 export |
| `components/AttachmentList.tsx` | 수정 | 중복 `formatFileSize` 제거, `lib/fileUpload`에서 import |
| `components/FileUploadField.tsx` | 수정 | 중복 `formatFileSize` 제거, `lib/fileUpload`에서 import |

### 수정된 버그 요약

1. **revalidatePath 과다 호출**: `incrementViewAction`이 `/`와 `/posts` 캐시를 불필요하게 무효화해 조회할 때마다 홈+목록 전체 재렌더. → 조회수는 해당 상세 페이지만 invalidate. 반응/댓글 액션도 홈(`/`) invalidate 제거.

2. **PostAttachment storagePath 누락**: `PostAttachment` 타입에 `storagePath`가 없어 `AttachmentManager`가 공개 URL을 파싱해 Storage 경로를 추출하는 취약한 방법을 사용. → 타입에 필드 추가 및 직접 전달.

3. **formatFileSize 중복**: `AttachmentList.tsx`와 `FileUploadField.tsx` 두 곳에 동일한 함수 복사. → `lib/fileUpload.ts` 단일 출처로 통합.

### 플래그 항목 (수정하지 않음 — 별도 확인 필요)

- **검색 쿼리 인젝션**: `getPosts`에서 `query`를 `.or(`title.ilike.%${query}%,...`)` 문자열 보간으로 전달. `,`나 `)` 포함 쿼리가 PostgREST 파싱 오류 유발 가능. 범위 초과로 보류.
- **NewPostPage `ensureProfile` 누락**: 이메일 인증 직후 첫 글 작성 시 `profiles` 행이 없으면 FK violation 가능성. 범위 초과로 보류.
- **아바타 확장자 소문자 미처리**: `.PNG`같은 대문자 확장자가 그대로 path에 들어감. 범위 초과로 보류.

### 검증 결과

- `npm.cmd run build`: 통과

## 2026-05-18 최종 품질 검증 수정

전체 소스 코드 정적 분석 및 14개 항목 품질 점검 후 5개 항목 수정.

| 파일 | 변경 | 내용 |
|---|---|---|
| `lib/posts.ts` | 수정 | 검색 쿼리 내 `,` `)` `%` `_` 특수문자 이스케이프로 PostgREST `.or()` 파싱 오류 방지 |
| `app/posts/new/page.tsx` | 수정 | posts insert 전 `profiles` upsert 추가 — 이메일 인증 직후 FK violation 방지 |
| `components/AvatarUpload.tsx` | 수정 | 숨겨진 file input에 `aria-label` 추가 / 확장자 소문자 정규화 (`.PNG` → `.png`) |
| `components/AttachmentManager.tsx` | 수정 | 에러 메시지 `text-destructive`, 성공 메시지 `text-muted-foreground`로 색상 구분 |
| `components/AttachmentList.tsx` | 수정 | 첨부파일 링크에 `aria-label` 추가 (새 탭 열기 안내) |

### 검증 결과

- `npm run build`: Exit code 0 (TypeScript 오류 없음)

## 2026-05-19 작성자 표시 수정

- 문제: Supabase DB 글의 `author`가 항상 기본값 `작성자`로 매핑되어 목록/상세 화면에 `작성자: 작성자`처럼 표시됨.
- 수정:
  - `lib/posts.ts`에서 DB 글 요약 생성 시 `profiles.username`을 조회해 `post.author`에 반영.
  - 기존 글의 프로필 이름이 비어 있어도 로그인한 본인 글은 Auth 이름/이메일 앞부분으로 표시.
  - `lib/auth.ts`에서 로그인/회원가입 성공 시 프로필 이름을 upsert해 기존 글도 이후 실제 작성자명으로 표시되도록 보강.
  - `lib/profiles.ts`의 `ensureProfile()`이 선택적으로 `username`을 저장할 수 있게 확장.
  - `app/posts/new/page.tsx`에서 새 글 작성 전 프로필 upsert 시 회원가입 이름(`user_metadata.name`) 또는 이메일 앞부분을 `username`으로 저장.
- 검증:
  - `npm.cmd run build`: 통과
  - `npm.cmd run lint`: 통과

## 2026-05-19 홈 화면 UI 조정

- 문제: 홈 화면 최근 포스트 카드가 내용 대비 높고, `새 글 작성` 링크가 버튼처럼 덜 보이며, `전체 보기` 위치가 다소 떠 보임.
- 수정:
  - `app/page.tsx`에서 `새 글 작성` 링크를 secondary 버튼 스타일로 변경.
  - 최근 포스트 카드의 강제 빈 공간(`flex-1`)을 제거하고 카드 내부 여백과 설명 줄 수를 줄여 높이를 낮춤.
  - 최근 포스트 그리드에 `items-start`를 적용해 짧은 카드가 같은 행의 긴 카드 높이에 맞춰 늘어나지 않도록 수정.
  - `전체 보기` 링크는 사용자 선호에 따라 기존처럼 섹션 오른쪽의 파란 텍스트 링크로 유지.
- 검증:
  - `npm.cmd run lint`: 통과
  - `npm.cmd run build`: 통과

## 2026-05-19 홈 카드 수평 리듬 보정

- 문제: 최근 포스트 카드 2개의 글 길이가 달라 제목, 요약, 버튼의 세로 위치가 서로 달라 보임.
- 수정: `app/page.tsx`에서 카드 높이를 같은 행 기준으로 맞추고, 제목/요약은 2줄 기준 높이를 부여하며, `상세 보기` 버튼은 카드 하단에 정렬.
- 의도: 글 길이가 조금 달라도 두 카드의 날짜, 제목, 요약, 버튼 위치가 수평으로 맞아 자연스럽게 보이도록 함.
- 검증:
  - `npm.cmd run lint`: 통과
  - `npm.cmd run build`: 통과

## 2026-05-19 GitHub/Vercel 최신화

- 로컬 작업 트리는 코드 변경 없이 `origin/master`와 같은 커밋(`1505753 Refine home post cards`) 상태였음.
- 로컬 검증을 다시 수행해 현재 코드 기준 프로덕션 빌드와 lint 통과를 확인.
- Vercel CLI가 로컬에 설치되어 있지 않아 GitHub `master` push를 통해 Vercel Git 연동 배포를 트리거하는 방식으로 최신화를 진행.
- 검증:
  - `npm.cmd run build`: 통과
  - `npm.cmd run lint`: 통과
