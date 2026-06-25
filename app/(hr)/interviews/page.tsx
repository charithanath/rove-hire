import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Interviews" };

export default function InterviewsPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Interviews"
        description="All scheduled and completed interviews."
      />
      <div className="flex flex-1 items-center justify-center p-12 text-text-muted text-sm">
        Interview schedule — coming in Milestone 5.
      </div>
    </div>
  );
}
