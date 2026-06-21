import { Skeleton } from "../ui/Skeleton";

export function MetricCard({ label, value, subtext, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-white px-5 py-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-16" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {subtext ? <p className="mt-1 text-sm text-muted">{subtext}</p> : null}
    </div>
  );
}
