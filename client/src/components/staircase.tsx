import { Footprints, CalendarClock, Handshake, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { defineCopy, useCopy, useRouteHref } from "@/i18n";

// The section that makes the broad promise concrete: not "we transform your
// business", but "this is stage one, and this is what the next year looks like".
const copy = defineCopy({
  en: {
    eyebrow: "The staircase",
    title: "One stage at a time, each one paid for by the last.",
    subtitle:
      "We don't sell a transformation. We sell stage one — and we tell you what stage two would be, so you always know where you are.",
    rungs: [
      {
        when: "First",
        title: "Stage one — the first process",
        description:
          "The gap costing you the most, automated and handed over working. Fixed price agreed before we start, real production tests. You own everything we build.",
        points: [
          "One process, not a platform",
          "Fixed price, known before day one",
          "Working in your business, not in a demo",
        ],
      },
      {
        when: "Months 4–12",
        title: "One new stage per quarter",
        description:
          "Each stage builds on the last: the data plumbing from stage one is what makes stage two cheap. You decide each time whether the next one is worth it — nothing renews by surprise.",
        points: [
          "You approve each stage before it starts",
          "Every stage has a date, or it isn't a stage",
          "Stop after one, and stage one still stands on its own",
        ],
      },
      {
        when: "Ongoing",
        title: "We keep it running",
        description:
          "Everything we've built stays monitored and maintained, we fix what breaks, and the quarterly stage is included. This is the part that compounds.",
        points: [
          "Monitored and maintained, not handed over and forgotten",
          "One quarterly review of what's actually working",
          "Cancel any month — the builds are yours to keep",
        ],
      },
    ],
    exampleLabel: "What a sequence looks like",
    example:
      "In a clinic, it usually goes: month 1, nobody's call or message goes unanswered. Month 4, appointment reminders and no-show recovery. Month 7, reactivating patients who are overdue. Month 10, the weekly report that shows what all of it did. Your order will be different — the check tells us where to start.",
    enterpriseExampleLabel: "Example in a larger company",
    enterpriseExample:
      "In a logistics operation, it could go: first, pre-validating commercial invoices before they reach the customs specialist. Then, shipment status for customers. Then, draft quotes for a person to approve. Same staircase, with a fixed-price diagnostic instead of the 2-minute check.",
    enterpriseExampleLink: "AI for enterprise operations",
    creditNote:
      "Each step credits toward the next: what you pay for the plan comes off stage one.",
  },
  es: {
    eyebrow: "La escalera",
    title: "Una etapa a la vez, y cada una paga la siguiente.",
    subtitle:
      "No vendemos una transformación. Vendemos la etapa uno, y te decimos cuál sería la dos, para que siempre sepas dónde estás parado.",
    rungs: [
      {
        when: "Primero",
        title: "Etapa uno — el primer proceso",
        description:
          "El punto que más te está costando, automatizado y entregado funcionando. Precio fijo acordado antes de empezar, pruebas reales en producción. Todo lo que construimos es tuyo.",
        points: [
          "Un proceso, no una plataforma",
          "Precio fijo, conocido antes del día uno",
          "Funcionando en tu negocio, no en una demo",
        ],
      },
      {
        when: "Meses 4 a 12",
        title: "Una etapa nueva por trimestre",
        description:
          "Cada etapa se apoya en la anterior: la conexión de datos que dejó la etapa uno es lo que hace barata la dos. Tú decides cada vez si la siguiente vale la pena. Nada se renueva por sorpresa.",
        points: [
          "Apruebas cada etapa antes de que empiece",
          "Cada etapa tiene fecha, o no es una etapa",
          "Si te detienes después de una, esa etapa sigue funcionando sola",
        ],
      },
      {
        when: "Continuo",
        title: "Lo mantenemos funcionando",
        description:
          "Todo lo construido queda monitoreado y mantenido, arreglamos lo que se rompa y la etapa del trimestre va incluida. Esta es la parte que se va acumulando.",
        points: [
          "Monitoreado y mantenido, no entregado y olvidado",
          "Una revisión trimestral de lo que de verdad está funcionando",
          "Cancelas el mes que quieras y lo construido se queda contigo",
        ],
      },
    ],
    exampleLabel: "Cómo se ve una secuencia",
    example:
      "En una clínica suele ir así: mes 1, que ninguna llamada ni mensaje quede sin respuesta. Mes 4, recordatorios de cita y recuperación de inasistencias. Mes 7, reactivar a los pacientes a los que ya les tocaba volver. Mes 10, el reporte semanal que muestra qué logró todo lo anterior. Tu orden va a ser distinto: el diagnóstico nos dice por dónde empezar.",
    enterpriseExampleLabel: "Ejemplo en una empresa más grande",
    enterpriseExample:
      "En una operación logística podría ir así: primero, prevalidar las facturas comerciales antes de que lleguen al especialista aduanero. Después, el estado de embarques para clientes. Después, borradores de cotización para que una persona apruebe. La misma escalera, con un diagnóstico de precio fijo en lugar del de 2 minutos.",
    enterpriseExampleLink: "IA para operaciones empresariales",
    creditNote:
      "Cada paso se acredita al siguiente: lo que pagas por el plan se descuenta de la etapa uno.",
  },
});

// Paired with copy.rungs by index.
const rungConfig = [
  { icon: Footprints, number: "01" },
  { icon: CalendarClock, number: "02" },
  { icon: Handshake, number: "03" },
];

export default function Staircase() {
  const t = useCopy(copy);
  const enterpriseHref = useRouteHref("/enterprise");
  const rungs = t.rungs.map((text, index) => ({ ...rungConfig[index], ...text }));

  return (
    <section id="staircase" className="py-20 bg-background">
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
            data-testid="text-staircase-title"
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

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {rungs.map((rung, index) => {
            const Icon = rung.icon;
            return (
              <motion.div
                key={rung.number}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
                style={{ marginTop: `${index * 0.75}rem` }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                data-testid={`card-rung-${rung.number}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-muted-foreground/30">
                    {rung.number}
                  </span>
                </div>
                <p className="text-xs text-primary uppercase tracking-wide font-semibold mb-2">
                  {rung.when}
                </p>
                <h3 className="text-xl font-bold mb-3">{rung.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  {rung.description}
                </p>
                <ul className="space-y-2 text-sm text-foreground mt-auto">
                  {rung.points.map((point) => (
                    <li key={point} className="flex items-start">
                      <Check className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
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
          data-testid="card-staircase-example"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t.exampleLabel}
          </span>
          <p className="text-muted-foreground leading-relaxed mt-3">{t.example}</p>
          <div className="mt-6 pt-6 border-t border-border" data-testid="card-staircase-enterprise-example">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t.enterpriseExampleLabel}
            </span>
            <p className="text-muted-foreground leading-relaxed mt-3">{t.enterpriseExample}</p>
            <Link href={enterpriseHref} className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
              {t.enterpriseExampleLink} →
            </Link>
          </div>
          <p className="text-sm text-foreground font-medium mt-4 border-t border-border pt-4">
            {t.creditNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
