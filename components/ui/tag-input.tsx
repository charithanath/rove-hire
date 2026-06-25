"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
}

/**
 * Tag input — type a skill and press Enter or comma to add.
 * Backspace on empty input removes the last tag.
 */
export function TagInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  error,
  hint,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim().replace(/,$/, "").trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInputValue("");
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5",
          "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-1 focus-within:ring-offset-bg",
          "transition-colors cursor-text",
          error && "border-danger focus-within:ring-danger"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, i) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-accent/20 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-2.5 w-2.5" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputValue) addTag(inputValue); }}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-disabled focus:outline-none"
          placeholder={value.length === 0 ? placeholder : ""}
          aria-label={label ?? "Tag input"}
        />
      </div>

      {error && (
        <p className="text-xs text-danger" role="alert">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}
