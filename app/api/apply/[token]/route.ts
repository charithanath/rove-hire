import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { candidateApplicationSchema } from "@/lib/validations";

// GET /api/apply/[token] — validate token and return candidate stub
// Used by the page server component to determine which screen to show
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            job: { select: { title: true } },
          },
        },
      },
    });

    if (!magicLink) {
      return Response.json({ data: null, error: "not_found" }, { status: 404 });
    }

    if (magicLink.usedAt) {
      return Response.json({ data: null, error: "already_used" }, { status: 410 });
    }

    if (magicLink.expiresAt < new Date()) {
      return Response.json({ data: null, error: "expired" }, { status: 410 });
    }

    return Response.json({
      data: {
        candidateName: magicLink.candidate.name,
        jobTitle:      magicLink.candidate.job.title,
      },
      error: null,
    });
  } catch {
    return Response.json(
      { data: null, error: "server_error" },
      { status: 500 }
    );
  }
}

// POST /api/apply/[token] — submit the candidate application form
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();

    // Validate input
    const parsed = candidateApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Re-validate token (must exist, not used, not expired)
    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
      include: { candidate: true },
    });

    if (!magicLink) {
      return Response.json({ data: null, error: "not_found" }, { status: 404 });
    }
    if (magicLink.usedAt) {
      return Response.json({ data: null, error: "already_used" }, { status: 410 });
    }
    if (magicLink.expiresAt < new Date()) {
      return Response.json({ data: null, error: "expired" }, { status: 410 });
    }

    const { phone, location, currentRole, noticePeriod, salaryExpectation, linkedinUrl } =
      parsed.data;

    // Update candidate + mark link used + transition status + append timeline — all in one transaction
    await prisma.$transaction([
      prisma.candidate.update({
        where: { id: magicLink.candidateId },
        data: {
          phone,
          location,
          currentRole,
          noticePeriod,
          salaryExpectation,
          linkedinUrl:  linkedinUrl || null,
          status:       "FORM_SUBMITTED",
        },
      }),
      prisma.magicLink.update({
        where: { id: magicLink.id },
        data: { usedAt: new Date() },
      }),
      prisma.timelineEvent.create({
        data: {
          candidateId: magicLink.candidateId,
          eventType:   "FORM_SUBMITTED",
          payload:     {},
          actorName:   null, // candidate self-action
        },
      }),
    ]);

    return Response.json({ data: { success: true }, error: null });
  } catch {
    return Response.json(
      { data: null, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
