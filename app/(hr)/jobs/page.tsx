import type { Metadata } from "next";
import { Suspense } from "react";
import { getJobs } from "@/lib/jobs";
import { CreateJobModal } from "@/components/jobs/create-job-modal";
import { JobRow } from "@/components/jobs/job-row";
import { JobsFilters } from "@/components/jobs/jobs-filters";
import { JobsEmptyState } from "@/components/jobs/jobs-empty-state";

export const metadata: Metadata = { title: "Jobs" };
export const dynamic = "force-dynamic";

interface JobsPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { q, status } = await searchParams;
  const jobs = await getJobs({ q, status });
  const hasFilters = !!(q || status);

  const openCount   = jobs.filter((j) => j.status === "OPEN").length;
  const closedCount = jobs.filter((j) => j.status === "CLOSED").length;

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Jobs</h1>
            <p className="mt-0.5 text-sm text-text-muted">
              {openCount} open · {closedCount} closed
            </p>
          </div>
          <CreateJobModal />
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-surface/60 px-6 py-3">
        <Suspense fallback={<div className="h-9" />}>
          <JobsFilters />
        </Suspense>
      </div>

      {/* List */}
      <div className="px-6 py-6">
        {jobs.length === 0 ? (
          <JobsEmptyState filtered={hasFilters} />
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-border bg-bg/50 px-5 py-2.5">
              <span className="w-2" aria-hidden="true" />
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                Job title
              </span>
              <span className="hidden sm:block text-xs font-medium text-text-muted uppercase tracking-wide">
                Candidates
              </span>
              <span className="hidden sm:block w-32" aria-hidden="true" />
              <span className="w-4" aria-hidden="true" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
