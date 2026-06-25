import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/candidates/status-badge";
import { formatRelative } from "@/lib/utils";
import type { getRecentCandidates } from "@/lib/dashboard";

type RecentCandidate = Awaited<ReturnType<typeof getRecentCandidates>>[number];

interface RecentCandidatesProps {
  candidates: RecentCandidate[];
}

export function RecentCandidates({ candidates }: RecentCandidatesProps) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Recent Candidates
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Latest additions to the pipeline
          </p>
        </div>
        <Link
          href="/candidates"
          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors"
        >
          View all
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {/* Table */}
      {candidates.length === 0 ? (
        <EmptyRow message="No candidates yet" />
      ) : (
        <div className="divide-y divide-border">
          {candidates.map((candidate) => (
            <CandidateRow key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateRow({ candidate }: { candidate: RecentCandidate }) {
  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-surface-hover)] transition-colors group"
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
        {getInitials(candidate.name)}
      </div>

      {/* Name + role */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
          {candidate.name}
        </p>
        <p className="text-xs text-text-muted truncate mt-0.5">
          {candidate.job.title}
          {candidate.job.department && (
            <span className="text-text-disabled"> · {candidate.job.department}</span>
          )}
        </p>
      </div>

      {/* Status */}
      <div className="hidden sm:block shrink-0">
        <StatusBadge status={candidate.status} />
      </div>

      {/* Time */}
      <p className="hidden md:block shrink-0 text-xs text-text-muted tabular-nums">
        {formatRelative(candidate.createdAt)}
      </p>

      {/* Arrow */}
      <ArrowRight
        className="h-3.5 w-3.5 text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        aria-hidden="true"
      />
    </Link>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-5 py-10 text-center text-sm text-text-muted">
      {message}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
