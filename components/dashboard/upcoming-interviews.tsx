import Link from "next/link";
import { ArrowRight, Video, Phone } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";
import type { getUpcomingInterviews } from "@/lib/dashboard";

type UpcomingInterview = Awaited<ReturnType<typeof getUpcomingInterviews>>[number];

interface UpcomingInterviewsProps {
  interviews: UpcomingInterview[];
}

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Upcoming Interviews
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Scheduled and not yet completed
          </p>
        </div>
        <Link
          href="/interviews"
          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {/* List */}
      {interviews.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-text-muted">
          No upcoming interviews
        </div>
      ) : (
        <div className="divide-y divide-border">
          {interviews.map((interview) => (
            <InterviewRow key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}

function InterviewRow({ interview }: { interview: UpcomingInterview }) {
  const dateLabel = getDateLabel(interview.scheduledAt);
  const isUrgent  = isToday(interview.scheduledAt);
  const isSoon    = isTomorrow(interview.scheduledAt);
  const Icon      = interview.interviewType === "TECHNICAL" ? Video : Phone;

  return (
    <Link
      href={`/candidates/${interview.candidate.id}`}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-surface-hover)] transition-colors group"
    >
      {/* Type icon */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          interview.interviewType === "TECHNICAL"
            ? "bg-violet-50 text-violet-600"
            : "bg-blue-50 text-blue-600"
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </div>

      {/* Candidate + interviewer */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
          {interview.candidate.name}
        </p>
        <p className="text-xs text-text-muted truncate mt-0.5">
          {interview.interviewType === "TECHNICAL" ? "Technical" : "Screening"} ·{" "}
          {interview.interviewerName}
        </p>
      </div>

      {/* Date */}
      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-xs font-medium tabular-nums",
            isUrgent ? "text-danger" : isSoon ? "text-warning" : "text-text-muted"
          )}
        >
          {dateLabel}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {format(interview.scheduledAt, "h:mm a")}
        </p>
      </div>
    </Link>
  );
}

function getDateLabel(date: Date): string {
  if (isToday(date))    return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
}
