import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, User, Video, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate, cn } from "@/lib/utils";
import { isToday, isTomorrow, isPast } from "date-fns";

export const metadata: Metadata = { title: "Interviews" };
export const dynamic = "force-dynamic";

async function getInterviews() {
  return prisma.interview.findMany({
    orderBy: { scheduledAt: "asc" },
    include: {
      candidate: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export default async function InterviewsPage() {
  const interviews = await getInterviews();

  const upcoming  = interviews.filter((iv) => iv.status === "SCHEDULED");
  const completed = interviews.filter((iv) => iv.status === "COMPLETED");

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <h1 className="text-lg font-semibold text-text-primary">Interviews</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          {upcoming.length} upcoming · {completed.length} completed
        </p>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Upcoming */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
            Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming interviews scheduled." />
          ) : (
            <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden">
              {upcoming.map((iv) => (
                <InterviewRow key={iv.id} interview={iv} />
              ))}
            </div>
          )}
        </section>

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
              Completed
            </h2>
            <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden opacity-75">
              {completed.map((iv) => (
                <InterviewRow key={iv.id} interview={iv} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

type InterviewWithCandidate = Awaited<ReturnType<typeof getInterviews>>[number];

function InterviewRow({ interview }: { interview: InterviewWithCandidate }) {
  const isCompleted = interview.status === "COMPLETED";
  const date        = interview.scheduledAt;
  const Icon        = interview.interviewType === "TECHNICAL" ? Video : Phone;

  const dateLabel = isToday(date)
    ? "Today"
    : isTomorrow(date)
    ? "Tomorrow"
    : formatDate(date);

  const isOverdue = !isCompleted && isPast(date);

  return (
    <Link
      href={`/candidates/${interview.candidate.id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-surface-hover)] transition-colors group"
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

      {/* Candidate name + type */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
          {interview.candidate.name}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {interview.interviewType === "TECHNICAL" ? "Technical" : "Screening"} ·{" "}
          {interview.interviewerName}
        </p>
      </div>

      {/* Status badge */}
      <Badge variant={isCompleted ? "green" : "default"}>
        {isCompleted ? "Completed" : "Scheduled"}
      </Badge>

      {/* Date + time */}
      <div className="hidden sm:block shrink-0 text-right">
        <p
          className={cn(
            "text-sm font-medium tabular-nums",
            isOverdue
              ? "text-danger"
              : isCompleted
              ? "text-text-muted"
              : "text-text-primary"
          )}
        >
          {dateLabel}
        </p>
        <p className="text-xs text-text-muted mt-0.5">
          {new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Recommendation (completed only) */}
      {isCompleted && interview.recommendation && (
        <div className="hidden md:block shrink-0">
          <RecommendationChip rec={interview.recommendation} />
        </div>
      )}
    </Link>
  );
}

function RecommendationChip({ rec }: { rec: string }) {
  const map: Record<string, string> = {
    HIRE:    "bg-green-50 text-green-700",
    NO_HIRE: "bg-red-50 text-red-700",
    MAYBE:   "bg-amber-50 text-amber-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        map[rec] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {rec.replace("_", " ")}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-surface/50 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
        <CalendarDays className="h-5 w-5 text-text-muted" aria-hidden="true" />
      </div>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
