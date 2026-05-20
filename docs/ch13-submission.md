# Ch13 과제 제출 자료

## 1. GitHub 저장소 URL

https://github.com/dkstpwjd2-cmyk/my-first-web

## 2. Vercel 배포 URL

Production URL: https://my-first-web-xi-seven.vercel.app

최신 확인 Deployment: https://my-first-r1k1r6hbx-dkstpwjd2-2207s-projects.vercel.app

## 3. 검증 보고서 Markdown

검증 보고서 파일: `docs/ch13-validation-report.md`

## 4. Playwright 테스트 실행 결과 로그

로그 파일: `docs/ch13-playwright-log.md`

요약:

| 테스트 | 결과 |
|---|---|
| 행복 경로: 로그인 후 새 포스트 작성 | 확인 필요 (`TEST_EMAIL`, `TEST_PASSWORD` 없음으로 skip) |
| 거절 경로: 비로그인 `/posts/new` 접근 | 통과 |

## 5. `npm run build` 성공 결과 로그

로그 파일: `docs/ch13-build-log.md`

요약: `npm.cmd run build` 통과, Next.js 16.2.1 production build 성공.

## 6. 보안 grep 3개 실행 결과 로그

로그 파일: `docs/ch13-security-grep-log.md`

요약:

| 점검 | 결과 |
|---|---|
| 민감 키 (`service_role`, `SUPABASE_SERVICE_ROLE`, `sb_secret_`, `sbp_`) | 출력 없음 |
| 구버전 라우터/API (`next/router`, `auth.signIn(`) | 출력 없음 |
| XSS 위험 (`dangerouslySetInnerHTML`, `eval(`) | 출력 없음 |

## 7. Vercel 배포 URL 핵심 시나리오 결과

로그 파일: `docs/ch13-vercel-check-log.md`

| 시나리오 | 결과 | 판정 |
|---|---|---|
| 홈 접속 | `/` → 200 | 통과 |
| 포스트 목록 접속 | `/posts` → 200 | 통과 |
| 비로그인 `/posts/new` 접근 | `/posts/new` → 307 | 통과 |
| 로그인 | 테스트 계정으로 브라우저 확인 필요 | 직접 확인 |
| 글 작성 | 테스트 계정으로 브라우저 확인 필요 | 직접 확인 |
| 로그아웃 | 테스트 계정으로 브라우저 확인 필요 | 직접 확인 |

## 직접 해야 하는 확인

아래 항목은 계정 정보와 대시보드 눈검증이 필요해서 직접 확인해야 한다.

- [ ] Vercel 대시보드에서 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값이 Supabase 프로젝트와 같은지 확인
- [ ] Supabase Authentication → URL Configuration에서 localhost URL과 Vercel URL 확인
- [ ] Vercel 배포 URL에서 테스트 계정으로 로그인
- [ ] Vercel 배포 URL에서 글 작성
- [ ] Vercel 배포 URL에서 로그아웃
- [ ] 필요하면 `TEST_EMAIL`, `TEST_PASSWORD` 환경변수 설정 후 `npm.cmd run test:e2e` 재실행

