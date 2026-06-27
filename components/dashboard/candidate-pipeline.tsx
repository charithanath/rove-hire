"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Search, X, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/candidates/status-badge";
import { formatRelative, cn, STATUS_LABELS } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import type { CandidateStatus } from "@prisma/client";

const PAGE_SIZE = 10;

interface PipelineCandidate {
  id:        string;
  name:      string;
  email:     string;
  status:    CandidateStatus;
  updatedAt: Date | string;
  job:       { id: string; title: string; department: string | null };
}

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: "All statuses",                    value: "" },
  { label: STATUS_LABELS.APPLIED,             value: "APPLIED" },
  { label: STATUS_LABELS.FORM_SUBMITTED,      value: "FORM_SUBMITTED" },
  { label: STATUS_LABELS.INTERVIEW_SCHEDULED, value: "INTERVIEW_SCHEDULED" },
  { label: STATUS_LABELS.OFFER_SENT,          value: "OFFER_SENT" },
  { label: STATUS_LABELS.HIRED,               value: "HIRED" },
  { label: STATUS_LABELS.REJECTED,            value: "REJECTED" },
];

export function CandidatePipeline({ initialCandidates }: { initialCandidates: PipelineCandidate[] }) {
  const [allCandidates, setAllCandidates] = useState<PipelineCandidate[]>(initialCandidates);
  const [status,  setStatus]  = useState("");
  const [q,       setQ]       = useState("");
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(1);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevInitialRef = useRef(initialCandidates);

  useEffect(() => {
    const prev = prevInitialRef.current;
    const changed = prev.length !== initialCandidates.length || prev[0]?.id !== initialCandidates[0]?.id;
    if (changed) {
      // Always re-fetch with current filters so the new candidate appears
      // regardless of whether search/status filters are active
      fetchCandidates(q, status);
    }
    prevInitialRef.current = initialCandidates;
  }, [initialCandidates]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCandidates = useCallback(async (search: string, statusFilter: string) => {
    setLoading(true); setPage(1);
    try {
      const params = new URLSearchParams();
      if (search)       params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/candidates?${params}`);
      const json = await res.json();
      if (res.ok) setAllCandidates(json.data ?? []);
    } finally { setLoading(false); }
  }, []);

  function handleStatusChange(value: string) { setStatus(value); fetchCandidates(q, value); }
  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCandidates(value, status), 400);
  }
  function clearSearch() { setQ(""); if (debounceRef.current) clearTimeout(debounceRef.current); fetchCandidates("", status); }

  const totalPages = Math.max(1, Math.ceil(allCandidates.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * PAGE_SIZE;
  const paginated  = allCandidates.slice(start, start + PAGE_SIZE);
  const hasFilters = !!(q || status);

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-[13px] font-semibold text-text-primary whitespace-nowrap">
            Candidate Pipeline
          </h2>
          {!loading && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-text-muted">
              {allCandidates.length}
            </span>
          )}
          {loading && <Spinner size="sm" />}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search candidates…"
              value={q}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-8 w-44 rounded-lg border border-border bg-[var(--color-bg)] pl-8 pr-7 text-[13px] text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              aria-label="Search candidates"
            />
            {q && (
              <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-muted transition-colors" aria-label="Clear">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-8 appearance-none rounded-lg border border-border bg-[var(--color-bg)] pl-8 pr-7 text-[13px] text-text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              aria-label="Filter by status"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── Column headers ────────────────────────────────────────────────── */}
      {paginated.length > 0 && (
        <div className="grid grid-cols-[1fr_148px_148px_96px] gap-3 border-b border-border bg-[var(--color-bg)] px-4 py-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Candidate</span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Role</span>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">Activity</span>
        </div>
      )}

      {/* ── Rows ─────────────────────────────────────────────────────────── */}
      {paginated.length === 0 && !loading ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className={cn("divide-y divide-border", loading && "opacity-40 pointer-events-none select-none")}>
          {paginated.map((c) => <PipelineRow key={c.id} candidate={c} />)}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {allCandidates.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-border bg-[var(--color-bg)] px-4 py-2.5">
          <p className="text-[12px] text-text-muted">
            {start + 1}–{Math.min(start + PAGE_SIZE, allCandidates.length)} of {allCandidates.length}
          </p>
          <div className="flex items-center gap-1">
            <PagBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} label="Previous">
              <ChevronLeft className="h-3.5 w-3.5" />
            </PagBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p); return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="px-1 text-[12px] text-text-muted">…</span>
                ) : (
                  <PagBtn key={p} onClick={() => setPage(p as number)} active={safePage === p} label={`Page ${p}`}>
                    {p}
                  </PagBtn>
                )
              )}
            <PagBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} label="Next">
              <ChevronRight className="h-3.5 w-3.5" />
            </PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineRow({ candidate }: { candidate: PipelineCandidate }) {
  const router = useRouter();

  return (
    <div
      role="row"
      onClick={() => router.push(`/candidates/${candidate.id}`)}
      className="group grid grid-cols-[1fr_148px_148px_96px] gap-3 items-center px-4 py-3 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent">
          {getInitials(candidate.name)}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text-primary truncate group-hover:text-accent transition-colors leading-snug">
            {candidate.name}
          </p>
          <p className="text-[11px] text-text-muted truncate leading-snug">{candidate.email}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center">
        <StatusBadge status={candidate.status} />
      </div>

      {/* Role */}
      <div className="min-w-0">
        <p className="text-[13px] text-text-primary truncate leading-snug">{candidate.job.title}</p>
        {candidate.job.department && (
          <p className="text-[11px] text-text-muted truncate leading-snug">{candidate.job.department}</p>
        )}
      </div>

      {/* Activity */}
      <div className="flex items-center justify-end gap-1.5">
        <p className="text-[11px] text-text-muted tabular-nums">{formatRelative(candidate.updatedAt)}</p>
        <ArrowRight className="h-3 w-3 text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
        <Users className="h-[18px] w-[18px] text-text-muted" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-text-primary">
          {hasFilters ? "No candidates match your filters" : "No candidates yet"}
        </p>
        <p className="mt-1 text-[12px] text-text-muted">
          {hasFilters ? "Clear filters or try a different search." : "Add your first candidate to get started."}
        </p>
      </div>
    </div>
  );
}

function PagBtn({ onClick, disabled, active, label, children }: {
  onClick: () => void; disabled?: boolean; active?: boolean; label: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-[12px] font-medium transition-colors",
        active
          ? "bg-accent text-white"
          : "border border-border text-text-muted hover:bg-[var(--color-surface-hover)] hover:text-text-primary",
        disabled && "opacity-40 pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
