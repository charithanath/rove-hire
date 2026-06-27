import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth-helpers";
import { getCandidateProfile } from "@/lib/candidates";

// GET /api/candidates/[id]
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
    const candidate = await getCandidateProfile(id);

    if (!candidate) {
      return Response.json({ data: null, error: "Candidate not found" }, { status: 404 });
    }

    return Response.json({ data: candidate, error: null });
  } catch {
    return Response.json(
      { data: null, error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}
