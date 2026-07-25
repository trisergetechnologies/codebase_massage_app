import { Skeleton } from "../ui/Skeleton";

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-3.5 sm:p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-16" />
        <Skeleton className="mt-2 h-5 w-20" />
        <div className="mt-2.5 flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <Skeleton className="mt-3.5 h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
