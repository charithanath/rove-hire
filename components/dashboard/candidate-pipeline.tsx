import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { StatusBadge } from "@/components/candidates/status-badge";
import { formatRelative } from "@/lib/utils";
import type { getCandidatePipeline } from "@/lib/dashboard";

type PipelineCandidate = Awaited<ReturnType<typeof getCandidatePipeline>>[number];

interface CandidatePipelineProps {
  candidates: PipelineCandidate[];
  hasFilters: boolean;
}

export function CandidatePipeline({
  candidates,
  hasFilters,
}: CandidatePipelineProps) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Candidate Pipeline
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {candidates.length}{" "}
            {candidates.length === 1 ? "candidate" : "candidates"}
            {hasFilters ? " matching filters" : " in pipeline"}
          </p>
        </div>
      </div>

      {/* Column headers */}
      {candidates.length > 0 && (
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_160px_140px_100px] gap-4 px-5 py-2 border-b border-border bg-bg/50">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
            Candidate
          </span>
          <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide">
            Status
          </span>
          <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide">
            Role
          </span>
          <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide text-right">
            Last activity
          </span>
        </div>
      )}

      {/* Rows */}
      {candidates.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="divide-y divide-border">
          {candidates.map((c) => (
            <PipelineRow key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function PipelineRow({ candidate }: { candidate: PipelineCandidate }) {
  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_160px_140px_100px] gap-4 items-center px-5 py-3.5 hover:bg-[var(--color-surface-hover)] transition-colors group"
    >
      {/* Name + email */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent"
          aria-hidden="true"
        >
          {getInitials(candidate.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
            {candidate.name}
          </p>
          <p className="text-xs text-text-muted truncate mt-0.5">
            {candidate.email}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center">
        <StatusBadge status={candidate.status} />
      </div>

      {/* Role */}
      <div className="hidden sm:block min-w-0">
        <p className="text-sm text-text-primary truncate">
          {candidate.job.title}
        </p>
        {candidate.job.department && (
          <p className="text-xs text-text-muted truncate mt-0.5">
            {candidate.job.department}
          </p>
        )}
      </div>

      {/* Last activity */}
      <div className="hidden sm:flex items-center justify-end gap-1">
        <p className="text-xs text-text-muted tabular-nums text-right">
          {formatRelative(candidate.updatedAt)}
        </p>
        <ArrowRight
          className="h-3.5 w-3.5 text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
        <Users className="h-5 w-5 text-text-muted" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">
          {hasFilters ? "No candidates match your filters" : "No candidates yet"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {hasFilters
            ? "Try a different search term or status filter."
            : "Add your first candidate to get started."}
        </p>
      </div>
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
