import { BarChart3, Lock, Bolt, Star, ArrowsUpFromLine, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: BarChart3,
      title: "AI Dashboard",
      description: "Easily manage your AI projects with a comprehensive dashboard.",
      color: "bg-primary"
    },
    {
      icon: Lock,
      title: "Fixed monthly rate",
      description: "No surprises here! Pay the same fixed price each month.",
      color: "bg-primary"
    },
    {
      icon: Bolt,
      title: "Fast delivery",
      description: "Get your AI solution one at a time in just a couple days on average.",
      color: "bg-accent"
    },
    {
      icon: Star,
      title: "Top-notch quality",
      description: "Senior AI expertise at your fingertips, whenever you need it.",
      color: "bg-emerald-500"
    },
    {
      icon: ArrowsUpFromLine,
      title: "Flexible and scalable",
      description: "Scale up or down as needed, and pause or cancel at anytime.",
      color: "bg-purple-500"
    },
    {
      icon: Fingerprint,
      title: "Unique and all yours",
      description: "Every AI solution is made especially for you and is 100% yours.",
      color: "bg-orange-500"
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
            It's "you'll never go back" better
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="text-benefits-subtitle"
          >
            AIFlow replaces unreliable freelancers and expensive agencies for one flat monthly fee, 
            with AI solutions delivered so fast you won't want to go anywhere else.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
