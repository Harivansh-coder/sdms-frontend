import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4">
        {Array(columns)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-8 flex-1" />
          ))}
      </div>
      {Array(rows)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array(columns)
              .fill(null)
              .map((_, j) => (
                <Skeleton key={j} className="h-12 flex-1" />
              ))}
          </div>
        ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
    </div>
  );
}
