import Link from "next/link";
import {
  UserPlus, FileText, CalendarDays, CheckCircle,
  FileOutput, TrendingUp, UserCheck, UserX, Activity,
} from "lucide-react";
import { formatRelative, cn } from "@/lib/utils";
import type { TimelineEventType } from "@prisma/client";
import type { getRecentActivity } from "@/lib/dashboard";

type ActivityEvent = Awaited<ReturnType<typeof getRecentActivity>>[number];

const EVENT_CONFIG: Record<TimelineEventType, {
  label: (p: Record<string, unknown>) => string;
  icon:  React.ComponentType<{ className?: string }>;
  dot:   string;
}> = {
  CANDIDATE_CREATED:   { label: () => "Added to pipeline",             icon: UserPlus,    dot: "bg-blue-500"    },
  FORM_SUBMITTED:      { label: () => "Submitted application",         icon: FileText,    dot: "bg-indigo-500"  },
  INTERVIEW_SCHEDULED: { label: (p) => `${p.interviewType === "TECHNICAL" ? "Technical" : "Screening"} interview scheduled`, icon: CalendarDays, dot: "bg-violet-500" },
  INTERVIEW_COMPLETED: { label: (p) => `Interview completed · ${p.recommendation ? String(p.recommendation).replace("_", " ") : ""}`, icon: CheckCircle, dot: "bg-green-500" },
  OFFER_GENERATED:     { label: () => "Offer documents generated",     icon: FileOutput,  dot: "bg-amber-500"   },
  STATUS_CHANGED:      { label: (p) => `Status → ${String(p.to ?? "").replace("_", " ")}`, icon: TrendingUp, dot: "bg-slate-400" },
  CANDIDATE_HIRED:     { label: () => "Marked as hired 🎉",            icon: UserCheck,   dot: "bg-green-500"   },
  CANDIDATE_REJECTED:  { label: () => "Application rejected",          icon: UserX,       dot: "bg-red-400"     },
};

export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <h2 className="text-[13px] font-semibold text-text-primary">Recent Activity</h2>
        {events.length > 0 && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-text-muted">
            {events.length}
          </span>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
            <Activity className="h-[18px] w-[18px] text-text-muted" aria-hidden="true" />
          </div>
          <p className="text-[12px] text-text-muted">No activity yet</p>
        </div>
      ) : (
        <div className="px-4 py-3">
          <ol className="relative" aria-label="Recent activity">
            {events.map((event, index) => {
              const config  = EVENT_CONFIG[event.eventType];
              const payload = (event.payload ?? {}) as Record<string, unknown>;
              const Icon    = config.icon;
              const isLast  = index === events.length - 1;

              return (
                <li key={event.id} className="flex gap-3 group">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center pt-1">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full ring-2 ring-white", config.dot)} aria-hidden="true" />
                    {!isLast && <div className="mt-1 w-px flex-1 bg-border min-h-[20px]" aria-hidden="true" />}
                  </div>

                  {/* Content */}
                  <div className={cn("min-w-0 flex-1 pb-3.5", isLast && "pb-0")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/candidates/${event.candidate.id}`}
                          className="text-[13px] font-medium text-text-primary hover:text-accent transition-colors truncate block leading-snug"
                        >
                          {event.candidate.name}
                        </Link>
                        <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                          {config.label(payload)}
                          {event.actorName && (
                            <span className="text-text-disabled"> · {event.actorName}</span>
                          )}
                        </p>
                      </div>
                      <time
                        className="shrink-0 text-[11px] text-text-muted tabular-nums pt-0.5"
                        dateTime={event.createdAt.toISOString()}
                      >
                        {formatRelative(event.createdAt)}
                      </time>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
