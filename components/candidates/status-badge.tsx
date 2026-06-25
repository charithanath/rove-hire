import { Badge, type BadgeProps } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/utils";
import type { CandidateStatus } from "@prisma/client";

const STATUS_VARIANT: Record<
  CandidateStatus,
  BadgeProps["variant"]
> = {
  APPLIED:              "default",
  FORM_SUBMITTED:       "blue",
  INTERVIEW_SCHEDULED:  "violet",
  OFFER_SENT:           "amber",
  HIRED:                "green",
  REJECTED:             "red",
};

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} dot className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
