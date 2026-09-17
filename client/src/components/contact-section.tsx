import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) =>
      apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent.",
        description: "We'll respond within a day.",
      });
      setContactForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description:
          "Please try again or email hello@thynra.com directly.",
        variant: "destructive",
      });
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = contactSchema.parse(contactForm);
      contactMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4" data-testid="text-contact-title">
            Want to see if this fits your business?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Talk to Sofia now, or send a message. We usually reply within a day.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() =>
              (window as any).thynra?.startCall?.({ context: "screening" })
            }
            className="bg-card border-2 border-primary rounded-xl p-8 text-left hover:bg-muted/50 transition-colors group"
            data-testid="card-talk-to-sofia"
          >
            <div className="flex items-center mb-4">
              <Phone className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Talk to Sofia now</h3>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Live AI receptionist. No callback wait. Tell her about your
              business and she&apos;ll book a discovery call with the team if
              it&apos;s a fit.
            </p>
            <span className="text-primary font-medium inline-flex items-center">
              Start the call
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <a
            href="mailto:hello@thynra.com"
            className="bg-card border border-border rounded-xl p-8 text-left hover:border-primary/50 transition-colors group"
            data-testid="card-email"
          >
            <div className="flex items-center mb-4">
              <Mail className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Email us</h3>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              hello@thynra.com. Tell us about your business and what
              you&apos;re trying to solve. We read every message.
            </p>
            <span className="text-primary font-medium inline-flex items-center">
              Open mail
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 w-5 h-5" />
                Or send a message right here
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder="Your full name"
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <Input
                      value={contactForm.company}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          company: e.target.value,
                        })
                      }
                      placeholder="Your company"
                      data-testid="input-contact-company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Optional"
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    What are you trying to solve? *
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Where are customers slipping through? What have you tried? Any context helps."
                    rows={5}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? "Sending..." : "Send message"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
