"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserX } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  reason: z.string().min(1, "Please provide a reason for rejection"),
});

type FormValues = z.infer<typeof schema>;

interface RejectCandidateModalProps {
  candidateId:   string;
  candidateName: string;
}

export function RejectCandidateModal({
  candidateId,
  candidateName,
}: RejectCandidateModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function onSubmit(data: FormValues) {
    const res = await fetch(`/api/candidates/${candidateId}/status`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ action: "reject", reason: data.reason }),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? "Failed to reject candidate");
      return;
    }

    toast.success(`${candidateName} marked as rejected`);
    handleClose();
    router.refresh();
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        <UserX className="h-4 w-4" aria-hidden="true" />
        Reject
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Reject candidate"
        description={`Provide a reason for rejecting ${candidateName}.`}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Textarea
            label="Reason for rejection"
            placeholder="e.g. Strong candidate but not the right fit for this role at this time..."
            rows={4}
            required
            error={errors.reason?.message}
            {...register("reason")}
          />

          <div className="flex justify-end gap-2 pt-1 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={isSubmitting}>
              Confirm rejection
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
