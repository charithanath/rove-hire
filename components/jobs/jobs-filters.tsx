"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { label: "All",    value: ""       },
  { label: "Open",   value: "OPEN"   },
  { label: "Closed", value: "CLOSED" },
] as const;

export function JobsFilters() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") ?? "";
  const currentQ      = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search jobs..."
          defaultValue={currentQ}
          onChange={(e) => updateParams({ q: e.target.value })}
          className={cn(
            "h-9 w-56 rounded-md border border-border bg-surface pl-8 pr-8 text-sm text-text-primary",
            "placeholder:text-text-disabled",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg",
            "transition-colors",
            isPending && "opacity-60"
          )}
          aria-label="Search jobs by title"
        />
        {currentQ && (
          <button
            onClick={() => updateParams({ q: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => updateParams({ status: filter.value })}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              currentStatus === filter.value
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-primary hover:bg-[var(--color-surface-hover)]"
            )}
            aria-pressed={currentStatus === filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
