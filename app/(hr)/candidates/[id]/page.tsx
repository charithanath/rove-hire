import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  FileText,
  Download,
  Linkedin,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { getCandidateProfile } from "@/lib/candidates";
import { StatusBadge } from "@/components/candidates/status-badge";
import { CandidateTimeline } from "@/components/candidates/candidate-timeline";
import { CandidateActions } from "@/components/candidates/candidate-actions";
import { CompleteInterviewModal } from "@/components/candidates/complete-interview-modal";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelative, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface CandidateProfilePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({
  params,
}: CandidateProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const candidate = await getCandidateProfile(id);
  return { title: candidate ? candidate.name : "Candidate not found" };
}

export default async function CandidateProfilePage({
  params,
  searchParams,
}: CandidateProfilePageProps) {
  const { id }   = await params;
  const { from } = await searchParams;
  const candidate = await getCandidateProfile(id);

  if (!candidate) notFound();

  const backHref  = from === "candidates" ? "/candidates" : from === "jobs" ? "/jobs" : "/dashboard";
  const backLabel = from === "candidates" ? "Candidates"  : from === "jobs" ? "Jobs"  : "Dashboard";

  const hasOffer   = candidate.offerDocuments.length > 0;
  const isTerminal = candidate.status === "HIRED" || candidate.status === "REJECTED";

  // Most recent interview that is still SCHEDULED (not yet completed)
  const pendingInterview =
    candidate.interviews.find((iv) => iv.status === "SCHEDULED") ?? null;

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent hover:text-[var(--color-accent-hover)] transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {backLabel}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-accent text-[16px] font-bold text-white shadow-sm">
              {getInitials(candidate.name)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[20px] font-bold text-text-primary">
                  {candidate.name}
                </h1>
                <StatusBadge status={candidate.status} />
              </div>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-[13px] font-medium text-accent">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                  {candidate.job.title}
                </span>
                <span className="text-text-disabled text-sm">·</span>
                <span className="text-[12px] text-text-muted">
                  Added {formatRelative(candidate.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Status-based actions */}
          {!isTerminal && (
            <div className="shrink-0">
              <CandidateActions
                candidateId={candidate.id}
                candidateName={candidate.name}
                status={candidate.status}
                hasOffer={hasOffer}
                pendingInterview={pendingInterview}
                defaultRoleTitle={candidate.job.title}
              />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Left — timeline + interviews */}
        <div className="lg:col-span-2 space-y-6">

          {/* Timeline */}
          <Section title="Activity timeline">
            <CandidateTimeline events={candidate.timelineEvents} />
          </Section>

          {/* Interviews */}
          {candidate.interviews.length > 0 && (
            <Section title="Interviews">
              <div className="space-y-3">
                {candidate.interviews.map((interview) => (
                  <InterviewCard key={interview.id} interview={interview} />
                ))}
              </div>
            </Section>
          )}

          {/* Offer documents */}
          {candidate.offerDocuments.length > 0 && (
            <Section title="Offer documents">
              <div className="space-y-3">
                {candidate.offerDocuments.map((doc) => (
                  <OfferDocCard key={doc.id} doc={doc} />
                ))}
              </div>
            </Section>
          )}

        </div>

        {/* Right — info panels */}
        <div className="space-y-4">

          {/* Contact info */}
          <Section title="Contact">
            <dl className="space-y-2.5">
              <InfoRow icon={Mail} label={candidate.email} href={`mailto:${candidate.email}`} />
              {candidate.phone && (
                <InfoRow icon={Phone} label={candidate.phone} href={`tel:${candidate.phone}`} />
              )}
              {candidate.location && (
                <InfoRow icon={MapPin} label={candidate.location} />
              )}
              {candidate.linkedinUrl && (
                <InfoRow
                  icon={Linkedin}
                  label="LinkedIn profile"
                  href={candidate.linkedinUrl}
                  external
                />
              )}
            </dl>
          </Section>

          {/* Application details */}
          {(candidate.currentRole || candidate.noticePeriod || candidate.salaryExpectation) && (
            <Section title="Application details">
              <dl className="space-y-2.5">
                {candidate.currentRole && (
                  <DetailRow label="Current role" value={candidate.currentRole} />
                )}
                {candidate.noticePeriod && (
                  <DetailRow label="Notice period" value={candidate.noticePeriod} />
                )}
                {candidate.salaryExpectation && (
                  <DetailRow label="Salary expectation" value={candidate.salaryExpectation} />
                )}
              </dl>
            </Section>
          )}

          {/* Resume */}
          <Section title="Resume">
            {candidate.resumeUrl ? (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-[var(--color-surface-hover)] transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10">
                  <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                    {candidate.resumeFilename ?? "Resume"}
                  </p>
                  <p className="text-xs text-text-muted">PDF · Click to view</p>
                </div>
                <Download className="h-4 w-4 text-text-muted shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <p className="text-sm text-text-muted">No resume uploaded.</p>
            )}
          </Section>

          {/* Job info */}
          <Section title="Applied for">
            <Link
              href={`/jobs/${candidate.job.id}`}
              className="flex items-center gap-3 rounded-md border border-border p-3 hover:bg-[var(--color-surface-hover)] transition-colors group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-50">
                <Briefcase className="h-4 w-4 text-violet-600" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                  {candidate.job.title}
                </p>
                {candidate.job.department && (
                  <p className="text-xs text-text-muted">{candidate.job.department}</p>
                )}
              </div>
            </Link>
          </Section>

          {/* Rejection reason */}
          {candidate.status === "REJECTED" && candidate.rejectionReason && (
            <Section title="Rejection reason">
              <p className="text-sm text-text-primary leading-relaxed">
                {candidate.rejectionReason}
              </p>
            </Section>
          )}

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
      <h2 className="mb-4 text-[13px] font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
        <span className="inline-block h-3.5 w-[3px] rounded-full bg-accent" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="text-sm text-text-primary truncate">{label}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block hover:text-accent transition-colors"
      >
        {inner}
      </a>
    );
  }

  return <div>{inner}</div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs text-text-muted shrink-0">{label}</dt>
      <dd className="text-xs text-text-primary text-right">{value}</dd>
    </div>
  );
}

type InterviewData = NonNullable<
  Awaited<ReturnType<typeof getCandidateProfile>>
>["interviews"][number];

function InterviewCard({ interview }: { interview: InterviewData }) {
  const isCompleted = interview.status === "COMPLETED";
  const recColors: Record<string, string> = {
    HIRE:     "bg-green-50 text-green-700",
    NO_HIRE:  "bg-red-50 text-red-700",
    MAYBE:    "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={interview.interviewType === "TECHNICAL" ? "violet" : "blue"}>
            {interview.interviewType === "TECHNICAL" ? "Technical" : "Screening"}
          </Badge>
          <Badge variant={isCompleted ? "green" : "default"}>
            {isCompleted ? "Completed" : "Scheduled"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            {formatDate(interview.scheduledAt)}
          </span>
          {!isCompleted && (
            <CompleteInterviewModal
              interviewId={interview.id}
              interviewerName={interview.interviewerName}
              interviewType={interview.interviewType}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm text-text-muted">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        {interview.interviewerName}
      </div>

      {interview.notes && (
        <p className="text-sm text-text-muted leading-relaxed">{interview.notes}</p>
      )}

      {isCompleted && interview.recommendation && (
        <div className="pt-2 border-t border-border space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Recommendation:</span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                recColors[interview.recommendation] ?? "bg-gray-100 text-gray-600"
              )}
            >
              {interview.recommendation.replace("_", " ")}
            </span>
          </div>
          {interview.feedbackNotes && (
            <p className="text-sm text-text-primary leading-relaxed">
              {interview.feedbackNotes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

type OfferDocData = NonNullable<
  Awaited<ReturnType<typeof getCandidateProfile>>
>["offerDocuments"][number];

function OfferDocCard({ doc }: { doc: OfferDocData }) {
  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">{doc.roleTitle}</p>
        <span className="text-xs text-text-muted">{formatDate(doc.createdAt)}</span>
      </div>

      <div className="flex items-center gap-1 text-sm text-text-muted">
        <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
        {doc.salaryCurrency} {Number(doc.salaryAmount).toLocaleString()} ·{" "}
        Start {formatDate(doc.startDate)}
      </div>

      {(doc.offerPdfUrl || doc.ndaPdfUrl) && (
        <div className="flex gap-2 pt-1">
          {doc.offerPdfUrl && (
            <a
              href={doc.offerPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <Download className="h-3 w-3" aria-hidden="true" />
              Offer Letter
            </a>
          )}
          {doc.ndaPdfUrl && (
            <a
              href={doc.ndaPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <Download className="h-3 w-3" aria-hidden="true" />
              NDA
            </a>
          )}
        </div>
      )}
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
