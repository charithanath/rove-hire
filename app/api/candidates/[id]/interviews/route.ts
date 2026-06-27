import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { scheduleInterviewSchema } from "@/lib/validations";

// POST /api/candidates/[id]/interviews — schedule an interview
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: candidateId } = await params;
    const body = await req.json();

    const parsed = scheduleInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { interviewType, scheduledAt, interviewerName, notes } = parsed.data;

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) {
      return Response.json({ data: null, error: "Candidate not found" }, { status: 404 });
    }

    const scheduledDate = new Date(scheduledAt);

    // Create interview + update candidate status + append timeline — all in one transaction
    const interview = await prisma.$transaction(async (tx) => {
      const iv = await tx.interview.create({
        data: {
          candidateId,
          interviewType,
          scheduledAt:    scheduledDate,
          interviewerName,
          notes:          notes || null,
          status:         "SCHEDULED",
          scheduledById:  session.user.id,
        },
      });

      await tx.candidate.update({
        where: { id: candidateId },
        data:  { status: "INTERVIEW_SCHEDULED" },
      });

      await tx.timelineEvent.create({
        data: {
          candidateId,
          eventType: "INTERVIEW_SCHEDULED",
          payload: {
            interviewType,
            interviewerName,
            scheduledAt: scheduledDate.toISOString(),
          },
          actorName: session.user.name ?? "HR",
        },
      });

      return iv;
    });

    return Response.json({ data: interview, error: null }, { status: 201 });
  } catch {
    return Response.json(
      { data: null, error: "Failed to schedule interview" },
      { status: 500 }
    );
  }
}
