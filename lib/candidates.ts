import { prisma } from "@/lib/prisma";

// Full candidate profile — all relations in one query
export async function getCandidateProfile(id: string) {
  return prisma.candidate.findUnique({
    where: { id },
    include: {
      job: true,
      interviews: {
        orderBy: { scheduledAt: "desc" },
      },
      offerDocuments: {
        orderBy: { createdAt: "desc" },
      },
      timelineEvents: {
        orderBy: { createdAt: "desc" },
      },
      magicLink: true,
    },
  });
}

export type CandidateProfileData = NonNullable<
  Awaited<ReturnType<typeof getCandidateProfile>>
>;
