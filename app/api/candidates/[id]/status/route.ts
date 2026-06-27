import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const hireSchema = z.object({
  action: z.literal("hire"),
});

const rejectSchema = z.object({
  action: z.literal("reject"),
  reason: z.string().min(1, "Rejection reason is required"),
});

const bodySchema = z.discriminatedUnion("action", [hireSchema, rejectSchema]);

// PATCH /api/candidates/[id]/status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: candidateId } = await params;
    const body   = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { offerDocuments: { take: 1 } },
    });

    if (!candidate) {
      return Response.json({ data: null, error: "Candidate not found" }, { status: 404 });
    }

    // Guard: terminal statuses cannot be changed
    if (candidate.status === "HIRED" || candidate.status === "REJECTED") {
      return Response.json(
        { data: null, error: "Candidate is already in a terminal status" },
        { status: 409 }
      );
    }

    if (parsed.data.action === "hire") {
      // Guard: must have an offer document first
      if (candidate.offerDocuments.length === 0) {
        return Response.json(
          { data: null, error: "An offer must be generated before marking as hired" },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.candidate.update({
          where: { id: candidateId },
          data:  { status: "HIRED" },
        }),
        prisma.timelineEvent.create({
          data: {
            candidateId,
            eventType: "CANDIDATE_HIRED",
            payload:   {},
            actorName: session.user.name ?? "HR",
          },
        }),
      ]);

      return Response.json({ data: { status: "HIRED" }, error: null });
    }

    // Reject
    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: candidateId },
        data:  { status: "REJECTED", rejectionReason: parsed.data.reason },
      }),
      prisma.timelineEvent.create({
        data: {
          candidateId,
          eventType: "CANDIDATE_REJECTED",
          payload:   { reason: parsed.data.reason },
          actorName: session.user.name ?? "HR",
        },
      }),
    ]);

    return Response.json({ data: { status: "REJECTED" }, error: null });
  } catch {
    return Response.json(
      { data: null, error: "Failed to update candidate status" },
      { status: 500 }
    );
  }
}
