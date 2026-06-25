"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { JobForm } from "./job-form";

export function CreateJobModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        New job
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create job opening"
        description="Fill in the details below to post a new role."
        size="lg"
      >
        <JobForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
