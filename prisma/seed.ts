/**
 * ROVE Hire — Database Seed Script
 *
 * Run with:  npm run db:seed  (or: npx tsx prisma/seed.ts)
 *
 * Creates:
 *  - 1 HR user (credentials for the demo)
 *  - 3 job openings
 *  - 5 candidates in varying pipeline states
 *  - Interviews, offer documents, timeline events as needed
 *    so the evaluator sees a fully populated experience on first load.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

function magicToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding ROVE Hire database...\n");

  // ── Wipe existing data (order matters for FK constraints) ──────────────────
  await prisma.timelineEvent.deleteMany();
  await prisma.offerDocument.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.magicLink.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();

  // ── HR User ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("rovehire2024", 12);

  const hrUser = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "hr@rovehire.com",
      password: passwordHash,
      role: "HR",
    },
  });

  console.log(`✅ HR user created: ${hrUser.email} / rovehire2024`);

  // ── Jobs ───────────────────────────────────────────────────────────────────

  const jobSeniorFE = await prisma.job.create({
    data: {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "London, UK (Hybrid)",
      employmentType: "FULL_TIME",
      description: `## About the Role

We're looking for a Senior Frontend Engineer to join ROVE's product team. You'll work on our core dashcam management platform, building the interfaces that fleet operators rely on every day.

## What You'll Do

- Lead frontend architecture decisions for new product areas
- Build performant, accessible React components and pages
- Collaborate closely with design and backend engineers
- Mentor junior engineers through code review and pairing

## What We're Looking For

Strong proficiency in React, TypeScript, and modern CSS. Experience with Next.js is a plus. You care about the details — performance, accessibility, and UX quality matter to you.`,
      requiredSkills: ["React", "TypeScript", "Next.js", "CSS", "GraphQL"],
      status: "OPEN",
      createdById: hrUser.id,
    },
  });

  const jobBackend = await prisma.job.create({
    data: {
      title: "Backend Engineer – Platform",
      department: "Engineering",
      location: "New York, NY (Hybrid)",
      employmentType: "FULL_TIME",
      description: `## About the Role

ROVE's Platform team owns the infrastructure that processes millions of dashcam events per day. We're hiring a Backend Engineer to help scale our data ingestion and processing pipelines.

## What You'll Do

- Design and build high-throughput event processing services
- Own reliability and performance of core platform APIs
- Work with Postgres, Redis, and message queues at scale
- Participate in on-call rotation (light — we keep things boring)

## What We're Looking For

Experience with Go or Node.js backend services. Comfortable with Postgres query optimization and distributed systems patterns.`,
      requiredSkills: ["Go", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
      status: "OPEN",
      createdById: hrUser.id,
    },
  });

  const jobDesign = await prisma.job.create({
    data: {
      title: "Product Designer",
      department: "Design",
      location: "Remote (EU timezone)",
      employmentType: "FULL_TIME",
      description: `## About the Role

We're hiring a Product Designer to own the end-to-end design of ROVE's fleet management interfaces. This is a high-ownership role — you'll work directly with the founders and engineering leads.

## What You'll Do

- Lead design for 2–3 major product areas
- Produce high-fidelity Figma designs and prototypes
- Conduct user research with fleet operators
- Build and maintain our design system

## What We're Looking For

A portfolio that demonstrates systems thinking and attention to interaction detail. Experience designing data-dense interfaces is a strong plus.`,
      requiredSkills: ["Figma", "User Research", "Design Systems", "Prototyping"],
      status: "CLOSED",
      createdById: hrUser.id,
    },
  });

  console.log(`✅ 3 jobs created`);

  // ── Candidate 1: Applied (just added, no further action) ───────────────────

  const candidate1 = await prisma.candidate.create({
    data: {
      name: "Marcus Johnson",
      email: "marcus.johnson@email.com",
      status: "APPLIED",
      resumeUrl: null,
      resumeFilename: "marcus_johnson_resume.pdf",
      jobId: jobSeniorFE.id,
      createdById: hrUser.id,
    },
  });

  await prisma.magicLink.create({
    data: {
      token: magicToken(),
      expiresAt: daysFromNow(14),
      candidateId: candidate1.id,
    },
  });

  await prisma.timelineEvent.create({
    data: {
      candidateId: candidate1.id,
      eventType: "CANDIDATE_CREATED",
      payload: { jobTitle: jobSeniorFE.title },
      actorName: hrUser.name,
      createdAt: daysAgo(3),
    },
  });

  // ── Candidate 2: Form Submitted ────────────────────────────────────────────

  const candidate2 = await prisma.candidate.create({
    data: {
      name: "Priya Nair",
      email: "priya.nair@gmail.com",
      status: "FORM_SUBMITTED",
      resumeUrl: null,
      resumeFilename: "priya_nair_resume.pdf",
      jobId: jobBackend.id,
      createdById: hrUser.id,
      // Filled in via the magic link form
      phone: "+1 (415) 555-0182",
      location: "San Francisco, CA",
      currentRole: "Backend Engineer at Stripe",
      noticePeriod: "4 weeks",
      salaryExpectation: "$180,000 – $200,000",
      linkedinUrl: "https://linkedin.com/in/priyanair",
    },
  });

  await prisma.magicLink.create({
    data: {
      token: magicToken(),
      expiresAt: daysFromNow(14),
      usedAt: daysAgo(5), // already used
      candidateId: candidate2.id,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: candidate2.id,
        eventType: "CANDIDATE_CREATED",
        payload: { jobTitle: jobBackend.title },
        actorName: hrUser.name,
        createdAt: daysAgo(8),
      },
      {
        candidateId: candidate2.id,
        eventType: "FORM_SUBMITTED",
        payload: {},
        actorName: null, // candidate action
        createdAt: daysAgo(5),
      },
    ],
  });

  // ── Candidate 3: Interview Scheduled with completed feedback ───────────────

  const candidate3 = await prisma.candidate.create({
    data: {
      name: "Daniel Osei",
      email: "d.osei@protonmail.com",
      status: "INTERVIEW_SCHEDULED",
      resumeUrl: null,
      resumeFilename: "daniel_osei_resume.pdf",
      jobId: jobSeniorFE.id,
      createdById: hrUser.id,
      phone: "+44 7700 900142",
      location: "London, UK",
      currentRole: "Senior Engineer at Monzo",
      noticePeriod: "1 month",
      salaryExpectation: "£95,000 – £110,000",
      linkedinUrl: "https://linkedin.com/in/danielosei",
    },
  });

  await prisma.magicLink.create({
    data: {
      token: magicToken(),
      expiresAt: daysFromNow(14),
      usedAt: daysAgo(12),
      candidateId: candidate3.id,
    },
  });

  await prisma.interview.create({
    data: {
      candidateId: candidate3.id,
      scheduledById: hrUser.id,
      interviewType: "SCREENING",
      scheduledAt: daysAgo(4),
      interviewerName: "Sarah Chen",
      notes: "Intro call — 30 minutes. Focus on motivation and culture fit.",
      status: "COMPLETED",
      recommendation: "HIRE",
      feedbackNotes:
        "Strong communicator with clear architectural thinking. Genuinely excited about the fleet tech space. Recommend moving to technical round.",
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: candidate3.id,
        eventType: "CANDIDATE_CREATED",
        payload: { jobTitle: jobSeniorFE.title },
        actorName: hrUser.name,
        createdAt: daysAgo(18),
      },
      {
        candidateId: candidate3.id,
        eventType: "FORM_SUBMITTED",
        payload: {},
        actorName: null,
        createdAt: daysAgo(14),
      },
      {
        candidateId: candidate3.id,
        eventType: "INTERVIEW_SCHEDULED",
        payload: {
          interviewType: "SCREENING",
          interviewerName: "Sarah Chen",
          scheduledAt: daysAgo(4).toISOString(),
        },
        actorName: hrUser.name,
        createdAt: daysAgo(10),
      },
      {
        candidateId: candidate3.id,
        eventType: "INTERVIEW_COMPLETED",
        payload: {
          recommendation: "HIRE",
          feedbackNotes:
            "Strong communicator with clear architectural thinking.",
        },
        actorName: hrUser.name,
        createdAt: daysAgo(4),
      },
    ],
  });

  // ── Candidate 4: Offer Sent (PDFs generated) ───────────────────────────────
  // Note: PDF URLs are placeholder strings since we can't run PDF generation
  // at seed time without the full Next.js context. The seed script marks
  // paths as "[seeded-placeholder]" — the real URLs come from Vercel Blob
  // when generated through the app. For demo purposes, this candidate's
  // profile shows the "Offer Sent" state correctly.

  const candidate4 = await prisma.candidate.create({
    data: {
      name: "Aisha Malik",
      email: "aisha.malik@outlook.com",
      status: "OFFER_SENT",
      resumeUrl: null,
      resumeFilename: "aisha_malik_resume.pdf",
      jobId: jobBackend.id,
      createdById: hrUser.id,
      phone: "+1 (646) 555-0234",
      location: "New York, NY",
      currentRole: "Platform Engineer at Datadog",
      noticePeriod: "2 weeks",
      salaryExpectation: "$195,000",
      linkedinUrl: "https://linkedin.com/in/aishamalik",
    },
  });

  await prisma.magicLink.create({
    data: {
      token: magicToken(),
      expiresAt: daysFromNow(14),
      usedAt: daysAgo(22),
      candidateId: candidate4.id,
    },
  });

  await prisma.interview.createMany({
    data: [
      {
        candidateId: candidate4.id,
        scheduledById: hrUser.id,
        interviewType: "SCREENING",
        scheduledAt: daysAgo(18),
        interviewerName: "Sarah Chen",
        status: "COMPLETED",
        recommendation: "HIRE",
        feedbackNotes: "Excellent systems knowledge. Clear communicator. Strong hire.",
      },
      {
        candidateId: candidate4.id,
        scheduledById: hrUser.id,
        interviewType: "TECHNICAL",
        scheduledAt: daysAgo(10),
        interviewerName: "James Liu",
        status: "COMPLETED",
        recommendation: "HIRE",
        feedbackNotes:
          "Impressed by her Postgres query optimization answers. Solid distributed systems fundamentals. Offer recommended.",
      },
    ],
  });

  await prisma.offerDocument.create({
    data: {
      candidateId: candidate4.id,
      generatedById: hrUser.id,
      roleTitle: "Backend Engineer – Platform",
      salaryCurrency: "USD",
      salaryAmount: 195000,
      startDate: daysFromNow(30),
      reportingManager: "James Liu",
      workLocation: "New York, NY (Hybrid)",
      // These will be null until regenerated through the app,
      // since Vercel Blob is not available at seed time.
      offerPdfUrl: null,
      ndaPdfUrl: null,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: candidate4.id,
        eventType: "CANDIDATE_CREATED",
        payload: { jobTitle: jobBackend.title },
        actorName: hrUser.name,
        createdAt: daysAgo(28),
      },
      {
        candidateId: candidate4.id,
        eventType: "FORM_SUBMITTED",
        payload: {},
        actorName: null,
        createdAt: daysAgo(22),
      },
      {
        candidateId: candidate4.id,
        eventType: "INTERVIEW_SCHEDULED",
        payload: { interviewType: "SCREENING", interviewerName: "Sarah Chen" },
        actorName: hrUser.name,
        createdAt: daysAgo(20),
      },
      {
        candidateId: candidate4.id,
        eventType: "INTERVIEW_COMPLETED",
        payload: { recommendation: "HIRE" },
        actorName: hrUser.name,
        createdAt: daysAgo(18),
      },
      {
        candidateId: candidate4.id,
        eventType: "INTERVIEW_SCHEDULED",
        payload: { interviewType: "TECHNICAL", interviewerName: "James Liu" },
        actorName: hrUser.name,
        createdAt: daysAgo(14),
      },
      {
        candidateId: candidate4.id,
        eventType: "INTERVIEW_COMPLETED",
        payload: { recommendation: "HIRE" },
        actorName: hrUser.name,
        createdAt: daysAgo(10),
      },
      {
        candidateId: candidate4.id,
        eventType: "OFFER_GENERATED",
        payload: {
          roleTitle: "Backend Engineer – Platform",
          salaryAmount: 195000,
          salaryCurrency: "USD",
        },
        actorName: hrUser.name,
        createdAt: daysAgo(5),
      },
    ],
  });

  // ── Candidate 5: Rejected ──────────────────────────────────────────────────

  const candidate5 = await prisma.candidate.create({
    data: {
      name: "Tom Bergström",
      email: "tom.bergstrom@email.se",
      status: "REJECTED",
      rejectionReason:
        "Strong technical skills but looking for a fully remote role. We require London-based presence at least 2 days/week — not a fit at this time.",
      resumeUrl: null,
      resumeFilename: "tom_bergstrom_resume.pdf",
      jobId: jobDesign.id,
      createdById: hrUser.id,
      phone: "+46 70 555 0198",
      location: "Stockholm, Sweden",
      currentRole: "Lead Product Designer at Klarna",
      noticePeriod: "3 months",
      salaryExpectation: "€95,000",
      linkedinUrl: "https://linkedin.com/in/tombergstrom",
    },
  });

  await prisma.magicLink.create({
    data: {
      token: magicToken(),
      expiresAt: daysFromNow(14),
      usedAt: daysAgo(30),
      candidateId: candidate5.id,
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      {
        candidateId: candidate5.id,
        eventType: "CANDIDATE_CREATED",
        payload: { jobTitle: jobDesign.title },
        actorName: hrUser.name,
        createdAt: daysAgo(38),
      },
      {
        candidateId: candidate5.id,
        eventType: "FORM_SUBMITTED",
        payload: {},
        actorName: null,
        createdAt: daysAgo(30),
      },
      {
        candidateId: candidate5.id,
        eventType: "CANDIDATE_REJECTED",
        payload: {
          reason:
            "Strong technical skills but looking for a fully remote role.",
        },
        actorName: hrUser.name,
        createdAt: daysAgo(20),
      },
    ],
  });

  // ── Summary ────────────────────────────────────────────────────────────────

  console.log(`\n✅ Seed complete.\n`);
  console.log(`📋 Summary:`);
  console.log(`   HR login:    hr@rovehire.com  /  rovehire2024`);
  console.log(`   Jobs:        3 (2 open, 1 closed)`);
  console.log(`   Candidates:  5`);
  console.log(`     - Marcus Johnson    → Applied`);
  console.log(`     - Priya Nair        → Form Submitted`);
  console.log(`     - Daniel Osei       → Interview Scheduled (with feedback)`);
  console.log(`     - Aisha Malik       → Offer Sent (offer doc record created)`);
  console.log(`     - Tom Bergström     → Rejected`);
  console.log(``);
  console.log(`⚠️  Note: Offer PDFs for Aisha Malik will be null until`);
  console.log(`   regenerated through the app (Vercel Blob not available at seed time).`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
