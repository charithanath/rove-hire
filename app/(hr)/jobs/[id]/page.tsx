import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Users,
  Clock,
  ChevronLeft,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { getJob } from "@/lib/jobs";
import { Badge } from "@/components/ui/badge";
import { EditJobModal } from "@/components/jobs/edit-job-modal";
import { JobStatusToggle } from "@/components/jobs/job-status-toggle";
import { StatusBadge } from "@/components/candidates/status-badge";
import { formatDate, formatRelative, EMPLOYMENT_TYPE_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  return { title: job ? job.title : "Job not found" };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  const isOpen = job.status === "OPEN";

  return (
    <div className="min-h-full">
      {/* Breadcrumb + header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        {/* Back link */}
        <Link
          href="/jobs"
          className="mb-3 inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All jobs
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <Badge variant={isOpen ? "green" : "default"} dot>
                {isOpen ? "Open" : "Closed"}
              </Badge>
              <Badge variant="outline">
                {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
              </Badge>
            </div>

            <h1 className="text-xl font-semibold text-text-primary leading-tight">
              {job.title}
            </h1>

            {/* Meta */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
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
                icon={CalendarDays}
                label={`Posted ${formatDate(job.createdAt)}`}
              />
              {job.createdBy && (
                <MetaItem
                  icon={Clock}
                  label={`by ${job.createdBy.name}`}
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <EditJobModal job={job} />
            <JobStatusToggle jobId={job.id} currentStatus={job.status} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Description — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Description">
            <div className="prose-sm text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </Section>

          {/* Required skills */}
          <Section title="Required skills">
            {job.requiredSkills.length === 0 ? (
              <p className="text-sm text-text-muted">No skills listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md bg-accent/8 px-2.5 py-1 text-sm font-medium text-accent border border-accent/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* Candidates */}
          <Section title={`Candidates (${job._count.candidates})`}>
            {job.candidates.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
                <p className="text-sm text-text-muted">No candidates for this role yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border -mx-5 -mb-5 overflow-hidden rounded-b-xl">
                {job.candidates.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/candidates/${candidate.id}?from=jobs`}
                    className="group flex items-center gap-3 px-5 py-3 hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent">
                      {candidate.name.split(" ").map((p: string) => p[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                        {candidate.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">{candidate.email}</p>
                    </div>
                    <StatusBadge status={candidate.status} />
                    <p className="hidden sm:block text-xs text-text-muted tabular-nums shrink-0">
                      {formatRelative(candidate.updatedAt)}
                    </p>
                    <ArrowRight className="h-3.5 w-3.5 text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-4">
          <Section title="Job details">
            <dl className="space-y-3">
              <DetailRow label="Status">
                <Badge variant={isOpen ? "green" : "default"} dot>
                  {isOpen ? "Open" : "Closed"}
                </Badge>
              </DetailRow>
              <DetailRow label="Employment type">
                {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
              </DetailRow>
              {job.department && (
                <DetailRow label="Department">{job.department}</DetailRow>
              )}
              {job.location && (
                <DetailRow label="Location">{job.location}</DetailRow>
              )}
              <DetailRow label="Posted">{formatDate(job.createdAt)}</DetailRow>
              <DetailRow label="Last updated">{formatDate(job.updatedAt)}</DetailRow>
              {job.createdBy && (
                <DetailRow label="Created by">{job.createdBy.name}</DetailRow>
              )}
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-4 text-sm font-semibold text-text-primary">{title}</h2>
      {children}
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs text-text-muted shrink-0">{label}</dt>
      <dd className="text-xs text-text-primary text-right">{children}</dd>
    </div>
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
    <span className="flex items-center gap-1 text-sm text-text-muted">
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}
