import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { defineCopy, useCopy, useRouteHref } from "@/i18n";

interface Faq {
  question: string;
  answer: string;
  /** Optional link under the answer, to the enterprise page. */
  enterpriseLink?: string;
}

const copy = defineCopy({
  en: {
    title: "Frequently asked questions",
    faqs: [
      {
        question: "What exactly do you do?",
        answer:
          "We put AI to work on repetitive processes where people, messages or documents are involved — connected to the systems you already use. For most businesses that starts with customers: getting found, answering fast, following up, winning back the ones who drifted, and the reporting behind it. One process at a time, starting with whichever is costing you the most.",
      },
      {
        question: "What's the AI readiness check?",
        answer:
          "A 2-minute scorecard. You answer six questions about how you handle customers today, and you get an instant diagnosis of the three stages where SMBs win or lose — awareness, conversion, and retention — plus which gap is costing you the most. No cost, no signup beyond your email to see the result. It's the fastest way to see where to start.",
      },
      {
        question: "Who is this for?",
        answer:
          "Two kinds of organizations, with the same method. Owner-operated service businesses that have demand but can't keep up with it — where the owner still answers the phone or the front desk is the bottleneck. And larger companies with several teams and their own systems, who want an AI agent working inside a real process with the security and approvals their IT team requires.",
        enterpriseLink: "See how we work with larger companies",
      },
      {
        question: "What's not in scope?",
        answer:
          "Bookkeeping and accounting, HR and payroll, developer tooling, and AI strategy decks with nothing built behind them. We also don't sell a tool and leave you to run it, and we don't do six-month transformations. We build one working process at a time and keep it running.",
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
        question: "Do you work with large companies?",
        answer:
          "Yes. It is the same method — one process to production, then the next — with the pieces a larger organization needs: deployment in your own cloud, identity and permissions per agent, human approval on irreversible actions, and a full audit trail. It starts with a fixed-price diagnostic instead of the 2-minute check.",
        enterpriseLink: "AI for enterprise operations",
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
    ] as Faq[],
  },
  es: {
    title: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Qué hacen exactamente?",
        answer:
          "Ponemos a trabajar la IA en procesos repetitivos donde hay personas, mensajes o documentos de por medio, conectada a los sistemas que ya usas. En la mayoría de los negocios eso empieza por los clientes: que te encuentren, responder rápido, dar seguimiento, recuperar a los que se alejaron y los reportes que hay detrás. Un proceso a la vez, empezando por el que más te esté costando.",
      },
      {
        question: "¿Qué es el Diagnóstico de IA?",
        answer:
          "Una evaluación de 2 minutos. Respondes seis preguntas sobre cómo atiendes hoy a tus clientes y recibes al instante un diagnóstico de las tres etapas donde los negocios ganan o pierden clientes (visibilidad, conversión y fidelización), y de qué punto te está costando más. Sin costo y sin registro: solo pedimos tu correo para mostrarte el resultado. Es la forma más rápida de saber por dónde empezar.",
      },
      {
        question: "¿Para quién es?",
        answer:
          "Para dos tipos de organización, con el mismo método. Negocios de servicios manejados por sus dueños, que tienen clientes interesados pero no dan abasto: donde el dueño todavía contesta el teléfono o la recepción es el cuello de botella. Y empresas más grandes, con varios equipos y sistemas propios, que quieren un agente de IA dentro de un proceso real con la seguridad y las aprobaciones que exige su equipo de TI.",
        enterpriseLink: "Ver cómo trabajamos con empresas",
      },
      {
        question: "¿Qué no incluye?",
        answer:
          "Contabilidad, recursos humanos y planillas, herramientas para programadores, y presentaciones de estrategia de IA sin nada construido detrás. Tampoco te vendemos una herramienta para que la manejes tú, ni hacemos transformaciones de seis meses. Construimos un proceso funcionando a la vez y lo mantenemos corriendo.",
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
        question: "¿Trabajan con empresas grandes?",
        answer:
          "Sí. Es el mismo método (un proceso en producción y después el siguiente) con lo que necesita una organización más grande: despliegue en su propia nube, identidad y permisos por agente, aprobación humana en las acciones irreversibles y trazabilidad completa. Empieza con un diagnóstico de precio fijo en lugar del de 2 minutos.",
        enterpriseLink: "IA para operaciones empresariales",
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
    ] as Faq[],
  },
});

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = useCopy(copy);
  const faqs = t.faqs;
  const enterpriseHref = useRouteHref("/enterprise");

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
                      {faq.enterpriseLink && (
                        <Link href={enterpriseHref} className="inline-block mt-3 font-medium text-primary hover:underline">
                          {faq.enterpriseLink} →
                        </Link>
                      )}
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
