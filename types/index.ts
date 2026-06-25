// Central types file. Re-exports Prisma model types and defines
// extended/composed types used across the application.

export type {
  User,
  UserRole,
  Job,
  JobStatus,
  EmploymentType,
  Candidate,
  CandidateStatus,
  MagicLink,
  Interview,
  InterviewType,
  InterviewStatus,
  Recommendation,
  OfferDocument,
  TimelineEvent,
  TimelineEventType,
} from "@prisma/client";

// ─────────────────────────────────────────────
// Composed types (Prisma queries with includes)
// ─────────────────────────────────────────────

import type { Prisma } from "@prisma/client";

// Candidate row on the dashboard (includes job title)
export type CandidateWithJob = Prisma.CandidateGetPayload<{
  include: { job: { select: { id: true; title: true } } };
}>;

// Full candidate profile (all relations)
export type CandidateProfile = Prisma.CandidateGetPayload<{
  include: {
    job: true;
    interviews: { orderBy: { scheduledAt: "desc" } };
    offerDocuments: { orderBy: { createdAt: "desc" } };
    timelineEvents: { orderBy: { createdAt: "desc" } };
    magicLink: true;
  };
}>;

// Job with candidate count
export type JobWithCount = Prisma.JobGetPayload<{
  include: { _count: { select: { candidates: true } } };
}>;

// ─────────────────────────────────────────────
// API response envelope
// ─────────────────────────────────────────────

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// ─────────────────────────────────────────────
// Next-Auth session extension
// Adds `id` to the default session.user object
// ─────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
