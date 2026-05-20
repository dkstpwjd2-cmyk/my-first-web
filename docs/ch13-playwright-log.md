# Ch13 Playwright Log

명령:

```powershell
npm.cmd run test:e2e
```

결과:

```text
> my-first-web@0.1.0 test:e2e
> playwright test

Running 2 tests using 2 workers

  -  2 [chromium] › tests\auth-crud.spec.ts:3:5 › 행복 경로: 로그인 후 새 포스트를 작성한다
  ok 1 [chromium] › tests\auth-crud.spec.ts:33:5 › 거절 경로: 비로그인 사용자의 새 포스트 작성 접근을 로그인으로 보낸다 (840ms)

  1 skipped
  1 passed (2.6s)
```

판정:

| 테스트 | 판정 | 비고 |
|---|---|---|
| 행복 경로 | 확인 필요 | `TEST_EMAIL`, `TEST_PASSWORD` 환경변수가 없어 skip |
| 거절 경로 | 통과 | 비로그인 `/posts/new` 접근 시 `/login` 이동 확인 |

