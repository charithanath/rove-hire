"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCheck } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface HireCandidateModalProps {
  candidateId:   string;
  candidateName: string;
}

export function HireCandidateModal({
  candidateId,
  candidateName,
}: HireCandidateModalProps) {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleHire() {
    setLoading(true);

    const res = await fetch(`/api/candidates/${candidateId}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action: "hire" }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(json.error ?? "Failed to mark as hired");
      return;
    }

    toast.success(`${candidateName} marked as hired 🎉`);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <UserCheck className="h-4 w-4" aria-hidden="true" />
        Mark as Hired
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Mark as hired"
        description={`Confirm that ${candidateName} has accepted the offer and will be joining ROVE.`}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          {/* Confirmation message */}
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm text-green-800 leading-relaxed">
              This will move{" "}
              <span className="font-semibold">{candidateName}</span> to{" "}
              <span className="font-semibold">Hired</span> status. This
              action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-border">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button loading={loading} onClick={handleHire}>
              Confirm hire
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
