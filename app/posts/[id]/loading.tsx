export default function PostDetailLoading() {
  return (
    <div
      className="rounded-lg border border-border p-6 shadow-sm"
      aria-label="포스트 상세를 불러오는 중"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-full max-w-2xl animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-24 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
