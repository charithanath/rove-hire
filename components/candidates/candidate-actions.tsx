"use client";

import type { CandidateStatus } from "@prisma/client";
import { ScheduleInterviewModal }  from "./schedule-interview-modal";
import { CompleteInterviewModal }  from "./complete-interview-modal";
import { GenerateOfferModal }      from "./generate-offer-modal";
import { HireCandidateModal }      from "./hire-candidate-modal";
import { RejectCandidateModal }    from "./reject-candidate-modal";

interface PendingInterview {
  id:              string;
  interviewerName: string;
  interviewType:   "SCREENING" | "TECHNICAL";
  status:          "SCHEDULED" | "COMPLETED";
}

interface CandidateActionsProps {
  candidateId:      string;
  candidateName:    string;
  status:           CandidateStatus;
  hasOffer:         boolean;
  pendingInterview: PendingInterview | null;
  defaultRoleTitle?: string;
}

/**
 * Context-sensitive action buttons on the candidate profile header.
 *
 * Status → available actions:
 *  APPLIED             → Reject
 *  FORM_SUBMITTED      → Schedule Interview · Reject
 *  INTERVIEW_SCHEDULED → Complete Interview · Schedule another · Generate Offer · Reject
 *  OFFER_SENT          → Mark Hired · Generate Offer (re-issue) · Reject
 *  HIRED / REJECTED    → nothing (terminal — component returns null)
 */
export function CandidateActions({
  candidateId,
  candidateName,
  status,
  hasOffer,
  pendingInterview,
  defaultRoleTitle,
}: CandidateActionsProps) {
  // Terminal — no actions
  if (status === "HIRED" || status === "REJECTED") return null;

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* APPLIED → schedule interview (HR can schedule before form is submitted) */}
      {status === "APPLIED" && (
        <ScheduleInterviewModal
          candidateId={candidateId}
          candidateName={candidateName}
        />
      )}

      {/* FORM_SUBMITTED → schedule interview */}
      {status === "FORM_SUBMITTED" && (
        <ScheduleInterviewModal
          candidateId={candidateId}
          candidateName={candidateName}
        />
      )}

      {/* INTERVIEW_SCHEDULED → complete the pending interview */}
      {status === "INTERVIEW_SCHEDULED" && pendingInterview && (
        <CompleteInterviewModal
          interviewId={pendingInterview.id}
          interviewerName={pendingInterview.interviewerName}
          interviewType={pendingInterview.interviewType}
        />
      )}

      {/* INTERVIEW_SCHEDULED → schedule another round */}
      {status === "INTERVIEW_SCHEDULED" && (
        <ScheduleInterviewModal
          candidateId={candidateId}
          candidateName={candidateName}
        />
      )}

      {/* INTERVIEW_SCHEDULED or OFFER_SENT → generate / re-generate offer */}
      {(status === "INTERVIEW_SCHEDULED" || status === "OFFER_SENT") && (
        <GenerateOfferModal
          candidateId={candidateId}
          candidateName={candidateName}
          defaultRoleTitle={defaultRoleTitle}
        />
      )}

      {/* OFFER_SENT → mark hired (requires offer to exist — enforced server-side too) */}
      {status === "OFFER_SENT" && hasOffer && (
        <HireCandidateModal
          candidateId={candidateId}
          candidateName={candidateName}
        />
      )}

      {/* All non-terminal statuses → reject */}
      <RejectCandidateModal
        candidateId={candidateId}
        candidateName={candidateName}
      />

    </div>
  );
}
