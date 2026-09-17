import {
  PhoneOff,
  ArchiveX,
  Clock,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    eyebrow: "Where SMBs lose customers",
    title: "Five places customers walk away before you even know.",
    subtitle:
      "These are the five gaps where customers slip away. Pick the one that's costing you the most. That's where we start.",
    pains: [
      {
        stage: "Awareness",
        title: "Invisible where they search",
        description:
          "When prospects search Google, ask ChatGPT, or scan your reviews for a business like yours, you don't show up. Reviews and local presence decide who does.",
      },
      {
        stage: "Conversion",
        title: "Missed calls",
        description:
          "Most small-business calls go unanswered. Every miss is a customer choosing your competitor.",
      },
      {
        stage: "Conversion",
        title: "Slow follow-up",
        description:
          "Leads contacted within five minutes convert dramatically better. Most owners reply in 42 hours. By then, the lead is gone.",
      },
      {
        stage: "Retention",
        title: "Lapsed customers",
        description:
          "Past customers and abandoned leads sit in your records. Most owners never follow up. The revenue is sitting there, waiting to be reactivated.",
      },
      {
        stage: "Trust",
        title: "The embarrassing-AI trauma",
        description:
          "Every prospect has been burned by a bad AI demo. They aren't buying capability. They are buying \"this won't happen to me again.\"",
      },
    ],
  },
  es: {
    eyebrow: "Dónde pierden clientes los negocios",
    title: "Cinco puntos donde se van los clientes sin que te enteres.",
    subtitle:
      "Estos son los cinco puntos por donde se te escapan los clientes. Elige el que más te está costando. Ahí empezamos.",
    pains: [
      {
        stage: "Visibilidad",
        title: "Invisible donde te buscan",
        description:
          "Cuando alguien busca en Google, le pregunta a ChatGPT o revisa reseñas buscando un negocio como el tuyo, no apareces. Las reseñas y la presencia local deciden quién aparece.",
      },
      {
        stage: "Conversión",
        title: "Llamadas perdidas",
        description:
          "La mayoría de las llamadas a pequeños negocios quedan sin respuesta. Cada llamada perdida es un cliente que elige a tu competencia.",
      },
      {
        stage: "Conversión",
        title: "Seguimiento lento",
        description:
          "Los clientes potenciales que reciben respuesta en menos de cinco minutos compran mucho más. La mayoría de los dueños responde en 42 horas. Para entonces, ese cliente ya se fue.",
      },
      {
        stage: "Fidelización",
        title: "Clientes que dejaron de venir",
        description:
          "Tus clientes anteriores y los contactos que se quedaron a medias están en tus registros. La mayoría de los dueños nunca les da seguimiento. Ese dinero está ahí, esperando que lo recuperes.",
      },
      {
        stage: "Confianza",
        title: "El mal recuerdo de la IA",
        description:
          "Casi todos ya tuvieron una mala experiencia con una demo de IA que salió mal. No están comprando funciones. Están comprando \"esto no me va a volver a pasar\".",
      },
    ],
  },
});

// Paired with copy.pains by index.
const painConfig = [
  { icon: EyeOff, stageColor: "text-blue-500" },
  { icon: PhoneOff, stageColor: "text-purple-500" },
  { icon: Clock, stageColor: "text-purple-500" },
  { icon: ArchiveX, stageColor: "text-emerald-500" },
  { icon: AlertTriangle, stageColor: "text-amber-500" },
];

export default function PainSection() {
  const t = useCopy(copy);
  const pains = t.pains.map((text, index) => ({ ...painConfig[index], ...text }));

  return (
    <section className="py-20 bg-background">
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
            data-testid="text-pain-title"
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pains.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <motion.div
                key={pain.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                data-testid={`card-pain-${index}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${pain.stageColor}`}
                  >
                    {pain.stage}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{pain.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pain.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
