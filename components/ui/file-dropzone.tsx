"use client";

import * as React from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESUME_MAX_SIZE_BYTES } from "@/lib/validations";

interface FileDropzoneProps {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
}

export function FileDropzone({
  label = "Resume",
  value,
  onChange,
  error,
  accept = "application/pdf",
}: FileDropzoneProps) {
  const inputRef   = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  function handleFile(file: File) {
    onChange(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const sizeMB = value ? (value.size / (1024 * 1024)).toFixed(1) : null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
          <span className="ml-1 text-danger" aria-hidden="true">*</span>
        </label>
      )}

      {value ? (
        // File selected — show file info
        <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10">
            <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {value.name}
            </p>
            <p className="text-xs text-text-muted">{sizeMB} MB · PDF</p>
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-[var(--color-surface-hover)] hover:text-danger transition-colors"
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        // No file — show drop zone
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8",
            "transition-colors cursor-pointer",
            dragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50 hover:bg-[var(--color-surface-hover)]",
            error && "border-danger"
          )}
          aria-label="Upload resume PDF"
        >
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            dragging ? "bg-accent/10" : "bg-gray-100"
          )}>
            <UploadCloud
              className={cn("h-5 w-5", dragging ? "text-accent" : "text-text-muted")}
              aria-hidden="true"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">
              Drop PDF here or{" "}
              <span className="text-accent">browse</span>
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              PDF only · Max {RESUME_MAX_SIZE_BYTES / 1024 / 1024} MB
            </p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {error && (
        <p className="text-xs text-danger" role="alert">{error}</p>
      )}
    </div>
  );
}
