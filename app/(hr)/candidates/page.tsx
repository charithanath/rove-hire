import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/candidates/status-badge";
import { formatRelative } from "@/lib/utils";

export const metadata: Metadata = { title: "Candidates" };
export const dynamic = "force-dynamic";

async function getAllCandidates() {
  return prisma.candidate.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      job: { select: { id: true, title: true, department: true } },
    },
  });
}

export default async function CandidatesPage() {
  const candidates = await getAllCandidates();

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <h1 className="text-lg font-semibold text-text-primary">Candidates</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          {candidates.length}{" "}
          {candidates.length === 1 ? "candidate" : "candidates"} in pipeline
        </p>
      </div>

      {/* List */}
      <div className="px-6 py-6">
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
            <p className="text-sm font-medium text-text-primary">No candidates yet</p>
            <p className="text-xs text-text-muted">
              Add candidates from the Dashboard.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_160px_160px_100px_40px] gap-4 border-b border-border bg-bg/50 px-5 py-2.5">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Candidate</span>
              <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide">Status</span>
              <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide">Role</span>
              <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide text-right">Last activity</span>
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {candidates.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/candidates/${candidate.id}?from=candidates`}
                  className="grid grid-cols-[1fr_160px_160px_100px_40px] gap-4 items-center px-5 py-3.5 hover:bg-[var(--color-surface-hover)] transition-colors group"
                >
                  {/* Avatar + name */}
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

                  {/* Status */}
                  <div className="hidden sm:flex items-center">
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
                  <p className="hidden sm:block text-xs text-text-muted tabular-nums text-right">
                    {formatRelative(candidate.updatedAt)}
                  </p>

                  {/* Arrow */}
                  <div className="flex justify-end">
                    <ArrowRight
                      className="h-3.5 w-3.5 text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
