import Link from "next/link";
import { MapPin, Building2, Users, Clock, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditJobModal } from "./edit-job-modal";
import { JobStatusToggle } from "./job-status-toggle";
import { formatDate, EMPLOYMENT_TYPE_LABELS, cn } from "@/lib/utils";
import type { JobWithCount } from "@/types";

interface JobCardProps {
  job: JobWithCount;
}

export function JobCard({ job }: JobCardProps) {
  const isOpen = job.status === "OPEN";

  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border bg-surface p-5",
        "transition-all duration-150 hover:shadow-sm hover:border-accent/30",
        !isOpen && "opacity-70"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Status + type badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge
              variant={isOpen ? "green" : "default"}
              dot
            >
              {isOpen ? "Open" : "Closed"}
            </Badge>
            <Badge variant="outline">
              {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug">
            {job.title}
          </h3>
        </div>

        {/* Actions — stop propagation so clicks don't navigate */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditJobModal job={job} />
          <JobStatusToggle jobId={job.id} currentStatus={job.status} />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {job.department && (
          <MetaItem icon={Building2} label={job.department} />
        )}
        {job.location && (
          <MetaItem icon={MapPin} label={job.location} />
        )}
        <MetaItem
          icon={Users}
          label={`${job._count.candidates} candidate${job._count.candidates !== 1 ? "s" : ""}`}
        />
        <MetaItem
          icon={Clock}
          label={`Posted ${formatDate(job.createdAt)}`}
        />
      </div>

      {/* Skills */}
      {job.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border">
          {job.requiredSkills.slice(0, 6).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md bg-bg px-2 py-0.5 text-xs text-text-muted border border-border"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 6 && (
            <span className="inline-flex items-center rounded-md bg-bg px-2 py-0.5 text-xs text-text-disabled border border-border">
              +{job.requiredSkills.length - 6} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

function MetaItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1 text-xs text-text-muted">
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}
