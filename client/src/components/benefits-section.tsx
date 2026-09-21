import { Search, MessagesSquare, Repeat, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    eyebrow: "The map",
    title: "Four fronts where customers are won or lost. Almost nobody attacks all four at once.",
    subtitle:
      "Getting found, answering fast, bringing them back, and the operations behind all three. You don't need all four — you need to know which one is leaking.",
    stages: [
      {
        label: "Awareness",
        tagline: "How customers find you.",
        description:
          "When someone searches Google, asks ChatGPT, or checks your reviews looking for a business like yours.",
        bullets: [
          "Reviews monitored and answered on-brand",
          "Higher local map-pack ranking from review velocity",
          "Google Business Profile and a fast site you own",
        ],
      },
      {
        label: "Conversion",
        tagline: "What happens in the next five minutes.",
        description:
          "When a customer reaches out by call, chat, form, or DM. The window is short. The result decides everything.",
        bullets: [
          "Calls, chat and WhatsApp answered 24/7",
          "Books, qualifies, hands off only when needed",
          "Replies to DMs and form-fills instantly",
        ],
      },
      {
        label: "Retention",
        tagline: "What happens after the first sale.",
        description:
          "The dormant database, the review you never asked for, the customer who would refer if you reminded them.",
        bullets: [
          "Reactivates dormant leads and customers",
          "Asks for and responds to reviews",
          "Sends relevant follow-ups in your voice",
        ],
      },
      {
        label: "Operations",
        tagline: "What keeps the promises you make.",
        description:
          "The admin behind every customer — scheduling, reminders, reporting — that eats your team's hours and quietly caps how much you can grow.",
        bullets: [
          "Repetitive admin automated end to end",
          "A weekly owner's report from your scattered data",
          "Scale to more customers without more headcount",
        ],
      },
    ],
  },
  es: {
    eyebrow: "El mapa",
    title: "Cuatro frentes donde se ganan o se pierden los clientes. Casi nadie los ataca todos a la vez.",
    subtitle:
      "Que te encuentren, responder rápido, lograr que vuelvan, y la operación que sostiene las tres. No necesitas los cuatro: necesitas saber por cuál se te está fugando el tuyo.",
    stages: [
      {
        label: "Visibilidad",
        tagline: "Cómo te encuentran tus clientes.",
        description:
          "Cuando alguien busca en Google, le pregunta a ChatGPT o revisa tus reseñas buscando un negocio como el tuyo.",
        bullets: [
          "Reseñas monitoreadas y respondidas con el tono de tu marca",
          "Mejor posición en el mapa de Google al recibir reseñas con más frecuencia",
          "Perfil de Empresa en Google y un sitio rápido que es tuyo",
        ],
      },
      {
        label: "Conversión",
        tagline: "Lo que pasa en los próximos cinco minutos.",
        description:
          "Cuando un cliente te contacta por llamada, chat, formulario o mensaje directo. El margen es corto. El resultado lo decide todo.",
        bullets: [
          "Llamadas, chat y WhatsApp atendidos 24/7",
          "Agenda, filtra y pasa a una persona solo cuando hace falta",
          "Responde mensajes directos y formularios al instante",
        ],
      },
      {
        label: "Fidelización",
        tagline: "Lo que pasa después de la primera venta.",
        description:
          "La base de clientes dormida, la reseña que nunca pediste, el cliente que te recomendaría si se lo recordaras.",
        bullets: [
          "Reactiva clientes potenciales y clientes inactivos",
          "Pide reseñas y las responde",
          "Envía seguimientos relevantes con tu propia voz",
        ],
      },
      {
        label: "Operación",
        tagline: "Lo que sostiene las promesas que haces.",
        description:
          "El trabajo administrativo detrás de cada cliente (agenda, recordatorios, reportes) que se come las horas de tu equipo y, sin que lo notes, limita cuánto puedes crecer.",
        bullets: [
          "Tareas administrativas repetitivas, automatizadas de principio a fin",
          "Un reporte semanal del dueño armado con tus datos dispersos",
          "Atiende a más clientes sin contratar más personal",
        ],
      },
    ],
  },
});

// Paired with copy.stages by index. `id` keeps data-testid stable across locales.
const stageConfig = [
  { id: "awareness", icon: Search, color: "bg-blue-500" },
  { id: "conversion", icon: MessagesSquare, color: "bg-purple-500" },
  { id: "retention", icon: Repeat, color: "bg-emerald-500" },
  { id: "operations", icon: BarChart3, color: "bg-amber-500" },
];

export default function BenefitsSection() {
  const t = useCopy(copy);
  const stages = t.stages.map((text, index) => ({ ...stageConfig[index], ...text }));

  return (
    <section id="what" className="py-20 bg-muted">
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
            data-testid="text-stages-title"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.id}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-stage-${stage.id}`}
              >
                <div
                  className={`w-12 h-12 ${stage.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{stage.label}</h3>
                <p className="text-primary text-sm font-medium mb-3">
                  {stage.tagline}
                </p>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {stage.description}
                </p>
                <ul className="space-y-2 text-sm text-foreground">
                  {stage.bullets.map((b) => (
                    <li key={b} className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
