import { Skeleton } from "@/components/ui/skeleton";

export default function CandidatesLoading() {
  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-surface px-6 py-5">
        <Skeleton className="h-6 w-28 mb-1.5" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="px-6 py-6">
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="border-b border-border bg-bg/50 px-5 py-2.5 flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-5 w-20 rounded-md hidden sm:block" />
                <div className="hidden sm:block space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-16 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
