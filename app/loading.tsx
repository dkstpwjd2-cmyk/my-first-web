export default function Loading() {
  return (
    <div className="space-y-6" aria-label="페이지를 불러오는 중">
      <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full max-w-lg animate-pulse rounded-md bg-muted" />
      <div className="rounded-lg border border-border p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
