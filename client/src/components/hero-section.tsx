import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    eyebrow: "One problem at a time",
    title: "We fix one problem in your business at a time. The first one, in two weeks.",
    subtitle:
      "No six-month projects, no replacing the systems you already use, no new hire. You start with whatever is costing you the most — the free 2-minute check tells you which one that is.",
    primaryCta: "Start the 2-min check",
    subline: "Free · 2 minutes · instant results",
    sofiaPrompt: "Rather talk to someone right now?",
    sofiaCta: "Talk to Sofia",
  },
  es: {
    eyebrow: "Un problema a la vez",
    title: "Arreglamos un problema de tu negocio a la vez. El primero, en dos semanas.",
    subtitle:
      "Sin proyectos de seis meses, sin cambiar los sistemas que ya usas y sin contratar a nadie. Empiezas por el que más te está costando: el diagnóstico gratis de 2 minutos te dice cuál es.",
    primaryCta: "Empezar el diagnóstico",
    subline: "Gratis · 2 minutos · resultados al instante",
    sofiaPrompt: "¿Prefieres hablar con alguien ahora?",
    sofiaCta: "Habla con Sofia",
  },
});

export default function HeroSection() {
  const [, navigate] = useLocation();
  const t = useCopy(copy);
  const talkToSofia = () =>
    (window as any).thynra?.startCall?.({ context: "screening" });

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm sm:text-base font-semibold uppercase tracking-wider mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          data-testid="text-hero-eyebrow"
        >
          {t.eyebrow}
        </motion.span>

        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          data-testid="text-hero-title"
        >
          {t.title}
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-testid="text-hero-subtitle"
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={() => navigate("/quiz")}
            className="gradient-bg text-white px-6 py-3 rounded-lg text-base font-semibold hover:scale-105 transition-transform"
            data-testid="button-take-quiz-hero"
          >
            {t.primaryCta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        <motion.p
          className="mt-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-testid="text-hero-subline"
        >
          {t.subline}
        </motion.p>

        <motion.p
          className="mt-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {t.sofiaPrompt}{" "}
          <button
            onClick={talkToSofia}
            className="inline-flex items-center font-semibold text-primary hover:underline"
            data-testid="button-talk-to-sofia-hero"
          >
            <Phone className="mr-1.5 w-4 h-4" />
            {t.sofiaCta}
          </button>
        </motion.p>
      </div>
    </section>
  );
}
