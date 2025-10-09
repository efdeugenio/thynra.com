import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    pricingSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-5xl lg:text-7xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="text-hero-title"
          >
            Thinking for the new era.
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="text-hero-subtitle"
          >
            Pause or cancel anytime.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              className="gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
              onClick={scrollToPricing}
              data-testid="button-start-today"
            >
              Start today
            </Button>
            <Button 
              variant="outline"
              className="border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
              onClick={scrollToPricing}
              data-testid="button-join-aiflow"
            >
              Join Thynra
            </Button>
          </motion.div>
          
          <motion.p 
            className="text-lg text-muted-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            data-testid="text-hero-tagline"
          >
            One subscription to rule them all.
          </motion.p>
          
          <motion.div 
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button 
              onClick={scrollToPricing}
              className="text-primary hover:text-accent transition-colors underline"
              data-testid="link-see-pricing"
            >
              See pricing
            </button>
          </motion.div>
          
          {/* Call to Action Card */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-8 max-w-md mx-auto hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            data-testid="card-intro-call"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Bot className="text-white text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" data-testid="text-intro-call-title">
              Book a 15-min intro call
            </h3>
            <p className="text-muted-foreground mb-4" data-testid="text-intro-call-subtitle">
              Schedule now
            </p>
            <Button 
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
              onClick={scrollToContact}
              data-testid="button-schedule-call"
            >
              Schedule <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
