import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Same tokens as offer letter for visual consistency
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
    // paddingBottom is handled by the footer spacer — do NOT use absolute footer
    paddingHorizontal: 0,
    lineHeight: 1.6,
  },

  // ── Header band — same dark treatment as offer letter ────────────────────
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
  accentStripe: {
    height: 3,
    backgroundColor: BRAND,
  },

  // ── Body ─────────────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 52,
    paddingTop: 28,
    paddingBottom: 52,   // clears the 36px absolute footer + breathing room
  },

  // Date + title block
  dateText: {
    fontSize: 10,
    color: MID,
    marginBottom: 12,
  },
  titleBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  docTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 10,
  },
  docSubtitle: {
    fontSize: 10,
    color: MUTED,
  },

  // Parties box
  partiesRow: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
  },
  partyBox: {
    flex: 1,
    padding: 12,
    backgroundColor: LIGHT,
  },
  partyBoxRight: {
    flex: 1,
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
  },
  partyRole: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  partyName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  partyDetail: {
    fontSize: 9,
    color: MUTED,
    marginTop: 2,
  },

  // Section heading — underlined like offer letter
  sectionHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 12,
    marginBottom: 5,
    textDecoration: "underline",
  },

  paragraph: {
    fontSize: 10,
    color: MID,
    marginBottom: 8,
    lineHeight: 1.65,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },

  // Numbered sub-clauses
  numberedRow: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 4,
  },
  numberedIndex: {
    width: 20,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
  },
  numberedText: {
    flex: 1,
    fontSize: 10,
    color: MID,
    lineHeight: 1.6,
  },

  // Signature block — two columns side by side like offer letter
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  signatureBox: {
    width: "45%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#9CA3AF",
    marginTop: 32,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 8,
    color: MUTED,
    letterSpacing: 0.4,
  },
  signatureName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginTop: 3,
  },
  signatureDate: {
    fontSize: 9,
    color: MUTED,
    marginTop: 4,
  },

  // Footer — absolute so it sticks to the bottom of every page
  footerDivider: {
    position: "absolute",
    bottom: 36,
    left: 52,
    right: 52,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 9,
    paddingHorizontal: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: LIGHT,
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

interface NDAProps {
  candidateName: string;
  generatedDate: string;
  effectiveDate: string;
  logoBase64:    string | null;
}

export function NDATemplate({
  candidateName,
  generatedDate,
  effectiveDate,
  logoBase64,
}: NDAProps) {
  return (
    <Document title={`NDA — ${candidateName}`} author="ROVE">
      <Page size="A4" style={styles.page}>

        {/* ── Header ───────────────────────────────────────────────────── */}
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

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <View style={styles.body}>

          <Text style={styles.dateText}>{generatedDate}</Text>

          <View style={styles.titleBlock}>
            <Text style={styles.docTitle}>Non-Disclosure Agreement</Text>
            <Text style={styles.docSubtitle}>
              Effective {effectiveDate} · ROVE Dashcam Technology Ltd. and {candidateName}
            </Text>
          </View>

          {/* Parties */}
          <View style={styles.partiesRow}>
            <View style={styles.partyBox}>
              <Text style={styles.partyRole}>DISCLOSING PARTY</Text>
              <Text style={styles.partyName}>ROVE Dashcam Technology Ltd.</Text>
              <Text style={styles.partyDetail}>careers@rovehire.com</Text>
            </View>
            <View style={styles.partyBoxRight}>
              <Text style={styles.partyRole}>RECEIVING PARTY</Text>
              <Text style={styles.partyName}>{candidateName}</Text>
              <Text style={styles.partyDetail}>Prospective Employee</Text>
            </View>
          </View>

          {/* Recital */}
          <Text style={styles.paragraph}>
            This Non-Disclosure Agreement ("Agreement") is entered into as of{" "}
            <Text style={styles.bold}>{effectiveDate}</Text> between ROVE
            Dashcam Technology Ltd. ("Company") and {candidateName}{" "}
            ("Recipient") in connection with the Recipient's prospective or
            active employment with the Company.
          </Text>

          {/* Section 1 */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>1. Confidential Information</Text>
            <Text style={styles.paragraph}>
              "Confidential Information" means any non-public information
              disclosed by the Company that is designated as confidential or
              that reasonably should be understood to be confidential,
              including:
            </Text>
            <View style={styles.numberedRow}>
              <Text style={styles.numberedIndex}>(a)</Text>
              <Text style={styles.numberedText}>
                Technical data, trade secrets, know-how, research, product
                plans, software, source code, databases, inventions, and
                designs;
              </Text>
            </View>
            <View style={styles.numberedRow}>
              <Text style={styles.numberedIndex}>(b)</Text>
              <Text style={styles.numberedText}>
                Business information including operations, finances,
                customers, marketing strategies, and business plans; and
              </Text>
            </View>
            <View style={styles.numberedRow}>
              <Text style={styles.numberedIndex}>(c)</Text>
              <Text style={styles.numberedText}>
                Personnel information, compensation details, and
                organisational structure.
              </Text>
            </View>
          </View>

          {/* Section 2 */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>2. Obligations</Text>
            <Text style={styles.paragraph}>
              The Recipient agrees to: (i) hold all Confidential Information
              in strict confidence; (ii) not disclose it to any third party
              without prior written consent; (iii) use it solely in connection
              with employment at ROVE; and (iv) apply at least reasonable care
              to protect it.
            </Text>
          </View>

          {/* Section 3 */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>3. Exclusions</Text>
            <Text style={styles.paragraph}>
              Obligations do not apply to information that: (a) becomes
              publicly known without breach of this Agreement; (b) was
              rightfully in the Recipient's possession before disclosure;
              (c) is independently developed without use of Confidential
              Information; or (d) is required to be disclosed by law,
              provided prompt written notice is given to the Company.
            </Text>
          </View>

          {/* Section 4 */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>4. Term</Text>
            <Text style={styles.paragraph}>
              This Agreement remains in effect for{" "}
              <Text style={styles.bold}>three (3) years</Text> from the
              Effective Date, or for the duration of any employment
              relationship, whichever is longer.
            </Text>
          </View>

          {/* Section 5 — wrap=false so it never splits across pages */}
          <View wrap={false}>
            <Text style={styles.sectionHeading}>5. Return of Information</Text>
            <Text style={styles.paragraph}>
              Upon request or upon termination of discussions or employment,
              the Recipient shall promptly return or destroy all materials
              containing Confidential Information and certify in writing that
              this has been done.
            </Text>
          </View>

          {/* Signatures — wrap=false keeps both boxes together */}
          <View wrap={false} style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>FOR ROVE DASHCAM TECHNOLOGY</Text>
              <Text style={styles.signatureName}>Authorised Representative</Text>
              <Text style={styles.signatureDate}>Date: _______________</Text>
            </View>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>RECEIVING PARTY</Text>
              <Text style={styles.signatureName}>{candidateName}</Text>
              <Text style={styles.signatureDate}>Date: _______________</Text>
            </View>
          </View>

        </View>

        {/* ── Footer — fixed to bottom of every page ────────────────── */}
        <View style={styles.footerDivider} fixed />
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            ROVE Dashcam Technology Ltd · Non-Disclosure Agreement
          </Text>
          <Text style={styles.footerBrand}>CONFIDENTIAL</Text>
        </View>

      </Page>
    </Document>
  );
}
