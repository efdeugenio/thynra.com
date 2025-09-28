import { Bot, BarChart3, Brain, ServerCog, Languages, Eye, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function ServicesShowcase() {
  const services = [
    { icon: Bot, name: "Chatbots", color: "text-primary" },
    { icon: BarChart3, name: "Data Analysis", color: "text-accent" },
    { icon: Brain, name: "ML Models", color: "text-primary" },
    { icon: ServerCog, name: "Automation", color: "text-accent" },
    { icon: Languages, name: "NLP Solutions", color: "text-primary" },
    { icon: Eye, name: "Computer Vision", color: "text-accent" },
    { icon: Plus, name: "+ more", color: "text-muted-foreground" }
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
            data-testid="text-showcase-title"
          >
            Recent work
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="text-showcase-subtitle"
          >
            We're talking "AI Innovation of the Year" good.
          </motion.p>
          <Button 
            variant="link" 
            className="text-primary hover:text-accent underline"
            data-testid="button-see-recent-work"
          >
            See recent work
          </Button>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div 
                key={service.name}
                className="bg-card rounded-lg p-4 text-center hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                data-testid={`card-service-${service.name.toLowerCase().replace(/\s+/g, '-').replace('+', 'plus')}`}
              >
                <IconComponent className={`${service.color} text-2xl mb-2 mx-auto`} />
                <p className="text-sm font-medium">{service.name}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          data-testid="text-showcase-footer"
        >
          <h3 className="text-2xl font-bold mb-4">AI solutions, integrations, models & more</h3>
          <p className="text-muted-foreground">All the AI capabilities you need under one roof.</p>
        </motion.div>
      </div>
    </section>
  );
}
