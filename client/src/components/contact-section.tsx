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
import { defineCopy, useCopy, useLocale } from "@/i18n";
import { withLeadContext } from "@/lib/attribution";

const copy = defineCopy({
  en: {
    title: "Want to see if this fits your business?",
    subtitle: "Talk to Sofia now, or send a message. We usually reply within a day.",
    sofiaTitle: "Talk to Sofia now",
    sofiaBody:
      "Our own AI front desk — the kind of thing we build. No callback wait. Tell her about your business and she'll book a discovery call with the team if it's a fit.",
    sofiaCta: "Start the call",
    emailTitle: "Email us",
    emailBody:
      "hello@thynra.com. Tell us about your business and what you're trying to solve. We read every message.",
    emailCta: "Open mail",
    formTitle: "Or send a message right here",
    nameLabel: "Name *",
    namePlaceholder: "Your full name",
    emailLabel: "Email *",
    emailPlaceholder: "your@email.com",
    companyLabel: "Company",
    companyPlaceholder: "Your company",
    phoneLabel: "Phone",
    phonePlaceholder: "Optional",
    messageLabel: "What are you trying to solve? *",
    messagePlaceholder:
      "Where are customers slipping through? What have you tried? Any context helps.",
    submit: "Send message",
    sending: "Sending...",
    successTitle: "Message sent.",
    successDescription: "We'll respond within a day.",
    errorTitle: "Something went wrong.",
    errorDescription: "Please try again or email hello@thynra.com directly.",
    validationTitle: "Validation error",
    validation: {
      name: "Name must be at least 2 characters",
      email: "Please enter a valid email",
      message: "Message must be at least 10 characters",
    },
  },
  es: {
    title: "¿Quieres ver si esto le sirve a tu negocio?",
    subtitle: "Habla con Sofia ahora o envíanos un mensaje. Normalmente respondemos en un día.",
    sofiaTitle: "Habla con Sofia ahora",
    sofiaBody:
      "Es nuestra propia recepción con IA, del tipo de cosas que construimos. Sin esperar a que te devuelvan la llamada. Cuéntale sobre tu negocio y, si encajamos, te agenda una llamada inicial con el equipo.",
    sofiaCta: "Iniciar la llamada",
    emailTitle: "Escríbenos",
    emailBody:
      "hello@thynra.com. Cuéntanos sobre tu negocio y qué quieres resolver. Leemos todos los mensajes.",
    emailCta: "Abrir correo",
    formTitle: "O envíanos un mensaje aquí mismo",
    nameLabel: "Nombre *",
    namePlaceholder: "Tu nombre completo",
    emailLabel: "Correo *",
    emailPlaceholder: "tu@correo.com",
    companyLabel: "Empresa",
    companyPlaceholder: "Tu empresa",
    phoneLabel: "Teléfono",
    phonePlaceholder: "Opcional",
    messageLabel: "¿Qué quieres resolver? *",
    messagePlaceholder:
      "¿Dónde se te están escapando clientes? ¿Qué has probado? Cualquier detalle ayuda.",
    submit: "Enviar mensaje",
    sending: "Enviando...",
    successTitle: "Mensaje enviado.",
    successDescription: "Te responderemos en un día.",
    errorTitle: "Algo salió mal.",
    errorDescription: "Inténtalo de nuevo o escríbenos directamente a hello@thynra.com.",
    validationTitle: "Revisa tus datos",
    validation: {
      name: "El nombre debe tener al menos 2 caracteres",
      email: "Ingresa un correo válido",
      message: "El mensaje debe tener al menos 10 caracteres",
    },
  },
});

type ContactCopy = (typeof copy)["en"];

function makeContactSchema(messages: ContactCopy["validation"]) {
  return z.object({
    name: z.string().min(2, messages.name),
    email: z.string().email(messages.email),
    company: z.string().optional(),
    phone: z.string().optional(),
    message: z.string().min(10, messages.message),
  });
}

type ContactForm = z.infer<ReturnType<typeof makeContactSchema>>;

export default function ContactSection() {
  const t = useCopy(copy);
  const locale = useLocale();
  const contactSchema = makeContactSchema(t.validation);
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
      apiRequest("POST", "/api/contact", withLeadContext({ ...data, kind: "contact" }, locale)),
    onSuccess: () => {
      toast({
        title: t.successTitle,
        description: t.successDescription,
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
        title: t.errorTitle,
        description: t.errorDescription,
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
          title: t.validationTitle,
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
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
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
              <h3 className="text-2xl font-bold">{t.sofiaTitle}</h3>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t.sofiaBody}
            </p>
            <span className="text-primary font-medium inline-flex items-center">
              {t.sofiaCta}
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
              <h3 className="text-2xl font-bold">{t.emailTitle}</h3>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t.emailBody}
            </p>
            <span className="text-primary font-medium inline-flex items-center">
              {t.emailCta}
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
                {t.formTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.nameLabel}
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder={t.namePlaceholder}
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.emailLabel}
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, email: e.target.value })
                      }
                      placeholder={t.emailPlaceholder}
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.companyLabel}
                    </label>
                    <Input
                      value={contactForm.company}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          company: e.target.value,
                        })
                      }
                      placeholder={t.companyPlaceholder}
                      data-testid="input-contact-company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.phoneLabel}
                    </label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder={t.phonePlaceholder}
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.messageLabel}
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder={t.messagePlaceholder}
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
                  {contactMutation.isPending ? t.sending : t.submit}
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
