# My First Web — 개인 블로그

Next.js 16 App Router + Supabase로 만든 개인 블로그 프로젝트입니다.

- **배포 URL**: https://my-first-web-xi-seven.vercel.app
- **GitHub**: https://github.com/dkstpwjd2-cmyk/my-first-web

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.2.1 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| 백엔드 | Supabase (Auth, DB, Storage) |
| 배포 | Vercel |
| 테스트 | Playwright |

---

## 주요 기능

- **인증**: 이메일/비밀번호 회원가입 · 로그인 · 로그아웃
- **게시글 CRUD**: 작성 · 목록 · 상세 · 수정 · 삭제
- **보안**: Supabase RLS — 본인 글만 수정·삭제 가능 (DB 레벨 강제)
- **댓글**: 로그인 사용자만 작성 가능, 본인 댓글만 삭제 가능
- **반응**: 좋아요 / 싫어요 토글 (로그인 필요)
- **파일 첨부**: 이미지·문서 업로드 (최대 5MB, Supabase Storage)
- **검색**: 제목·내용 키워드 검색 (`?q=` 파라미터)
- **조회수**: 30분 중복 방지 (LocalStorage 기반)
- **마이페이지**: 프로필 아바타 업로드 · 작성 글 수 확인
- **공유**: Web Share API / 클립보드 fallback

---

## 라우트 보호 (미들웨어)

> **Next.js 16에서는 `middleware.ts` 대신 `proxy.ts`를 사용합니다.**  
> (`middleware.ts`와 `proxy.ts` 동시 존재 시 빌드 에러 발생)

`proxy.ts` 파일이 미들웨어 역할을 담당하며, 비로그인 사용자의 보호 경로 접근 시 `/login`으로 리다이렉트합니다.

```
보호 경로: /posts/new, /mypage
```

---

## 로컬 개발 환경 설정

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 입력

# 3. 개발 서버 실행
npm run dev
```

---

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 테스트

```bash
# E2E 테스트 (Playwright)
npx playwright test
```

테스트 계정은 `.env.test`의 `TEST_EMAIL`, `TEST_PASSWORD`로 설정합니다.

---

## 데이터베이스 마이그레이션

`supabase/migrations/` 폴더에 모든 DDL 및 RLS 정책 SQL이 포함되어 있습니다.
