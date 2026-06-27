import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

/**
 * Login page — server component.
 * Redirects already-authenticated users straight to the dashboard.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const { callbackUrl, error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      {/* Background subtle dot pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo + wordmark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/rove-logo.jpg"
            alt="ROVE"
            width={56}
            height={56}
            className="rounded-xl object-contain"
            priority
          />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-text-primary">
              ROVE Hire
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Internal recruitment platform
            </p>
          </div>
        </div>

        {/* Card */}        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-medium text-text-primary">
            Sign in to your account
          </h2>
          <LoginForm
            callbackUrl={callbackUrl ?? "/dashboard"}
            serverError={error}
          />
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-text-muted">
          Access restricted to ROVE HR team members.
        </p>
      </div>
    </div>
  );
}

