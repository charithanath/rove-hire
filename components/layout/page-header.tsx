import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Action buttons / controls rendered flush-right */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Consistent page-level heading used at the top of every HR screen.
 * Server component — no client state needed.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-6 py-5 border-b border-border",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-text-primary leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
