import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4", className)}>
      <div className="min-w-0">
        <h1 className="text-[16px] font-bold text-text-primary leading-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-[12px] font-medium text-text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
