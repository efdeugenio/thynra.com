import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
});

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type BookingForm = z.infer<typeof bookingSchema>;
type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    email: "",
    company: "",
    preferredTime: "",
    message: "",
  });

  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const [activeForm, setActiveForm] = useState<"booking" | "contact">("booking");
  const { toast } = useToast();

  const bookingMutation = useMutation({
    mutationFn: (data: BookingForm) => apiRequest("POST", "/api/booking", data),
    onSuccess: () => {
      toast({
        title: "Booking Request Sent!",
        description: "We'll get back to you within 24 hours to schedule your call.",
      });
      setBookingForm({
        name: "",
        email: "",
        company: "",
        preferredTime: "",
        message: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll respond within 24 hours.",
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
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = bookingSchema.parse(bookingForm);
      bookingMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = contactSchema.parse(contactForm);
      contactMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8">
            <Video className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-bold mb-4" data-testid="text-contact-title">
            Book a 15-min intro call
          </h2>
          <p className="text-muted-foreground mb-8" data-testid="text-contact-subtitle">
            Let's discuss your AI needs and see how we can help transform your business
          </p>
        </motion.div>

        {/* Form Toggle */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-muted rounded-lg p-1 flex" data-testid="toggle-form-type">
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeForm === "booking"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveForm("booking")}
              data-testid="button-booking-form"
            >
              Book a Call
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeForm === "contact"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveForm("contact")}
              data-testid="button-contact-form"
            >
              Send Message
            </button>
          </div>
        </motion.div>

        {/* Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {activeForm === "booking" ? (
            <Card className="max-w-2xl mx-auto" data-testid="form-booking">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2" />
                  Schedule Your Call
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="Your full name"
                        required
                        data-testid="input-booking-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        data-testid="input-booking-email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        value={bookingForm.company}
                        onChange={(e) => setBookingForm({ ...bookingForm, company: e.target.value })}
                        placeholder="Your company name"
                        data-testid="input-booking-company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Time</label>
                      <Input
                        value={bookingForm.preferredTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                        placeholder="e.g., Next week afternoons"
                        data-testid="input-booking-time"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      placeholder="Tell us about your AI project or requirements..."
                      rows={4}
                      data-testid="textarea-booking-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                    disabled={bookingMutation.isPending}
                    data-testid="button-submit-booking"
                  >
                    {bookingMutation.isPending ? "Scheduling..." : "Schedule Call"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl mx-auto" data-testid="form-contact">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your full name"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="Your company name"
                        data-testid="input-contact-company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="Your phone number"
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us about your AI project, requirements, or any questions you have..."
                      rows={6}
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
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Email Option */}
        <motion.div 
          className="border-t border-border pt-12 mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          data-testid="section-email-option"
        >
          <a 
            href="mailto:hello@aiflow.co" 
            className="inline-flex items-center text-primary hover:text-accent transition-colors"
            data-testid="link-email"
          >
            <Mail className="text-2xl mr-4" />
            <div className="text-left">
              <p className="font-semibold">Prefer to email?</p>
              <p className="text-muted-foreground">hello@aiflow.co</p>
            </div>
            <ArrowRight className="ml-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
