import { prisma } from "@/lib/prisma";
import type { JobStatus } from "@prisma/client";

// ── List (with search + filter) ───────────────────────────────────────────────

export async function getJobs(params?: { q?: string; status?: string }) {
  const { q, status } = params ?? {};

  return prisma.job.findMany({
    where: {
      ...(status === "OPEN" || status === "CLOSED"
        ? { status: status as JobStatus }
        : {}),
      ...(q
        ? { title: { contains: q, mode: "insensitive" } }
        : {}),
    },
    include: {
      _count: { select: { candidates: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ── Single job (for detail page) ──────────────────────────────────────────────

export async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      _count:    { select: { candidates: true } },
      createdBy: { select: { name: true } },
      candidates: {
        orderBy: { updatedAt: "desc" },
        select: {
          id:        true,
          name:      true,
          email:     true,
          status:    true,
          updatedAt: true,
        },
      },
    },
  });
}

// ── Open jobs only (used in Add Candidate modal job picker) ───────────────────

export async function getOpenJobs() {
  return prisma.job.findMany({
    where: { status: "OPEN" },
    select: { id: true, title: true, department: true },
    orderBy: { title: "asc" },
  });
}
