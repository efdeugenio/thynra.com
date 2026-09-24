import {
  EyeOff,
  PhoneOff,
  Clock,
  ArchiveX,
  BarChart3,
  Phone,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { defineCopy, useCopy } from "@/i18n";

// One section, not two. Each pain is immediately followed by what we build for
// it and which stage it belongs to, so the page argues a sequence instead of
// listing a product catalogue.
const copy = defineCopy({
  en: {
    eyebrow: "Where SMBs lose customers",
    title: "Five places customers walk away. We fix them one at a time.",
    subtitle:
      "Nobody fixes all five at once, and nobody needs to. Pick the one costing you the most — that's stage one.",
    fixLabel: "What we build",
    sofiaNote: "This is our own front desk. Call it and hear how it works.",
    sofiaCta: "Talk to Sofia",
    closingTitle: "Why one at a time",
    closing:
      "Almost every owner has been burned by an AI demo that fell apart in front of a customer. They aren't buying capability — they're buying \"this won't happen to me again.\" So we start with one process, with a date and a fixed price, and you see it working before anything else changes.",
    notSure: "Not sure which one is costing you the most?",
    quizCta: "Start the 2-min check",
    items: [
      {
        stage: "Awareness",
        moment: "When someone searches for a business like yours and finds your competitor instead.",
        title: "Invisible where they search",
        description:
          "Prospects search Google, ask ChatGPT, or scan reviews before they ever contact you. Reviews and local presence decide who shows up.",
        fix: "Review monitoring with on-brand replies ready to approve, post-visit review nudges, your Google Business Profile fixed and posting weekly, and a fast website you own.",
      },
      {
        stage: "Conversion",
        moment: "When the phone rings during a job and nobody can pick it up.",
        title: "Calls and messages nobody answers",
        description:
          "Most small-business calls go unanswered. Every miss is a customer choosing whoever picked up instead.",
        fix: "A front desk that answers phone, web chat, WhatsApp and SMS in English or Spanish, books appointments, qualifies the lead, and passes a human only what needs one.",
      },
      {
        stage: "Conversion",
        moment: "When the quote sits in your phone for three days before you send it.",
        title: "Slow follow-up",
        description:
          "Leads answered within five minutes convert dramatically better. Most owners reply in 42 hours. By then the lead is gone.",
        fix: "Follow-ups, quotes and replies drafted in your voice the moment a lead comes in — you approve, it sends. Plus reminders and no-show recovery that run themselves.",
      },
      {
        stage: "Retention",
        moment: "When a customer you served last year books with someone else.",
        title: "Customers who stopped coming back",
        description:
          "Past customers and cold quotes are sitting in your records. Most owners never follow up. That revenue is waiting to be reactivated.",
        fix: "Reactivation that runs on the data you already have — overdue clients, patients due for a visit, quotes that went cold — with personalized messages, not generic blasts.",
      },
      {
        stage: "Operations",
        moment: "When you're asked how the month went and you have to go count.",
        title: "No clear picture of the business",
        description:
          "The numbers that actually run your business live in four different tools, and pulling them together by hand is a job nobody has time for.",
        fix: "A weekly owner's report — leads, bookings, no-shows, revenue — pulled from your scattered tools into one email. Built to work with the messy data you already have.",
      },
    ],
  },
  es: {
    eyebrow: "Dónde pierden clientes los negocios",
    title: "Cinco puntos por donde se van los clientes. Los arreglamos de uno en uno.",
    subtitle:
      "Nadie arregla los cinco a la vez, y nadie lo necesita. Elige el que más te está costando: ese es la etapa uno.",
    fixLabel: "Lo que construimos",
    sofiaNote: "Es nuestra propia recepción. Llámala y escucha cómo funciona.",
    sofiaCta: "Habla con Sofia",
    closingTitle: "Por qué de uno en uno",
    closing:
      "Casi todos los dueños ya tuvieron una mala experiencia con una demo de IA que se cayó delante de un cliente. No están comprando funciones: están comprando \"esto no me va a volver a pasar\". Por eso empezamos con un solo proceso, con fecha y precio fijo, y lo ves funcionando antes de cambiar nada más.",
    notSure: "¿No sabes cuál te está costando más?",
    quizCta: "Empezar el diagnóstico",
    items: [
      {
        stage: "Visibilidad",
        moment: "Cuando alguien busca un negocio como el tuyo y encuentra a tu competencia.",
        title: "Invisible donde te buscan",
        description:
          "Antes de contactarte, la gente busca en Google, le pregunta a ChatGPT o revisa reseñas. Las reseñas y la presencia local deciden quién aparece.",
        fix: "Monitoreo de reseñas con respuestas listas para aprobar, recordatorios de reseña después de cada visita, tu Perfil de Empresa en Google corregido y publicando cada semana, y un sitio web rápido que es tuyo.",
      },
      {
        stage: "Conversión",
        moment: "Cuando suena el teléfono en medio del trabajo y nadie lo puede contestar.",
        title: "Llamadas y mensajes que nadie responde",
        description:
          "La mayoría de las llamadas a negocios pequeños quedan sin respuesta. Cada una es un cliente que se va con quien sí contestó.",
        fix: "Una recepción que atiende teléfono, chat web, WhatsApp y SMS en español o inglés, agenda citas, filtra al cliente potencial y le pasa a una persona solo lo que de verdad necesita una.",
      },
      {
        stage: "Conversión",
        moment: "Cuando la cotización se queda tres días en tu celular antes de que la mandes.",
        title: "Seguimiento lento",
        description:
          "Quien recibe respuesta en menos de cinco minutos compra mucho más. La mayoría de los dueños responde en 42 horas. Para entonces ese cliente ya se fue.",
        fix: "Seguimientos, cotizaciones y respuestas redactadas con tu voz apenas entra el contacto: tú apruebas y salen. Más recordatorios de cita y recuperación de inasistencias que funcionan solos.",
      },
      {
        stage: "Fidelización",
        moment: "Cuando un cliente que atendiste el año pasado agenda con otro.",
        title: "Clientes que dejaron de volver",
        description:
          "Tus clientes anteriores y las cotizaciones frías están en tus registros. La mayoría de los dueños nunca les da seguimiento. Ese dinero está esperando a que lo recuperes.",
        fix: "Reactivación con los datos que ya tienes: clientes que ya deberían haber vuelto, pacientes a los que les toca su cita, cotizaciones que se enfriaron. Mensajes personalizados, no envíos masivos.",
      },
      {
        stage: "Operación",
        moment: "Cuando te preguntan cómo te fue en el mes y tienes que ponerte a contar.",
        title: "Sin una foto clara del negocio",
        description:
          "Los números que de verdad mueven tu negocio viven en cuatro herramientas distintas, y juntarlos a mano es un trabajo para el que nadie tiene tiempo.",
        fix: "Un reporte semanal del dueño (clientes potenciales, citas, inasistencias, ingresos) tomado de tus herramientas dispersas y reunido en un solo correo. Hecho para funcionar con los datos desordenados que ya tienes.",
      },
    ],
  },
});

// Paired with copy.items by index.
const itemConfig = [
  { id: "visibility", icon: EyeOff, stageColor: "text-blue-500" },
  { id: "answering", icon: PhoneOff, stageColor: "text-purple-500" },
  { id: "followup", icon: Clock, stageColor: "text-purple-500" },
  { id: "recall", icon: ArchiveX, stageColor: "text-emerald-500" },
  { id: "operations", icon: BarChart3, stageColor: "text-amber-500" },
];

export default function PainsAndFixes() {
  const [, navigate] = useLocation();
  const t = useCopy(copy);
  // Sofia is Thynra's own front desk, shown as proof of a build — never sold here.
  const talkToSofia = () =>
    (window as any).thynra?.startCall?.({ context: "screening" });

  const items = t.items.map((text, index) => ({ ...itemConfig[index], ...text }));

  return (
    <section id="solutions" className="py-20 bg-background">
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
            data-testid="text-pains-title"
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
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                data-testid={`card-pain-${item.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${item.stageColor}`}
                  >
                    {item.stage}
                  </span>
                </div>

                <p className="text-primary text-sm font-medium italic mb-3">
                  {item.moment}
                </p>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-auto border-t border-border pt-5">
                  <div className="flex items-center mb-2">
                    <Wrench className="w-4 h-4 text-primary mr-2" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {t.fixLabel}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {item.fix}
                  </p>

                  {item.id === "answering" && (
                    <div className="mt-5 rounded-lg bg-muted/60 border border-border p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        {t.sofiaNote}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={talkToSofia}
                        className="w-full"
                        data-testid="button-talk-to-sofia-proof"
                      >
                        <Phone className="mr-2 w-4 h-4" />
                        {t.sofiaCta}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-12 max-w-3xl mx-auto bg-card border border-border rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          data-testid="card-why-one-at-a-time"
        >
          <h3 className="text-xl font-bold mb-3">{t.closingTitle}</h3>
          <p className="text-muted-foreground leading-relaxed">{t.closing}</p>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">{t.notSure}</p>
          <Button
            onClick={() => navigate("/quiz")}
            className="gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            data-testid="button-pains-quiz"
          >
            {t.quizCta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
