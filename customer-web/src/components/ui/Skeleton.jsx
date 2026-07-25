export function Skeleton({ className = "", shimmer = true }) {
  return (
    <div
      className={`rounded-card-sm ${shimmer ? "shimmer" : "bg-surface-2"} ${className}`}
      aria-busy="true"
      aria-label="Loading…"
    />
  );
}

export function SkeletonCard({ lines = 2, className = "" }) {
  return (
    <div className={`space-y-3 rounded-card border border-border bg-surface p-4 ${className}`}>
      <Skeleton className="h-5 w-3/5" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? "w-2/5" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonOrderCard() {
  return <Skeleton className="h-[76px] w-full rounded-card-sm" />;
}

export function SkeletonServiceCard() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <Skeleton className="h-[120px] w-full rounded-none" />
      <div className="space-y-2 p-5">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-20 rounded-btn" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTracking() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[260px] w-full rounded-[20px] bg-forest-mid" shimmer={false} />
      <div className="space-y-3 rounded-card border border-border bg-surface p-5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
