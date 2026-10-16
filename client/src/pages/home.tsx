import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileSearch,
  Headset,
  Repeat,
  ShieldCheck,
  Store,
  UserCheck,
  ScrollText,
} from "lucide-react";
import thynraLogo from "@assets/Thynra logo_1760137533222.png";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import { LanguageSuggestion, LanguageSwitcher } from "@/components/language-switcher";
import { defineCopy, useCopy, useRouteHref } from "@/i18n";
import { readDoor, useHideSofiaBubble, type Door } from "@/lib/door";

// The neutral home at "/" and "/es". Its only jobs: say in the first line that
// Thynra builds AI agents (not process consulting), and send each visitor to
// their door — /business (/es/negocios) or /enterprise (/es/empresas).
//
// Copy rules: the mechanism (AI agents) goes first, the result next to it.
// Spanish avoids both tú and usted where it can, since this page speaks to
// both audiences; the doors themselves are first person.
//
const copy = defineCopy({
  en: {
    eyebrow: "AI agents in production",
    title: "We build AI agents that help your operation do more with the same team.",
    subtitle:
      "They serve customers, review documents, follow up and move work between systems, with a person approving what matters. In production, not in a demo.",
    doorsLabel: "Where do you want to start?",
    businessDoor: {
      title: "I have a business",
      body: "An AI agent working in your business in two weeks, at a fixed price.",
      cta: "See it for businesses",
      quiz: "Or take the free 2-minute check",
    },
    enterpriseDoor: {
      title: "I represent a company",
      body: "AI agents inside your processes and systems, with the control your IT team requires.",
      cta: "See it for enterprises",
    },
    continueLabel: { business: "Continue in Businesses", enterprise: "Continue in Enterprise" },
    navBusiness: "Businesses",
    navEnterprise: "Enterprise",
    agentEyebrow: "What an agent does",
    agentTitle: "Not a report. An agent working.",
    agentSubtitle:
      "A consultancy hands over a redesigned process for your people to run. We hand over an AI agent that runs it — and we stay to keep it running.",
    agents: [
      {
        title: "Serves your customers",
        body: "Answers questions, books and solves requests by phone, WhatsApp and web, at any hour, and hands a person whatever needs one.",
      },
      {
        title: "Reviews documents",
        body: "Reads invoices, forms and emails, extracts the data and flags what is missing before it reaches your team.",
      },
      {
        title: "Follows up",
        body: "Quotes, reminders and customers who stopped coming back, with drafts a person approves before they go out.",
      },
      {
        title: "Builds the report",
        body: "Pulls the numbers from scattered systems into one weekly report that shows what is working.",
      },
    ],
    howEyebrow: "How we work",
    howTitle: "One process at a time.",
    steps: [
      { title: "We pick the process", body: "The one costing you the most, with the clearest result." },
      { title: "We build the agent and put it in production", body: "Connected to the real systems, with a fixed scope and a date." },
      { title: "We keep it running", body: "Monitored and adjusted, and then the next process builds on it." },
    ],
    controlEyebrow: "Under control",
    controlTitle: "AI that works inside the rules.",
    controls: [
      { title: "A person approves what matters", body: "The agent prepares; anything irreversible waits for a human." },
      { title: "Your data stays under your control", body: "It runs on your accounts, and what we build is yours." },
      { title: "Every action is recorded", body: "Who asked, what the agent did, who approved." },
    ],
    securityLink: "How we handle security and data",
    closingTitle: "Where do you want to start?",
  },
  es: {
    eyebrow: "Agentes de IA en producción",
    title: "Desarrollamos agentes de IA que ayudan a tu operación a hacer más con el mismo equipo.",
    subtitle:
      "Atienden clientes, revisan documentos, dan seguimiento y mueven trabajo entre sistemas, con una persona aprobando lo que importa. En producción, no en una demo.",
    doorsLabel: "¿Por dónde empezamos?",
    businessDoor: {
      title: "Tengo un negocio",
      body: "Un agente de IA trabajando en tu negocio en dos semanas, a precio fijo.",
      cta: "Ver para negocios",
      quiz: "O haz el diagnóstico gratis de 2 minutos",
    },
    enterpriseDoor: {
      title: "Represento a una empresa",
      body: "Agentes de IA dentro de sus procesos y sistemas, con el control que exige su equipo de TI.",
      cta: "Ver para empresas",
    },
    continueLabel: { business: "Seguir en Negocios", enterprise: "Seguir en Empresas" },
    navBusiness: "Negocios",
    navEnterprise: "Empresas",
    agentEyebrow: "Qué hace un agente",
    agentTitle: "No es un informe. Es un agente trabajando.",
    agentSubtitle:
      "Una consultora entrega un proceso rediseñado para que lo ejecute la gente. Nosotros entregamos un agente de IA que lo ejecuta, y nos quedamos para mantenerlo funcionando.",
    agents: [
      {
        title: "Atiende a los clientes",
        body: "Responde consultas, agenda y resuelve solicitudes por teléfono, WhatsApp y web, a cualquier hora, y le pasa a una persona lo que lo necesita.",
      },
      {
        title: "Revisa documentos",
        body: "Lee facturas, formularios y correos, extrae los datos y marca lo que falta antes de que llegue al equipo.",
      },
      {
        title: "Da seguimiento",
        body: "Cotizaciones, recordatorios y clientes que dejaron de volver, con borradores que una persona aprueba antes de salir.",
      },
      {
        title: "Arma el reporte",
        body: "Junta los números de sistemas dispersos en un reporte semanal que muestra qué está funcionando.",
      },
    ],
    howEyebrow: "Cómo trabajamos",
    howTitle: "Un proceso a la vez.",
    steps: [
      { title: "Elegimos el proceso", body: "El que más está costando y con el resultado más claro." },
      { title: "Desarrollamos el agente y lo ponemos en producción", body: "Conectado a los sistemas reales, con alcance fijo y fecha." },
      { title: "Lo mantenemos funcionando", body: "Monitoreado y ajustado, y el siguiente proceso se construye encima." },
    ],
    controlEyebrow: "Bajo control",
    controlTitle: "IA que trabaja dentro de las reglas.",
    controls: [
      { title: "Una persona aprueba lo que importa", body: "El agente prepara; lo irreversible espera a un humano." },
      { title: "Los datos quedan bajo control propio", body: "Corre en cuentas propias, y lo que construimos es de quien lo contrata." },
      { title: "Cada acción queda registrada", body: "Quién lo pidió, qué hizo el agente y quién aprobó." },
    ],
    securityLink: "Cómo manejamos la seguridad y los datos",
    closingTitle: "¿Por dónde empezamos?",
  },
});

type HomeCopy = (typeof copy)["en"];

const AGENT_ICONS = [Headset, FileSearch, Repeat, BarChart3];
const CONTROL_ICONS = [UserCheck, ShieldCheck, ScrollText];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

function Doors({ t, testid }: { t: HomeCopy; testid: string }) {
  const businessHref = useRouteHref("/business");
  const enterpriseHref = useRouteHref("/enterprise");
  const card =
    "bg-card border border-border rounded-xl p-8 text-left flex flex-col hover:border-primary/60 transition-colors";
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto" data-testid={testid}>
      <div className={card} data-testid={`${testid}-business`}>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Store className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{t.businessDoor.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.businessDoor.body}</p>
        <div className="mt-auto space-y-3">
          <Button asChild className="w-full gradient-bg text-white font-semibold h-auto py-3 whitespace-normal">
            <Link href={businessHref} data-testid={`${testid}-business-cta`}>
              {t.businessDoor.cta}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Link
            href="/quiz"
            className="block text-center text-sm font-medium text-primary hover:underline"
            data-testid={`${testid}-quiz`}
          >
            {t.businessDoor.quiz}
          </Link>
        </div>
      </div>
      <div className={card} data-testid={`${testid}-enterprise`}>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">{t.enterpriseDoor.title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">{t.enterpriseDoor.body}</p>
        <div className="mt-auto">
          <Button asChild variant="outline" className="w-full font-semibold h-auto py-3 whitespace-normal border-primary text-primary hover:bg-primary/5">
            <Link href={enterpriseHref} data-testid={`${testid}-enterprise-cta`}>
              {t.enterpriseDoor.cta}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function HomeHeader() {
  const t = useCopy(copy);
  const businessHref = useRouteHref("/business");
  const enterpriseHref = useRouteHref("/enterprise");
  return (
    <>
      <LanguageSuggestion />
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <img src={thynraLogo} alt="Thynra" className="h-12 w-auto object-contain" data-testid="logo" />
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href={businessHref} className="hidden sm:inline text-secondary-foreground hover:text-primary transition-colors text-sm" data-testid="nav-home-business">
                {t.navBusiness}
              </Link>
              <Link href={enterpriseHref} className="hidden sm:inline text-secondary-foreground hover:text-primary transition-colors text-sm" data-testid="nav-home-enterprise">
                {t.navEnterprise}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default function HomePage() {
  const t = useCopy(copy);
  useHideSofiaBubble();
  const securityHref = useRouteHref("/security");
  const businessHref = useRouteHref("/business");
  const enterpriseHref = useRouteHref("/enterprise");
  const [door, setDoor] = useState<Door | null>(null);
  useEffect(() => setDoor(readDoor()), []);

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero + doors */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-muted to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {door && (
            <Link
              href={door === "business" ? businessHref : enterpriseHref}
              className="inline-flex items-center mb-6 text-sm font-medium text-primary hover:underline"
              data-testid="link-home-continue"
            >
              {t.continueLabel[door]}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          )}
          <motion.span
            className="block w-fit mx-auto px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm sm:text-base font-semibold uppercase tracking-wider mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            data-testid="text-home-eyebrow"
          >
            {t.eyebrow}
          </motion.span>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="text-home-title"
          >
            {t.title}
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">{t.doorsLabel}</p>
            <Doors t={t} testid="doors-hero" />
          </motion.div>
        </div>
      </section>

      {/* What an agent does */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" {...fade}>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">{t.agentEyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t.agentTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.agentSubtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.agents.map((a, i) => {
              const Icon = AGENT_ICONS[i];
              return (
                <motion.div key={a.title} className="bg-card border border-border rounded-xl p-8" {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} data-testid={`card-home-agent-${i + 1}`}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{a.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{a.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fade}>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">{t.howEyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t.howTitle}</h2>
          </motion.div>
          <ol className="grid md:grid-cols-3 gap-6">
            {t.steps.map((s, i) => (
              <motion.li key={s.title} className="bg-card border border-border rounded-xl p-8" {...fade} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <span className="text-3xl font-bold text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-bold mt-2 mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Control */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" {...fade}>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">{t.controlEyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t.controlTitle}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.controls.map((c, i) => {
              const Icon = CONTROL_ICONS[i];
              return (
                <motion.div key={c.title} className="text-center px-4" {...fade} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{c.body}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href={securityHref} className="inline-flex items-center font-semibold text-primary hover:underline">
              {t.securityLink}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Doors again */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10" {...fade}>
            {t.closingTitle}
          </motion.h2>
          <Doors t={t} testid="doors-closing" />
        </div>
      </section>

      <Footer variant="home" />
    </div>
  );
}
