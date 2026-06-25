import { Briefcase } from "lucide-react";

interface JobsEmptyStateProps {
  filtered?: boolean;
}

export function JobsEmptyState({ filtered = false }: JobsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
        <Briefcase className="h-5 w-5 text-text-muted" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">
          {filtered ? "No jobs match your filters" : "No job openings yet"}
        </p>
        <p className="mt-1 text-xs text-text-muted max-w-xs">
          {filtered
            ? "Try adjusting your search or status filter."
            : "Create your first job opening to start building your pipeline."}
        </p>
      </div>
    </div>
  );
}
