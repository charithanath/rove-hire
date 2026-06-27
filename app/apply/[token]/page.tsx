import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ApplicationForm } from "./application-form";
import { Clock, XCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "Complete Your Application | ROVE Hire" };
export const dynamic = "force-dynamic";

interface ApplyPageProps {
  params: Promise<{ token: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { token } = await params;

  // Validate token server-side — no API call needed, query directly
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: {
      candidate: {
        select: {
          name: true,
          job: { select: { title: true } },
        },
      },
    },
  });

  // ── Guard screens ──────────────────────────────────────────────────────────

  if (!magicLink) {
    return (
      <PublicShell>
        <GuardScreen
          icon={XCircle}
          iconClass="text-danger"
          iconBg="bg-red-100"
          title="Link not found"
          message="This application link doesn't exist or may have been removed. Please contact the ROVE team if you believe this is an error."
        />
      </PublicShell>
    );
  }

  if (magicLink.usedAt) {
    return (
      <PublicShell>
        <GuardScreen
          icon={CheckCircle}
          iconClass="text-green-600"
          iconBg="bg-green-100"
          title="Already submitted"
          message="You've already completed this application. The ROVE team will be in touch with next steps."
        />
      </PublicShell>
    );
  }

  if (magicLink.expiresAt < new Date()) {
    return (
      <PublicShell>
        <GuardScreen
          icon={Clock}
          iconClass="text-amber-600"
          iconBg="bg-amber-100"
          title="This link has expired"
          message="Application links are valid for 14 days. Please reach out to the ROVE team to request a new link."
        />
      </PublicShell>
    );
  }

  // ── Valid token — show the form ────────────────────────────────────────────

  return (
    <PublicShell>
      <ApplicationForm
        token={token}
        candidateName={magicLink.candidate.name}
        jobTitle={magicLink.candidate.job.title}
      />
    </PublicShell>
  );
}

// ── Layout wrapper ─────────────────────────────────────────────────────────

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      {/* ROVE branding */}
      <div className="mb-8 flex items-center gap-2">
        <Image
          src="/rove-logo.jpg"
          alt="ROVE"
          width={32}
          height={32}
          className="rounded-lg object-contain"
          priority
        />
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          ROVE Hire
        </span>
      </div>

      {children}
    </div>
  );
}

function GuardScreen({
  icon: Icon,
  iconClass,
  iconBg,
  title,
  message,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  iconBg: string;
  title: string;
  message: string;
}) {
  return (
    <div className="w-full max-w-sm text-center">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon className={`h-7 w-7 ${iconClass}`} aria-hidden="true" />
      </div>
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      <p className="mt-2 text-sm text-text-muted leading-relaxed">{message}</p>
      <div className="mt-6 rounded-xl border border-border bg-surface p-4">
        <p className="text-xs text-text-muted">
          Need help?{" "}
          <a
            href="mailto:careers@rovehire.com"
            className="text-accent hover:underline"
          >
            Contact ROVE
          </a>
        </p>
      </div>
    </div>
  );
}


