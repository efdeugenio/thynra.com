import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { defineCopy, useCopy, useLocale, localePath } from "@/i18n";

const CONTACT_EMAIL = "hello@thynra.com";

type Section = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Paragraph that ends in a mailto link: `{before} <a>email</a>{after}`. */
  mailto?: { before: string; after: string };
};

const copy = defineCopy<{
  backToHome: string;
  title: string;
  intro: string;
  sections: Section[];
}>({
  en: {
    backToHome: "Back to home",
    title: "Terms of Service",
    intro:
      'These Terms of Service ("Terms") govern your use of the Thynra website and subscription services ("Service") provided by Thynra ("we," "us," or "our"). By subscribing to or using our Service, you agree to be bound by these Terms.',
    sections: [
      {
        heading: "1. Services",
        paragraphs: [
          "Thynra provides on-demand AI development services on a monthly subscription basis. Services include, but are not limited to, chatbot development, data analysis pipelines, machine learning models, workflow automation, and other AI-powered solutions.",
          "Each subscription includes one active AI build at a time. Milestones are delivered within 5–7 business days. Unlimited adjustments within the agreed scope are included at no additional charge.",
        ],
      },
      {
        heading: "2. Subscription and Billing",
        paragraphs: [
          "The Thynra Monthly plan is priced at $3,995 USD per month. Payment is processed securely via PayPal. By subscribing, you authorize us to charge your payment method each billing cycle until you cancel or pause your subscription.",
          "Billing occurs monthly on the date of your initial subscription. All fees are non-refundable except as described in Section 4 (Satisfaction Guarantee).",
        ],
      },
      {
        heading: "3. Pausing and Cancellation",
        paragraphs: [
          "You may pause or cancel your subscription at any time by contacting us at hello@thynra.com. Pausing stops future billing while preserving your account and project history. Cancellation takes effect at the end of your current billing period.",
          "We reserve the right to terminate your subscription immediately if you violate these Terms.",
        ],
      },
      {
        heading: "4. Satisfaction Guarantee",
        paragraphs: [
          "If the first milestone delivered under your subscription does not meet your expectations, we will refund your first month's payment in full — no questions asked. To request a refund under this guarantee, contact us at hello@thynra.com within 7 days of the first milestone delivery. This guarantee applies only to your first billing cycle.",
        ],
      },
      {
        heading: "5. Intellectual Property",
        paragraphs: [
          "Upon receipt of full payment for the applicable billing period, all custom work product created specifically for you under this subscription is assigned to you. This excludes any pre-existing tools, libraries, frameworks, or proprietary methods we use in delivering the Service.",
          "You grant us a limited, non-exclusive license to use your data, systems access, and materials solely to perform the services described herein.",
        ],
      },
      {
        heading: "6. Confidentiality",
        paragraphs: [
          "We treat all client data and project details as strictly confidential. We will not share, sell, or disclose your information to third parties except as required to deliver the Service or comply with applicable law. Your data stays yours.",
        ],
      },
      {
        heading: "7. Client Responsibilities",
        paragraphs: ["You agree to:"],
        list: [
          "Provide accurate and complete information when onboarding.",
          "Grant us necessary access to systems and tools required to complete the project.",
          "Respond to requests for clarification or feedback in a timely manner.",
          "Not use the deliverables for unlawful purposes.",
        ],
      },
      {
        heading: "8. Limitation of Liability",
        paragraphs: [
          "To the maximum extent permitted by law, Thynra shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our total liability for any claim under these Terms is limited to the amount paid by you in the 30 days preceding the event giving rise to the claim.",
        ],
      },
      {
        heading: "9. Disclaimer of Warranties",
        paragraphs: [
          'The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be error-free or that specific outcomes will be achieved. AI-generated deliverables are experimental in nature and you are responsible for reviewing and validating all output before production use.',
        ],
      },
      {
        heading: "10. Governing Law",
        paragraphs: [
          "These Terms are governed by the laws of the United States. Any disputes arising under these Terms shall be resolved through good-faith negotiation before any formal proceedings.",
        ],
      },
      {
        heading: "11. Changes to These Terms",
        paragraphs: [
          "We may update these Terms from time to time. If we make material changes, we will notify you by email or by posting the updated Terms on this page with a new effective date. Continued use of the Service after changes constitutes acceptance of the updated Terms.",
        ],
      },
      {
        heading: "12. Contact",
        mailto: { before: "Questions about these Terms? Reach us at", after: "." },
      },
    ],
  },
  es: {
    backToHome: "Volver al inicio",
    title: "Términos del Servicio",
    intro:
      'Estos Términos del Servicio (los "Términos") rigen tu uso del sitio web de Thynra y de los servicios de suscripción (el "Servicio") que presta Thynra ("nosotros", "nos" o "nuestro"). Al suscribirte a nuestro Servicio o usarlo, aceptas que estos Términos te son vinculantes.',
    sections: [
      {
        heading: "1. Servicios",
        paragraphs: [
          "Thynra presta servicios de desarrollo de IA bajo demanda mediante una suscripción mensual. Los servicios incluyen, entre otros, el desarrollo de chatbots, pipelines de análisis de datos, modelos de aprendizaje automático, automatización de flujos de trabajo y otras soluciones basadas en IA.",
          "Cada suscripción incluye un único desarrollo de IA activo a la vez. Los hitos se entregan en un plazo de 5 a 7 días hábiles. Se incluyen ajustes ilimitados dentro del alcance acordado, sin cargo adicional.",
        ],
      },
      {
        heading: "2. Suscripción y facturación",
        paragraphs: [
          "El plan Thynra Monthly tiene un precio de $3995 USD al mes. El pago se procesa de forma segura a través de PayPal. Al suscribirte, nos autorizas a realizar el cargo en tu método de pago en cada ciclo de facturación hasta que canceles o pauses tu suscripción.",
          "La facturación se realiza mensualmente en la fecha de tu suscripción inicial. Ninguna tarifa es reembolsable, salvo en los casos descritos en la Sección 4 (Garantía de satisfacción).",
        ],
      },
      {
        heading: "3. Pausa y cancelación",
        paragraphs: [
          "Puedes pausar o cancelar tu suscripción en cualquier momento contactándonos en hello@thynra.com. La pausa detiene la facturación futura y conserva tu cuenta y el historial de tus proyectos. La cancelación surte efecto al final de tu período de facturación en curso.",
          "Nos reservamos el derecho de dar por terminada tu suscripción de forma inmediata si incumples estos Términos.",
        ],
      },
      {
        heading: "4. Garantía de satisfacción",
        paragraphs: [
          "Si el primer hito entregado en el marco de tu suscripción no cumple tus expectativas, te reembolsaremos íntegramente el pago de tu primer mes, sin preguntas. Para solicitar un reembolso conforme a esta garantía, contáctanos en hello@thynra.com dentro de los 7 días siguientes a la entrega del primer hito. Esta garantía se aplica únicamente a tu primer ciclo de facturación.",
        ],
      },
      {
        heading: "5. Propiedad intelectual",
        paragraphs: [
          "Una vez recibido el pago íntegro correspondiente al período de facturación aplicable, se te cede todo el producto del trabajo personalizado creado específicamente para ti en virtud de esta suscripción. Se excluyen las herramientas, bibliotecas, frameworks o métodos propios preexistentes que utilicemos para prestar el Servicio.",
          "Nos otorgas una licencia limitada y no exclusiva para usar tus datos, el acceso a tus sistemas y tus materiales, únicamente con el fin de prestar los servicios descritos en estos Términos.",
        ],
      },
      {
        heading: "6. Confidencialidad",
        paragraphs: [
          "Tratamos todos los datos de los clientes y los detalles de los proyectos como estrictamente confidenciales. No compartiremos, venderemos ni divulgaremos tu información a terceros, salvo cuando sea necesario para prestar el Servicio o para cumplir con la legislación aplicable. Tus datos siguen siendo tuyos.",
        ],
      },
      {
        heading: "7. Responsabilidades del cliente",
        paragraphs: ["Te comprometes a:"],
        list: [
          "Proporcionar información exacta y completa durante la incorporación.",
          "Otorgarnos el acceso necesario a los sistemas y herramientas que se requieran para completar el proyecto.",
          "Responder oportunamente a las solicitudes de aclaración o de retroalimentación.",
          "No utilizar los entregables con fines ilícitos.",
        ],
      },
      {
        heading: "8. Limitación de responsabilidad",
        paragraphs: [
          "En la máxima medida permitida por la ley, Thynra no será responsable de ningún daño indirecto, incidental, especial, consecuencial o punitivo que surja del uso que hagas del Servicio o que esté relacionado con él. Nuestra responsabilidad total por cualquier reclamación en virtud de estos Términos se limita al monto que hayas pagado en los 30 días anteriores al hecho que dio origen a la reclamación.",
        ],
      },
      {
        heading: "9. Exclusión de garantías",
        paragraphs: [
          'El Servicio se proporciona "tal cual" y "según disponibilidad", sin garantías de ningún tipo, ya sean expresas o implícitas. No garantizamos que el Servicio esté libre de errores ni que se logren resultados específicos. Los entregables generados con IA son de naturaleza experimental y eres responsable de revisar y validar todos los resultados antes de usarlos en producción.',
        ],
      },
      {
        heading: "10. Legislación aplicable",
        paragraphs: [
          "Estos Términos se rigen por las leyes de los Estados Unidos. Cualquier controversia que surja en virtud de estos Términos se resolverá mediante negociación de buena fe antes de iniciar cualquier procedimiento formal.",
        ],
      },
      {
        heading: "11. Cambios en estos Términos",
        paragraphs: [
          "Podemos actualizar estos Términos ocasionalmente. Si realizamos cambios sustanciales, te lo notificaremos por correo electrónico o publicando los Términos actualizados en esta página con una nueva fecha de entrada en vigor. El uso continuado del Servicio después de los cambios constituye la aceptación de los Términos actualizados.",
        ],
      },
      {
        heading: "12. Contacto",
        mailto: { before: "¿Tienes preguntas sobre estos Términos? Escríbenos a", after: "." },
      },
    ],
  },
});

export default function TermsPage() {
  const t = useCopy(copy);
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:text-accent transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t.title}</h1>
          {locale === "es" && (
            <p className="text-muted-foreground text-sm">
              Esta traducción se ofrece por conveniencia. Si hubiera diferencias, prevalece la{" "}
              <a href={localePath("/terms", "en")} className="text-primary hover:text-accent transition-colors">
                versión en inglés
              </a>
              .
            </p>
          )}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">

          <section>
            <p className="text-muted-foreground leading-relaxed">{t.intro}</p>
          </section>

          {t.sections.map((section) => {
            const paragraphs = section.paragraphs ?? [];
            const hasMoreAfterParagraphs = Boolean(section.list || section.mailto);
            return (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
                {paragraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      i < paragraphs.length - 1 || hasMoreAfterParagraphs
                        ? "text-muted-foreground leading-relaxed mb-3"
                        : "text-muted-foreground leading-relaxed"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.mailto && (
                  <p className="text-muted-foreground leading-relaxed">
                    {section.mailto.before}{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:text-accent transition-colors">
                      {CONTACT_EMAIL}
                    </a>
                    {section.mailto.after}
                  </p>
                )}
              </section>
            );
          })}

        </div>
      </div>
    </div>
  );
}
