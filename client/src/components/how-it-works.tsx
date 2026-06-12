import { Phone, Map, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      icon: Phone,
      number: "01",
      title: "Discovery call",
      duration: "30 minutes · free",
      description:
        "We talk about your business, where customers come in, where they fall out, and what front-office AI could plausibly fix in your specific case. No pitch deck.",
    },
    {
      icon: Map,
      number: "02",
      title: "Diagnostic",
      duration: "1 to 2 weeks",
      description:
        "We map your current customer journey, identify the highest-leverage front-office gap, and propose a system, not a single tool. You get a written diagnosis whether or not we work together.",
    },
    {
      icon: Wrench,
      number: "03",
      title: "Build & ship",
      duration: "scoped per project",
      description:
        "Real implementation, real integrations, real production tests. Honest about what is working and what isn't. You own everything we build.",
    },
  ];

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
            How we work
          </motion.span>
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="text-how-title"
          >
            Three steps. No surprises.
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Owner-operators don&apos;t have time to be sold. So this isn&apos;t
            a sales process. It&apos;s an engineering one.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
