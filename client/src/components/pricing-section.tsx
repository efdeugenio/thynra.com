import { Button } from "@/components/ui/button";
import { Check, PauseCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingSection() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    "One active AI build at a time",
    "Delivery in 5–7 business days per milestone",
    "Unlimited adjustments within scope",
    "Custom AI solution or data workflow design",
    "Integration with your existing tools and APIs",
    "Secure, private implementation (your data stays yours)",
    "Pause or cancel anytime"
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div 
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full mr-3"></div>
            <span className="text-muted-foreground font-medium" data-testid="text-pricing-label">
              PRICING
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="text-pricing-title"
          >
            One subscription, endless possibilities
          </motion.h2>
        </div>

        {/* Pricing Card */}
        <motion.div 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-card border-2 border-primary rounded-2xl p-8 relative hover:scale-105 transition-transform" data-testid="card-pricing">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2" data-testid="text-plan-name">Monthly Club</h3>
              <p className="text-muted-foreground mb-4" data-testid="text-plan-terms">PAUSE OR CANCEL ANYTIME</p>
              <div className="text-5xl font-bold mb-2" data-testid="text-plan-price">$3,995</div>
              <p className="text-muted-foreground" data-testid="text-plan-period">/month</p>
            </div>

            <ul className="space-y-4 mb-8" data-testid="list-features">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center" data-testid={`feature-${index}`}>
                  <Check className="text-emerald-500 mr-3 w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full gradient-bg text-white py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform"
              onClick={scrollToContact}
              data-testid="button-get-started"
            >
              Get started
            </Button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-16 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          data-testid="section-additional-info"
        >
          <div className="flex items-center bg-card rounded-lg p-4" data-testid="info-pause">
            <PauseCircle className="text-primary text-2xl mr-4" />
            <div>
              <h4 className="font-semibold">Pause anytime</h4>
              <p className="text-muted-foreground text-sm">Temporarily pause your subscription anytime, no sweat.</p>
            </div>
          </div>
          <div className="flex items-center bg-card rounded-lg p-4" data-testid="info-trial">
            <CheckCircle className="text-emerald-500 text-2xl mr-4" />
            <div>
              <h4 className="font-semibold">Try it for a milestone</h4>
              <p className="text-muted-foreground text-sm">Not happy after the first milestone? Get a full refund — no questions asked.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
