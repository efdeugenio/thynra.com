import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How fast will I receive my AI solutions?",
      answer: "We deliver AI solutions in 5–7 business days per milestone. Each milestone represents a complete, functional deliverable. Complex builds are broken into clear milestones so you see progress quickly and can provide feedback along the way."
    },
    {
      question: "How does onboarding work?",
      answer: "Subscribe to a plan and we'll quickly add you to your AI project dashboard. This process usually takes about an hour to complete from the time you subscribe. Once you accept the invite, you're ready to start requesting AI solutions."
    },
    {
      question: "Who are the AI engineers?",
      answer: "Thynra is run by senior AI engineers based in Costa Rica, each with over a decade of experience building technology. You'll work directly with experienced professionals — no outsourcing, no handoffs."
    },
    {
      question: "What types of AI solutions do you build?",
      answer: "We build AI systems that connect, automate, and assist. From data-driven automation and intelligent chat agents to custom workflows and integrations — if it helps your business think and act smarter, we can build it."
    },
    {
      question: "How does the pause feature work?",
      answer: "We understand you may not have enough AI projects to fill up an entire month. Billing cycles are based on a monthly period. If you use the service for 21 days and pause, the remaining days of service can be used anytime in the future."
    }
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
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              data-testid={`faq-item-${index}`}
            >
              <button 
                className="w-full p-6 text-left flex justify-between items-center hover:bg-muted transition-colors"
                onClick={() => toggleFaq(index)}
                data-testid={`button-faq-${index}`}
              >
                <span className="font-semibold" data-testid={`text-faq-question-${index}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`text-muted-foreground transform transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
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
                    <div className="px-6 pb-6" data-testid={`text-faq-answer-${index}`}>
                      <p className="text-muted-foreground">{faq.answer}</p>
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
