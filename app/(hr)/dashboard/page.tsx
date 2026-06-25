import type { Metadata } from "next";
import { Suspense } from "react";
import { Briefcase, Users, CalendarDays, FileOutput } from "lucide-react";
import { requireAuth } from "@/lib/auth-helpers";
import {
  getKpiStats,
  getCandidatePipeline,
  getUpcomingInterviews,
  getRecentActivity,
} from "@/lib/dashboard";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CandidatePipeline } from "@/components/dashboard/candidate-pipeline";
import { PipelineFilters } from "@/components/dashboard/pipeline-filters";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { format } from "date-fns";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requireAuth();
  const { q, status } = await searchParams;

  // All data in parallel — pipeline query uses the search params
  const [stats, candidates, upcomingInterviews, recentActivity] =
    await Promise.all([
      getKpiStats(),
      getCandidatePipeline({ q, status }),
      getUpcomingInterviews(),
      getRecentActivity(),
    ]);

  const hasFilters = !!(q || status);
  const greeting   = getGreeting();
  const today      = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              {greeting},{" "}
              <span className="text-accent">
                {session.user.name?.split(" ")[0] ?? "there"}
              </span>
            </h1>
            <p className="mt-0.5 text-sm text-text-muted">{today}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
            <span className="text-xs text-text-muted">Live</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">

        {/* KPI cards */}
        <section aria-label="Key metrics">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              title="Open Jobs"
              value={stats.openJobs}
              icon={Briefcase}
              description="Active job openings"
              accent="violet"
            />
            <KpiCard
              title="Candidates"
              value={stats.totalCandidates}
              icon={Users}
              description="Active in pipeline"
              accent="blue"
            />
            <KpiCard
              title="Interviews This Week"
              value={stats.interviewsThisWeek}
              icon={CalendarDays}
              description="Scheduled Mon – Sun"
              accent="amber"
            />
            <KpiCard
              title="Offers Sent"
              value={stats.offersSent}
              icon={FileOutput}
              description="Offer sent or hired"
              accent="green"
            />
          </div>
        </section>

        {/* Pipeline search + filter bar */}
        <section aria-label="Pipeline filters">
          <Suspense fallback={<div className="h-9" />}>
            <PipelineFilters />
          </Suspense>
        </section>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Pipeline table — 2 cols */}
          <section className="lg:col-span-2" aria-label="Candidate pipeline">
            <CandidatePipeline
              candidates={candidates}
              hasFilters={hasFilters}
            />
          </section>

          {/* Upcoming interviews — 1 col */}
          <section aria-label="Upcoming interviews">
            <UpcomingInterviews interviews={upcomingInterviews} />
          </section>

        </div>

        {/* Recent activity — full width */}
        <section aria-label="Recent activity">
          <RecentActivity events={recentActivity} />
        </section>

      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
