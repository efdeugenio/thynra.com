import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What does "front-office AI" actually mean?',
      answer:
        "Front-office is every part of your business that talks to a customer. The phone. The DM. The form-fill. The website. The follow-up email. Front-office AI is AI that runs those touchpoints. It's not bookkeeping AI, not internal-ops AI, not generic productivity AI.",
    },
    {
      question: "Who is this for?",
      answer:
        "Owner-operated SMBs that have customer demand but can't keep up with it. Service businesses where the owner is still answering the phone. Teams where the front desk is the bottleneck. Most of our work is with service businesses where missed conversations directly cost revenue.",
    },
    {
      question: "What's not in scope?",
      answer:
        "Anything back-office. Bookkeeping, HR, internal automation, dev tooling, generic AI strategy decks. We don't sell single-feature tools either. We build systems where the customer's first call, first message, first form, and first follow-up all work together.",
    },
    {
      question: "Are you taking new clients right now?",
      answer:
        "Yes. We're actively engaging new clients, with a focus on service businesses where front-office gaps are costing measurable revenue. The fastest way to find out if there's a fit is a 30-minute discovery call.",
    },
    {
      question: "How is this different from the AI tools I've already tried?",
      answer:
        "Most AI tools you've tried are point solutions. A chatbot. A voice agent. A scheduler. Each solves one problem. Front-office AI is a system: voice, chat, web, follow-up, and reviews working together. The compounding effect is the point.",
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
  ];

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
          Frequently asked questions
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
