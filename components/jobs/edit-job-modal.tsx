"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { JobForm } from "./job-form";
import type { JobWithCount } from "@/types";

interface EditJobModalProps {
  job: JobWithCount;
}

export function EditJobModal({ job }: EditJobModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        aria-label="Edit job"
        title="Edit job"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit job opening"
        description="Update the details for this role."
        size="lg"
      >
        <JobForm
          job={job}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
