import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { CandidateStatus, EmploymentType } from "@prisma/client";

// ─────────────────────────────────────────────
// Tailwind class merging utility
// Used throughout components: cn("base", conditional && "extra")
// ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────
// Date formatting
// ─────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// ─────────────────────────────────────────────
// Candidate status helpers
// ─────────────────────────────────────────────

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  APPLIED: "Applied",
  FORM_SUBMITTED: "Form Submitted",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  OFFER_SENT: "Offer Sent",
  HIRED: "Hired",
  REJECTED: "Rejected",
};

// Maps status to Tailwind color classes (background + text)
export const STATUS_COLORS: Record<
  CandidateStatus,
  { bg: string; text: string; dot: string }
> = {
  APPLIED: {
    bg:   "bg-gray-100",
    text: "text-gray-600",
    dot:  "bg-gray-400",
  },
  FORM_SUBMITTED: {
    bg:   "bg-blue-50",
    text: "text-blue-700",
    dot:  "bg-blue-400",
  },
  INTERVIEW_SCHEDULED: {
    bg:   "bg-violet-50",
    text: "text-violet-700",
    dot:  "bg-violet-400",
  },
  OFFER_SENT: {
    bg:   "bg-amber-50",
    text: "text-amber-700",
    dot:  "bg-amber-400",
  },
  HIRED: {
    bg:   "bg-green-50",
    text: "text-green-700",
    dot:  "bg-green-400",
  },
  REJECTED: {
    bg:   "bg-red-50",
    text: "text-red-700",
    dot:  "bg-red-400",
  },
};

// ─────────────────────────────────────────────
// Status transition rules
// Defines which statuses HR can manually transition to from a given status
// Used to render context-sensitive action buttons on the candidate profile
// ─────────────────────────────────────────────
export const STATUS_TRANSITIONS: Record<CandidateStatus, CandidateStatus[]> = {
  APPLIED: ["REJECTED"],
  FORM_SUBMITTED: ["INTERVIEW_SCHEDULED", "REJECTED"],
  INTERVIEW_SCHEDULED: ["OFFER_SENT", "REJECTED"],
  OFFER_SENT: ["HIRED", "REJECTED"],
  HIRED: [],    // terminal
  REJECTED: [], // terminal
};

// ─────────────────────────────────────────────
// Magic link helpers
// ─────────────────────────────────────────────
export function buildMagicLinkUrl(token: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/apply/${token}`;
}

// ─────────────────────────────────────────────
// Currency formatting
// ─────────────────────────────────────────────
export function formatSalary(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────
// Employment type labels
// ─────────────────────────────────────────────
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME:  "Full-time",
  PART_TIME:  "Part-time",
  CONTRACT:   "Contract",
  INTERNSHIP: "Internship",
};
