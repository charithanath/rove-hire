import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title:        string;
  value:        number;
  icon:         LucideIcon;
  description?: string;
  accent?:      "default" | "blue" | "violet" | "amber" | "green";
  href?:        string;
}

const ACCENT: Record<
  NonNullable<KpiCardProps["accent"]>,
  { icon: string; value: string; border: string }
> = {
  default: { icon: "bg-slate-100 text-slate-500",   value: "text-slate-700",   border: "border-l-slate-300"   },
  blue:    { icon: "bg-blue-50 text-blue-600",       value: "text-blue-700",    border: "border-l-blue-500"    },
  violet:  { icon: "bg-violet-50 text-violet-600",   value: "text-violet-700",  border: "border-l-violet-500"  },
  amber:   { icon: "bg-amber-50 text-amber-600",     value: "text-amber-700",   border: "border-l-amber-400"   },
  green:   { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700", border: "border-l-emerald-500" },
};

export function KpiCard({ title, value, icon: Icon, description, accent = "default", href }: KpiCardProps) {
  const a = ACCENT[accent];

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </p>
        <div className={cn("rounded-lg p-2 shrink-0", a.icon)}>
          <Icon className="h-[14px] w-[14px]" aria-hidden="true" />
        </div>
      </div>
      <p className={cn("text-[32px] font-bold tracking-tight leading-none mb-1.5", a.value)}>
        {value}
      </p>
      {description && (
        <p className="text-[11px] text-text-muted">{description}</p>
      )}
    </>
  );

  const baseClass = cn(
    "relative overflow-hidden rounded-xl border border-border border-l-[3px] bg-surface px-5 py-4",
    "transition-all duration-150 hover:shadow-md hover:-translate-y-px",
    href && "cursor-pointer",
    a.border
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}
