"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { completeInterviewSchema, type CompleteInterviewInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface CompleteInterviewModalProps {
  interviewId: string;
  interviewerName: string;
  interviewType: "SCREENING" | "TECHNICAL";
}

const RECOMMENDATIONS = [
  {
    value: "HIRE",
    label: "Hire",
    description: "Strong candidate, recommend proceeding",
    color: "border-green-200 bg-green-50 text-green-700",
    selected: "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200",
  },
  {
    value: "MAYBE",
    label: "Maybe",
    description: "Promising but has reservations",
    color: "border-amber-200 bg-amber-50 text-amber-700",
    selected: "border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-200",
  },
  {
    value: "NO_HIRE",
    label: "No hire",
    description: "Not the right fit at this time",
    color: "border-red-200 bg-red-50 text-red-700",
    selected: "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200",
  },
] as const;

export function CompleteInterviewModal({
  interviewId,
  interviewerName,
  interviewType,
}: CompleteInterviewModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompleteInterviewInput>({
    resolver: zodResolver(completeInterviewSchema),
  });

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function onSubmit(data: CompleteInterviewInput) {
    const res = await fetch(`/api/interviews/${interviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? "Failed to record feedback");
      return;
    }

    toast.success("Interview feedback recorded");
    handleClose();
    router.refresh();
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
        Mark completed
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Record interview feedback"
        description={`${interviewType === "TECHNICAL" ? "Technical" : "Screening"} interview · ${interviewerName}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Recommendation — visual card picker */}
          <div>
            <p className="text-sm font-medium text-text-primary mb-2">
              Recommendation
              <span className="ml-1 text-danger" aria-hidden="true">*</span>
            </p>
            <Controller
              name="recommendation"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {RECOMMENDATIONS.map((rec) => (
                    <button
                      key={rec.value}
                      type="button"
                      onClick={() => field.onChange(rec.value)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all",
                        field.value === rec.value ? rec.selected : rec.color
                      )}
                    >
                      <p className="text-sm font-semibold">{rec.label}</p>
                      <p className="text-xs mt-0.5 opacity-80">{rec.description}</p>
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.recommendation && (
              <p className="text-xs text-danger mt-1" role="alert">
                {errors.recommendation.message}
              </p>
            )}
          </div>

          {/* Feedback notes */}
          <Textarea
            label="Feedback notes"
            placeholder="Describe your assessment of the candidate..."
            rows={4}
            required
            error={errors.feedbackNotes?.message}
            {...register("feedbackNotes")}
          />

          <div className="flex justify-end gap-2 pt-1 border-t border-border mt-1">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save feedback
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
