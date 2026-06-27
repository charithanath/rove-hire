import type { Metadata } from "next";
import { Briefcase, Users, CalendarDays } from "lucide-react";
import { requireAuth } from "@/lib/auth-helpers";
import {
  getKpiStats,
  getCandidatePipeline,
  getUpcomingInterviews,
  getRecentActivity,
} from "@/lib/dashboard";
import { getOpenJobs } from "@/lib/jobs";
import { KpiCard }           from "@/components/dashboard/kpi-card";
import { CandidatePipeline } from "@/components/dashboard/candidate-pipeline";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { RecentActivity }    from "@/components/dashboard/recent-activity";
import { AddCandidateModal } from "@/components/candidates/add-candidate-modal";
import { format } from "date-fns";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireAuth();

  const [stats, initialCandidates, upcomingInterviews, recentActivity, openJobs] =
    await Promise.all([
      getKpiStats(),
      getCandidatePipeline(),
      getUpcomingInterviews(),
      getRecentActivity(),
      getOpenJobs(),
    ]);

  const greeting = getGreeting();
  const today    = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="min-h-full flex flex-col">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-[16px] font-bold text-text-primary leading-tight">
            {greeting},{" "}
            <span className="text-accent">
              {session.user.name?.split(" ")[0] ?? "there"}
            </span>
          </h1>
          <p className="text-[12px] text-text-muted mt-0.5 font-medium">{today}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <AddCandidateModal openJobs={openJobs} />
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-3">
          <KpiCard title="Open Jobs"            value={stats.openJobs}           icon={Briefcase}    description="Active job openings"  accent="blue"   href="/jobs"       />
          <KpiCard title="In Pipeline"          value={stats.totalCandidates}    icon={Users}        description="Active candidates"    accent="violet" href="/candidates" />
          <KpiCard title="Interviews This Week" value={stats.interviewsThisWeek} icon={CalendarDays} description="Mon – Sun"            accent="amber"  href="/interviews" />
        </div>

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <section className="lg:col-span-2" aria-label="Candidate pipeline">
            <CandidatePipeline initialCandidates={initialCandidates} />
          </section>
          <section aria-label="Upcoming interviews">
            <UpcomingInterviews interviews={upcomingInterviews} />
          </section>
        </div>

        {/* Activity feed */}
        <section aria-label="Recent activity">
          <RecentActivity events={recentActivity} />
        </section>

      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
