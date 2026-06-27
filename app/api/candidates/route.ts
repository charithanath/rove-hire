import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { createCandidateSchema, validateResumeFile } from "@/lib/validations";
import { buildMagicLinkUrl } from "@/lib/utils";
import crypto from "crypto";
import type { CandidateStatus } from "@prisma/client";

// GET /api/candidates — searchable + filterable candidate list
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const q      = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "";

    const candidates = await prisma.candidate.findMany({
      where: {
        ...(status ? { status: status as CandidateStatus } : {}),
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

    return Response.json({ data: candidates, error: null });
  } catch {
    return Response.json(
      { data: null, error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST /api/candidates
// Accepts multipart/form-data: name, email, jobId, resume (File)
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const name  = formData.get("name")  as string | null;
    const email = formData.get("email") as string | null;
    const jobId = formData.get("jobId") as string | null;
    const file  = formData.get("resume") as File | null;

    // Validate text fields with Zod
    const parsed = createCandidateSchema.safeParse({ name, email, jobId });
    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // Validate resume file
    if (!file || file.size === 0) {
      return Response.json(
        { data: null, error: "Resume is required" },
        { status: 400 }
      );
    }

    const fileError = validateResumeFile(file);
    if (fileError) {
      return Response.json({ data: null, error: fileError }, { status: 400 });
    }

    // Guard: job must be OPEN
    const job = await prisma.job.findUnique({ where: { id: parsed.data.jobId } });
    if (!job) {
      return Response.json({ data: null, error: "Job not found" }, { status: 404 });
    }
    if (job.status === "CLOSED") {
      return Response.json(
        { data: null, error: "Cannot add candidates to a closed job" },
        { status: 400 }
      );
    }

    // Upload resume to Vercel Blob (private store — served via signed URLs)
    const filename  = `resumes/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const blob      = await put(filename, file, { access: "public" });

    // Generate magic link token
    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    // Create candidate + magic link + timeline event in a transaction
    const candidate = await prisma.$transaction(async (tx) => {
      const c = await tx.candidate.create({
        data: {
          name:            parsed.data.name,
          email:           parsed.data.email,
          jobId:           parsed.data.jobId,
          resumeUrl:       blob.url,
          resumeFilename:  file.name,
          status:          "APPLIED",
          createdById:     session.user.id,
        },
      });

      await tx.magicLink.create({
        data: { token, expiresAt, candidateId: c.id },
      });

      await tx.timelineEvent.create({
        data: {
          candidateId: c.id,
          eventType:   "CANDIDATE_CREATED",
          payload:     { jobTitle: job.title },
          actorName:   session.user.name ?? "HR",
        },
      });

      return c;
    });

    return Response.json(
      {
        data: {
          candidate,
          magicLink: buildMagicLinkUrl(token),
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/candidates]", err);

    // Prisma unique constraint violation — email already exists
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return Response.json(
        { data: null, error: "A candidate with this email already exists." },
        { status: 409 }
      );
    }

    return Response.json(
      { data: null, error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
