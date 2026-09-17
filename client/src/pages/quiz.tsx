import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  MessagesSquare,
  Repeat,
  Phone,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
  Clock,
  Zap,
  Lightbulb,
  Download,
  MessageCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { buildReport, reportSummaryText } from "@/lib/quizReport";
import { sofiaConfigured, talkToSofia, chatWithSofia, type QuizContext } from "@/lib/sofiaWidget";

const CALENDLY_URL = "https://calendly.com/efdeugenio/apply-ai";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

// Base64-encode a Blob without blowing the call stack on large buffers.
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });
}

type Stage = "awareness" | "conversion" | "retention";

interface Question {
  id: string;
  stage: Stage;
  text: string;
  options: { label: string; value: number }[];
}

const STAGE_META: Record<
  Stage,
  { label: string; icon: typeof Search; color: string; blurb: string }
> = {
  awareness: {
    label: "Awareness",
    icon: Search,
    color: "bg-blue-500",
    blurb: "How customers find you.",
  },
  conversion: {
    label: "Conversion",
    icon: MessagesSquare,
    color: "bg-purple-500",
    blurb: "What happens in the next five minutes.",
  },
  retention: {
    label: "Retention",
    icon: Repeat,
    color: "bg-emerald-500",
    blurb: "What happens after the first sale.",
  },
};

// 6 questions, 2 per stage. Each option scores 1 (manual) to 4 (autonomous).
const QUESTIONS: Question[] = [
  {
    id: "aw1",
    stage: "awareness",
    text: "When someone searches for a business like yours, how reliably do you show up?",
    options: [
      { label: "We rely on word of mouth. No real online presence.", value: 1 },
      { label: "We have a profile and some reviews, but it's inconsistent.", value: 2 },
      { label: "We actively manage reviews, listings, and search presence.", value: 3 },
      { label: "We're consistently visible across search and AI tools, with a system behind it.", value: 4 },
    ],
  },
  {
    id: "aw2",
    stage: "awareness",
    text: "How often do you publish content or engage where your customers are looking?",
    options: [
      { label: "Rarely. We don't have time for it.", value: 1 },
      { label: "Now and then, when someone remembers to.", value: 2 },
      { label: "On a schedule, mostly done by hand.", value: 3 },
      { label: "Consistently, with help that keeps it in our voice.", value: 4 },
    ],
  },
  {
    id: "cv1",
    stage: "conversion",
    text: "When a new lead reaches out (call, form, chat, DM), how fast does someone respond?",
    options: [
      { label: "Hours, sometimes the next day.", value: 1 },
      { label: "Within an hour or two, if we're not slammed.", value: 2 },
      { label: "Usually within minutes during business hours.", value: 3 },
      { label: "Instantly, 24/7, even when no human is available.", value: 4 },
    ],
  },
  {
    id: "cv2",
    stage: "conversion",
    text: "What happens to inquiries that come in after hours or while you're busy?",
    options: [
      { label: "They wait until someone is free. Some get lost.", value: 1 },
      { label: "We catch up eventually, but follow-up is patchy.", value: 2 },
      { label: "An auto-reply holds them, then a person follows up.", value: 3 },
      { label: "They're answered, qualified, and booked automatically.", value: 4 },
    ],
  },
  {
    id: "rt1",
    stage: "retention",
    text: "How do you follow up with past customers or leads that went quiet?",
    options: [
      { label: "We don't, really. We hope they come back.", value: 1 },
      { label: "Occasionally, one by one, when we think of it.", value: 2 },
      { label: "With manual campaigns or templates we send out.", value: 3 },
      { label: "Automatically, with relevant, personalized follow-ups.", value: 4 },
    ],
  },
  {
    id: "rt2",
    stage: "retention",
    text: "How do you ask for reviews and referrals?",
    options: [
      { label: "We don't have a process for it.", value: 1 },
      { label: "We ask sometimes, when it feels right.", value: 2 },
      { label: "We ask consistently, by hand.", value: 3 },
      { label: "It's automated and timed to the right moment.", value: 4 },
    ],
  },
];

type LevelKey = "reactive" | "responsive" | "autonomous";

const LEVELS: Record<
  LevelKey,
  { name: string; range: string; headline: string; body: string }
> = {
  reactive: {
    name: "Reactive Business",
    range: "Your business runs on people and memory",
    headline:
      "Customers reach you when they catch you. The work gets done, but it depends on someone being available, and revenue slips through the cracks you can't see.",
    body: "This is where most growing businesses are. The good news: the highest-impact fixes here are also the fastest. Closing the response-time gap alone usually pays for itself.",
  },
  responsive: {
    name: "Responsive Business",
    range: "You have systems, but they still lean on you",
    headline:
      "You've put real structure in place. Inquiries get answered and follow-ups happen, but a lot of it still runs through your hands, and it gets uneven when things get busy.",
    body: "You're past the basics. The opportunity now is removing yourself as the bottleneck so the system holds up at 2x the volume without 2x the effort.",
  },
  autonomous: {
    name: "Autonomous Business",
    range: "Your business largely runs itself",
    headline:
      "Awareness, conversion, and retention are working with minimal manual lift. You're in the top tier of AI maturity for an SMB.",
    body: "From here it's about optimization and edge cases: tightening hand-offs, sharpening personalization, and making sure quality holds as you scale. This is where good gets compounding.",
  },
};

function levelForScore(total: number): LevelKey {
  // 6 questions x 1..4 => range 6..24
  if (total <= 11) return "reactive";
  if (total <= 18) return "responsive";
  return "autonomous";
}

// Per-stage insight shown in the report. Stats are industry benchmarks,
// not Thynra outcomes (kept sourceable per the site's design guidelines).
const STAGE_INSIGHT: Record<
  Stage,
  { strong: string; weak: string; stat?: { value: string; label: string } }
> = {
  awareness: {
    strong:
      "You're showing up where customers look. That's demand you don't have to pay for twice.",
    weak: "Customers can't choose a business they never find. Consistent presence across search and reviews is the cheapest demand you'll ever generate.",
  },
  conversion: {
    strong:
      "You answer fast. Speed is the single biggest lever on whether an inquiry becomes a customer.",
    weak: "This is usually the most expensive gap. Every slow reply is a customer who already called someone else.",
    stat: {
      value: "391%",
      label:
        "higher conversion when a lead is answered within 5 minutes vs. the 42-hour industry average",
    },
  },
  retention: {
    strong:
      "You keep the relationship alive after the sale. Repeat business is your highest-margin revenue.",
    weak: "You already paid to win these customers. A simple automated follow-up and review loop turns them into repeat revenue and referrals with no new ad spend.",
  },
};

// Headline industry benchmarks for the "by the numbers" strip.
const INDUSTRY_STATS: { icon: typeof Clock; value: string; label: string }[] = [
  {
    icon: Clock,
    value: "42 hrs",
    label: "average time a business takes to respond to a new lead",
  },
  {
    icon: Zap,
    value: "40–60%",
    label: "of routine inquiries AI can handle with no human involved",
  },
  {
    icon: TrendingUp,
    value: "20+ hrs/mo",
    label: "saved by most small businesses already using AI",
  },
  {
    icon: CheckCircle2,
    value: "~9%",
    label: "of SMBs have fully integrated AI across their business — being early is an edge",
  },
];

const STAGE_RECO: Record<Stage, string> = {
  awareness:
    "Awareness is your softest stage. Customers can't choose you if they can't find you. Start by making your presence consistent across search and reviews so demand stops leaking before it reaches you.",
  conversion:
    "Conversion is your softest stage, and it's usually the most expensive gap. Leads contacted within five minutes convert dramatically better than ones that wait, yet the average business takes over a day to respond. Closing that window is the fastest win available to you.",
  retention:
    "Retention is your softest stage. You've already paid to win these customers. A simple, automated follow-up and review system turns one-time buyers into repeat revenue and referrals without more ad spend.",
};

// The Thynra solution that maps to each weak stage — rendered inline on the
// result page so the prospect sees the concrete fix, not just a diagnosis.
const STAGE_SOLUTION: Record<
  Stage,
  {
    name: string;
    icon: typeof Search;
    color: string;
    tagline: string;
    bullets: string[];
  }
> = {
  awareness: {
    name: "Reputation & Local Presence",
    icon: Star,
    color: "bg-blue-500",
    tagline: "Get found and trusted before the first call.",
    bullets: [
      "Review monitoring with on-brand responses, ready to approve",
      "Post-visit review nudges that lift your local map-pack ranking",
      "Google Business Profile audit, fixes, and weekly posts",
      "A fast website you own — hosting and domain in your name",
    ],
  },
  conversion: {
    name: "AI Receptionist",
    icon: Phone,
    color: "bg-purple-500",
    tagline: "Answer and book in the next five minutes — then follow up for you.",
    bullets: [
      "Phone, web chat, WhatsApp, and SMS — one bilingual persona, 24/7",
      "Books appointments and qualifies leads on every channel",
      "Drafts your follow-ups, quotes, and replies in your voice for approval",
      "Appointment reminders and no-show recovery that run themselves",
    ],
  },
  retention: {
    name: "Recall & Reactivation",
    icon: Repeat,
    color: "bg-emerald-500",
    tagline: "Win back the customers you already paid to earn.",
    bullets: [
      "Wins back lapsed customers and patients automatically",
      "Reactivation campaigns that run on your existing data",
      "Personalized follow-ups in your voice — not generic blasts",
      "Turns one-time buyers into repeat revenue and referrals",
    ],
  },
};

export default function QuizPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 = questions; then gate; then result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<"questions" | "gate" | "result">(
    "questions",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [reportFilename, setReportFilename] = useState("");

  const total = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progress =
    phase === "result"
      ? 100
      : phase === "gate"
        ? 95
        : Math.round((answeredCount / total) * 90);

  const select = (qid: string, value: number) => {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    setTimeout(() => {
      if (step < total - 1) {
        setStep(step + 1);
      } else {
        setPhase("gate");
      }
    }, 180);
  };

  const back = () => {
    if (phase === "gate") {
      setPhase("questions");
      setStep(total - 1);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const stageScores = (): Record<Stage, number> => {
    const s: Record<Stage, number> = {
      awareness: 0,
      conversion: 0,
      retention: 0,
    };
    QUESTIONS.forEach((q) => {
      s[q.stage] += answers[q.id] ?? 0;
    });
    return s;
  };

  const totalScore = () =>
    QUESTIONS.reduce((acc, q) => acc + (answers[q.id] ?? 0), 0);

  const weakestStage = (): Stage => {
    const s = stageScores();
    return (Object.keys(s) as Stage[]).reduce((min, k) =>
      s[k] < s[min] ? k : min,
    );
  };

  const submitGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Almost there",
        description: "Add your name and email to see your results.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const report = buildReport(stageScores(), {
      name: name.trim(),
      company: company.trim(),
    });
    const summary = reportSummaryText(report);
    const dateLabel = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const filename = `Thynra-AI-Readiness-Report${
      company.trim() ? "-" + slugify(company) : ""
    }.pdf`;

    // Generate the branded PDF in the browser. It's a bonus deliverable, so a
    // failure here must never block the prospect from seeing their result.
    let pdfBase64: string | undefined;
    try {
      // Lazy-load the PDF renderer so the ~1MB library never touches the
      // landing page — only this gate submission pulls the chunk.
      const [{ pdf }, { QuizReportPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/QuizReportPdf"),
      ]);
      const blob = await pdf(
        <QuizReportPdf data={report} dateLabel={dateLabel} />,
      ).toBlob();
      setReportUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setReportFilename(filename);
      pdfBase64 = await blobToBase64(blob);
    } catch {
      // No PDF — the on-screen report and email still go out.
    }

    try {
      await apiRequest("POST", "/api/contact", {
        name,
        email,
        company,
        message: summary,
        level: LEVELS[report.levelKey].name,
        scores: report.scores,
        weakestStage: STAGE_META[report.weakest].label,
        pdfBase64,
        pdfFilename: filename,
      });
    } catch {
      // Non-blocking: the user still sees their result even if capture fails.
    } finally {
      setSubmitting(false);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
            data-testid="link-quiz-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Thynra
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">
            AI Readiness Check
          </span>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* QUESTIONS */}
          {phase === "questions" && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="mb-10 text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                    How ready is your business to grow with AI?
                  </h1>
                  <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Six questions, about two minutes. You'll get your readiness
                    level across the three stages where SMBs win or lose
                    customers: Awareness, Conversion, and Retention.
                  </p>
                </div>
              )}

              {(() => {
                const q = QUESTIONS[step];
                const meta = STAGE_META[q.stage];
                const Icon = meta.icon;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`w-10 h-10 ${meta.color} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <Icon className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {meta.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Question {step + 1} of {total}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 leading-snug">
                      {q.text}
                    </h2>

                    <div className="space-y-3">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => select(q.id, opt.value)}
                            className={`w-full text-left rounded-xl border p-4 transition-all hover:border-primary/60 hover:bg-muted/50 ${
                              active
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                            data-testid={`option-${q.id}-${opt.value}`}
                          >
                            <span className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/40"
                                }`}
                              >
                                {active && (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                              </span>
                              <span className="text-foreground leading-relaxed">
                                {opt.label}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {step > 0 && (
                      <button
                        onClick={back}
                        className="mt-8 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        data-testid="button-quiz-back"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                      </button>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* EMAIL GATE */}
          {phase === "gate" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="text-primary-foreground w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Your results are ready.
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Tell us where to send your readiness breakdown, and we'll show it
                to you right now.
              </p>

              <form onSubmit={submitGate} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    data-testid="input-quiz-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    required
                    data-testid="input-quiz-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional"
                    data-testid="input-quiz-company"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform"
                  disabled={submitting}
                  data-testid="button-quiz-reveal"
                >
                  {submitting ? "Calculating..." : "Show my results"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-1">
                  No spam. We'll only use this to send your results and follow up
                  if you want help.
                </p>
                <button
                  type="button"
                  onClick={back}
                  className="block mx-auto text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 inline" />
                  Back
                </button>
              </form>
            </motion.div>
          )}

          {/* RESULT */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {(() => {
                const lvlKey = levelForScore(totalScore());
                const lvl = LEVELS[lvlKey];
                const s = stageScores();
                const weak = weakestStage();
                const stageOrder: Stage[] = [
                  "awareness",
                  "conversion",
                  "retention",
                ];
                const overallPct = Math.round((totalScore() / 24) * 100);
                const R = 54;
                const CIRC = 2 * Math.PI * R;
                const dash = CIRC * (1 - overallPct / 100);
                return (
                  <div>
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary/70 mb-4">
                      Your AI Readiness report
                    </p>

                    {/* Score gauge + level */}
                    <div className="bg-card border border-border rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
                      <div className="relative shrink-0">
                        <svg width="140" height="140" viewBox="0 0 140 140">
                          <circle
                            cx="70"
                            cy="70"
                            r={R}
                            fill="none"
                            strokeWidth="12"
                            className="text-muted"
                            stroke="currentColor"
                          />
                          <motion.circle
                            cx="70"
                            cy="70"
                            r={R}
                            fill="none"
                            strokeWidth="12"
                            strokeLinecap="round"
                            className="text-primary"
                            stroke="currentColor"
                            strokeDasharray={CIRC}
                            initial={{ strokeDashoffset: CIRC }}
                            animate={{ strokeDashoffset: dash }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            transform="rotate(-90 70 70)"
                          />
                          <text
                            x="70"
                            y="64"
                            textAnchor="middle"
                            className="fill-foreground"
                            style={{ fontSize: "30px", fontWeight: 700 }}
                          >
                            {overallPct}
                          </text>
                          <text
                            x="70"
                            y="86"
                            textAnchor="middle"
                            className="fill-muted-foreground"
                            style={{ fontSize: "12px" }}
                          >
                            / 100
                          </text>
                        </svg>
                      </div>
                      <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                          {lvl.name}
                        </h1>
                        <p className="text-primary font-medium mb-3">
                          {lvl.range}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {lvlKey === "autonomous"
                            ? "You're ahead of the roughly 9% of SMBs that have fully integrated AI across their business."
                            : "Most SMBs land in the Reactive and Responsive range. Only about 9% have fully integrated AI across their business, so closing your gaps now is a real edge."}
                        </p>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 mb-6">
                      <p className="text-foreground leading-relaxed mb-3">
                        {lvl.headline}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {lvl.body}
                      </p>
                    </div>

                    {/* Stage breakdown with insights */}
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Your stage-by-stage breakdown
                    </h3>
                    <div className="space-y-4 mb-8">
                      {stageOrder.map((st) => {
                        const meta = STAGE_META[st];
                        const Icon = meta.icon;
                        const pct = Math.round((s[st] / 8) * 100);
                        const ins = STAGE_INSIGHT[st];
                        const strong = s[st] >= 6;
                        return (
                          <div
                            key={st}
                            className="bg-card border border-border rounded-xl p-5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 ${meta.color} rounded-md flex items-center justify-center`}
                                >
                                  <Icon className="text-white w-4 h-4" />
                                </div>
                                <span className="font-semibold text-foreground">
                                  {meta.label}
                                </span>
                                {st === weak && (
                                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    Start here
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {s[st]}/8
                              </span>
                            </div>
                            <Progress value={pct} className="h-2 mb-3" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {strong ? ins.strong : ins.weak}
                            </p>
                            {ins.stat && (
                              <div className="mt-3 flex items-baseline gap-2 rounded-lg bg-muted/60 px-3 py-2">
                                <span className="text-primary font-bold text-lg shrink-0">
                                  {ins.stat.value}
                                </span>
                                <span className="text-xs text-muted-foreground leading-snug">
                                  {ins.stat.label}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* By the numbers */}
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      Why this matters — by the numbers
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {INDUSTRY_STATS.map((stat) => {
                        const Icon = stat.icon;
                        return (
                          <div
                            key={stat.value}
                            className="bg-card border border-border rounded-xl p-4"
                          >
                            <Icon className="w-5 h-5 text-primary mb-2" />
                            <p className="text-2xl font-bold text-foreground leading-none mb-1">
                              {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground leading-snug">
                              {stat.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Personalized reco */}
                    <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">
                          Where we'd start: {STAGE_META[weak].label}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {STAGE_RECO[weak]}
                      </p>
                    </div>

                    {/* Inline solution match — the concrete fix for the weak stage */}
                    {(() => {
                      const sol = STAGE_SOLUTION[weak];
                      const SolIcon = sol.icon;
                      return (
                        <div className="bg-card border border-primary/40 rounded-xl p-6 mb-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">
                            Your fastest win
                          </p>
                          <div className="flex items-center gap-3 mb-1">
                            <div
                              className={`w-10 h-10 ${sol.color} rounded-lg flex items-center justify-center shrink-0`}
                            >
                              <SolIcon className="text-white w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                              {sol.name}
                            </h3>
                          </div>
                          <p className="text-primary text-sm font-medium mb-4">
                            {sol.tagline}
                          </p>
                          <ul className="space-y-2 text-sm text-foreground">
                            {sol.bullets.map((b) => (
                              <li key={b} className="flex items-start">
                                <CheckCircle2 className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}

                    <p className="text-xs text-muted-foreground/70 mb-8 leading-relaxed">
                      Figures are industry benchmarks from published research
                      (Velocify, MIT/HBR lead-response studies, Thryv, SAS/IDC),
                      not Thynra performance claims.
                    </p>

                    {/* Download the full PDF report */}
                    {reportUrl && (
                      <div className="text-center bg-primary/5 border border-primary/30 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          Your full report is ready
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto leading-relaxed">
                          A branded PDF with your scores, the stage to start
                          with, and a personalized 30 / 60 / 90-day action plan.
                          We've emailed you a copy too.
                        </p>
                        <a
                          href={reportUrl}
                          download={
                            reportFilename ||
                            "Thynra-AI-Readiness-Report.pdf"
                          }
                          data-testid="link-quiz-download-report"
                        >
                          <Button
                            variant="outline"
                            className="font-semibold border-primary/40 text-primary hover:bg-primary/10"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download your report (PDF)
                          </Button>
                        </a>
                      </div>
                    )}

                    {/* CTA — hand the prospect to Sofia for screening */}
                    <div className="text-center bg-card border border-border rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Want a second set of eyes on this?
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                        Talk to Sofia, our AI receptionist. She'll walk through
                        your result, pinpoint the one fix with the fastest
                        payback, and book a free discovery call if it's worth it
                        for your business.
                      </p>
                      {sofiaConfigured() ? (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                          <Button
                            onClick={() => {
                              const quizCtx: QuizContext = {
                                level: lvl.name,
                                totalScore: totalScore(),
                                scores: {
                                  awareness: s.awareness,
                                  conversion: s.conversion,
                                  retention: s.retention,
                                },
                                weakestStage: STAGE_META[weak].label,
                              };
                              void talkToSofia("screening", quizCtx);
                            }}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-lg font-semibold"
                            data-testid="button-quiz-talk-sofia"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Talk to Sofia
                          </Button>
                          <button
                            onClick={() => {
                              void chatWithSofia();
                            }}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                            data-testid="button-quiz-chat-sofia"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Prefer to type? Chat instead
                          </button>
                        </div>
                      ) : (
                        <a
                          href={CALENDLY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid="link-quiz-book-call"
                        >
                          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-lg font-semibold">
                            <Phone className="w-4 h-4 mr-2" />
                            Book a call
                          </Button>
                        </a>
                      )}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setAnswers({});
                            setStep(0);
                            setPhase("questions");
                            setReportUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev);
                              return null;
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                          data-testid="button-quiz-retake"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Retake the assessment
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
