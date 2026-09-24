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
import { withLeadContext } from "@/lib/attribution";
import {
  buildReport,
  levelForScore,
  reportCopy,
  reportSummaryText,
  stageSequence,
  type Stage,
} from "@/lib/quizReport";
import { sofiaConfigured, talkToSofia, chatWithSofia, type QuizContext } from "@/lib/sofiaWidget";
import { defineCopy, useCopy, useLocale } from "@/i18n";

const CALENDLY_URL = "https://calendly.com/efdeugenio/apply-ai";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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

type QuestionId = "aw1" | "aw2" | "cv1" | "cv2" | "rt1" | "rt2";
type OptionValue = 1 | 2 | 3 | 4;

interface Question {
  id: QuestionId;
  stage: Stage;
}

// Stage visuals are locale-independent; labels come from reportCopy.
const STAGE_STYLE: Record<Stage, { icon: typeof Search; color: string }> = {
  awareness: { icon: Search, color: "bg-blue-500" },
  conversion: { icon: MessagesSquare, color: "bg-purple-500" },
  retention: { icon: Repeat, color: "bg-emerald-500" },
};

// 6 questions, 2 per stage. Each option scores 1 (manual) to 4 (autonomous).
// Ids and option values are shared by every locale; only the text is localized.
const QUESTIONS: Question[] = [
  { id: "aw1", stage: "awareness" },
  { id: "aw2", stage: "awareness" },
  { id: "cv1", stage: "conversion" },
  { id: "cv2", stage: "conversion" },
  { id: "rt1", stage: "retention" },
  { id: "rt2", stage: "retention" },
];

const OPTION_VALUES: OptionValue[] = [1, 2, 3, 4];

// Headline industry benchmarks for the "by the numbers" strip (text in
// reportCopy.industryStats, same order).
const INDUSTRY_STAT_ICONS: (typeof Clock)[] = [Clock, Zap, TrendingUp, CheckCircle2];

// The Thynra solution that maps to each weak stage — rendered inline on the
// result page so the prospect sees the concrete fix, not just a diagnosis.
const STAGE_SOLUTION_STYLE: Record<Stage, { icon: typeof Search; color: string }> = {
  awareness: { icon: Star, color: "bg-blue-500" },
  conversion: { icon: Phone, color: "bg-purple-500" },
  retention: { icon: Repeat, color: "bg-emerald-500" },
};

type QuestionCopy = { text: string; options: Record<OptionValue, string> };
type SolutionCopy = { name: string; tagline: string; bullets: string[] };

const copy = defineCopy<{
  headerLabel: string;
  introTitle: string;
  introBody: string;
  questionOf: (n: number, total: number) => string;
  back: string;
  questions: Record<QuestionId, QuestionCopy>;
  gateToastTitle: string;
  gateToastBody: string;
  gateTitle: string;
  gateBody: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  businessLabel: string;
  businessPlaceholder: string;
  submitting: string;
  submit: string;
  privacy: string;
  dateLocale: string;
  pdfBaseName: string;
  reportKicker: string;
  peerAutonomous: string;
  peerOther: string;
  breakdownTitle: string;
  sequenceIntro: string;
  /** "Stage one / two / three" — the rung, not a grade. */
  rankLabels: [string, string, string];
  rankHints: [string, string, string];
  levelStripTitle: string;
  startHere: string;
  numbersTitle: string;
  whereWeStart: (stage: string) => string;
  fastestWin: string;
  solutions: Record<Stage, SolutionCopy>;
  reportReadyTitle: string;
  reportReadyBody: string;
  downloadReport: string;
  ctaTitle: string;
  ctaBody: string;
  talkToSofia: string;
  chatInstead: string;
  bookCall: string;
  retake: string;
}>({
  en: {
    headerLabel: "AI Readiness Check",
    introTitle: "Which problem should you fix first?",
    introBody:
      "Six questions, about two minutes. You get back the three stages where SMBs win or lose customers — Awareness, Conversion, Retention — put in the order we'd fix them, so you know what stage one is.",
    questionOf: (n, total) => `Question ${n} of ${total}`,
    back: "Back",
    questions: {
      aw1: {
        text: "When someone searches for a business like yours, how reliably do you show up?",
        options: {
          1: "We rely on word of mouth. No real online presence.",
          2: "We have a profile and some reviews, but it's inconsistent.",
          3: "We actively manage reviews, listings, and search presence.",
          4: "We're consistently visible across search and AI tools, with a system behind it.",
        },
      },
      aw2: {
        text: "How often do you publish content or engage where your customers are looking?",
        options: {
          1: "Rarely. We don't have time for it.",
          2: "Now and then, when someone remembers to.",
          3: "On a schedule, mostly done by hand.",
          4: "Consistently, with help that keeps it in our voice.",
        },
      },
      cv1: {
        text: "When a new lead reaches out (call, form, chat, DM), how fast does someone respond?",
        options: {
          1: "Hours, sometimes the next day.",
          2: "Within an hour or two, if we're not slammed.",
          3: "Usually within minutes during business hours.",
          4: "Instantly, 24/7, even when no human is available.",
        },
      },
      cv2: {
        text: "What happens to inquiries that come in after hours or while you're busy?",
        options: {
          1: "They wait until someone is free. Some get lost.",
          2: "We catch up eventually, but follow-up is patchy.",
          3: "An auto-reply holds them, then a person follows up.",
          4: "They're answered, qualified, and booked automatically.",
        },
      },
      rt1: {
        text: "How do you follow up with past customers or leads that went quiet?",
        options: {
          1: "We don't, really. We hope they come back.",
          2: "Occasionally, one by one, when we think of it.",
          3: "With manual campaigns or templates we send out.",
          4: "Automatically, with relevant, personalized follow-ups.",
        },
      },
      rt2: {
        text: "How do you ask for reviews and referrals?",
        options: {
          1: "We don't have a process for it.",
          2: "We ask sometimes, when it feels right.",
          3: "We ask consistently, by hand.",
          4: "It's automated and timed to the right moment.",
        },
      },
    },
    gateToastTitle: "Almost there",
    gateToastBody: "Add your name and email to see your results.",
    gateTitle: "Your results are ready.",
    gateBody:
      "Tell us where to send your plan, and we'll show it to you right now.",
    nameLabel: "Name *",
    namePlaceholder: "Your full name",
    emailLabel: "Email *",
    emailPlaceholder: "you@business.com",
    businessLabel: "Business",
    businessPlaceholder: "Optional",
    submitting: "Calculating...",
    submit: "Show my results",
    privacy:
      "No spam. We'll only use this to send your results and follow up if you want help.",
    dateLocale: "en-US",
    pdfBaseName: "Thynra-AI-Readiness-Report",
    reportKicker: "Your AI Readiness report",
    peerAutonomous:
      "You're ahead of the roughly 9% of SMBs that have fully integrated AI across their business.",
    peerOther:
      "Most SMBs land in the Reactive and Responsive range. Only about 9% have fully integrated AI across their business, so closing your gaps now is a real edge.",
    breakdownTitle: "Your plan, in order",
    sequenceIntro:
      "This isn't a grade. It's the order we'd fix things in — weakest first, because that's where the money is leaking fastest. You don't do all three. You do stage one.",
    rankLabels: ["Stage one", "Stage two", "Stage three"],
    rankHints: [
      "What we'd build first",
      "Once stage one is running",
      "Last, and cheaper by then",
    ],
    levelStripTitle: "Where you're starting from",
    startHere: "Start here",
    numbersTitle: "Why this matters — by the numbers",
    whereWeStart: (stage) => `Where we'd start: ${stage}`,
    fastestWin: "Your fastest win",
    solutions: {
      awareness: {
        name: "Reputation & Local Presence",
        tagline: "Get found and trusted before the first call.",
        bullets: [
          "Review monitoring with on-brand responses, ready to approve",
          "Post-visit review nudges that lift your local map-pack ranking",
          "Google Business Profile audit, fixes, and weekly posts",
          "A fast website you own — hosting and domain in your name",
        ],
      },
      conversion: {
        name: "Answering and follow-up",
        tagline: "Answer and book in the next five minutes — then follow up for you.",
        bullets: [
          "Phone, web chat, WhatsApp, and SMS answered 24/7, in English and Spanish",
          "Books appointments and qualifies leads on every channel",
          "Drafts your follow-ups, quotes, and replies in your voice for approval",
          "Appointment reminders and no-show recovery that run themselves",
        ],
      },
      retention: {
        name: "Recall & Reactivation",
        tagline: "Win back the customers you already paid to earn.",
        bullets: [
          "Wins back lapsed customers and patients automatically",
          "Reactivation campaigns that run on your existing data",
          "Personalized follow-ups in your voice — not generic blasts",
          "Turns one-time buyers into repeat revenue and referrals",
        ],
      },
    },
    reportReadyTitle: "Your full report is ready",
    reportReadyBody:
      "A branded PDF with your scores, the stage to start with, and a personalized 30 / 60 / 90-day action plan. We've emailed you a copy too.",
    downloadReport: "Download your report (PDF)",
    ctaTitle: "Want a second set of eyes on this?",
    ctaBody:
      "Talk to Sofia, our AI receptionist. She'll walk through your result, pinpoint the one fix with the fastest payback, and book a free discovery call if it's worth it for your business.",
    talkToSofia: "Talk to Sofia",
    chatInstead: "Prefer to type? Chat instead",
    bookCall: "Book a call",
    retake: "Retake the assessment",
  },
  es: {
    headerLabel: "Diagnóstico de IA",
    introTitle: "¿Qué problema deberías arreglar primero?",
    introBody:
      "Seis preguntas, unos dos minutos. Te devolvemos las tres etapas donde los negocios ganan o pierden clientes (Visibilidad, Conversión y Fidelización) puestas en el orden en que las arreglaríamos, para que sepas cuál es tu etapa uno.",
    questionOf: (n, total) => `Pregunta ${n} de ${total}`,
    back: "Atrás",
    questions: {
      aw1: {
        text: "Cuando alguien busca un negocio como el tuyo, ¿qué tan seguido apareces?",
        options: {
          1: "Dependemos del boca a boca. No tenemos una presencia real en internet.",
          2: "Tenemos un perfil y algunas reseñas, pero no somos constantes.",
          3: "Gestionamos activamente las reseñas, los directorios y nuestra presencia en buscadores.",
          4: "Aparecemos siempre en buscadores y herramientas de IA, con un sistema detrás.",
        },
      },
      aw2: {
        text: "¿Con qué frecuencia publicas contenido o participas donde tus clientes están buscando?",
        options: {
          1: "Casi nunca. No tenemos tiempo.",
          2: "De vez en cuando, cuando alguien se acuerda.",
          3: "Con un calendario, pero casi todo a mano.",
          4: "Constantemente, con ayuda que respeta nuestra forma de comunicar.",
        },
      },
      cv1: {
        text: "Cuando un cliente potencial nuevo te contacta (llamada, formulario, chat, mensaje directo), ¿qué tan rápido le responde alguien?",
        options: {
          1: "En horas, a veces al día siguiente.",
          2: "En una o dos horas, si no estamos a tope.",
          3: "Normalmente en minutos, en horario de atención.",
          4: "Al instante, 24/7, aunque no haya nadie disponible.",
        },
      },
      cv2: {
        text: "¿Qué pasa con las consultas que llegan fuera de horario o cuando estás ocupado?",
        options: {
          1: "Esperan hasta que alguien se desocupe. Algunas se pierden.",
          2: "Tarde o temprano respondemos, pero el seguimiento es irregular.",
          3: "Una respuesta automática las recibe y después una persona les da seguimiento.",
          4: "Se responden, se filtran y se agendan automáticamente.",
        },
      },
      rt1: {
        text: "¿Cómo les das seguimiento a clientes anteriores o a clientes potenciales que dejaron de responder?",
        options: {
          1: "La verdad, no lo hacemos. Esperamos que vuelvan.",
          2: "De vez en cuando, uno por uno, cuando nos acordamos.",
          3: "Con campañas manuales o plantillas que enviamos.",
          4: "Automáticamente, con seguimientos relevantes y personalizados.",
        },
      },
      rt2: {
        text: "¿Cómo pides reseñas y recomendaciones?",
        options: {
          1: "No tenemos un proceso para eso.",
          2: "A veces las pedimos, cuando parece el momento.",
          3: "Las pedimos siempre, a mano.",
          4: "Está automatizado y se pide en el momento justo.",
        },
      },
    },
    gateToastTitle: "Ya casi",
    gateToastBody: "Agrega tu nombre y correo para ver tus resultados.",
    gateTitle: "Tus resultados están listos.",
    gateBody:
      "Dinos a dónde enviarte tu plan y te lo mostramos ahora mismo.",
    nameLabel: "Nombre *",
    namePlaceholder: "Tu nombre completo",
    emailLabel: "Correo *",
    emailPlaceholder: "tu@negocio.com",
    businessLabel: "Negocio",
    businessPlaceholder: "Opcional",
    submitting: "Calculando...",
    submit: "Ver mis resultados",
    privacy:
      "Sin spam. Solo usaremos estos datos para enviarte tus resultados y darte seguimiento si quieres ayuda.",
    dateLocale: "es-419",
    pdfBaseName: "Thynra-Diagnostico-IA",
    reportKicker: "Tu Diagnóstico de IA",
    peerAutonomous:
      "Estás por delante de ese 9% aproximado de pymes que ya integró la IA por completo en su negocio.",
    peerOther:
      "La mayoría de las pymes queda entre Negocio reactivo y Negocio que responde. Solo alrededor del 9% ha integrado la IA por completo en su negocio, así que cerrar tus brechas ahora es una ventaja real.",
    breakdownTitle: "Tu plan, en orden",
    sequenceIntro:
      "Esto no es una nota. Es el orden en que lo arreglaríamos: primero lo más débil, porque es por donde se te está yendo el dinero más rápido. No haces las tres. Haces la etapa uno.",
    rankLabels: ["Etapa uno", "Etapa dos", "Etapa tres"],
    rankHints: [
      "Lo que construiríamos primero",
      "Cuando la etapa uno esté funcionando",
      "Al final, y para entonces más barata",
    ],
    levelStripTitle: "Desde dónde arrancas",
    startHere: "Empieza aquí",
    numbersTitle: "Por qué importa: los números",
    whereWeStart: (stage) => `Por dónde empezaríamos: ${stage}`,
    fastestWin: "Tu mejora más rápida",
    solutions: {
      awareness: {
        name: "Reputación y presencia local",
        tagline: "Que te encuentren y confíen en ti antes de la primera llamada.",
        bullets: [
          "Monitoreo de reseñas con respuestas en tu estilo, listas para que las apruebes",
          "Recordatorios para pedir reseñas después de cada visita, que mejoran tu posición en el mapa local",
          "Revisión y corrección de tu Perfil de Empresa en Google, más publicaciones semanales",
          "Un sitio web rápido que es tuyo, con hosting y dominio a tu nombre",
        ],
      },
      conversion: {
        name: "Respuesta y seguimiento",
        tagline: "Responde y agenda en los próximos cinco minutos, y después da seguimiento por ti.",
        bullets: [
          "Teléfono, chat web, WhatsApp y SMS atendidos 24/7, en español e inglés",
          "Agenda citas y califica clientes potenciales en todos los canales",
          "Redacta tus seguimientos, cotizaciones y respuestas en tu estilo, para que los apruebes",
          "Recordatorios de citas y recuperación de inasistencias que funcionan solos",
        ],
      },
      retention: {
        name: "Recuperación de clientes",
        tagline: "Recupera a los clientes que ya te costó ganar.",
        bullets: [
          "Recupera automáticamente a clientes y pacientes que dejaron de venir",
          "Campañas de reactivación que funcionan con los datos que ya tienes",
          "Seguimientos personalizados en tu estilo, no envíos masivos genéricos",
          "Convierte a quienes compraron una vez en ventas repetidas y recomendaciones",
        ],
      },
    },
    reportReadyTitle: "Tu reporte completo está listo",
    reportReadyBody:
      "Un PDF con tus puntajes, la etapa por la que conviene empezar y un plan de acción personalizado a 30 / 60 / 90 días. También te enviamos una copia por correo.",
    downloadReport: "Descarga tu reporte (PDF)",
    ctaTitle: "¿Quieres una segunda opinión?",
    ctaBody:
      "Habla con Sofia, nuestra recepcionista con IA. Revisa tu resultado contigo, identifica la mejora que se paga más rápido y, si vale la pena para tu negocio, te agenda una llamada inicial gratuita.",
    talkToSofia: "Habla con Sofia",
    chatInstead: "¿Prefieres escribir? Escríbele a Sofia",
    bookCall: "Agenda una llamada",
    retake: "Volver a hacer el diagnóstico",
  },
});

export default function QuizPage() {
  const { toast } = useToast();
  const locale = useLocale();
  const t = useCopy(copy);
  const rc = reportCopy[locale];
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

  const orderedStages = (): Stage[] => stageSequence(stageScores());

  const weakestStage = (): Stage => orderedStages()[0];

  const submitGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: t.gateToastTitle,
        description: t.gateToastBody,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const report = buildReport(stageScores(), {
      name: name.trim(),
      company: company.trim(),
    });
    const summary = reportSummaryText(report, locale);
    const dateLabel = new Date().toLocaleDateString(t.dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const filename = `${t.pdfBaseName}${
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
        <QuizReportPdf data={report} dateLabel={dateLabel} locale={locale} />,
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
      await apiRequest(
        "POST",
        "/api/contact",
        withLeadContext(
          {
            kind: "quiz",
            name,
            email,
            company,
            message: summary,
            level: rc.levels[report.levelKey].name,
            levelKey: report.levelKey,
            scores: report.scores,
            weakestStage: rc.stages[report.weakest].label,
            weakestStageKey: report.weakest,
            pdfBase64,
            pdfFilename: filename,
          },
          locale,
        ),
      );
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
            {t.headerLabel}
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
                    {t.introTitle}
                  </h1>
                  <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    {t.introBody}
                  </p>
                </div>
              )}

              {(() => {
                const q = QUESTIONS[step];
                const qc = t.questions[q.id];
                const meta = { ...STAGE_STYLE[q.stage], ...rc.stages[q.stage] };
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
                          {t.questionOf(step + 1, total)}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 leading-snug">
                      {qc.text}
                    </h2>

                    <div className="space-y-3">
                      {OPTION_VALUES.map((value) => {
                        const opt = { value, label: qc.options[value] };
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
                        {t.back}
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
                {t.gateTitle}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t.gateBody}
              </p>

              <form onSubmit={submitGate} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.nameLabel}
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    required
                    data-testid="input-quiz-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.emailLabel}
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    data-testid="input-quiz-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.businessLabel}
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t.businessPlaceholder}
                    data-testid="input-quiz-company"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform"
                  disabled={submitting}
                  data-testid="button-quiz-reveal"
                >
                  {submitting ? t.submitting : t.submit}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-1">
                  {t.privacy}
                </p>
                <button
                  type="button"
                  onClick={back}
                  className="block mx-auto text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 inline" />
                  {t.back}
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
                const lvl = rc.levels[lvlKey];
                const s = stageScores();
                const weak = weakestStage();
                const ordered = orderedStages();
                const overallPct = Math.round((totalScore() / 24) * 100);
                const R = 54;
                const CIRC = 2 * Math.PI * R;
                const dash = CIRC * (1 - overallPct / 100);
                return (
                  <div>
                    <p className="text-center text-xs font-semibold uppercase tracking-wider text-primary/70 mb-4">
                      {t.reportKicker}
                    </p>

                    {/* The deliverable: the order of work, weakest first. */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                      {t.breakdownTitle}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t.sequenceIntro}
                    </p>
                    <div className="space-y-4 mb-8">
                      {ordered.map((st, rank) => {
                        const meta = { ...STAGE_STYLE[st], ...rc.stages[st] };
                        const Icon = meta.icon;
                        const pct = Math.round((s[st] / 8) * 100);
                        const ins = rc.insights[st];
                        const strong = s[st] >= 6;
                        return (
                          <div
                            key={st}
                            className="bg-card border border-border rounded-xl p-5"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 ${meta.color} rounded-md flex items-center justify-center shrink-0`}
                                >
                                  <Icon className="text-white w-4 h-4" />
                                </div>
                                <div>
                                  <p
                                    className={`text-xs font-semibold uppercase tracking-wider ${
                                      rank === 0
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {t.rankLabels[rank]} · {t.rankHints[rank]}
                                  </p>
                                  <span className="font-semibold text-foreground">
                                    {meta.label}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground shrink-0 mt-1">
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
                      {t.numbersTitle}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {rc.industryStats.map((stat, i) => {
                        const Icon = INDUSTRY_STAT_ICONS[i];
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

                    {/* Where you're starting from — context for the plan above,
                        not the headline. */}
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {t.levelStripTitle}
                    </h3>
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
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                          {lvl.name}
                        </h2>
                        <p className="text-primary font-medium mb-3">
                          {lvl.range}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {lvlKey === "autonomous"
                            ? t.peerAutonomous
                            : t.peerOther}
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

                    {/* Personalized reco */}
                    <div className="bg-primary/5 border border-primary/30 rounded-xl p-6 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">
                          {t.whereWeStart(rc.stages[weak].label)}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {rc.reco[weak]}
                      </p>
                    </div>

                    {/* Inline solution match — the concrete fix for the weak stage */}
                    {(() => {
                      const sol = { ...STAGE_SOLUTION_STYLE[weak], ...t.solutions[weak] };
                      const SolIcon = sol.icon;
                      return (
                        <div className="bg-card border border-primary/40 rounded-xl p-6 mb-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">
                            {t.fastestWin}
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
                      {rc.sourcesNote}
                    </p>

                    {/* Download the full PDF report */}
                    {reportUrl && (
                      <div className="text-center bg-primary/5 border border-primary/30 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {t.reportReadyTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto leading-relaxed">
                          {t.reportReadyBody}
                        </p>
                        <a
                          href={reportUrl}
                          download={
                            reportFilename ||
                            `${t.pdfBaseName}.pdf`
                          }
                          data-testid="link-quiz-download-report"
                        >
                          <Button
                            variant="outline"
                            className="font-semibold border-primary/40 text-primary hover:bg-primary/10"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {t.downloadReport}
                          </Button>
                        </a>
                      </div>
                    )}

                    {/* CTA — hand the prospect to Sofia for screening */}
                    <div className="text-center bg-card border border-border rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {t.ctaTitle}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                        {t.ctaBody}
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
                                weakestStage: rc.stages[weak].label,
                              };
                              void talkToSofia("screening", quizCtx);
                            }}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-6 rounded-lg font-semibold"
                            data-testid="button-quiz-talk-sofia"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            {t.talkToSofia}
                          </Button>
                          <button
                            onClick={() => {
                              void chatWithSofia();
                            }}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                            data-testid="button-quiz-chat-sofia"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {t.chatInstead}
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
                            {t.bookCall}
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
                          {t.retake}
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
