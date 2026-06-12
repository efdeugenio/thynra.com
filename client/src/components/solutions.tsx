import { Phone, Send, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Solutions() {
  const trySofiaLive = () =>
    (window as any).thynra?.startCall?.({ context: "receptionist_demo" });
  const solutions = [
    {
      icon: Phone,
      name: "AI Receptionist",
      tagline: "Voice, chat, and messaging — 24/7, bilingual.",
      description:
        "An AI front desk that picks up the phone, replies on web chat, and handles WhatsApp or SMS in English or Spanish. It books appointments, qualifies leads, answers common questions, and routes to a human only when the conversation needs it.",
      bullets: [
        "Phone, web chat, WhatsApp, and SMS — one consistent persona",
        "English and Spanish out of the box, more languages on request",
        "Books appointments and captures leads on every channel",
        "Built for owner-operated businesses that can't catch every call",
      ],
    },
    {
      icon: Send,
      name: "AI Front-Office Assistant",
      tagline: "The other side of your AI Receptionist. The side you delegate to.",
      description:
        "After the AI Receptionist answers a call, captures a lead, or takes a message, your Front-Office Assistant picks up the thread. You delegate the next step. A follow-up email. A contract to send. A prospect to schedule. A DM to reply to. It executes in your voice, for your approval. One AI persona, two roles.",
      bullets: [
        "Picks up where the receptionist hands off — leads, quotes, and messages",
        "Drafts emails, DMs, and replies in your voice for your approval",
        "Schedules with prospects, sends contracts, prepares outbound on your behalf",
        "One AI persona, two roles: receptionist for your customers, assistant for you",
      ],
    },
    {
      icon: Globe,
      name: "AI-Powered Web Subscription",
      tagline: "Unlimited pages. Live in 48 hours. Not weeks.",
      description:
        "Migrate off slow agencies and expensive hosting. We build your site on a modern stack and use AI to draft updates in minutes. We review and test before shipping, and most updates go live within 48 hours, often faster. Your hosting account and domain stay in your name. We're the dev layer on top, not a middleman. Flat monthly fee covers unlimited pages and updates.",
      bullets: [
        "Modern stack on infrastructure that scales without surprise bills",
        "Most updates live within 48 hours, not six-week agency cycles",
        "AI-drafted, human-reviewed, tested before every ship",
        "You own the hosting account and the domain. No agency lock-in.",
        "Unlimited pages and updates included in the subscription",
      ],
    },
  ];

  return (
    <section id="solutions" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Solutions
          </motion.span>
          <motion.h2
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="text-solutions-title"
          >
            Three productized systems we build for SMBs.
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Each one solves a specific front-office gap. Pick the one that&apos;s
            costing you the most. Combine them when the system compounds.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.name}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-solution-${index}`}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{solution.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">
                  {solution.tagline}
                </p>
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  {solution.description}
                </p>
                <ul className="space-y-2 text-sm text-foreground mt-auto">
                  {solution.bullets.map((b) => (
                    <li key={b} className="flex items-start">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {solution.name === "AI Receptionist" && (
                  <Button
                    onClick={trySofiaLive}
                    className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-try-sofia-live"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    Try Sofia live
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
