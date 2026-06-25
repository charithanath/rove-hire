import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HRNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-12 text-center">
      <p className="text-5xl font-bold text-text-muted/30 select-none">404</p>
      <div>
        <h2 className="text-base font-semibold text-text-primary">
          Page not found
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          This page doesn&apos;t exist or you don&apos;t have access.
        </p>
      </div>
      <Button variant="secondary" size="sm" asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
