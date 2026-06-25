"use client";

import Link from "next/link";
import { MapPin, Building2, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditJobModal } from "./edit-job-modal";
import { JobStatusToggle } from "./job-status-toggle";
import { formatDate, EMPLOYMENT_TYPE_LABELS, cn } from "@/lib/utils";
import type { JobWithCount } from "@/types";

interface JobRowProps {
  job: JobWithCount;
}

export function JobRow({ job }: JobRowProps) {
  const isOpen = job.status === "OPEN";

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-surface-hover)] transition-colors",
        !isOpen && "opacity-60"
      )}
    >
      {/* Status indicator */}
      <span
        className={cn(
          "mt-0.5 h-2 w-2 shrink-0 rounded-full",
          isOpen ? "bg-green-500" : "bg-gray-300"
        )}
        aria-hidden="true"
      />

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
            {job.title}
          </p>
          <Badge variant="outline" className="text-xs">
            {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
          </Badge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          {job.department && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Building2 className="h-3 w-3" aria-hidden="true" />
              {job.department}
            </span>
          )}
          {job.location && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {job.location}
            </span>
          )}
          <span className="text-xs text-text-disabled">
            Posted {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Candidate count */}
      <div className="hidden sm:flex items-center gap-1 shrink-0">
        <Users className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
        <span className="text-sm text-text-muted tabular-nums">
          {job._count.candidates}
        </span>
      </div>

      {/* Actions — revealed on hover, stop propagation */}
      <div
        className="hidden sm:flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.preventDefault()}
      >
        <EditJobModal job={job} />
        <JobStatusToggle jobId={job.id} currentStatus={job.status} />
      </div>

      <ArrowRight
        className="h-3.5 w-3.5 text-text-disabled shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </Link>
  );
}
