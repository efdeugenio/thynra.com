import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { defineCopy, useCopy } from "@/i18n";

const copy = defineCopy({
  en: {
    eyebrow: "AI that wins & keeps customers",
    title: "Most service businesses lose customers in the same three places. Find yours in 2 minutes.",
    subtitle:
      "The lead nobody called back. The customer who never came back. The reviews nobody answers. Take the free 2-minute readiness check to see which gap is costing you the most — then we automate it.",
    primaryCta: "Start the 2-min check",
    secondaryCta: "Talk to Sofia now",
    subline: "Free · 2 minutes · instant results",
  },
  es: {
    eyebrow: "IA para conseguir y conservar clientes",
    title: "Casi todos los negocios de servicios pierden clientes en los mismos tres puntos. Descubre dónde los pierde el tuyo en 2 minutos.",
    subtitle:
      "El cliente al que nadie le devolvió el mensaje. El que nunca volvió. Las reseñas que nadie responde. Haz el diagnóstico gratis de 2 minutos para ver qué punto te está costando más, y lo automatizamos.",
    primaryCta: "Empezar el diagnóstico",
    secondaryCta: "Habla con Sofia ahora",
    subline: "Gratis · 2 minutos · resultados al instante",
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
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={() => navigate("/quiz")}
            className="gradient-bg text-white px-5 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
            data-testid="button-take-quiz-hero"
          >
            {t.primaryCta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={talkToSofia}
            className="px-5 py-2 rounded-lg text-sm font-semibold"
            data-testid="button-talk-to-sofia-hero"
          >
            <Phone className="mr-2 w-4 h-4" />
            {t.secondaryCta}
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
      </div>
    </section>
  );
}
