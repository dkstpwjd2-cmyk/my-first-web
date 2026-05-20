# Ch13 최종 검증 보고서

- 검증일: 2026-05-20
- GitHub 저장소: https://github.com/dkstpwjd2-cmyk/my-first-web
- Production URL: https://my-first-web-xi-seven.vercel.app
- 최신 확인 Deployment: https://my-first-r1k1r6hbx-dkstpwjd2-2207s-projects.vercel.app

## 환경 확인

| 항목 | 결과 | 판정 |
|---|---:|---|
| `npx.cmd supabase --version` | 2.100.1 | 통과 |
| `npx.cmd supabase projects list` | `my-first-web` / `qxgutxeaolqbkjsfymiu` / Northeast Asia (Seoul) / LINKED | 통과 |
| `npx.cmd vercel@latest --version` | 54.2.0 | 통과 |
| `npx.cmd vercel@latest ls` | 최신 Production 배포 `Ready` | 통과 |
| `npx.cmd vercel@latest env ls` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록 확인 | 값 일치 여부는 대시보드 확인 필요 |
| `npx.cmd vercel@latest logs` | `/`, `/posts`, `/login`, `/posts/new` 등 최근 200/307 로그 확인 | 통과 |
| `npm.cmd run build` | Exit code 0 | 통과 |
| `npm.cmd run lint` | Exit code 0 | 통과 |
| `npm.cmd audit --omit=dev` | 9 vulnerabilities (6 moderate, 3 high) | 확인 필요 |

## Playwright E2E

| 테스트 | 결과 | 비고 |
|---|---|---|
| 행복 경로: 로그인 후 새 포스트 작성 | 확인 필요 | `TEST_EMAIL`, `TEST_PASSWORD` 환경변수가 없어 skip |
| 거절 경로: 비로그인 `/posts/new` 접근 | 통과 | `/login` 이동 및 로그인 폼 표시 확인 |

- 테스트 파일: `tests/auth-crud.spec.ts`
- 실행 명령: `npm.cmd run test:e2e`
- 최종 결과: 1 passed, 1 skipped
- 수정한 실패: 최초 실행에서 `CardTitle`을 heading role로 가정해 실패했다. 현재 UI 구조에 맞춰 로그인 폼의 `이메일`, `비밀번호` label 확인으로 변경 후 통과했다.

## 보안/코드리뷰 스캔

| 점검 | 명령 | 결과 | 판정 |
|---|---|---|---|
| 민감 키 노출 | `git grep -nE "service_role|SUPABASE_SERVICE_ROLE|sb_secret_|sbp_" -- "app/**" "lib/**" "components/**" "contexts/**" "proxy.ts"` | 출력 없음 | 통과 |
| 구버전 라우터/API | `git grep -nE "next/router|auth\.signIn\(" -- "app/**" "lib/**" "components/**" "contexts/**"` | 출력 없음 | 통과 |
| XSS 위험 패턴 | `git grep -nE "dangerouslySetInnerHTML|eval\(" -- "app/**" "components/**"` | 출력 없음 | 통과 |
| `onAuthStateChange` cleanup | `contexts/AuthContext.tsx` | `subscription.unsubscribe()` 확인 | 통과 |
| App Router 구조 | `app/`, `proxy.ts` | `pages/`, `middleware.ts` 없음 | 통과 |

`npm audit --omit=dev`는 `next`, `postcss`, `fast-uri`, `hono`, `picomatch`, `ws` 등에서 취약점을 보고했다. 자동 수정 일부는 Next.js를 교재 기준 `16.2.1` 밖으로 올릴 수 있으므로 이번 Ch13 실습에서는 버전을 변경하지 않고 확인 필요로 남겼다.

## 배포 URL 검증

| 시나리오 | 결과 | 판정 |
|---|---|---|
| Production 홈 접속 | `https://my-first-web-xi-seven.vercel.app/` → 200 | 통과 |
| Production 목록 접속 | `/posts` → 200 | 통과 |
| Production 비로그인 `/posts/new` 접근 | `/posts/new` → 307 | 통과 |
| Production 로그인 | 테스트 계정으로 브라우저 확인 필요 | 확인 필요 |
| Production 글 작성 | 테스트 계정으로 브라우저 확인 필요 | 확인 필요 |
| Production 로그아웃 | 테스트 계정으로 브라우저 확인 필요 | 확인 필요 |
| Supabase URL Configuration | localhost/Vercel URL을 대시보드에서 눈으로 확인 필요 | 확인 필요 |

## 남은 확인 필요 항목

| 항목 | 이유 |
|---|---|
| `TEST_EMAIL`, `TEST_PASSWORD` 기반 행복 경로 E2E 실행 | 현재 `.env.local`에는 테스트 계정 변수가 없음 |
| RLS 다른 사용자 수정/삭제 차단 재검증 | Ch13 세션에서 사용자 A/B 계정 교차 브라우저 테스트는 미실행 |
| Vercel env 실제 값과 Supabase URL Configuration | CLI는 이름과 적용 대상만 보여주며 실제 값은 Encrypted |
| npm audit 취약점 처리 방향 | 보안 업데이트와 교재 고정 버전 정책 사이의 결정 필요 |
| 제출용 스크린샷 | Playwright/빌드/grep/배포 수동 검증 캡처는 사람이 제출용으로 저장 필요 |
