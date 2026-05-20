# Ch13 Security Grep Log

## 1. 민감 키 grep

명령:

```powershell
git grep -nE "service_role|SUPABASE_SERVICE_ROLE|sb_secret_|sbp_" -- "app/**" "lib/**" "components/**" "contexts/**" "proxy.ts"
```

결과:

```text
출력 없음
```

판정: 통과

## 2. 구버전 라우터/API grep

명령:

```powershell
git grep -nE "next/router|auth\.signIn\(" -- "app/**" "lib/**" "components/**" "contexts/**"
```

결과:

```text
출력 없음
```

판정: 통과

## 3. XSS 위험 grep

명령:

```powershell
git grep -nE "dangerouslySetInnerHTML|eval\(" -- "app/**" "components/**"
```

결과:

```text
출력 없음
```

판정: 통과

