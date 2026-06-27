"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { MagicLinkBox } from "@/components/ui/magic-link-box";
import { createCandidateSchema, type CreateCandidateInput } from "@/lib/validations";
import { validateResumeFile } from "@/lib/validations";

interface OpenJob {
  id: string;
  title: string;
  department: string | null;
}

interface AddCandidateModalProps {
  openJobs: OpenJob[];
}

type Step = "form" | "success";

export function AddCandidateModal({ openJobs }: AddCandidateModalProps) {
  const router = useRouter();
  const [open, setOpen]           = useState(false);
  const [step, setStep]           = useState<Step>("form");
  const [magicLink, setMagicLink] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>("");

  const jobOptions = openJobs.map((j) => ({
    value: j.id,
    label: j.department ? `${j.title} · ${j.department}` : j.title,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCandidateInput>({
    resolver: zodResolver(createCandidateSchema),
    mode: "onTouched", // show errors after field is touched, not only on submit
  });

  function handleOpen() {
    setStep("form");
    setMagicLink("");
    setResumeFile(null);
    setResumeError("");
    reset();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    if (step === "success") {
      router.refresh();
    }
  }

  async function onSubmit(data: CreateCandidateInput) {
    // Validate resume separately (it's a File, not in the Zod schema)
    if (!resumeFile) {
      setResumeError("Resume is required");
      return;
    }
    const fileErr = validateResumeFile(resumeFile);
    if (fileErr) {
      setResumeError(fileErr);
      return;
    }
    setResumeError("");

    const formData = new FormData();
    formData.append("name",   data.name);
    formData.append("email",  data.email);
    formData.append("jobId",  data.jobId);
    formData.append("resume", resumeFile);

    const res  = await fetch("/api/candidates", { method: "POST", body: formData });
    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? "Failed to add candidate");
      return;
    }

    setMagicLink(json.data.magicLink);
    setStep("success");
    toast.success("Candidate added successfully");
  }

  return (
    <>
      <Button onClick={handleOpen}>
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Add Candidate
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title={step === "form" ? "Add candidate" : "Candidate added"}
        description={
          step === "form"
            ? "Upload a resume and fill in the candidate's details."
            : "Share the link below with the candidate to complete their application."
        }
        size="md"
      >
        {step === "form" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Resume upload */}
            <FileDropzone
              value={resumeFile}
              onChange={(f) => { setResumeFile(f); if (f) setResumeError(""); }}
              error={resumeError}
            />

            {/* Job picker */}
            {openJobs.length === 0 ? (
              <div className="rounded-md border border-warning/20 bg-warning/5 px-3 py-2.5 text-sm text-warning">
                No open jobs available. Create a job opening first.
              </div>
            ) : (
              <Select
                label="Job opening"
                placeholder="Select a job..."
                options={jobOptions}
                error={errors.jobId?.message}
                {...register("jobId")}
              />
            )}

            {/* Name + Email */}
            <Input
              label="Full name"
              placeholder="e.g. Jane Smith"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="e.g. jane@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1 border-t border-border mt-1">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={openJobs.length === 0}
              >
                Add candidate
              </Button>
            </div>
          </form>
        ) : (
          // Success step — show magic link
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Candidate added to pipeline
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Status set to <strong>Applied</strong>. Share the link below to
                  collect their details.
                </p>
              </div>
            </div>

            <MagicLinkBox url={magicLink} />

            <div className="flex justify-end pt-1 border-t border-border mt-1">
              <Button onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
