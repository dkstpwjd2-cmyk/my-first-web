export default function PostsLoading() {
  return (
    <div className="space-y-6" aria-label="포스트 목록을 불러오는 중">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-44 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
      </section>

      <div className="flex flex-wrap gap-2">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-16 animate-pulse rounded-md bg-muted" />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="min-h-48 rounded-lg border border-border p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-4/5 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
