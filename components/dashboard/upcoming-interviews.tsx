import Link from "next/link";
import { ArrowRight, Video, Phone, CalendarDays } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";
import type { getUpcomingInterviews } from "@/lib/dashboard";

type UpcomingInterview = Awaited<ReturnType<typeof getUpcomingInterviews>>[number];

export function UpcomingInterviews({ interviews }: { interviews: UpcomingInterview[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-text-primary">Upcoming Interviews</h2>
          {interviews.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-text-muted">
              {interviews.length}
            </span>
          )}
        </div>
        <Link
          href="/interviews"
          className="flex items-center gap-1 text-[12px] font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
            <CalendarDays className="h-[18px] w-[18px] text-text-muted" aria-hidden="true" />
          </div>
          <p className="text-[12px] text-text-muted">No upcoming interviews</p>
        </div>
      ) : (
        <div className="flex-1 divide-y divide-border overflow-y-auto">
          {interviews.map((iv) => <InterviewRow key={iv.id} interview={iv} />)}
        </div>
      )}
    </div>
  );
}

function InterviewRow({ interview }: { interview: UpcomingInterview }) {
  const isUrgent = isToday(interview.scheduledAt);
  const isSoon   = isTomorrow(interview.scheduledAt);
  const Icon     = interview.interviewType === "TECHNICAL" ? Video : Phone;
  const dateLabel = isUrgent ? "Today" : isSoon ? "Tomorrow" : format(interview.scheduledAt, "MMM d");

  return (
    <Link
      href={`/candidates/${interview.candidate.id}`}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors"
    >
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
        interview.interviewType === "TECHNICAL" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
      )}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-primary truncate group-hover:text-accent transition-colors leading-snug">
          {interview.candidate.name}
        </p>
        <p className="text-[11px] text-text-muted truncate leading-snug">
          {interview.interviewType === "TECHNICAL" ? "Technical" : "Screening"} · {interview.interviewerName}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className={cn(
          "text-[12px] font-medium tabular-nums leading-snug",
          isUrgent ? "text-danger" : isSoon ? "text-warning" : "text-text-muted"
        )}>
          {dateLabel}
        </p>
        <p className="text-[11px] text-text-muted leading-snug">
          {format(interview.scheduledAt, "h:mm a")}
        </p>
      </div>
    </Link>
  );
}
