# Ch13 Vercel Check Log

## 배포 URL

Production URL: https://my-first-web-xi-seven.vercel.app

최신 확인 Deployment: https://my-first-r1k1r6hbx-dkstpwjd2-2207s-projects.vercel.app

## Vercel 배포 목록 확인

명령:

```powershell
npx.cmd vercel@latest ls
```

주요 결과:

```text
Deployments for dkstpwjd2-2207s-projects/my-first-web

Age   Project                               Deployment                                                     Status   Environment   Duration
35m   dkstpwjd2-2207s-projects/my-first-web https://my-first-r1k1r6hbx-dkstpwjd2-2207s-projects.vercel.app ● Ready  Production    30s
```

판정: 최신 Production 배포 Ready

## Vercel 환경변수 이름 확인

명령:

```powershell
npx.cmd vercel@latest env ls
```

결과:

```text
name                            value       environments   created
VERCEL_OIDC_TOKEN               Encrypted   Production     16d ago
NEXT_PUBLIC_SUPABASE_URL        Encrypted   Production     16d ago
NEXT_PUBLIC_SUPABASE_ANON_KEY   Encrypted   Production     16d ago
```

판정: 필수 환경변수 이름은 등록됨. 실제 값 일치 여부는 Vercel 대시보드 확인 필요.

## 배포 URL HTTP 확인

명령:

```powershell
$urls = @(
  'https://my-first-web-xi-seven.vercel.app/',
  'https://my-first-web-xi-seven.vercel.app/posts',
  'https://my-first-web-xi-seven.vercel.app/posts/new'
)
foreach ($url in $urls) {
  Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 0
}
```

결과:

```text
https://my-first-web-xi-seven.vercel.app/ -> 200
https://my-first-web-xi-seven.vercel.app/posts -> 200
https://my-first-web-xi-seven.vercel.app/posts/new -> 307
```

판정:

| 시나리오 | 결과 | 판정 |
|---|---|---|
| 홈 접속 | 200 | 통과 |
| 포스트 목록 접속 | 200 | 통과 |
| 비로그인 `/posts/new` 접근 | 307 | 통과 |
| 로그인 | 브라우저 + 테스트 계정 필요 | 확인 필요 |
| 글 작성 | 브라우저 + 테스트 계정 필요 | 확인 필요 |
| 로그아웃 | 브라우저 + 테스트 계정 필요 | 확인 필요 |

