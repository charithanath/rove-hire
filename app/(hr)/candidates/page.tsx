import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Candidates" };

export default function CandidatesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Candidates"
        description="All candidates across every job opening."
      />
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted text-sm">
        Candidate list — coming in Milestone 2.
      </div>
    </div>
  );
}
