import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType =
  | "available"
  | "busy"
  | "offline"
  | "pending"
  | "completed"
  | "failed"
  | "in-progress";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: {
    label: "Available",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  busy: {
    label: "Busy",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  offline: {
    label: "Offline",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  pending: {
    label: "Pending",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  "in-progress": {
    label: "In Progress",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.offline;

  return (
    <Badge
      variant="outline"
      className={cn("font-normal", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
