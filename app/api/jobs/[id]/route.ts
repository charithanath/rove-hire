import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { updateJobSchema } from "@/lib/validations";

// GET /api/jobs/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: { select: { candidates: true } },
        createdBy: { select: { name: true } },
      },
    });

    if (!job) {
      return Response.json({ data: null, error: "Job not found" }, { status: 404 });
    }

    return Response.json({ data: job, error: null });
  } catch {
    return Response.json({ data: null, error: "Failed to fetch job" }, { status: 500 });
  }
}

// PATCH /api/jobs/[id] — update or toggle status
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
    const parsed = updateJobSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Merge optional metadata fields not in the Zod schema
    const updateData: Record<string, unknown> = { ...parsed.data };
    if ("department"     in body) updateData.department     = body.department     || null;
    if ("location"       in body) updateData.location       = body.location       || null;
    if ("employmentType" in body) updateData.employmentType = body.employmentType || "FULL_TIME";

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { candidates: true } } },
    });

    return Response.json({ data: job, error: null });
  } catch {
    return Response.json({ data: null, error: "Failed to update job" }, { status: 500 });
  }
}
