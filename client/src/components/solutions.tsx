import { Phone, Star, Repeat, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    eyebrow: "Solutions",
    title: "The workflows we automate — mapped to where you lose customers.",
    subtitle:
      "Awareness, conversion, retention, and the operations behind them. Start with the gap that's costing you the most — the 2-minute readiness check tells you which one.",
    trySofia: "Try Sofia live",
    notSure: "Not sure which gap is costing you the most?",
    quizCta: "Start the 2-min check",
    solutions: [
      {
        stage: "Awareness",
        name: "Reputation & Local Presence",
        tagline: "Get found and trusted before the first call.",
        description:
          "We turn reviews and your Google Business Profile into a steady engine that lifts your local ranking — plus a fast website you actually own. When someone searches for a business like yours, you're the one that shows up, with the reviews to back it.",
        bullets: [
          "Review monitoring with on-brand responses, ready to approve",
          "Post-visit review nudges that lift your local map-pack ranking",
          "Google Business Profile audit, fixes, and weekly posts",
          "A fast website you own — hosting and domain in your name, updated in 48h",
        ],
      },
      {
        stage: "Conversion",
        name: "AI Receptionist",
        tagline: "Answer and book in the next five minutes — then follow up for you.",
        description:
          "An AI front desk that picks up the phone, web chat, WhatsApp, and SMS in English or Spanish. It books appointments, qualifies leads, and routes to a human only when needed. The same AI also drafts your follow-ups, quotes, and replies in your voice — for your approval. One persona, two roles.",
        bullets: [
          "Phone, web chat, WhatsApp, and SMS — one bilingual persona, 24/7",
          "Books appointments and qualifies leads on every channel",
          "Drafts your follow-ups, quotes, and replies in your voice for approval",
          "Appointment reminders and no-show recovery that run themselves",
        ],
      },
      {
        stage: "Retention",
        name: "Recall & Reactivation",
        tagline: "Win back the customers you already paid to earn.",
        description:
          "Your past customers and abandoned leads are sitting in your records. We reactivate them automatically — overdue clients, patients due for a visit, quotes that went cold — with personalized, on-brand messages that bring them back without more ad spend.",
        bullets: [
          "Wins back lapsed customers and patients automatically",
          "Reactivation campaigns that run on your existing data",
          "Personalized follow-ups in your voice — not generic blasts",
          "Turns one-time buyers into repeat revenue and referrals",
        ],
      },
      {
        stage: "Operations",
        name: "Owner's Weekly Report",
        tagline: "Run it without drowning in spreadsheets.",
        description:
          "The numbers that actually run your business — leads, bookings, no-shows, revenue — pulled from your scattered tools into one weekly report that lands in your inbox. Built on a data-engineering backbone, so it works with the messy data you already have.",
        bullets: [
          "A weekly owner's report auto-generated from your scattered data",
          "The numbers that matter, without the manual spreadsheet work",
          "Spot what's working and what's leaking before it costs you",
          "A data-engineering backbone competitors can't copy",
        ],
      },
    ],
  },
  es: {
    eyebrow: "Soluciones",
    title: "Los procesos que automatizamos, según dónde pierdes clientes.",
    subtitle:
      "Visibilidad, conversión, fidelización y la operación que las sostiene. Empieza por el punto que más te está costando: el diagnóstico de 2 minutos te dice cuál es.",
    trySofia: "Prueba a Sofia en vivo",
    notSure: "¿No sabes qué punto te está costando más?",
    quizCta: "Empezar el diagnóstico",
    solutions: [
      {
        stage: "Visibilidad",
        name: "Reputación y presencia local",
        tagline: "Que te encuentren y confíen en ti antes de la primera llamada.",
        description:
          "Convertimos tus reseñas y tu Perfil de Empresa en Google en un motor constante que mejora tu posición local, además de un sitio web rápido que de verdad es tuyo. Cuando alguien busca un negocio como el tuyo, apareces tú, con las reseñas que lo respaldan.",
        bullets: [
          "Monitoreo de reseñas con respuestas en el tono de tu marca, listas para aprobar",
          "Recordatorios para dejar reseña después de cada visita, que mejoran tu posición en el mapa de Google",
          "Auditoría, correcciones y publicaciones semanales en tu Perfil de Empresa en Google",
          "Un sitio web rápido que es tuyo: hosting y dominio a tu nombre, cambios listos en 48h",
        ],
      },
      {
        stage: "Conversión",
        name: "Recepcionista con IA",
        tagline: "Contesta y agenda en los próximos cinco minutos, y luego da seguimiento por ti.",
        description:
          "Una recepción con IA que atiende el teléfono, el chat web, WhatsApp y SMS en inglés o español. Agenda citas, filtra a los clientes potenciales y pasa a una persona solo cuando hace falta. La misma IA también redacta tus seguimientos, cotizaciones y respuestas con tu voz, para que los apruebes. Una sola asistente, dos funciones.",
        bullets: [
          "Teléfono, chat web, WhatsApp y SMS: una sola asistente bilingüe, 24/7",
          "Agenda citas y filtra clientes potenciales en todos los canales",
          "Redacta tus seguimientos, cotizaciones y respuestas con tu voz para que los apruebes",
          "Recordatorios de citas y recuperación de inasistencias que funcionan solos",
        ],
      },
      {
        stage: "Fidelización",
        name: "Recuperación de clientes",
        tagline: "Recupera a los clientes que ya te costó conseguir.",
        description:
          "Tus clientes anteriores y los contactos que no se concretaron están en tus registros. Los reactivamos automáticamente (clientes que ya deberían haber vuelto, pacientes a los que les toca su cita, cotizaciones que se enfriaron) con mensajes personalizados y en el tono de tu marca que los traen de vuelta sin gastar más en publicidad.",
        bullets: [
          "Recupera clientes y pacientes inactivos de forma automática",
          "Campañas de reactivación con los datos que ya tienes",
          "Seguimientos personalizados con tu voz, no envíos masivos genéricos",
          "Convierte a quienes compraron una vez en clientes que vuelven y te recomiendan",
        ],
      },
      {
        stage: "Operación",
        name: "Reporte semanal del dueño",
        tagline: "Maneja tu negocio sin ahogarte en hojas de cálculo.",
        description:
          "Los números que de verdad mueven tu negocio (clientes potenciales, citas, inasistencias, ingresos), tomados de tus distintas herramientas y reunidos en un reporte semanal que llega a tu correo. Está construido sobre una base sólida de ingeniería de datos, así que funciona con los datos desordenados que ya tienes.",
        bullets: [
          "Un reporte semanal del dueño generado automáticamente con tus datos dispersos",
          "Los números que importan, sin trabajo manual en hojas de cálculo",
          "Detecta qué funciona y por dónde se te escapa dinero antes de que te cueste",
          "Una base de ingeniería de datos que la competencia no puede copiar",
        ],
      },
    ],
  },
});

// Paired with copy.solutions by index. `id` drives behavior, never the display name.
const solutionConfig = [
  { id: "reputation", icon: Star, stageColor: "text-blue-500" },
  { id: "receptionist", icon: Phone, stageColor: "text-purple-500" },
  { id: "recall", icon: Repeat, stageColor: "text-emerald-500" },
  { id: "report", icon: BarChart3, stageColor: "text-amber-500" },
];

export default function Solutions() {
  const [, navigate] = useLocation();
  const t = useCopy(copy);
  const trySofiaLive = () =>
    (window as any).thynra?.startCall?.({ context: "receptionist_demo" });

  const solutions = t.solutions.map((text, index) => ({ ...solutionConfig[index], ...text }));

  return (
    <section id="solutions" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {t.eyebrow}
          </motion.span>
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="text-solutions-title"
          >
            {t.title}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.id}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-solution-${index}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${solution.stageColor}`}
                  >
                    {solution.stage}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{solution.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">
                  {solution.tagline}
                </p>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {solution.description}
                </p>
                <ul className="space-y-2 text-sm text-foreground mt-auto">
                  {solution.bullets.map((b) => (
                    <li key={b} className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {solution.id === "receptionist" && (
                  <Button
                    onClick={trySofiaLive}
                    className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-try-sofia-live"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    {t.trySofia}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            {t.notSure}
          </p>
          <Button
            onClick={() => navigate("/quiz")}
            className="gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            data-testid="button-solutions-quiz"
          >
            {t.quizCta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
