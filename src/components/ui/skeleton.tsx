import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export function CardSkeleton({
  count = 1,
  className,
  ...props
}: { count?: number } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-40" />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 1,
  columns = 1,
  className,
  ...props
}: { rows?: number; columns?: number } & React.ComponentProps<"div">) {
  return (
    <div className={cn("grid grid-cols-1 gap-4", className)} {...props}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 gap-4">
          {Array.from({ length: columns }, (_, columnIndex) => (
            <Skeleton key={columnIndex} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

export { Skeleton };
