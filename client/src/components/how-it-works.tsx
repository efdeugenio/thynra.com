import { CreditCard, List, Smile } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const services = [
    "Chatbots", "Data Analysis", "ML Models", "Automation", "Chatbots", "Data Analysis"
  ];

  const services2 = [
    "Process Automation", "NLP Solutions", "Computer Vision", "Predictive Analytics"
  ];

  const services3 = [
    "AI Integration", "Custom APIs", "Model Training", "Data Processing"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="text-how-it-works-title"
          >
            The way AI should've been done in the first place
          </motion.h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Subscribe */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            data-testid="card-subscribe"
          >
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4" data-testid="text-subscribe-title">Subscribe</h3>
            <p className="text-muted-foreground" data-testid="text-subscribe-description">
              Subscribe to a plan & request as many AI solutions as you'd like.
            </p>
          </motion.div>

          {/* Request */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="card-request"
          >
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <List className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4" data-testid="text-request-title">Request</h3>
            <p className="text-muted-foreground mb-6" data-testid="text-request-description">
              Request whatever you'd like, from chatbots to ML models.
            </p>
            
            {/* Service Carousel */}
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm" data-testid="carousel-services">
              <motion.div 
                className="service-animation"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {services.join(" • ")}
              </motion.div>
              <motion.div 
                className="service-animation"
                animate={{ x: [100, -100] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: -4 }}
              >
                {services2.join(" • ")}
              </motion.div>
              <motion.div 
                className="service-animation"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: -8 }}
              >
                {services3.join(" • ")}
              </motion.div>
            </div>
          </motion.div>

          {/* Receive */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            data-testid="card-receive"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smile className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4" data-testid="text-receive-title">Receive</h3>
            <p className="text-muted-foreground" data-testid="text-receive-description">
              Receive your AI solution within two business days on average.
            </p>
          </motion.div>
        </div>

        {/* Client Logos */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          data-testid="section-client-logos"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">TechCorp</div>
            <div className="text-2xl font-bold text-muted-foreground">DataFlow</div>
            <div className="text-2xl font-bold text-muted-foreground">AI Solutions</div>
            <div className="text-2xl font-bold text-muted-foreground">StartupX</div>
            <div className="text-2xl font-bold text-muted-foreground">InnovateLab</div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          data-testid="text-company-description"
        >
          <p className="text-muted-foreground">
            First launched in 2023, AIFlow revolutionized the AI industry with its subscription-based model. 
            To this day, AIFlow is run entirely by experienced AI engineers. AIFlow doesn't hire junior developers 
            or outsource work—instead, it focuses on delivering top-notch AI solutions to a limited roster of clients at a time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
