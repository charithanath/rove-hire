import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createJobSchema } from "@/lib/validations";

// GET /api/jobs — list all jobs
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const q      = searchParams.get("q") ?? undefined;
    const status = searchParams.get("status") ?? undefined;

    const jobs = await prisma.job.findMany({
      where: {
        ...(status === "OPEN" || status === "CLOSED" ? { status } : {}),
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      },
      include: { _count: { select: { candidates: true } } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ data: jobs, error: null });
  } catch {
    return Response.json({ data: null, error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST /api/jobs — create a new job
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createJobSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, description, requiredSkills, status, department, location, employmentType } = parsed.data;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requiredSkills,
        status,
        department:     department || null,
        location:       location   || null,
        employmentType: employmentType ?? "FULL_TIME",
        createdById: session.user.id,
      },
      include: { _count: { select: { candidates: true } } },
    });

    return Response.json({ data: job, error: null }, { status: 201 });
  } catch {
    return Response.json({ data: null, error: "Failed to create job" }, { status: 500 });
  }
}
