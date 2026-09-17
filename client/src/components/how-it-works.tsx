import { Sparkles, Map, Wrench, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    eyebrow: "How we work",
    title: "You don't need an AI transformation. You need one workflow off your plate.",
    subtitle:
      "So we don't sell you a transformation. We find the one workflow costing you the most, automate it for a fixed price, and keep it running.",
    steps: [
      {
        title: "Take the readiness check",
        duration: "2 minutes · free",
        description:
          "Answer six questions about how you handle customers today. You get an instant diagnosis of the three stages where SMBs win or lose, and which gap is costing you the most.",
      },
      {
        title: "Audit & plan",
        duration: "30-minute call",
        description:
          "We turn your result into a concrete plan: the one workflow to automate first, what it saves you, and what it costs to build. You leave with the roadmap whether or not we build it.",
      },
      {
        title: "Sprint",
        duration: "2 weeks · fixed price",
        description:
          "We build, test, and hand over one working automation. Real integrations, real production tests. No open-ended hourly bills. You own everything we build.",
      },
      {
        title: "Keep it running",
        duration: "optional · monthly",
        description:
          "We maintain the automation, fix anything that breaks, and add one improvement a month. The compounding layer — most clients start one workflow and expand from there.",
      },
    ],
  },
  es: {
    eyebrow: "Cómo trabajamos",
    title: "No necesitas una transformación con IA. Necesitas quitarte un proceso de encima.",
    subtitle:
      "Por eso no te vendemos una transformación. Encontramos el proceso que más te está costando, lo automatizamos a precio fijo y lo mantenemos funcionando.",
    steps: [
      {
        title: "Haz el diagnóstico",
        duration: "2 minutos · gratis",
        description:
          "Responde seis preguntas sobre cómo atiendes hoy a tus clientes. Recibes al instante un diagnóstico de las tres etapas donde los negocios ganan o pierden clientes, y de qué punto te está costando más.",
      },
      {
        title: "Auditoría y plan",
        duration: "Llamada de 30 minutos",
        description:
          "Convertimos tu resultado en un plan concreto: el primer proceso a automatizar, cuánto te ahorra y cuánto cuesta construirlo. Te llevas el plan de trabajo, lo construyamos nosotros o no.",
      },
      {
        title: "Sprint de automatización",
        duration: "2 semanas · precio fijo",
        description:
          "Construimos, probamos y te entregamos una automatización funcionando. Integraciones reales, pruebas reales en producción. Nada de cobros por hora sin límite. Todo lo que construimos es tuyo.",
      },
      {
        title: "Mantenimiento",
        duration: "opcional · mensual",
        description:
          "Mantenemos la automatización, arreglamos lo que falle y agregamos una mejora al mes. Aquí es donde los resultados se van sumando: la mayoría de los clientes empieza con un proceso y crece desde ahí.",
      },
    ],
  },
});

// Paired with copy.steps by index.
const stepConfig = [
  { icon: Sparkles, number: "01" },
  { icon: Map, number: "02" },
  { icon: Wrench, number: "03" },
  { icon: Repeat, number: "04" },
];

export default function HowItWorks() {
  const t = useCopy(copy);
  const steps = t.steps.map((text, index) => ({ ...stepConfig[index], ...text }));

  return (
    <section id="how" className="py-20 bg-background">
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
            data-testid="text-how-title"
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
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-step-${step.number}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-muted-foreground/30">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
                  {step.duration}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
