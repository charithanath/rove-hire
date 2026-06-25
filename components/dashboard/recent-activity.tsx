import Link from "next/link";
import {
  UserPlus,
  FileText,
  CalendarDays,
  CheckCircle,
  FileOutput,
  TrendingUp,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TimelineEventType } from "@prisma/client";
import type { getRecentActivity } from "@/lib/dashboard";

type ActivityEvent = Awaited<ReturnType<typeof getRecentActivity>>[number];

interface RecentActivityProps {
  events: ActivityEvent[];
}

// ── Event metadata ────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<
  TimelineEventType,
  {
    label: (payload: Record<string, unknown>) => string;
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    bgClass: string;
  }
> = {
  CANDIDATE_CREATED: {
    label: () => "Added to pipeline",
    icon: UserPlus,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  FORM_SUBMITTED: {
    label: () => "Submitted application form",
    icon: FileText,
    iconClass: "text-indigo-600",
    bgClass: "bg-indigo-50",
  },
  INTERVIEW_SCHEDULED: {
    label: (p) =>
      p.interviewType
        ? `${p.interviewType === "TECHNICAL" ? "Technical" : "Screening"} interview scheduled`
        : "Interview scheduled",
    icon: CalendarDays,
    iconClass: "text-violet-600",
    bgClass: "bg-violet-50",
  },
  INTERVIEW_COMPLETED: {
    label: (p) =>
      p.recommendation
        ? `Interview completed · ${String(p.recommendation).replace("_", " ")}`
        : "Interview completed",
    icon: CheckCircle,
    iconClass: "text-green-600",
    bgClass: "bg-green-50",
  },
  OFFER_GENERATED: {
    label: () => "Offer documents generated",
    icon: FileOutput,
    iconClass: "text-amber-600",
    bgClass: "bg-amber-50",
  },
  STATUS_CHANGED: {
    label: (p) =>
      p.to ? `Status moved to ${String(p.to).replace("_", " ")}` : "Status updated",
    icon: TrendingUp,
    iconClass: "text-gray-500",
    bgClass: "bg-gray-100",
  },
  CANDIDATE_HIRED: {
    label: () => "Marked as hired 🎉",
    icon: UserCheck,
    iconClass: "text-green-600",
    bgClass: "bg-green-50",
  },
  CANDIDATE_REJECTED: {
    label: () => "Application rejected",
    icon: UserX,
    iconClass: "text-red-500",
    bgClass: "bg-red-50",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function RecentActivity({ events }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary">
          Recent Activity
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Latest events across all candidates
        </p>
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-text-muted">
          No activity yet
        </div>
      ) : (
        <div className="px-5 py-4">
          <ol className="space-y-0" aria-label="Recent activity">
            {events.map((event, index) => (
              <ActivityItem
                key={event.id}
                event={event}
                isLast={index === events.length - 1}
              />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function ActivityItem({
  event,
  isLast,
}: {
  event: ActivityEvent;
  isLast: boolean;
}) {
  const config = EVENT_CONFIG[event.eventType];
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  const Icon = config.icon;

  return (
    <li className="flex gap-3">
      {/* Icon + connector line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
            config.bgClass
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", config.iconClass)} aria-hidden="true" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-border mt-1 mb-1" aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      <div className={cn("min-w-0 flex-1 pb-4", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/candidates/${event.candidate.id}`}
              className="text-sm font-medium text-text-primary hover:text-accent transition-colors truncate block"
            >
              {event.candidate.name}
            </Link>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {config.label(payload)}
              {event.actorName && (
                <span className="text-text-disabled"> · {event.actorName}</span>
              )}
            </p>
          </div>
          <time
            className="shrink-0 text-xs text-text-muted tabular-nums"
            dateTime={event.createdAt.toISOString()}
          >
            {formatRelative(event.createdAt)}
          </time>
        </div>
      </div>
    </li>
  );
}
