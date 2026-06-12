import {
  PhoneOff,
  ArchiveX,
  Clock,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PainSection() {
  const pains = [
    {
      icon: PhoneOff,
      title: "Missed calls",
      description:
        "Most small-business calls go unanswered. Every miss is a customer choosing your competitor.",
    },
    {
      icon: ArchiveX,
      title: "Dead database",
      description:
        "Past customers and abandoned leads sit in your CRM. Most owners never follow up. The revenue is sitting there.",
    },
    {
      icon: Clock,
      title: "Slow follow-up",
      description:
        "Leads contacted within five minutes convert dramatically better. Most owners reply in 42 hours. By then, the lead is gone.",
    },
    {
      icon: EyeOff,
      title: "AI-search invisibility",
      description:
        "When prospects ask ChatGPT or Perplexity for a business like yours, you don't show up. Reviews and structured presence decide who does.",
    },
    {
      icon: AlertTriangle,
      title: "The embarrassing-AI trauma",
      description:
        "Every prospect has been burned by a bad AI demo. They aren't buying capability. They are buying \"this won't happen to me again.\"",
    },
  ];

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
            Where SMBs lose customers
          </motion.span>
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="text-pain-title"
          >
            Five places customers walk away before you even know.
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Front-office AI exists because of these five gaps. Pick the one
            that&apos;s costing you the most. That&apos;s where we start.
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
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
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
