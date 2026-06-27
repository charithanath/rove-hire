"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileOutput, Download, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { generateOfferSchema, type GenerateOfferInput } from "@/lib/validations";

interface GenerateOfferModalProps {
  candidateId: string;
  candidateName: string;
  defaultRoleTitle?: string;
}

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "INR", label: "INR — Indian Rupee" },
  { value: "AUD", label: "AUD — Australian Dollar" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
];

interface GeneratedUrls {
  offerPdfUrl: string;
  ndaPdfUrl: string;
}

export function GenerateOfferModal({
  candidateId,
  candidateName,
  defaultRoleTitle = "",
}: GenerateOfferModalProps) {
  const router = useRouter();
  const [open, setOpen]               = useState(false);
  const [generated, setGenerated]     = useState<GeneratedUrls | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerateOfferInput>({
    resolver: zodResolver(generateOfferSchema),
    defaultValues: {
      roleTitle:        defaultRoleTitle,
      salaryCurrency:   "USD",
      salaryAmount:     undefined,
      startDate:        "",
      reportingManager: "",
      workLocation:     "",
    },
  });

  function handleClose() {
    setOpen(false);
    if (generated) {
      router.refresh();
    }
    setTimeout(() => {
      setGenerated(null);
      reset();
    }, 200);
  }

  async function onSubmit(data: GenerateOfferInput) {
    const res = await fetch(`/api/candidates/${candidateId}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? "Failed to generate offer documents");
      return;
    }

    setGenerated({
      offerPdfUrl: json.data.offerPdfUrl,
      ndaPdfUrl:   json.data.ndaPdfUrl,
    });
    toast.success("Offer documents generated");
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="primary">
        <FileOutput className="h-4 w-4" aria-hidden="true" />
        Generate Offer
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title={generated ? "Documents generated" : "Generate offer documents"}
        description={
          generated
            ? "Download the PDFs below. They are also saved on the candidate's profile."
            : `Prepare offer documents for ${candidateName}`
        }
        size="md"
      >
        {generated ? (
          /* ── Success state ─────────────────────────────────────────── */
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Offer documents ready
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Candidate status moved to <strong>Offer Sent</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={generated.offerPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-[var(--color-surface-hover)] transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 shrink-0">
                  <FileOutput className="h-4 w-4 text-violet-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                    Offer Letter
                  </p>
                  <p className="text-xs text-text-muted">PDF · Click to open</p>
                </div>
                <Download className="h-4 w-4 text-text-muted shrink-0" aria-hidden="true" />
              </a>

              <a
                href={generated.ndaPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-[var(--color-surface-hover)] transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                  <FileOutput className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                    Non-Disclosure Agreement (NDA)
                  </p>
                  <p className="text-xs text-text-muted">PDF · Click to open</p>
                </div>
                <Download className="h-4 w-4 text-text-muted shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div className="flex justify-end pt-1 border-t border-border mt-1">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        ) : (
          /* ── Form state ────────────────────────────────────────────── */
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Role title"
              placeholder="e.g. Senior Frontend Engineer"
              required
              error={errors.roleTitle?.message}
              {...register("roleTitle")}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Currency"
                options={CURRENCY_OPTIONS}
                required
                error={errors.salaryCurrency?.message}
                {...register("salaryCurrency")}
              />
              <Input
                label="Annual salary"
                type="number"
                placeholder="e.g. 120000"
                required
                error={errors.salaryAmount?.message}
                {...register("salaryAmount", { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Start date"
              type="date"
              required
              error={errors.startDate?.message}
              {...register("startDate")}
            />

            <Input
              label="Reporting manager"
              placeholder="e.g. James Liu"
              required
              error={errors.reportingManager?.message}
              {...register("reportingManager")}
            />

            <Input
              label="Work location"
              placeholder="e.g. London, UK (Hybrid)"
              required
              error={errors.workLocation?.message}
              {...register("workLocation")}
            />

            <div className="flex justify-end gap-2 pt-1 border-t border-border mt-1">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isSubmitting ? "Generating PDFs…" : "Generate documents"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
