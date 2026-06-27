import {
  UserPlus,
  FileText,
  CalendarDays,
  CheckCircle,
  FileOutput,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TimelineEventType } from "@prisma/client";
import type { CandidateProfileData } from "@/lib/candidates";

type TimelineEvent = CandidateProfileData["timelineEvents"][number];

const EVENT_CONFIG: Record<
  TimelineEventType,
  {
    label: (p: Record<string, unknown>) => string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
  }
> = {
  CANDIDATE_CREATED: {
    label: (p) => `Added to pipeline${p.jobTitle ? ` · ${p.jobTitle}` : ""}`,
    icon: UserPlus,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  FORM_SUBMITTED: {
    label: () => "Submitted application form",
    icon: FileText,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  INTERVIEW_SCHEDULED: {
    label: (p) => {
      const type = p.interviewType === "TECHNICAL" ? "Technical" : "Screening";
      return `${type} interview scheduled${p.interviewerName ? ` with ${p.interviewerName}` : ""}`;
    },
    icon: CalendarDays,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  INTERVIEW_COMPLETED: {
    label: (p) => {
      const rec = p.recommendation
        ? String(p.recommendation).replace("_", " ")
        : null;
      return `Interview completed${rec ? ` · ${rec}` : ""}`;
    },
    icon: CheckCircle,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  OFFER_GENERATED: {
    label: (p) =>
      p.roleTitle ? `Offer generated for ${p.roleTitle}` : "Offer documents generated",
    icon: FileOutput,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  STATUS_CHANGED: {
    label: (p) =>
      p.to ? `Status changed to ${String(p.to).replace("_", " ")}` : "Status updated",
    icon: TrendingUp,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
  },
  CANDIDATE_HIRED: {
    label: () => "Marked as hired 🎉",
    icon: UserCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  CANDIDATE_REJECTED: {
    label: (p) =>
      p.reason ? `Rejected · ${p.reason}` : "Application rejected",
    icon: UserX,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
};

interface CandidateTimelineProps {
  events: TimelineEvent[];
}

export function CandidateTimeline({ events }: CandidateTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4">No timeline events yet.</p>
    );
  }

  return (
    <ol className="space-y-0" aria-label="Candidate activity timeline">
      {events.map((event, index) => {
        const config  = EVENT_CONFIG[event.eventType];
        const payload = (event.payload ?? {}) as Record<string, unknown>;
        const Icon    = config.icon;
        const isLast  = index === events.length - 1;

        return (
          <li key={event.id} className="flex gap-3">
            {/* Icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  config.iconBg
                )}
              >
                <Icon
                  className={cn("h-3.5 w-3.5", config.iconColor)}
                  aria-hidden="true"
                />
              </div>
              {!isLast && (
                <div
                  className="w-px flex-1 bg-border mt-1 mb-1 min-h-[16px]"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("min-w-0 flex-1 pb-4", isLast && "pb-0")}>
              <p className="text-sm text-text-primary leading-snug">
                {config.label(payload)}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <time
                  className="text-xs text-text-muted"
                  dateTime={event.createdAt.toISOString()}
                >
                  {formatDateTime(event.createdAt)}
                </time>
                {event.actorName && (
                  <>
                    <span className="text-text-disabled text-xs">·</span>
                    <span className="text-xs text-text-muted">
                      {event.actorName}
                    </span>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
