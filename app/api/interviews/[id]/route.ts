import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { completeInterviewSchema } from "@/lib/validations";

// PATCH /api/interviews/[id] — mark interview completed + record feedback
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const parsed = completeInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { recommendation, feedbackNotes } = parsed.data;

    // Verify interview exists
    const interview = await prisma.interview.findUnique({
      where: { id },
    });
    if (!interview) {
      return Response.json({ data: null, error: "Interview not found" }, { status: 404 });
    }
    if (interview.status === "COMPLETED") {
      return Response.json(
        { data: null, error: "Interview is already completed" },
        { status: 409 }
      );
    }

    // Mark completed + append timeline event
    const updated = await prisma.$transaction(async (tx) => {
      const iv = await tx.interview.update({
        where: { id },
        data: {
          status:       "COMPLETED",
          recommendation,
          feedbackNotes,
        },
      });

      await tx.timelineEvent.create({
        data: {
          candidateId: interview.candidateId,
          eventType:   "INTERVIEW_COMPLETED",
          payload: {
            recommendation,
            feedbackNotes,
            interviewType: interview.interviewType,
          },
          actorName: session.user.name ?? "HR",
        },
      });

      return iv;
    });

    return Response.json({ data: updated, error: null });
  } catch {
    return Response.json(
      { data: null, error: "Failed to complete interview" },
      { status: 500 }
    );
  }
}
