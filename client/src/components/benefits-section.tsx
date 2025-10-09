import { Layers, Lightbulb, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Layers,
      title: "End-to-end expertise",
      description: "From data connection to intelligent automation.",
      color: "bg-blue-500"
    },
    {
      icon: Lightbulb,
      title: "Simple by design",
      description: "We make complex systems understandable and maintainable.",
      color: "bg-purple-500"
    },
    {
      icon: Zap,
      title: "Fast results",
      description: "Start small, see real impact in weeks.",
      color: "bg-orange-500"
    },
    {
      icon: Shield,
      title: "Secure foundation",
      description: "Your data stays private, structured, and ready for scale.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="text-benefits-title"
          >
            🔧 Why Thynra
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div 
                key={benefit.title}
                className="bg-card rounded-xl p-6 hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-benefit-${benefit.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2" data-testid={`text-benefit-title-${index}`}>
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`text-benefit-description-${index}`}>
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
