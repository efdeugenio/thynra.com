import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    title: "Frequently asked questions",
    faqs: [
      {
        question: "What exactly do you do?",
        answer:
          "We automate the moments where you win or lose customers — getting found in search and reviews, answering calls and messages fast, following up, winning back customers who drifted away, and the reporting behind it. One of them at a time, starting with whichever is costing you the most. The parts that touch your customers and your revenue: not bookkeeping, not internal-ops tools, not generic productivity AI.",
      },
      {
        question: "What's the AI readiness check?",
        answer:
          "A 2-minute scorecard. You answer six questions about how you handle customers today, and you get an instant diagnosis of the three stages where SMBs win or lose — awareness, conversion, and retention — plus which gap is costing you the most. No cost, no signup beyond your email to see the result. It's the fastest way to see where to start.",
      },
      {
        question: "Who is this for?",
        answer:
          "Owner-operated SMBs that have customer demand but can't keep up with it. Service businesses where the owner is still answering the phone. Teams where the front desk is the bottleneck. Most of our work is with service businesses where missed conversations directly cost revenue.",
      },
      {
        question: "What's not in scope?",
        answer:
          "Anything back-office. Bookkeeping, HR, internal automation, dev tooling, generic AI strategy decks. We also don't sell a tool and leave you to run it, and we don't do six-month transformations. We build one working process at a time and keep it running.",
      },
      {
        question: "What does it cost?",
        answer:
          "Stage one is a fixed price for one process, agreed before we start and built in about two weeks. After that there's an optional monthly plan that keeps everything running and includes one new stage per quarter. We scope the exact number on the call, once we know which process goes first — so you're pricing a specific outcome, not an open-ended hourly project.",
      },
      {
        question: "Are you taking new clients right now?",
        answer:
          "Yes. We're actively engaging new clients, with a focus on service businesses where missed calls, slow follow-up, and lapsed customers are costing measurable revenue. The fastest way to find out if there's a fit is the free 2-minute readiness check, then a 30-minute call to turn the result into a plan.",
      },
      {
        question: "How is this different from the AI tools I've already tried?",
        answer:
          "Most AI tools you've tried hand you a feature and leave the work to you: a chatbot, a voice agent, a scheduler — all set up, none of them finished. We deliver one process working end to end in your business, and then the next one builds on it. Stage two is cheaper because stage one already connected your data. That compounding is the point, and it's why we don't try to do it all at once.",
      },
      {
        question: "Do you build custom or use off-the-shelf vendors?",
        answer:
          "Both. The honest test we apply: if an off-the-shelf vendor solves the problem in week one, buy it. If you spend more than a day fighting their defaults, build. Most engagements end up as a mix.",
      },
      {
        question: "Where are you based and which markets do you serve?",
        answer:
          "Thynra is based in Costa Rica and serves clients across LATAM and the US. Our solutions are built bilingual (English and Spanish) from day one, with more languages available on request.",
      },
    ],
  },
  es: {
    title: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Qué hacen exactamente?",
        answer:
          "Automatizamos los momentos en que ganas o pierdes clientes: que te encuentren en búsquedas y reseñas, contestar llamadas y mensajes rápido, dar seguimiento, recuperar a los clientes que se alejaron y los reportes que hay detrás. Uno a la vez, empezando por el que más te esté costando. Las partes que tocan a tus clientes y tus ingresos: no contabilidad, no herramientas de operación interna, no IA genérica de productividad.",
      },
      {
        question: "¿Qué es el Diagnóstico de IA?",
        answer:
          "Una evaluación de 2 minutos. Respondes seis preguntas sobre cómo atiendes hoy a tus clientes y recibes al instante un diagnóstico de las tres etapas donde los negocios ganan o pierden clientes (visibilidad, conversión y fidelización), y de qué punto te está costando más. Sin costo y sin registro: solo pedimos tu correo para mostrarte el resultado. Es la forma más rápida de saber por dónde empezar.",
      },
      {
        question: "¿Para quién es?",
        answer:
          "Para negocios manejados por sus dueños que tienen clientes interesados pero no dan abasto. Negocios de servicios donde el dueño todavía contesta el teléfono. Equipos donde la recepción es el cuello de botella. La mayor parte de nuestro trabajo es con negocios de servicios donde cada conversación perdida cuesta dinero directamente.",
      },
      {
        question: "¿Qué no incluye?",
        answer:
          "Nada de la administración interna. Contabilidad, recursos humanos, automatización interna, herramientas para programadores, presentaciones genéricas de estrategia de IA. Tampoco te vendemos una herramienta para que la manejes tú, ni hacemos transformaciones de seis meses. Construimos un proceso funcionando a la vez y lo mantenemos corriendo.",
      },
      {
        question: "¿Cuánto cuesta?",
        answer:
          "La etapa uno es un precio fijo por un proceso, acordado antes de empezar y construido en unas dos semanas. Después hay un plan mensual opcional que mantiene todo funcionando e incluye una etapa nueva por trimestre. El número exacto lo definimos en la llamada, una vez que sabemos qué proceso va primero. Así pagas por un resultado concreto, no por un proyecto por horas sin final.",
      },
      {
        question: "¿Están aceptando clientes nuevos?",
        answer:
          "Sí. Estamos tomando clientes nuevos, sobre todo negocios de servicios donde las llamadas perdidas, el seguimiento lento y los clientes que dejaron de venir están costando dinero que se puede medir. La forma más rápida de saber si encajamos es el Diagnóstico de IA gratis de 2 minutos y, después, una llamada de 30 minutos para convertir el resultado en un plan.",
      },
      {
        question: "¿En qué se diferencia de las herramientas de IA que ya probé?",
        answer:
          "La mayoría de las herramientas de IA que has probado te entregan una función y te dejan el trabajo a ti: un chatbot, un agente de voz, una agenda. Todas configuradas, ninguna terminada. Nosotros entregamos un proceso funcionando de punta a punta en tu negocio, y el siguiente se apoya en ese. La etapa dos sale más barata porque la uno ya conectó tus datos. Eso es lo que se acumula, y por eso no intentamos hacerlo todo de una vez.",
      },
      {
        question: "¿Lo construyen a la medida o usan herramientas existentes?",
        answer:
          "Las dos cosas. La regla honesta que aplicamos: si una herramienta ya hecha resuelve el problema en la primera semana, se compra. Si pasas más de un día peleando con cómo viene configurada, se construye. La mayoría de los proyectos terminan siendo una mezcla.",
      },
      {
        question: "¿Dónde están y a qué mercados atienden?",
        answer:
          "Thynra está en Costa Rica y atiende clientes en toda Latinoamérica y Estados Unidos. Nuestras soluciones son bilingües (inglés y español) desde el primer día, y podemos sumar más idiomas si los necesitas.",
      },
    ],
  },
});

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = useCopy(copy);
  const faqs = t.faqs;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          data-testid="text-faq-title"
        >
          {t.title}
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              data-testid={`faq-item-${index}`}
            >
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-muted transition-colors"
                onClick={() => toggleFaq(index)}
                data-testid={`button-faq-${index}`}
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`text-muted-foreground transform transition-transform flex-shrink-0 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
