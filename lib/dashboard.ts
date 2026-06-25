import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

/**
 * All dashboard data fetched in a single file.
 * Each function is a focused Prisma query — called in parallel from the page.
 */

// ── KPI counts ────────────────────────────────────────────────────────────────

export async function getKpiStats() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekEnd   = endOfWeek(new Date(),   { weekStartsOn: 1 }); // Sunday

  const [
    openJobs,
    totalCandidates,
    interviewsThisWeek,
    offersSent,
  ] = await Promise.all([
    prisma.job.count({ where: { status: "OPEN" } }),

    prisma.candidate.count({
      where: { status: { not: "REJECTED" } },
    }),

    prisma.interview.count({
      where: {
        scheduledAt: { gte: weekStart, lte: weekEnd },
      },
    }),

    prisma.candidate.count({
      where: { status: { in: ["OFFER_SENT", "HIRED"] } },
    }),
  ]);

  return { openJobs, totalCandidates, interviewsThisWeek, offersSent };
}

// ── Recent candidates (last 5 added) ─────────────────────────────────────────

export async function getRecentCandidates() {
  return prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      job: { select: { id: true, title: true, department: true } },
    },
  });
}

// ── Full candidate pipeline (dashboard table — searchable + filterable) ────────

export async function getCandidatePipeline(params?: {
  q?: string;
  status?: string;
}) {
  const { q, status } = params ?? {};

  return prisma.candidate.findMany({
    where: {
      ...(status ? { status: status as import("@prisma/client").CandidateStatus } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { job: { title: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      job: { select: { id: true, title: true, department: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

// ── Upcoming interviews (next 5 scheduled) ───────────────────────────────────

export async function getUpcomingInterviews() {
  return prisma.interview.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: new Date() },
    },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    include: {
      candidate: { select: { id: true, name: true, email: true } },
    },
  });
}

// ── Recent activity (last 8 timeline events across all candidates) ────────────

export async function getRecentActivity() {
  return prisma.timelineEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      candidate: { select: { id: true, name: true } },
    },
  });
}
