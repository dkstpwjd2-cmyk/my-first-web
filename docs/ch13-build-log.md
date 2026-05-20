# Ch13 Build Log

명령:

```powershell
npm.cmd run build
```

결과:

```text
> my-first-web@0.1.0 build
> next build

▲ Next.js 16.2.1 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 4.0s
  Running TypeScript ...
  Finished TypeScript in 3.4s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/9) ...
  Generating static pages using 7 workers (2/9)
  Generating static pages using 7 workers (4/9)
  Generating static pages using 7 workers (6/9)
✓ Generating static pages using 7 workers (9/9) in 500ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ○ /login
├ ƒ /mypage
├ ƒ /posts
├ ƒ /posts/[id]
├ ƒ /posts/[id]/edit
├ ○ /posts/new
└ ○ /signup

ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

판정: 통과

