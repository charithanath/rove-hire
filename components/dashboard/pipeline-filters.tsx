"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All",                                        value: "" },
  { label: STATUS_LABELS.APPLIED,                        value: "APPLIED" },
  { label: STATUS_LABELS.FORM_SUBMITTED,                 value: "FORM_SUBMITTED" },
  { label: STATUS_LABELS.INTERVIEW_SCHEDULED,            value: "INTERVIEW_SCHEDULED" },
  { label: STATUS_LABELS.OFFER_SENT,                     value: "OFFER_SENT" },
  { label: STATUS_LABELS.HIRED,                          value: "HIRED" },
  { label: STATUS_LABELS.REJECTED,                       value: "REJECTED" },
];

export function PipelineFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") ?? "";
  const currentQ      = searchParams.get("q") ?? "";

  // Local input state — debounced before hitting the server
  const [inputValue, setInputValue] = useState(currentQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep input in sync if URL changes externally (e.g. browser back)
  useEffect(() => {
    setInputValue(currentQ);
  }, [currentQ]);

  const pushParams = useCallback(
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

  function handleSearchChange(value: string) {
    setInputValue(value);
    // Debounce: wait 400ms after user stops typing before navigating
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ q: value });
    }, 400);
  }

  function clearSearch() {
    setInputValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushParams({ q: "" });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search by name or role..."
          value={inputValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={cn(
            "h-9 w-full sm:w-64 rounded-md border border-border bg-surface pl-8 pr-8 text-sm text-text-primary",
            "placeholder:text-text-disabled",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg",
            "transition-colors",
            isPending && "opacity-60"
          )}
          aria-label="Search candidates by name or role"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1 shrink-0">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => pushParams({ status: filter.value })}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-colors",
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
