import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  accent?: "default" | "violet" | "blue" | "amber" | "green";
}

const ACCENT_CLASSES = {
  default: {
    icon: "bg-gray-100 text-gray-500",
    value: "text-text-primary",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    value: "text-text-primary",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    value: "text-text-primary",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    value: "text-text-primary",
  },
  green: {
    icon: "bg-green-50 text-green-600",
    value: "text-text-primary",
  },
};

export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  accent = "default",
}: KpiCardProps) {
  const colors = ACCENT_CLASSES[accent];

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-surface p-5",
        "transition-shadow duration-200 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className={cn("text-3xl font-semibold tracking-tight", colors.value)}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-text-muted">{description}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", colors.icon)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
