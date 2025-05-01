import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "ACCEPTED"
  | "COMPLETED"
  | "CANCELLED"
  | "ASSIGNED"
  | "REJECTED"
  | "IN_PROGRESS";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  COMPLETED: {
    label: "COMPLETED",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  ASSIGNED: {
    label: "Assigned",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  ACTIVE: {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-normal", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
