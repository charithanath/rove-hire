"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { scheduleInterviewSchema, type ScheduleInterviewInput } from "@/lib/validations";

interface ScheduleInterviewModalProps {
  candidateId: string;
  candidateName: string;
}

const INTERVIEW_TYPE_OPTIONS = [
  { value: "SCREENING", label: "Screening" },
  { value: "TECHNICAL", label: "Technical" },
];

export function ScheduleInterviewModal({
  candidateId,
  candidateName,
}: ScheduleInterviewModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleInterviewInput>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: { interviewType: "SCREENING" },
  });

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function onSubmit(data: ScheduleInterviewInput) {
    const res = await fetch(`/api/candidates/${candidateId}/interviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? "Failed to schedule interview");
      return;
    }

    toast.success("Interview scheduled");
    handleClose();
    router.refresh();
  }

  // Format today's datetime for the min attribute
  const nowLocal = new Date();
  nowLocal.setMinutes(nowLocal.getMinutes() - nowLocal.getTimezoneOffset());
  const minDatetime = nowLocal.toISOString().slice(0, 16);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Schedule Interview
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Schedule interview"
        description={`Schedule an interview for ${candidateName}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Type */}
          <Select
            label="Interview type"
            options={INTERVIEW_TYPE_OPTIONS}
            required
            error={errors.interviewType?.message}
            {...register("interviewType")}
          />

          {/* Date + time */}
          <Input
            label="Date and time"
            type="datetime-local"
            min={minDatetime}
            required
            error={errors.scheduledAt?.message}
            {...register("scheduledAt")}
          />

          {/* Interviewer */}
          <Input
            label="Interviewer name"
            placeholder="e.g. James Liu"
            required
            error={errors.interviewerName?.message}
            {...register("interviewerName")}
          />

          {/* Notes */}
          <Textarea
            label="Notes"
            placeholder="Optional preparation notes or agenda..."
            rows={3}
            error={errors.notes?.message}
            {...register("notes")}
          />

          <div className="flex justify-end gap-2 pt-1 border-t border-border mt-1">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
