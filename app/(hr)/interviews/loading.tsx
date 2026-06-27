import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewsLoading() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <Skeleton className="h-6 w-28 mb-1.5" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Upcoming section */}
        <div>
          <Skeleton className="h-3 w-20 mb-3" />
          <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
                <div className="hidden sm:block space-y-1 text-right">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
