"use client";

import { useState } from "react";
import { Copy, Check, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagicLinkBoxProps {
  url: string;
}

export function MagicLinkBox({ url }: MagicLinkBoxProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Link className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden="true" />
        <p className="text-xs font-medium text-accent">
          Candidate application link
        </p>
      </div>
      <p className="text-xs text-text-muted mb-3 leading-relaxed">
        Share this link with the candidate. It expires in 14 days and can only
        be used once.
      </p>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2">
          <p className="truncate text-xs font-mono text-text-muted">{url}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
            copied
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-accent text-white hover:bg-[var(--color-accent-hover)]"
          )}
          aria-label={copied ? "Copied!" : "Copy link"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
