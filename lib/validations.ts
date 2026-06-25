import { z } from "zod";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────

export const createJobSchema = z.object({
  title:          z.string().min(1, "Title is required").max(200),
  description:    z.string().min(1, "Description is required"),
  requiredSkills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
  status:         z.enum(["OPEN", "CLOSED"]).default("OPEN"),
  department:     z.string().max(100).optional().or(z.literal("")),
  location:       z.string().max(200).optional().or(z.literal("")),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).default("FULL_TIME"),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;

// ─────────────────────────────────────────────
// CANDIDATES
// ─────────────────────────────────────────────

export const createCandidateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  jobId: z.string().min(1, "Job is required"),
  // resume is handled as a File in the multipart request — validated separately
});

export const updateCandidateStatusSchema = z.object({
  status: z.enum([
    "APPLIED",
    "FORM_SUBMITTED",
    "INTERVIEW_SCHEDULED",
    "OFFER_SENT",
    "HIRED",
    "REJECTED",
  ]),
  rejectionReason: z.string().optional(),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateStatusInput = z.infer<
  typeof updateCandidateStatusSchema
>;

// ─────────────────────────────────────────────
// CANDIDATE PUBLIC FORM  (magic link page)
// ─────────────────────────────────────────────

export const candidateApplicationSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  currentRole: z.string().min(1, "Current role is required"),
  noticePeriod: z.string().min(1, "Notice period is required"),
  salaryExpectation: z.string().min(1, "Salary expectation is required"),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export type CandidateApplicationInput = z.infer<
  typeof candidateApplicationSchema
>;

// ─────────────────────────────────────────────
// INTERVIEWS
// ─────────────────────────────────────────────

export const scheduleInterviewSchema = z.object({
  interviewType: z.enum(["SCREENING", "TECHNICAL"]),
  scheduledAt: z.string().min(1, "Date and time are required"), // ISO string from datetime-local input
  interviewerName: z.string().min(1, "Interviewer name is required"),
  notes: z.string().optional(),
});

export const completeInterviewSchema = z.object({
  recommendation: z.enum(["HIRE", "NO_HIRE", "MAYBE"]),
  feedbackNotes: z.string().min(1, "Feedback notes are required"),
});

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>;
export type CompleteInterviewInput = z.infer<typeof completeInterviewSchema>;

// ─────────────────────────────────────────────
// OFFER DOCUMENTS
// ─────────────────────────────────────────────

export const generateOfferSchema = z.object({
  roleTitle: z.string().min(1, "Role title is required"),
  salaryCurrency: z.string().min(1, "Currency is required").max(3),
  salaryAmount: z
    .number({ invalid_type_error: "Salary must be a number" })
    .positive("Salary must be positive"),
  startDate: z.string().min(1, "Start date is required"), // YYYY-MM-DD
  reportingManager: z.string().min(1, "Reporting manager is required"),
  workLocation: z.string().min(1, "Work location is required"),
});

export type GenerateOfferInput = z.infer<typeof generateOfferSchema>;

// ─────────────────────────────────────────────
// FILE VALIDATION  (used in API routes)
// ─────────────────────────────────────────────

export const RESUME_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const RESUME_ACCEPTED_TYPES = ["application/pdf"];

export function validateResumeFile(file: File): string | null {
  if (!RESUME_ACCEPTED_TYPES.includes(file.type)) {
    return "Only PDF files are accepted";
  }
  if (file.size > RESUME_MAX_SIZE_BYTES) {
    return "File must be 10 MB or smaller";
  }
  return null; // valid
}
