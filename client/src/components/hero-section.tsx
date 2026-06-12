import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const talkToSofia = () =>
    (window as any).thynra?.startCall?.({ context: "screening" });
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
          Front-office AI for SMBs
        </motion.span>

        <motion.h1
          className="text-5xl lg:text-7xl font-bold text-foreground mb-6 max-w-5xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          data-testid="text-hero-title"
        >
          AI for every part of your business that talks to a customer.
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          data-testid="text-hero-subtitle"
        >
          The phone you can&apos;t always answer. The DM that piles up overnight.
          The form-fill nobody calls back. We build the AI that picks up where
          you can&apos;t.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={talkToSofia}
            className="gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            data-testid="button-talk-to-sofia-hero"
          >
            <Phone className="mr-2 w-4 h-4" />
            Talk to Sofia now
          </Button>
          <Button
            variant="outline"
            onClick={() => scrollTo("solutions")}
            className="px-8 py-3 rounded-lg font-semibold"
            data-testid="button-see-solutions"
          >
            See our solutions
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
          Live AI receptionist. No callback wait.
        </motion.p>
      </div>
    </section>
  );
}
