import { Skeleton } from "@/components/ui/skeleton";

export default function CandidateProfileLoading() {
  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <Skeleton className="h-3 w-20 mb-3" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-40 shrink-0" />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
