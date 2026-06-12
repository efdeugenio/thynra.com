import { Search, MessagesSquare, Repeat } from "lucide-react";
import { motion } from "framer-motion";

export default function BenefitsSection() {
  const stages = [
    {
      icon: Search,
      label: "Awareness",
      tagline: "How customers find you in 2026.",
      description:
        "When someone searches Google, asks ChatGPT, or scrolls past a comment thread looking for a business like yours.",
      bullets: [
        "Reviews, AI-search visibility, structured presence",
        "Content that consistently shows up in your voice",
        "Comment and DM engagement at scale",
      ],
      color: "bg-blue-500",
    },
    {
      icon: MessagesSquare,
      label: "Conversion",
      tagline: "What happens in the next five minutes.",
      description:
        "When a customer reaches out by call, chat, form, or DM. The window is short. The result decides everything.",
      bullets: [
        "AI receptionist answers calls 24/7",
        "Books, qualifies, hands off only when needed",
        "Replies to DMs and form-fills instantly",
      ],
      color: "bg-purple-500",
    },
    {
      icon: Repeat,
      label: "Retention",
      tagline: "What happens after the first sale.",
      description:
        "The dormant database, the review you never asked for, the customer who would refer if you reminded them.",
      bullets: [
        "Reactivates dormant leads and customers",
        "Asks for and responds to reviews",
        "Sends relevant follow-ups in your voice",
      ],
      color: "bg-emerald-500",
    },
  ];

  return (
    <section id="what" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What front-office AI covers
          </motion.span>
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="text-stages-title"
          >
            Three stages. One thing in common.
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Front-office means every part of your business that touches a
            customer. The back-office runs on its own software. The front-office
            is where AI changes how you compete.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.label}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-stage-${stage.label.toLowerCase()}`}
              >
                <div
                  className={`w-12 h-12 ${stage.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{stage.label}</h3>
                <p className="text-primary text-sm font-medium mb-3">
                  {stage.tagline}
                </p>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {stage.description}
                </p>
                <ul className="space-y-2 text-sm text-foreground">
                  {stage.bullets.map((b) => (
                    <li key={b} className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
