// Branded, downloadable + emailable PDF of the Front-Office AI Readiness
// report. Rendered with @react-pdf/renderer (browser-side), so the same
// document can be (a) downloaded instantly on the result page and
// (b) base64-encoded and attached to the prospect's confirmation email.
//
// Uses only the built-in Helvetica family — no external font fetch, so it
// renders reliably offline and inside the Worker email flow.

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Circle,
} from "@react-pdf/renderer";
import {
  ACTION_PLAN,
  INDUSTRY_STATS,
  LEVELS,
  SOURCES_NOTE,
  STAGE_INSIGHT,
  STAGE_META,
  STAGE_ORDER,
  type ReportData,
} from "@/lib/quizReport";

const BRAND = "#4F46E5"; // primary indigo (hsl 238 75% 59%)
const ACCENT = "#8B5CF6"; // violet accent
const INK = "#1F2433";
const MUTED = "#6B7280";
const LINE = "#E5E7EB";
const SOFT = "#F5F6FB";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    lineHeight: 1.45,
  },
  // header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  wordmark: { fontFamily: "Helvetica-Bold", fontSize: 15, color: BRAND, letterSpacing: 0.5 },
  kicker: { fontSize: 8, color: MUTED, textTransform: "uppercase", letterSpacing: 1 },
  // hero
  hero: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SOFT,
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },
  heroText: { marginLeft: 18, flex: 1 },
  levelName: { fontFamily: "Helvetica-Bold", fontSize: 19, color: INK },
  levelRange: { color: BRAND, fontSize: 10, marginTop: 2, marginBottom: 6 },
  headline: { color: "#374151", fontSize: 9.5 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: INK,
    marginTop: 14,
    marginBottom: 8,
  },
  // stage card
  stageCard: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    padding: 11,
    marginBottom: 8,
  },
  stageHead: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: 7 },
  stageLabel: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  startBadge: {
    marginLeft: 7,
    fontSize: 7,
    color: BRAND,
    backgroundColor: "#ECEBFE",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    fontFamily: "Helvetica-Bold",
  },
  stageScore: { marginLeft: "auto", color: MUTED, fontSize: 10 },
  barTrack: { height: 6, backgroundColor: "#EEF0F6", borderRadius: 3, marginBottom: 6 },
  barFill: { height: 6, borderRadius: 3 },
  stageInsight: { color: "#4B5563", fontSize: 9 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SOFT,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  statChipVal: { fontFamily: "Helvetica-Bold", color: BRAND, fontSize: 12, marginRight: 6 },
  statChipLbl: { color: MUTED, fontSize: 8, flex: 1 },
  // benchmark grid
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  statCard: {
    width: "48.5%",
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 8,
    padding: 9,
    marginBottom: 8,
  },
  statVal: { fontFamily: "Helvetica-Bold", fontSize: 15, color: INK },
  statLbl: { color: MUTED, fontSize: 8, marginTop: 2 },
  // plan
  planCard: {
    borderWidth: 1,
    borderColor: "#DAD7FB",
    backgroundColor: "#FAFAFF",
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
  },
  planHorizon: { fontFamily: "Helvetica-Bold", fontSize: 9, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.6 },
  planTitle: { fontFamily: "Helvetica-Bold", fontSize: 11, color: INK, marginTop: 2, marginBottom: 5 },
  planStep: { flexDirection: "row", marginBottom: 3 },
  planBullet: { width: 10, color: BRAND, fontFamily: "Helvetica-Bold" },
  planStepText: { flex: 1, fontSize: 9, color: "#374151" },
  // cta
  cta: {
    backgroundColor: BRAND,
    borderRadius: 10,
    padding: 16,
    marginTop: 6,
  },
  ctaTitle: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#FFFFFF" },
  ctaBody: { fontSize: 9, color: "#E4E2FB", marginTop: 4 },
  ctaLink: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#FFFFFF", marginTop: 8 },
  footnote: { fontSize: 7, color: "#9AA0AC", marginTop: 14 },
  pageNumber: { position: "absolute", bottom: 22, right: 44, fontSize: 8, color: "#B6BAC4" },
});

function Gauge({ pct }: { pct: number }) {
  const R = 30;
  const CIRC = 2 * Math.PI * R;
  const dash = CIRC * (pct / 100);
  return (
    <Svg width={78} height={78} viewBox="0 0 78 78">
      <Circle cx={39} cy={39} r={R} stroke="#E3E5EE" strokeWidth={8} fill="none" />
      <Circle
        cx={39}
        cy={39}
        r={R}
        stroke={BRAND}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${CIRC}`}
        transform="rotate(-90 39 39)"
      />
      <Text x={39} y={42} style={{ fontFamily: "Helvetica-Bold", fontSize: 18 }} fill={INK} textAnchor="middle">
        {String(pct)}
      </Text>
      <Text x={39} y={54} style={{ fontSize: 8 }} fill={MUTED} textAnchor="middle">
        / 100
      </Text>
    </Svg>
  );
}

export function QuizReportPdf({ data, dateLabel }: { data: ReportData; dateLabel: string }) {
  const lvl = LEVELS[data.levelKey];
  const plan = ACTION_PLAN[data.weakest];
  const preparedFor = [data.name, data.company].filter(Boolean).join(" · ");

  return (
    <Document
      title="AI Readiness Report"
      author="Thynra"
      subject="AI Readiness"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.wordmark}>THYNRA</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.kicker}>AI Readiness Report</Text>
            <Text style={{ fontSize: 8, color: MUTED, marginTop: 2 }}>{dateLabel}</Text>
          </View>
        </View>
        {preparedFor ? (
          <Text style={{ fontSize: 9, color: MUTED, marginBottom: 12 }}>Prepared for {preparedFor}</Text>
        ) : null}

        {/* Hero: score + level */}
        <View style={styles.hero}>
          <Gauge pct={data.overallPct} />
          <View style={styles.heroText}>
            <Text style={styles.levelName}>{lvl.name}</Text>
            <Text style={styles.levelRange}>{lvl.range}</Text>
            <Text style={styles.headline}>{lvl.headline}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 9.5, color: "#4B5563", marginBottom: 4 }}>{lvl.body}</Text>

        {/* Stage breakdown */}
        <Text style={styles.sectionTitle}>Your stage-by-stage breakdown</Text>
        {STAGE_ORDER.map((st) => {
          const meta = STAGE_META[st];
          const score = data.scores[st];
          const pct = Math.round((score / 8) * 100);
          const strong = score >= 6;
          const ins = STAGE_INSIGHT[st];
          return (
            <View key={st} style={styles.stageCard} wrap={false}>
              <View style={styles.stageHead}>
                <View style={[styles.dot, { backgroundColor: meta.hex }]} />
                <Text style={styles.stageLabel}>{meta.label}</Text>
                {st === data.weakest ? <Text style={styles.startBadge}>START HERE</Text> : null}
                <Text style={styles.stageScore}>{score}/8</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: meta.hex }]} />
              </View>
              <Text style={styles.stageInsight}>{strong ? ins.strong : ins.weak}</Text>
              {ins.stat ? (
                <View style={styles.statChip}>
                  <Text style={styles.statChipVal}>{ins.stat.value}</Text>
                  <Text style={styles.statChipLbl}>{ins.stat.label}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {/* Benchmarks */}
        <Text style={styles.sectionTitle}>Why this matters — by the numbers</Text>
        <View style={styles.grid}>
          {INDUSTRY_STATS.map((s) => (
            <View key={s.value} style={styles.statCard} wrap={false}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {/* Page 2 — the action plan + CTA */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>
          Your 30 / 60 / 90-day plan — start with {STAGE_META[data.weakest].label}
        </Text>
        <Text style={{ fontSize: 9.5, color: "#4B5563", marginBottom: 10 }}>
          {STAGE_RECO_INLINE[data.weakest]}
        </Text>

        {plan.map((block) => (
          <View key={block.horizon} style={styles.planCard} wrap={false}>
            <Text style={styles.planHorizon}>{block.horizon}</Text>
            <Text style={styles.planTitle}>{block.title}</Text>
            {block.steps.map((step, i) => (
              <View key={i} style={styles.planStep}>
                <Text style={styles.planBullet}>•</Text>
                <Text style={styles.planStepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Want a second set of eyes on this?</Text>
          <Text style={styles.ctaBody}>
            Talk to Sofia, our AI receptionist — she'll walk through your result, pinpoint the one fix with the
            fastest payback, and book a free discovery call if it's worth it for your business.
          </Text>
          <Text style={styles.ctaLink}>thynra.com/quiz  ·  hello@thynra.com</Text>
        </View>

        <Text style={styles.footnote}>{SOURCES_NOTE}</Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}

// Inlined here (rather than importing STAGE_RECO) to keep the PDF's intro line
// phrased for a leave-behind document.
const STAGE_RECO_INLINE: Record<ReportData["weakest"], string> = {
  awareness:
    "This is your softest stage. Customers can't choose you if they can't find you — so the plan below makes your presence consistent before chasing anything else.",
  conversion:
    "This is your softest stage and usually the most expensive gap. The plan below closes your response-time window first, because it's the fastest win available to you.",
  retention:
    "This is your softest stage. You've already paid to win these customers — the plan below turns one-time buyers into repeat revenue and referrals without more ad spend.",
};
