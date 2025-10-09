import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="testimonial-1"
          >
            <blockquote className="text-2xl font-semibold text-foreground mb-4">
              "Thynra shows that they know the art of AI implementation."
            </blockquote>
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center mr-3">
                <span className="text-xs font-semibold">TECH</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="testimonial-2"
          >
            <blockquote className="text-2xl font-semibold text-foreground mb-4">
              "AI is everything, and these guys have nailed it."
            </blockquote>
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">JD</span>
              </div>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-muted-foreground text-sm">AI Industry Expert</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Awards */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="award-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-white text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">TechCorp</h3>
            <p className="text-muted-foreground">AI Innovation of the Year</p>
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-6 bg-muted rounded flex items-center justify-center">
                <span className="text-xs">AWARD 2024</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-card border border-border rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            data-testid="award-2"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="text-white text-2xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Summit</h3>
            <p className="text-muted-foreground">Best AI Service Platform</p>
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-6 bg-muted rounded flex items-center justify-center">
                <span className="text-xs">AWARD 2024</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
