// Shared model for the Front-Office AI Readiness quiz report.
//
// This is the single source of truth for scoring, level/stage copy, benchmark
// stats, and the personalized 30/60/90 action plan. Both the on-screen result
// (pages/quiz.tsx) and the downloadable/emailed PDF (components/QuizReportPdf)
// import from here so the two never drift apart.
//
// Copy is localized (en/es) via `reportCopy[locale]`; scoring, stage keys and
// level keys are locale-independent.
//
// Stats are published industry benchmarks (Velocify, MIT/HBR lead-response
// studies, Thryv, SAS/IDC), NOT Thynra performance claims — keep it sourceable.
//
// The PDF renders with built-in Helvetica (WinAnsi only): keep this copy to
// Latin-1 letters plus the — – · punctuation already in use.

import { defineCopy, type Locale } from "@/i18n";

export type Stage = "awareness" | "conversion" | "retention";
export type LevelKey = "reactive" | "responsive" | "autonomous";

export const STAGE_ORDER: Stage[] = ["awareness", "conversion", "retention"];

export const STAGE_HEX: Record<Stage, string> = {
  awareness: "#3B82F6",
  conversion: "#A855F7",
  retention: "#10B981",
};

export interface ReportCopy {
  stages: Record<Stage, { label: string; blurb: string }>;
  levels: Record<LevelKey, { name: string; range: string; headline: string; body: string }>;
  insights: Record<
    Stage,
    { strong: string; weak: string; stat?: { value: string; label: string } }
  >;
  reco: Record<Stage, string>;
  industryStats: { value: string; label: string }[];
  actionPlan: Record<Stage, { horizon: string; title: string; steps: string[] }[]>;
  sourcesNote: string;
  summary: {
    header: string;
    result: (level: string, total: number) => string;
    stages: (scores: Record<Stage, number>, labels: Record<Stage, string>) => string;
    weakest: (stage: string) => string;
    /** The stages in the order we would fix them — the actual deliverable. */
    sequence: (labels: string[]) => string;
  };
}

export const reportCopy = defineCopy<ReportCopy>({
  en: {
    stages: {
      awareness: { label: "Awareness", blurb: "How customers find you." },
      conversion: { label: "Conversion", blurb: "What happens in the next five minutes." },
      retention: { label: "Retention", blurb: "What happens after the first sale." },
    },
    levels: {
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
    },
    insights: {
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
    },
    reco: {
      awareness:
        "Awareness is your softest stage. Customers can't choose you if they can't find you. Start by making your presence consistent across search and reviews so demand stops leaking before it reaches you.",
      conversion:
        "Conversion is your softest stage, and it's usually the most expensive gap. Leads contacted within five minutes convert dramatically better than ones that wait, yet the average business takes over a day to respond. Closing that window is the fastest win available to you.",
      retention:
        "Retention is your softest stage. You've already paid to win these customers. A simple, automated follow-up and review system turns one-time buyers into repeat revenue and referrals without more ad spend.",
    },
    industryStats: [
      { value: "42 hrs", label: "average time a business takes to respond to a new lead" },
      { value: "40–60%", label: "of routine inquiries AI can handle with no human involved" },
      { value: "20+ hrs/mo", label: "saved by most small businesses already using AI" },
      { value: "~9%", label: "of SMBs have fully integrated AI across their business — being early is an edge" },
    ],
    // The actionable centerpiece: a concrete 30 / 60 / 90-day plan per stage.
    // Written so an owner can act on it without us, but honest about where a
    // done-for-you build (Sofia / Thynra) removes the manual lift.
    actionPlan: {
      awareness: [
        {
          horizon: "First 30 days",
          title: "Stop leaking demand at the source",
          steps: [
            "Claim and fully fill out your Google Business Profile — hours, services, photos, and a direct booking/contact link.",
            "Ask your last 10 happy customers for a review this week. Volume and recency are what move the map ranking.",
            "Make sure your name, address, and phone are identical everywhere they appear online.",
          ],
        },
        {
          horizon: "Days 30–60",
          title: "Make presence consistent, not occasional",
          steps: [
            "Set a once-a-week content cadence (a tip, a before/after, an FAQ answer) on the one channel your customers actually use.",
            "Turn the 5 questions you get asked most into public answers — on your site and your profile.",
            "Put a review request into your post-service routine so it happens every time, not when you remember.",
          ],
        },
        {
          horizon: "Days 60–90",
          title: "Automate so it runs without you",
          steps: [
            "Trigger the review request automatically at the right moment after each visit.",
            "Keep content in your voice on schedule with AI assistance instead of by hand.",
            "Review what search terms and channels actually bring paying customers, and double down.",
          ],
        },
      ],
      conversion: [
        {
          horizon: "First 30 days",
          title: "Close the response-time gap — the fastest win you have",
          steps: [
            "Measure your real median response time to a new lead today. You can't fix what you don't see.",
            "Put an instant auto-acknowledgement on every inbound channel (call, form, chat, DM) so no one waits in silence.",
            "Define a 3-question qualifier so whoever responds first knows if it's a fit.",
          ],
        },
        {
          horizon: "Days 30–60",
          title: "Never miss after-hours or busy-hour inquiries",
          steps: [
            "Set up coverage for the moments you lose leads: after hours, lunch, and when you're with a customer.",
            "Have an AI receptionist answer common questions, qualify, and book — handing off only the ones that need you.",
            "Connect bookings straight to your calendar so there's no back-and-forth.",
          ],
        },
        {
          horizon: "Days 60–90",
          title: "Make instant, 24/7 response the default",
          steps: [
            "Move to answered-and-booked-automatically for routine inquiries, 24/7.",
            "Route only qualified, high-intent leads to a human, with full context attached.",
            "Track answer time and booking rate weekly and tune the script where leads drop off.",
          ],
        },
      ],
      retention: [
        {
          horizon: "First 30 days",
          title: "Reopen the revenue you already paid to win",
          steps: [
            "Pull a list of customers/leads who went quiet in the last 6–12 months.",
            "Send one relevant, personal follow-up to that list — not a blast, a reason to come back.",
            "Add a single review-and-referral ask to your post-sale moment.",
          ],
        },
        {
          horizon: "Days 30–60",
          title: "Turn follow-up into a system, not a memory",
          steps: [
            "Build a simple win-back sequence (overdue visit, lapsed lead) you can reuse.",
            "Segment by service or value so the message actually fits the customer.",
            "Time the review request to the moment satisfaction is highest.",
          ],
        },
        {
          horizon: "Days 60–90",
          title: "Make repeat revenue automatic",
          steps: [
            "Automate personalized follow-ups and recalls so they fire on their own.",
            "Close the loop: every new review and referral feeds back into Awareness.",
            "Watch repeat-purchase and reactivation rates and refine the timing.",
          ],
        },
      ],
    },
    sourcesNote:
      "Figures are industry benchmarks from published research (Velocify, MIT/HBR lead-response studies, Thryv, SAS/IDC), not Thynra performance claims.",
    // The Worker matches "Front-Office AI Readiness" in English messages as a
    // fallback quiz detector — do not change this header.
    summary: {
      header: "Front-Office AI Readiness assessment",
      result: (level, total) => `Result: ${level} (score ${total}/24)`,
      stages: (s, l) =>
        `${l.awareness} ${s.awareness}/8, ${l.conversion} ${s.conversion}/8, ${l.retention} ${s.retention}/8`,
      weakest: (stage) => `Weakest stage: ${stage}`,
      sequence: (labels) => `Order we'd fix them: 1) ${labels[0]}, 2) ${labels[1]}, 3) ${labels[2]}`,
    },
  },
  es: {
    stages: {
      awareness: { label: "Visibilidad", blurb: "Cómo te encuentran los clientes." },
      conversion: { label: "Conversión", blurb: "Lo que pasa en los próximos cinco minutos." },
      retention: { label: "Fidelización", blurb: "Lo que pasa después de la primera venta." },
    },
    levels: {
      reactive: {
        name: "Negocio reactivo",
        range: "Tu negocio depende de las personas y de la memoria",
        headline:
          "Los clientes te contactan cuando logran encontrarte disponible. El trabajo sale, pero depende de que alguien esté ahí, y se te escapan ingresos por huecos que no ves.",
        body: "Aquí está la mayoría de los negocios en crecimiento. La buena noticia: las mejoras de mayor impacto en este punto también son las más rápidas. Solo con reducir el tiempo de respuesta, normalmente la inversión se paga sola.",
      },
      responsive: {
        name: "Negocio que responde",
        range: "Tienes sistemas, pero todavía dependen de ti",
        headline:
          "Ya tienes una estructura real. Las consultas se responden y el seguimiento se hace, pero mucho todavía pasa por tus manos, y se vuelve irregular cuando hay mucho trabajo.",
        body: "Ya superaste lo básico. La oportunidad ahora es dejar de ser el cuello de botella, para que el sistema aguante el doble de volumen sin el doble de esfuerzo.",
      },
      autonomous: {
        name: "Negocio autónomo",
        range: "Tu negocio funciona prácticamente solo",
        headline:
          "La visibilidad, la conversión y la fidelización funcionan con muy poco trabajo manual. Estás en el nivel más alto de madurez en IA para una pyme.",
        body: "A partir de aquí se trata de optimizar y cuidar los casos especiales: afinar los traspasos, personalizar mejor y asegurarte de que la calidad se mantenga a medida que creces. Aquí es donde lo bueno empieza a multiplicarse.",
      },
    },
    insights: {
      awareness: {
        strong:
          "Apareces donde tus clientes buscan. Es demanda por la que no tienes que pagar dos veces.",
        weak: "Los clientes no pueden elegir un negocio que nunca encuentran. Tener presencia constante en buscadores y reseñas es la demanda más barata que vas a generar.",
      },
      conversion: {
        strong:
          "Respondes rápido. La velocidad es lo que más influye en que una consulta se convierta en cliente.",
        weak: "Esta suele ser la brecha más cara. Cada respuesta lenta es un cliente que ya llamó a otro negocio.",
        stat: {
          value: "391%",
          label:
            "más conversión cuando se le responde a un cliente potencial en menos de 5 minutos, frente al promedio de la industria de 42 horas",
        },
      },
      retention: {
        strong:
          "Mantienes viva la relación después de la venta. Los clientes que vuelven son tus ingresos con mayor margen.",
        weak: "Ya pagaste por ganar a estos clientes. Un sistema sencillo y automático de seguimiento y reseñas los convierte en ventas repetidas y recomendaciones, sin gastar más en anuncios.",
      },
    },
    reco: {
      awareness:
        "Visibilidad es tu etapa más débil. Los clientes no pueden elegirte si no te encuentran. Empieza por tener una presencia constante en buscadores y reseñas, para que la demanda deje de perderse antes de llegar a ti.",
      conversion:
        "Conversión es tu etapa más débil, y suele ser la brecha más cara. Los clientes potenciales que reciben respuesta en menos de cinco minutos se convierten muchísimo más que los que esperan, y aun así el negocio promedio tarda más de un día en responder. Cerrar esa ventana es la mejora más rápida que tienes a tu alcance.",
      retention:
        "Fidelización es tu etapa más débil. Ya pagaste por ganar a estos clientes. Un sistema sencillo y automático de seguimiento y reseñas convierte a quienes compraron una vez en ventas repetidas y recomendaciones, sin gastar más en anuncios.",
    },
    industryStats: [
      { value: "42 h", label: "es lo que tarda en promedio un negocio en responderle a un cliente potencial nuevo" },
      { value: "40–60%", label: "de las consultas de rutina las puede resolver la IA sin intervención humana" },
      { value: "20+ h/mes", label: "que ahorran la mayoría de los negocios pequeños que ya usan IA" },
      { value: "~9%", label: "de las pymes ha integrado la IA por completo en su negocio: llegar temprano es una ventaja" },
    ],
    actionPlan: {
      awareness: [
        {
          horizon: "Primeros 30 días",
          title: "Deja de perder demanda desde el origen",
          steps: [
            "Reclama tu Perfil de Empresa en Google y complétalo con todo: horario, servicios, fotos y un enlace directo para reservar o contactarte.",
            "Pídeles una reseña esta semana a tus últimos 10 clientes satisfechos. Lo que mejora tu posición en el mapa es cuántas reseñas tienes y qué tan recientes son.",
            "Asegúrate de que tu nombre, dirección y teléfono sean idénticos en todos los lugares donde aparecen en internet.",
          ],
        },
        {
          horizon: "Días 30–60",
          title: "Que tu presencia sea constante, no ocasional",
          steps: [
            "Publica una vez por semana (un consejo, un antes y después, la respuesta a una pregunta frecuente) en el canal que tus clientes realmente usan.",
            "Convierte las 5 preguntas que más te hacen en respuestas públicas, en tu sitio web y en tu perfil.",
            "Incluye la solicitud de reseña en tu rutina después de cada servicio, para que pase siempre y no solo cuando te acuerdas.",
          ],
        },
        {
          horizon: "Días 60–90",
          title: "Automatiza para que funcione sin ti",
          steps: [
            "Envía la solicitud de reseña automáticamente en el momento adecuado después de cada visita.",
            "Mantén tus publicaciones al día y con tu estilo con ayuda de la IA, en lugar de hacerlo a mano.",
            "Revisa qué búsquedas y canales te traen clientes que realmente pagan, y apuesta más por ellos.",
          ],
        },
      ],
      conversion: [
        {
          horizon: "Primeros 30 días",
          title: "Reduce tu tiempo de respuesta: la mejora más rápida que tienes",
          steps: [
            "Mide hoy cuánto tardas de verdad en responderle a un cliente potencial nuevo (la mediana). No puedes arreglar lo que no ves.",
            "Pon una respuesta automática inmediata en cada canal de entrada (llamada, formulario, chat, mensaje directo) para que nadie espere sin respuesta.",
            "Define 3 preguntas de filtro para que quien responda primero sepa si es un buen cliente para ti.",
          ],
        },
        {
          horizon: "Días 30–60",
          title: "No vuelvas a perder consultas fuera de horario o en horas pico",
          steps: [
            "Cubre los momentos en que pierdes clientes potenciales: fuera de horario, a la hora de almuerzo y cuando estás atendiendo a alguien.",
            "Haz que una recepcionista con IA responda las preguntas frecuentes, filtre y agende, y te pase solo los casos que te necesitan.",
            "Conecta las reservas directamente a tu calendario para evitar el ir y venir de mensajes.",
          ],
        },
        {
          horizon: "Días 60–90",
          title: "Que la respuesta inmediata, 24/7, sea lo normal",
          steps: [
            "Haz que las consultas de rutina se respondan y se agenden automáticamente, 24/7.",
            "Pásale a una persona solo los clientes potenciales calificados y con verdadera intención de compra, con todo el contexto.",
            "Mide cada semana el tiempo de respuesta y la tasa de citas agendadas, y ajusta el guion donde se pierden los clientes potenciales.",
          ],
        },
      ],
      retention: [
        {
          horizon: "Primeros 30 días",
          title: "Recupera los ingresos que ya pagaste por ganar",
          steps: [
            "Saca una lista de clientes y clientes potenciales que dejaron de responder en los últimos 6–12 meses.",
            "Envíale a esa lista un seguimiento personal y relevante: no un envío masivo, sino una razón para volver.",
            "Agrega una sola solicitud de reseña y recomendación justo después de la venta.",
          ],
        },
        {
          horizon: "Días 30–60",
          title: "Que el seguimiento sea un sistema, no algo que depende de tu memoria",
          steps: [
            "Arma una secuencia sencilla para recuperar clientes (visita atrasada, cliente potencial que se enfrió) que puedas reutilizar.",
            "Segmenta por servicio o por valor para que el mensaje de verdad le sirva a cada cliente.",
            "Pide la reseña en el momento en que el cliente está más satisfecho.",
          ],
        },
        {
          horizon: "Días 60–90",
          title: "Que las ventas repetidas lleguen solas",
          steps: [
            "Automatiza los seguimientos personalizados y los recordatorios para que se envíen solos.",
            "Cierra el círculo: cada reseña y recomendación nueva alimenta tu Visibilidad.",
            "Sigue de cerca la tasa de recompra y de reactivación, y ajusta los tiempos.",
          ],
        },
      ],
    },
    sourcesNote:
      "Las cifras son referencias de la industria tomadas de investigaciones publicadas (Velocify, estudios de MIT/HBR sobre tiempo de respuesta, Thryv, SAS/IDC), no resultados de Thynra.",
    summary: {
      header: "Diagnóstico de IA para conseguir y conservar clientes",
      result: (level, total) => `Resultado: ${level} (puntaje ${total}/24)`,
      stages: (s, l) =>
        `${l.awareness} ${s.awareness}/8, ${l.conversion} ${s.conversion}/8, ${l.retention} ${s.retention}/8`,
      weakest: (stage) => `Etapa más débil: ${stage}`,
      sequence: (labels) => `Orden en que las arreglaríamos: 1) ${labels[0]}, 2) ${labels[1]}, 3) ${labels[2]}`,
    },
  },
});

export function levelForScore(total: number): LevelKey {
  // 6 questions x 1..4 => range 6..24
  if (total <= 11) return "reactive";
  if (total <= 18) return "responsive";
  return "autonomous";
}

export interface ReportData {
  name: string;
  company: string;
  total: number; // 6..24
  overallPct: number; // 0..100
  levelKey: LevelKey;
  scores: Record<Stage, number>; // each 0..8
  weakest: Stage;
  /** Weakest first: the order we would fix the stages in. sequence[0] === weakest. */
  sequence: Stage[];
}

// The quiz answers "in what order", not "what grade". Ties break on STAGE_ORDER
// so the same answers always produce the same plan.
export function stageSequence(scores: Record<Stage, number>): Stage[] {
  return [...STAGE_ORDER].sort((a, b) => {
    const diff = (scores[a] ?? 0) - (scores[b] ?? 0);
    return diff !== 0 ? diff : STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b);
  });
}

// Build the full report model from raw per-stage scores. Centralizing this
// keeps the page, the PDF, and the email summary perfectly in sync.
export function buildReport(
  scores: Record<Stage, number>,
  meta: { name: string; company: string },
): ReportData {
  const total = STAGE_ORDER.reduce((acc, s) => acc + (scores[s] ?? 0), 0);
  const sequence = stageSequence(scores);
  return {
    name: meta.name,
    company: meta.company,
    total,
    overallPct: Math.round((total / 24) * 100),
    levelKey: levelForScore(total),
    scores,
    weakest: sequence[0],
    sequence,
  };
}

// Plain-text summary used as the lead-capture message + email body fallback.
export function reportSummaryText(r: ReportData, locale: Locale): string {
  const c = reportCopy[locale];
  const labels = {
    awareness: c.stages.awareness.label,
    conversion: c.stages.conversion.label,
    retention: c.stages.retention.label,
  };
  return (
    `${c.summary.header}\n` +
    `${c.summary.result(c.levels[r.levelKey].name, r.total)}\n` +
    `${c.summary.stages(r.scores, labels)}\n` +
    `${c.summary.weakest(c.stages[r.weakest].label)}\n` +
    c.summary.sequence(r.sequence.map((st) => c.stages[st].label))
  );
}
