import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How fast will I receive my AI solutions?",
      answer: "On average, most AI projects are completed in just two days or less. However, more complex ML models and integrations can take longer depending on the scope."
    },
    {
      question: "How does onboarding work?",
      answer: "Subscribe to a plan and we'll quickly add you to your AI project dashboard. This process usually takes about an hour to complete from the time you subscribe. Once you accept the invite, you're ready to start requesting AI solutions."
    },
    {
      question: "Who are the AI engineers?",
      answer: "AIFlow is run by senior AI engineers with 10+ years of experience in machine learning, deep learning, and AI systems. We don't outsource work to junior developers—you'll work directly with experienced professionals throughout your entire experience."
    },
    {
      question: "What types of AI solutions do you build?",
      answer: "We build chatbots, recommendation systems, predictive analytics models, computer vision solutions, natural language processing tools, automation workflows, custom APIs, and much more. If it's AI-related, we can probably build it."
    },
    {
      question: "How does the pause feature work?",
      answer: "We understand you may not have enough AI projects to fill up entire month. Billing cycles are based on 31 day period. If you use the service for 21 days and pause, you'll have 10 days of service remaining to be used anytime in the future."
    },
    {
      question: "Do you provide model training and deployment?",
      answer: "Yes! Model training and deployment are included with all subscriptions. We handle everything from data preprocessing to model deployment and monitoring. You'll own the trained models and can deploy them however you prefer."
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
