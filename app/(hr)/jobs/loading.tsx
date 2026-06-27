import { Skeleton } from "@/components/ui/skeleton";

export default function JobsLoading() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-surface/60 px-6 py-3">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-56 rounded-md" />
          <Skeleton className="h-9 w-48 rounded-lg" />
        </div>
      </div>

      {/* List */}
      <div className="px-6 py-6">
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          {/* Column header */}
          <div className="border-b border-border bg-bg/50 px-5 py-2.5">
            <Skeleton className="h-3 w-16" />
          </div>
          {/* Rows */}
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-6 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
