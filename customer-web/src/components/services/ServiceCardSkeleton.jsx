import { Skeleton } from "../ui/Skeleton";

export function ServiceCardSkeleton({ featured = false }) {
  return (
    <div
      className={`rounded-2xl bg-white ring-1 ring-border/70 ${
        featured ? "p-7" : "p-6"
      }`}
    >
      <Skeleton className={`${featured ? "h-8 w-2/3" : "h-6 w-3/5"}`} />
      <Skeleton className="mt-3 h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-28" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <Skeleton className={`mt-6 w-full rounded-xl ${featured ? "h-12" : "h-11"}`} />
    </div>
  );
}
