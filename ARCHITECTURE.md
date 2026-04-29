# ARCHITECTURE.md — my-first-web 설계 문서

> **목적**: 이 문서는 my-first-web 개인 블로그 프로젝트의 전체 설계를 한 곳에 모아둔다.  
> Ch8 이후 Copilot에게 `#file:ARCHITECTURE.md`로 제공하면 프로젝트 전체 구조를 한눈에 파악하고 작업할 수 있다.

---

## 1. 프로젝트 목표

- **목표**: 개인 일상·학습 기록을 위한 미니멀 개인 블로그를 구축한다.
- **독자**: 블로그 방문자(비로그인)는 글을 읽을 수 있고, 작성자(로그인)는 글을 쓰고 관리할 수 있다.
- **기술 스택**: Next.js 16.2.1 App Router + React 19.2.4 + Tailwind CSS 4 + shadcn/ui + Supabase(예정)

---

## 2. 페이지 맵 (Page Map)

```
홈 (/)
├── 포스트 목록 (/posts)
│   ├── 포스트 상세 (/posts/[id])
│   └── 포스트 작성 (/posts/new)
├── 로그인 (/login)
├── 회원가입 (/signup)
└── 마이페이지 (/mypage)
```

### 페이지별 URL & 파일 구조

| 페이지       | URL              | 파일 경로                        | 접근 권한          |
|-------------|-----------------|-----------------------------------|--------------------|
| 홈           | `/`              | `app/page.tsx`                   | 모두               |
| 포스트 목록  | `/posts`         | `app/posts/page.tsx`             | 모두               |
| 포스트 상세  | `/posts/[id]`    | `app/posts/[id]/page.tsx`        | 모두               |
| 포스트 작성  | `/posts/new`     | `app/posts/new/page.tsx`         | 로그인 필요        |
| 로그인       | `/login`         | `app/login/page.tsx`             | 비로그인만         |
| 회원가입     | `/signup`        | `app/signup/page.tsx`            | 비로그인만         |
| 마이페이지   | `/mypage`        | `app/mypage/page.tsx`            | 로그인 필요        |

---

## 3. AI 와이어프레임 (Wireframe)

> Copilot Vision(AI 이미지 생성)으로 생성한 페이지 레이아웃 초안.  
> 스케치 단계에서 화면 구조와 컴포넌트 배치를 시각화하기 위해 사용했다.

### 3.1 홈 페이지 (`/`)

**포함 요소**:
- 상단 네비게이션 바: 로고(좌), 포스트 목록·마이페이지 링크(중앙), 로그인 버튼(우)
- 히어로 섹션: 블로그 소개 제목 + 부제목 + "포스트 보러가기" CTA 버튼
- 포스트 카드 2열 그리드 (md 이상): 카테고리 배지, 제목, 요약, 작성자/날짜, "상세 보기" 버튼
- 하단 푸터: 저작권 텍스트

```
┌─────────────────────────────────────────────────┐
│  My First Web    [포스트 목록] [마이페이지]  [로그인] │ ← Navigation
├─────────────────────────────────────────────────┤
│                                                 │
│       안녕하세요, 제 블로그입니다               │ ← Hero
│       일상·학습·운동을 기록합니다              │
│       [포스트 보러가기]                         │
│                                                 │
├───────────────────┬─────────────────────────────┤
│ [일상] 2026-03-25 │ [운동] 2026-03-20           │ ← Card Grid
│ 첫 번째 포스트    │ 운동을 꾸준히 하는 법       │   (md:grid-cols-2)
│ 블로그를 시작하며 │ 바쁜 일상 속에서도...       │
│ [상세 보기]       │ [상세 보기]                 │
└───────────────────┴─────────────────────────────┘
│              © 2026 My First Web                │ ← Footer
└─────────────────────────────────────────────────┘
```

### 3.2 포스트 작성 페이지 (`/posts/new`)

**포함 요소**:
- 중앙 정렬 단일 카드 폼 (max-w-4xl)
- 제목 `<Input>` + 카테고리 `<Input>` + 내용 `<Textarea>`
- 하단 버튼 행: "저장하기" (primary) + "취소" (outline)

```
┌─────────────────────────────────────────────────┐
│  My First Web    [포스트 목록] [마이페이지]  [로그인] │ ← Navigation
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ 포스트 작성                               │  │ ← Card
│  │ 제목과 내용을 입력하면 목록에 추가됩니다  │  │
│  │ ─────────────────────────────────────── │  │
│  │ 제목                                      │  │
│  │ [____________________________________]   │  │ ← Input
│  │ 카테고리                                  │  │
│  │ [____________________________________]   │  │ ← Input
│  │ 내용                                      │  │
│  │ [                                      ]  │  │
│  │ [           Textarea                   ]  │  │ ← Textarea
│  │ [                                      ]  │  │
│  │                                           │  │
│  │ [저장하기]  [취소]                        │  │ ← Buttons
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 4. 유저 플로우 (User Flow)

### 4.1 글 읽기 흐름 (비로그인)

```
홈 (/) → 포스트 목록 (/posts) → 포스트 상세 (/posts/[id])
```

- 홈에서 "포스트 목록"으로 이동
- 카드 목록에서 원하는 글의 "상세 보기" 클릭
- 포스트 상세 페이지에서 본문 읽기

### 4.2 글 작성 흐름 (로그인 필요)

```
포스트 목록 (/posts)
  → "새 포스트 작성" 클릭
  → [비로그인이면] 로그인 페이지 (/login) 리다이렉트
    → 이메일 로그인
    → 포스트 작성 (/posts/new) 으로 복귀
  → [로그인 상태면] 포스트 작성 (/posts/new)
    → 제목 + 내용 입력 후 제출
    → 포스트 상세 (/posts/[id]) 로 이동
```

### 4.3 마이페이지 확인 흐름 (로그인 필요)

```
네비게이션 "마이페이지" 클릭
  → [비로그인이면] 로그인 페이지 (/login) 리다이렉트
  → [로그인 상태면] 마이페이지 (/mypage)
    → 프로필 정보 + 작성 포스트 수 확인
    → "포스트 보러가기" 클릭 → 포스트 목록 (/posts)
```

---

## 5. 컴포넌트 계층 (Component Hierarchy)

### 5.1 전역 레이아웃

```
app/layout.tsx
├── <Navigation />         → components/Navigation.tsx
│   ├── Logo (Link to /)
│   ├── NavLinks (포스트 목록, 마이페이지)
│   └── AuthButtons (로그인 / 로그아웃)
├── <main>                 → 각 페이지 콘텐츠 (max-w-4xl mx-auto p-6)
└── <footer>               → 간단한 저작권 텍스트
```

### 5.2 페이지별 컴포넌트

#### 홈 (`/`)
```
app/page.tsx
└── <Card> × N             → 라우트 바로가기 카드 목록
    ├── <CardHeader>
    │   ├── <CardTitle>
    │   └── <CardDescription>
    └── <CardContent>
        └── <Button asChild> → <Link>
```

#### 포스트 목록 (`/posts`)
```
app/posts/page.tsx
├── 헤더 섹션
│   ├── 제목 + 설명
│   └── <Button asChild> "새 포스트 작성" → Link /posts/new
└── <Card> × N (grid md:grid-cols-2)
    ├── <CardHeader>
    │   ├── 카테고리 Badge + 날짜
    │   ├── <CardTitle>
    │   └── <CardDescription> 요약
    ├── <CardContent> 작성자
    └── <CardFooter>
        └── <Button variant="outline"> "상세 보기" → Link /posts/[id]
```

#### 포스트 상세 (`/posts/[id]`)
```
app/posts/[id]/page.tsx
├── <Card>
│   ├── <CardHeader> 제목 + 메타(작성자, 날짜, 카테고리)
│   └── <CardContent> 본문
├── <Button variant="outline"> "목록으로"
└── <Button variant="destructive"> "삭제" → <Dialog> 확인
    └── <Dialog>
        ├── <DialogHeader> "정말 삭제할까요?"
        └── <DialogFooter>
            ├── <Button variant="outline"> 취소
            └── <Button variant="destructive"> 삭제 확인 → Server Action
```

#### 포스트 작성 (`/posts/new`)
```
app/posts/new/page.tsx
└── <Card>
    ├── <CardHeader> "새 포스트 작성"
    └── <CardContent>
        └── <form> (Server Action)
            ├── <Input> 제목
            ├── <Textarea> 내용
            └── <Button type="submit"> 저장
```

#### 로그인 (`/login`)
```
app/login/page.tsx
└── <Card>
    ├── <CardHeader> "로그인"
    └── <CardContent>
        └── <form>
            ├── <Input type="email"> 이메일
            ├── <Input type="password"> 비밀번호
            └── <Button type="submit"> 로그인
```

#### 회원가입 (`/signup`)
```
app/signup/page.tsx
└── <Card>
    ├── <CardHeader> "회원가입"
    └── <CardContent>
        └── <form>
            ├── <Input type="email"> 이메일
            ├── <Input> 사용자 이름
            ├── <Input type="password"> 비밀번호
            ├── <Input type="password"> 비밀번호 확인
            └── <Button type="submit"> 가입하기
```

#### 마이페이지 (`/mypage`)
```
app/mypage/page.tsx
├── <Card> 프로필
│   ├── <CardHeader>
│   └── <CardContent> 이름, 이메일, 관심사
└── <Card> 활동 요약
    ├── <CardHeader>
    └── <CardContent>
        ├── 작성 포스트 수 (숫자 강조)
        └── <Button> "포스트 보러가기" → Link /posts
```

### 5.3 shadcn/ui 컴포넌트 사용 위치 요약

| 컴포넌트    | 사용 위치                                              |
|------------|-------------------------------------------------------|
| `Button`   | 모든 페이지 — 네비게이션, 폼 제출, 삭제, 이동         |
| `Card`     | 포스트 목록, 포스트 상세, 홈, 로그인, 마이페이지       |
| `Input`    | 로그인, 회원가입, 포스트 작성(제목)                    |
| `Textarea` | 포스트 작성(본문)                                      |
| `Dialog`   | 포스트 상세 — 삭제 확인                               |

---

## 6. 데이터 모델 (Database Schema)

> Ch8 Supabase 연결을 위한 사전 설계. 현재는 `lib/posts.ts` 인메모리 데이터를 사용.

### 6.1 테이블 구조

#### `profiles` (사용자 프로필)
Supabase Auth의 `auth.users`와 1:1 연동.

| 컬럼          | 타입          | 제약                               | 설명                  |
|--------------|--------------|------------------------------------|-----------------------|
| `id`         | `uuid`       | PK, FK → auth.users.id            | 사용자 고유 ID         |
| `username`   | `text`       | NOT NULL                          | 표시 이름              |
| `avatar_url` | `text`       | NULLABLE                          | 프로필 이미지 URL      |
| `role`       | `text`       | DEFAULT `'user'`                  | 역할 (`user`/`admin`) |
| `created_at` | `timestamptz`| DEFAULT `now()`                   | 가입일시               |

#### `posts` (블로그 포스트)

| 컬럼          | 타입          | 제약                               | 설명                  |
|--------------|--------------|------------------------------------|-----------------------|
| `id`         | `uuid`       | PK, DEFAULT `gen_random_uuid()`   | 포스트 고유 ID         |
| `user_id`    | `uuid`       | FK → profiles.id, NOT NULL        | 작성자                 |
| `title`      | `text`       | NOT NULL                          | 제목                   |
| `content`    | `text`       | NOT NULL                          | 본문                   |
| `category`   | `text`       | NULLABLE                          | 카테고리               |
| `excerpt`    | `text`       | NULLABLE                          | 요약 (목록 표시용)     |
| `created_at` | `timestamptz`| DEFAULT `now()`                   | 작성일시               |
| `updated_at` | `timestamptz`| DEFAULT `now()`                   | 수정일시               |

### 6.2 테이블 관계

```
profiles (1) ──────── (N) posts
  id         ←──── user_id
```

- 한 명의 사용자(profiles)가 여러 개의 포스트(posts)를 작성할 수 있다 → **1:N 관계**
- `posts.user_id`가 `profiles.id`를 참조한다 (외래 키)

### 6.3 Supabase RLS 정책 (Ch11 예정)

| 테이블    | 작업     | 허용 조건                        |
|----------|---------|----------------------------------|
| `posts`  | SELECT  | 모두 (비로그인 포함)             |
| `posts`  | INSERT  | 로그인한 사용자 (`auth.uid()`)   |
| `posts`  | UPDATE  | 작성자 본인 (`user_id = auth.uid()`) |
| `posts`  | DELETE  | 작성자 본인 또는 admin 역할      |

---

## 7. 디자인 토큰 요약

> 자세한 값은 `app/globals.css` 참조. `copilot-instructions.md`의 Design Tokens 섹션과 동일.

| 토큰              | 용도                          |
|------------------|-------------------------------|
| `--background`   | 페이지 배경 (밝은 블루-화이트) |
| `--foreground`   | 기본 글자색 (다크 블루-그레이) |
| `--primary`      | 버튼 강조, 포인트 색상         |
| `--muted`        | 배경 보조, 비활성 영역         |
| `--border`       | 카드·입력창 테두리             |
| `--radius`       | 둥근 정도 (0.625rem 기준)      |

---

## 8. 향후 계획 (Ch8~12)

| 챕터  | 작업 내용                                      |
|------|------------------------------------------------|
| Ch8  | Supabase 연결, profiles/posts 테이블 생성, CRUD |
| Ch9  | Supabase Auth 이메일 로그인/회원가입            |
| Ch10 | 포스트 수정, 검색·필터 기능                     |
| Ch11 | RLS 정책 적용, 역할 기반 접근 제어              |
| Ch12 | 댓글, 이미지 업로드 (Supabase Storage)          |
