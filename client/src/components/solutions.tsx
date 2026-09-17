import { Phone, Star, Repeat, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Solutions() {
  const [, navigate] = useLocation();
  const trySofiaLive = () =>
    (window as any).thynra?.startCall?.({ context: "receptionist_demo" });

  const solutions = [
    {
      icon: Star,
      stage: "Awareness",
      stageColor: "text-blue-500",
      name: "Reputation & Local Presence",
      tagline: "Get found and trusted before the first call.",
      description:
        "We turn reviews and your Google Business Profile into a steady engine that lifts your local ranking — plus a fast website you actually own. When someone searches for a business like yours, you're the one that shows up, with the reviews to back it.",
      bullets: [
        "Review monitoring with on-brand responses, ready to approve",
        "Post-visit review nudges that lift your local map-pack ranking",
        "Google Business Profile audit, fixes, and weekly posts",
        "A fast website you own — hosting and domain in your name, updated in 48h",
      ],
    },
    {
      icon: Phone,
      stage: "Conversion",
      stageColor: "text-purple-500",
      name: "AI Receptionist",
      tagline: "Answer and book in the next five minutes — then follow up for you.",
      description:
        "An AI front desk that picks up the phone, web chat, WhatsApp, and SMS in English or Spanish. It books appointments, qualifies leads, and routes to a human only when needed. The same AI also drafts your follow-ups, quotes, and replies in your voice — for your approval. One persona, two roles.",
      bullets: [
        "Phone, web chat, WhatsApp, and SMS — one bilingual persona, 24/7",
        "Books appointments and qualifies leads on every channel",
        "Drafts your follow-ups, quotes, and replies in your voice for approval",
        "Appointment reminders and no-show recovery that run themselves",
      ],
    },
    {
      icon: Repeat,
      stage: "Retention",
      stageColor: "text-emerald-500",
      name: "Recall & Reactivation",
      tagline: "Win back the customers you already paid to earn.",
      description:
        "Your past customers and abandoned leads are sitting in your records. We reactivate them automatically — overdue clients, patients due for a visit, quotes that went cold — with personalized, on-brand messages that bring them back without more ad spend.",
      bullets: [
        "Wins back lapsed customers and patients automatically",
        "Reactivation campaigns that run on your existing data",
        "Personalized follow-ups in your voice — not generic blasts",
        "Turns one-time buyers into repeat revenue and referrals",
      ],
    },
    {
      icon: BarChart3,
      stage: "Operations",
      stageColor: "text-amber-500",
      name: "Owner's Weekly Report",
      tagline: "Run it without drowning in spreadsheets.",
      description:
        "The numbers that actually run your business — leads, bookings, no-shows, revenue — pulled from your scattered tools into one weekly report that lands in your inbox. Built on a data-engineering backbone, so it works with the messy data you already have.",
      bullets: [
        "A weekly owner's report auto-generated from your scattered data",
        "The numbers that matter, without the manual spreadsheet work",
        "Spot what's working and what's leaking before it costs you",
        "A data-engineering backbone competitors can't copy",
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
            The workflows we automate — mapped to where you lose customers.
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Awareness, conversion, retention, and the operations behind them.
            Start with the gap that&apos;s costing you the most — the 2-minute
            readiness check tells you which one.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${solution.stageColor}`}
                  >
                    {solution.stage}
                  </span>
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

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Not sure which gap is costing you the most?
          </p>
          <Button
            onClick={() => navigate("/quiz")}
            className="gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            data-testid="button-solutions-quiz"
          >
            Start the 2-min check
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
