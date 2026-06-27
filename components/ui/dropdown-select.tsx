"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownSelectOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  value:     string;
  onChange:  (value: string) => void;
  options:   DropdownSelectOption[];
  placeholder?: string;
  icon?:     React.ReactNode;
  className?: string;
}

export function DropdownSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  icon,
  className,
}: DropdownSelectProps) {
  const selected = options.find((o) => o.value === value);
  const label    = selected?.label ?? placeholder;
  const isActive = !!value;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium transition-colors",
            "hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg",
            isActive ? "border-accent/40 text-accent" : "text-text-muted",
            className
          )}
          aria-label="Filter by status"
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{label}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
              "data-[state=open]:rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            "z-50 min-w-[180px] overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/10",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
            "duration-100"
          )}
        >
          <div className="p-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <DropdownMenu.Item
                  key={opt.value}
                  onSelect={() => onChange(opt.value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm outline-none transition-colors select-none",
                    isSelected
                      ? "bg-accent/8 text-accent font-medium"
                      : "text-text-primary hover:bg-[var(--color-surface-hover)]"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                  )}
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
