import { NextRequest } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement, JSXElementConstructor } from "react";
import { put } from "@vercel/blob";
import { getAuthSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { generateOfferSchema } from "@/lib/validations";
import { OfferLetterTemplate } from "@/lib/pdf/offer-letter-template";
import { NDATemplate } from "@/lib/pdf/nda-template";
import { format } from "date-fns";
import React from "react";
import fs from "fs";
import path from "path";

// POST /api/candidates/[id]/offers
// Generates offer letter + NDA PDFs, stores them, transitions status
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: candidateId } = await params;
    const body = await req.json();

    const parsed = generateOfferSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { data: null, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { roleTitle, salaryCurrency, salaryAmount, startDate, reportingManager, workLocation } =
      parsed.data;

    // Verify candidate exists and is in a valid status for offer generation
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return Response.json({ data: null, error: "Candidate not found" }, { status: 404 });
    }

    const eligibleStatuses = ["INTERVIEW_SCHEDULED", "OFFER_SENT", "FORM_SUBMITTED"];
    if (!eligibleStatuses.includes(candidate.status)) {
      return Response.json(
        { data: null, error: "Candidate must have completed at least a form submission before generating an offer" },
        { status: 400 }
      );
    }

    // Read logo as base64 for PDF embedding
    // Use public/ path — accessible in both local dev and Vercel serverless
    const logoPath = path.join(process.cwd(), "public", "rove-logo.jpg");
    const logoBase64 = fs.existsSync(logoPath)
      ? `data:image/jpeg;base64,${fs.readFileSync(logoPath).toString("base64")}`
      : null;

    // Format dates for templates
    const generatedDate      = format(new Date(), "MMMM d, yyyy");
    const startDateFormatted = format(new Date(startDate), "MMMM d, yyyy");
    const timestamp          = Date.now();

    // ── Render offer letter PDF ────────────────────────────────────────────
    const offerBuffer = await renderToBuffer(
      React.createElement(OfferLetterTemplate, {
        candidateName:    candidate.name,
        roleTitle,
        salaryCurrency,
        salaryAmount,
        startDate:        startDateFormatted,
        reportingManager,
        workLocation,
        generatedDate,
        logoBase64,
        signerName:       session.user.name ?? "HR Team",
      }) as ReactElement<DocumentProps, JSXElementConstructor<DocumentProps>>
    );

    // ── Render NDA PDF ─────────────────────────────────────────────────────
    const ndaBuffer = await renderToBuffer(
      React.createElement(NDATemplate, {
        candidateName: candidate.name,
        generatedDate,
        effectiveDate: generatedDate,
        logoBase64,
      }) as ReactElement<DocumentProps, JSXElementConstructor<DocumentProps>>
    );

    // ── Upload both to Vercel Blob ─────────────────────────────────────────
    const [offerBlob, ndaBlob] = await Promise.all([
      put(
        `offer-documents/${candidateId}/offer-letter-${timestamp}.pdf`,
        offerBuffer,
        { access: "public", contentType: "application/pdf" }
      ),
      put(
        `offer-documents/${candidateId}/nda-${timestamp}.pdf`,
        ndaBuffer,
        { access: "public", contentType: "application/pdf" }
      ),
    ]);

    // ── Save to DB + transition status + timeline event ────────────────────
    const offerDoc = await prisma.$transaction(async (tx) => {
      const doc = await tx.offerDocument.create({
        data: {
          candidateId,
          roleTitle,
          salaryCurrency,
          salaryAmount,
          startDate:        new Date(startDate),
          reportingManager,
          workLocation,
          offerPdfUrl:      offerBlob.url,
          ndaPdfUrl:        ndaBlob.url,
          generatedById:    session.user.id,
        },
      });

      await tx.candidate.update({
        where: { id: candidateId },
        data:  { status: "OFFER_SENT" },
      });

      await tx.timelineEvent.create({
        data: {
          candidateId,
          eventType: "OFFER_GENERATED",
          payload: {
            roleTitle,
            salaryAmount,
            salaryCurrency,
            startDate,
          },
          actorName: session.user.name ?? "HR",
        },
      });

      return doc;
    });

    return Response.json(
      {
        data: {
          offerDocId:  offerDoc.id,
          offerPdfUrl: offerBlob.url,
          ndaPdfUrl:   ndaBlob.url,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/candidates/[id]/offers]", err);
    return Response.json(
      { data: null, error: "Failed to generate offer documents" },
      { status: 500 }
    );
  }
}
