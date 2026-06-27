"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  candidateApplicationSchema,
  type CandidateApplicationInput,
} from "@/lib/validations";

interface ApplicationFormProps {
  token: string;
  candidateName: string;
  jobTitle: string;
}

export function ApplicationForm({
  token,
  candidateName,
  jobTitle,
}: ApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateApplicationInput>({
    resolver: zodResolver(candidateApplicationSchema),
  });

  async function onSubmit(data: CandidateApplicationInput) {
    setServerError(null);

    const res = await fetch(`/api/apply/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      if (json.error === "already_used") {
        setServerError("This link has already been used.");
      } else if (json.error === "expired") {
        setServerError("This link has expired.");
      } else {
        setServerError(json.error ?? "Something went wrong. Please try again.");
      }
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return <ConfirmationScreen candidateName={candidateName} />;
  }

  return (
    <div className="w-full max-w-lg">
      {/* Card header */}
      <div className="mb-6 text-center">
        <p className="text-sm text-text-muted">
          You&apos;re applying for{" "}
          <span className="font-medium text-text-primary">{jobTitle}</span>
        </p>
        <h1 className="mt-1 text-xl font-semibold text-text-primary">
          Hi {candidateName.split(" ")[0]}, complete your application
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Fill in your details below. This takes about 2 minutes.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Phone number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Current location"
              placeholder="e.g. London, UK"
              required
              error={errors.location?.message}
              {...register("location")}
            />
          </div>

          {/* Row 2 */}
          <Input
            label="Current role"
            placeholder="e.g. Senior Engineer at Acme Corp"
            required
            error={errors.currentRole?.message}
            {...register("currentRole")}
          />

          {/* Row 3 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Notice period"
              placeholder="e.g. 4 weeks"
              required
              error={errors.noticePeriod?.message}
              {...register("noticePeriod")}
            />
            <Input
              label="Salary expectation"
              placeholder="e.g. $120,000"
              required
              error={errors.salaryExpectation?.message}
              {...register("salaryExpectation")}
            />
          </div>

          {/* LinkedIn */}
          <Input
            label="LinkedIn URL"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            hint="Optional"
            error={errors.linkedinUrl?.message}
            {...register("linkedinUrl")}
          />

          {/* Server error */}
          {serverError && (
            <div
              className="rounded-md border border-danger/20 bg-danger/5 px-3 py-2.5 text-sm text-danger"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full mt-2"
            size="lg"
          >
            Submit application
          </Button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-text-muted">
        This link is for your use only and expires in 14 days.
      </p>
    </div>
  );
}

function ConfirmationScreen({ candidateName }: { candidateName: string }) {
  return (
    <div className="w-full max-w-md text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
      </div>
      <h1 className="text-xl font-semibold text-text-primary">
        Application received!
      </h1>
      <p className="mt-3 text-sm text-text-muted leading-relaxed">
        Thanks{" "}
        <span className="font-medium text-text-primary">
          {candidateName.split(" ")[0]}
        </span>
        , your details have been submitted. The ROVE team will be in touch
        shortly about next steps.
      </p>
      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <p className="text-xs text-text-muted">
          You can safely close this tab. This link has been used and will no
          longer accept submissions.
        </p>
      </div>
    </div>
  );
}
