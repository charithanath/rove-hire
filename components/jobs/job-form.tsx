"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { Button } from "@/components/ui/button";
import { createJobSchema, type CreateJobInput } from "@/lib/validations";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/utils";
import type { JobWithCount } from "@/types";

interface JobFormProps {
  /** Passed when editing an existing job */
  job?: JobWithCount;
  onSuccess: () => void;
  onCancel: () => void;
}

const EMPLOYMENT_OPTIONS = Object.entries(EMPLOYMENT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

const STATUS_OPTIONS = [
  { value: "OPEN",   label: "Open" },
  { value: "CLOSED", label: "Closed" },
];

export function JobForm({ job, onSuccess, onCancel }: JobFormProps) {
  const router = useRouter();
  const isEditing = !!job;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title:          job?.title          ?? "",
      description:    job?.description    ?? "",
      requiredSkills: job?.requiredSkills ?? [],
      status:         job?.status         ?? "OPEN",
      department:     job?.department     ?? "",
      location:       job?.location       ?? "",
      employmentType: job?.employmentType ?? "FULL_TIME",
    },
  });

  async function onSubmit(data: CreateJobInput) {
    const url    = isEditing ? `/api/jobs/${job.id}` : "/api/jobs";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(json.error ?? "Something went wrong");
      return;
    }

    toast.success(isEditing ? "Job updated" : "Job created");
    router.refresh();
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Title */}
      <Input
        label="Job title"
        placeholder="e.g. Senior Frontend Engineer"
        required
        error={errors.title?.message}
        {...register("title")}
      />

      {/* Department + Location */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Department"
          placeholder="e.g. Engineering"
          error={errors.department?.message}
          {...register("department")}
        />
        <Input
          label="Location"
          placeholder="e.g. London (Hybrid)"
          error={errors.location?.message}
          {...register("location")}
        />
      </div>

      {/* Employment type + Status */}
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <Select
              label="Employment type"
              options={EMPLOYMENT_OPTIONS}
              error={errors.employmentType?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              error={errors.status?.message}
              {...field}
            />
          )}
        />
      </div>

      {/* Required skills */}
      <Controller
        name="requiredSkills"
        control={control}
        render={({ field }) => (
          <TagInput
            label="Required skills"
            value={field.value ?? []}
            onChange={field.onChange}
            placeholder="Type a skill and press Enter"
            error={errors.requiredSkills?.message}
            hint="Press Enter or comma to add a skill"
          />
        )}
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Describe the role, responsibilities, and requirements..."
        required
        rows={6}
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1 border-t border-border mt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Save changes" : "Create job"}
        </Button>
      </div>
    </form>
  );
}
