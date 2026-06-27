import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const BRAND  = "#2563EB";
const DARK   = "#111827";
const MID    = "#374151";
const MUTED  = "#6B7280";
const LIGHT  = "#F3F4F6";
const BORDER = "#E5E7EB";
const WHITE  = "#FFFFFF";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    backgroundColor: WHITE,
    paddingTop: 0,
    paddingBottom: 60,
    paddingHorizontal: 0,
    lineHeight: 1.6,
  },

  // ── Header band ──────────────────────────────────────────────────────────
  headerBand: {
    backgroundColor: DARK,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 36,
    objectFit: "contain",
  },
  logoFallback: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: WHITE,
    letterSpacing: 3,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerCompany: {
    fontSize: 10,
    color: WHITE,
    fontFamily: "Helvetica-Bold",
  },
  headerAddress: {
    fontSize: 8,
    color: "#9CA3AF",
    marginTop: 2,
    textAlign: "right",
  },

  // Accent stripe
  accentStripe: {
    height: 3,
    backgroundColor: BRAND,
  },

  // ── Letter body ──────────────────────────────────────────────────────────
  letterBody: {
    paddingHorizontal: 52,
    paddingTop: 28,
  },

  // Date
  dateText: {
    fontSize: 10,
    color: MID,
    marginBottom: 16,
  },

  // Recipient address block
  addressBlock: {
    marginBottom: 20,
  },
  addressName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  addressLine: {
    fontSize: 10,
    color: MID,
  },
  addressEmail: {
    fontSize: 10,
    color: BRAND,
    marginTop: 2,
  },

  // Salutation
  salutation: {
    fontSize: 10,
    color: DARK,
    marginBottom: 10,
  },

  // Body paragraph
  paragraph: {
    fontSize: 10,
    color: MID,
    marginBottom: 10,
    lineHeight: 1.65,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },

  // Remote badge under the opening paragraph
  remoteBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  remoteBadge: {
    backgroundColor: LIGHT,
    borderWidth: 1,
    borderColor: BRAND,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  remoteBadgeText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    letterSpacing: 0.5,
  },

  // Section heading (e.g. "Your Offer Terms")
  sectionHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 14,
    marginBottom: 6,
    textDecoration: "underline",
  },

  // Terms rows (label: value)
  termRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  termLabel: {
    width: 150,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  termColon: {
    width: 12,
    fontSize: 10,
    color: MID,
  },
  termValue: {
    flex: 1,
    fontSize: 10,
    color: MID,
  },

  // Bullet list
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 14,
    fontSize: 10,
    color: BRAND,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: MID,
    lineHeight: 1.55,
  },

  // Conditions box
  conditionBox: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 12,
    backgroundColor: LIGHT,
  },

  // Validity / closing
  closingText: {
    fontSize: 10,
    color: MID,
    marginTop: 10,
    marginBottom: 6,
    lineHeight: 1.65,
  },

  // ── Signature section ────────────────────────────────────────────────────
  signatureSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  signatureClosing: {
    fontSize: 10,
    color: MID,
    marginBottom: 4,
  },
  signerName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  signerTitle: {
    fontSize: 9,
    color: MUTED,
    marginTop: 1,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    marginTop: 28,
    marginBottom: 5,
    width: 180,
  },
  signatureDateLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  signatureDateLabel: {
    fontSize: 9,
    color: MUTED,
    width: 40,
  },
  signatureDateUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    width: 100,
  },

  // Candidate acceptance block
  acceptanceBlock: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  acceptanceIntro: {
    fontSize: 10,
    color: MID,
    marginBottom: 20,
    lineHeight: 1.6,
  },
  acceptanceSignatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    marginBottom: 5,
    width: 220,
  },
  acceptanceLabel: {
    fontSize: 9,
    color: MUTED,
  },
  acceptanceDateRow: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  acceptanceDateLabel: {
    fontSize: 9,
    color: MUTED,
    width: 36,
  },
  acceptanceDateLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    width: 120,
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: LIGHT,
    paddingVertical: 9,
    paddingHorizontal: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: MUTED,
  },
  footerBrand: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
  },
});

// ── Props ─────────────────────────────────────────────────────────────────────

interface OfferLetterProps {
  candidateName:    string;
  roleTitle:        string;
  salaryCurrency:   string;
  salaryAmount:     number;
  startDate:        string;        // "August 12, 2026"
  reportingManager: string;
  workLocation:     string;        // candidate's home country/region, e.g. "Anywhere (Remote)"
  generatedDate:    string;        // "June 18, 2026"
  logoBase64:       string | null;
  signerName:       string;        // HR user who generated the offer
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSalary(amount: number, currency: string): string {
  // Avoid Intl.NumberFormat currency symbols that produce strange glyphs in PDF
  // Instead format manually with a simple prefix
  const prefix: Record<string, string> = {
    USD: "USD ", GBP: "GBP ", EUR: "EUR ",
    INR: "INR ", AUD: "AUD ", CAD: "CAD ",
  };
  const symbol = prefix[currency] ?? `${currency} `;
  return `${symbol}${amount.toLocaleString("en-US")}`;
}

// ── Template ──────────────────────────────────────────────────────────────────

export function OfferLetterTemplate({
  candidateName,
  roleTitle,
  salaryCurrency,
  salaryAmount,
  startDate,
  reportingManager,
  workLocation,
  generatedDate,
  logoBase64,
  signerName,
}: OfferLetterProps) {
  const salaryFormatted = formatSalary(salaryAmount, salaryCurrency);
  const firstName       = candidateName.split(" ")[0];

  return (
    <Document title={`Offer Letter — ${candidateName}`} author="ROVE">
      <Page size="A4" style={styles.page}>

        {/* ── Company header ───────────────────────────────────────────── */}
        <View style={styles.headerBand}>
          <View>
            {logoBase64 ? (
              <Image src={logoBase64} style={styles.logo} />
            ) : (
              <Text style={styles.logoFallback}>ROVE</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerCompany}>ROVE Dashcam Technology Ltd.</Text>
            <Text style={styles.headerAddress}>careers@rovehire.com</Text>
          </View>
        </View>
        <View style={styles.accentStripe} />

        {/* ── Letter ───────────────────────────────────────────────────── */}
        <View style={styles.letterBody}>

          {/* Date */}
          <Text style={styles.dateText}>{generatedDate}</Text>

          {/* Salutation — no address block, candidate receives this digitally */}
          <Text style={styles.salutation}>Dear {firstName},</Text>

          {/* Opening — natural, corporate, no marketing language */}
          <Text style={styles.paragraph}>
            Congratulations! On behalf of everyone at{" "}
            <Text style={styles.bold}>ROVE Dashcam Technology Ltd.</Text>, I
            am pleased to offer you the position of{" "}
            <Text style={styles.bold}>{roleTitle}</Text>. We were impressed
            by your technical expertise, problem-solving skills, and
            professionalism throughout the interview process. We are
            confident that your experience and capabilities will make a
            valuable contribution to our engineering team, and we look
            forward to welcoming you to ROVE.
          </Text>

          {/* Offer details */}
          <Text style={styles.sectionHeading}>Offer Details</Text>

          <View style={styles.termRow}>
            <Text style={styles.termLabel}>Position</Text>
            <Text style={styles.termColon}>:</Text>
            <Text style={styles.termValue}>{roleTitle}</Text>
          </View>
          <View style={styles.termRow}>
            <Text style={styles.termLabel}>Reporting To</Text>
            <Text style={styles.termColon}>:</Text>
            <Text style={styles.termValue}>{reportingManager}</Text>
          </View>
          <View style={styles.termRow}>
            <Text style={styles.termLabel}>Start Date</Text>
            <Text style={styles.termColon}>:</Text>
            <Text style={styles.termValue}>{startDate}</Text>
          </View>
          <View style={styles.termRow}>
            <Text style={styles.termLabel}>Work Arrangement</Text>
            <Text style={styles.termColon}>:</Text>
            <Text style={styles.termValue}>Remote</Text>
          </View>
          <View style={styles.termRow}>
            <Text style={styles.termLabel}>Employment Type</Text>
            <Text style={styles.termColon}>:</Text>
            <Text style={styles.termValue}>Permanent, Full-time</Text>
          </View>

          {/* Compensation */}
          <Text style={styles.sectionHeading}>Compensation</Text>
          <Text style={styles.paragraph}>
            Your annual Cost to Company (CTC) will be{" "}
            <Text style={styles.bold}>{salaryFormatted} per annum</Text>. A
            detailed breakdown of your compensation, including salary
            components, statutory benefits, applicable deductions, and other
            terms of employment, will be provided in your Employment
            Agreement prior to your joining date.
          </Text>

          {/* Benefits */}
          <Text style={styles.sectionHeading}>Benefits</Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Health insurance coverage</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Paid time off and public holidays</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Flexible working hours</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Professional development support</Text>
          </View>

          {/* Probation */}
          <Text style={styles.sectionHeading}>Probation Period</Text>
          <Text style={styles.paragraph}>
            As with all new hires, you will serve a probationary period of{" "}
            <Text style={styles.bold}>90 days</Text> from your start date.
            Your manager will check in with you regularly during this time,
            and your performance will be formally reviewed at the end of the
            period in line with company policy.
          </Text>

          {/* Conditions — wrap={false} keeps heading + box on the same page */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>Conditions of This Offer</Text>
            <Text style={styles.paragraph}>
              This offer remains conditional upon the following:
            </Text>
            <View style={styles.conditionBox}>
              <View style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  Satisfactory completion of standard background verification
                  and reference checks.
                </Text>
              </View>
              <View style={[styles.bulletRow, { marginBottom: 0 }]}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  Your written confirmation that you are not bound by any
                  existing contractual obligation that would prevent you from
                  joining ROVE on the agreed start date.
                </Text>
              </View>
            </View>
          </View>

          {/* Validity + closing + signatures — kept together */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>Validity of This Offer</Text>
            <Text style={styles.paragraph}>
              Please confirm your acceptance by signing and returning a copy of
              this letter within{" "}
              <Text style={styles.bold}>five business days</Text> of the date
              above. If you have any questions, please contact us at{" "}
              <Text style={styles.bold}>careers@rovehire.com</Text>.
            </Text>
            <Text style={styles.paragraph}>
              We are excited about the opportunity to have you join ROVE
              Dashcam Technology Ltd. We believe your expertise will play an
              important role in our continued growth and success, and we look
              forward to welcoming you to the team.
            </Text>

            {/* Company sign-off */}
            <View style={styles.signatureSection}>
              <Text style={styles.signatureClosing}>Sincerely,</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signerName}>{signerName}</Text>
              <Text style={styles.signerTitle}>
                Head of People &amp; Talent · ROVE Dashcam Technology Ltd.
              </Text>
              <View style={styles.signatureDateLine}>
                <Text style={styles.signatureDateLabel}>Date:</Text>
                <View style={styles.signatureDateUnderline} />
              </View>
            </View>

            {/* Candidate acceptance */}
            <View style={styles.acceptanceBlock}>
              <Text style={styles.acceptanceIntro}>
                I, {candidateName}, confirm that I have read, understood, and
                accept the terms of employment with ROVE Dashcam Technology
                Ltd. as set out above.
              </Text>
              <View style={styles.acceptanceSignatureLine} />
              <Text style={styles.acceptanceLabel}>
                Signature: {candidateName}
              </Text>
              <View style={styles.acceptanceDateRow}>
                <Text style={styles.acceptanceDateLabel}>Date:</Text>
                <View style={styles.acceptanceDateLine} />
              </View>
            </View>
          </View>

        </View>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            ROVE Dashcam Technology Ltd · Offer of Employment
          </Text>
          <Text style={styles.footerBrand}>CONFIDENTIAL</Text>
        </View>

      </Page>
    </Document>
  );
}
