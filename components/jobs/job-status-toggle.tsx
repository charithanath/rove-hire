"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { JobStatus } from "@prisma/client";

interface JobStatusToggleProps {
  jobId: string;
  currentStatus: JobStatus;
}

export function JobStatusToggle({ jobId, currentStatus }: JobStatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isOpen = currentStatus === "OPEN";

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const res = await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: isOpen ? "CLOSED" : "OPEN" }),
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Failed to update job status");
      return;
    }

    toast.success(isOpen ? "Job closed" : "Job reopened");
    router.refresh();
  }

  return (
    <Button
      variant={isOpen ? "secondary" : "ghost"}
      size="sm"
      loading={loading}
      onClick={toggle}
      aria-label={isOpen ? "Close job" : "Reopen job"}
    >
      {isOpen ? "Close job" : "Reopen"}
    </Button>
  );
}
