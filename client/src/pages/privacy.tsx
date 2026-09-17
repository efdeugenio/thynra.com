import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { defineCopy, useCopy, useLocale, localePath } from "@/i18n";

const CONTACT_EMAIL = "hello@thynra.com";

type ListItem = { label?: string; text: string };

type Section = {
  heading: string;
  /** Paragraphs rendered before any list. */
  paragraphs?: string[];
  list?: ListItem[];
  /** Paragraph rendered after the list. */
  afterList?: string;
  /** Closing paragraph that ends in a mailto link: `{before} <a>email</a>{after}`. */
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
    title: "Privacy Policy",
    intro:
      'This Privacy Policy describes how Thynra ("we," "us," or "our") collects, uses, and protects the personal information you provide when using our website and services at thynra.com.',
    sections: [
      {
        heading: "1. Information We Collect",
        paragraphs: ["We collect information you provide directly to us, including:"],
        list: [
          {
            label: "Contact information:",
            text: "name, email address, phone number, and company name when you fill out our contact or booking forms.",
          },
          {
            label: "Project details:",
            text: "descriptions, requirements, and other content you share when onboarding or communicating with us.",
          },
          {
            label: "Payment information:",
            text: "billing details processed securely through PayPal. We do not store your payment card details on our servers.",
          },
        ],
        afterList:
          "We may also collect basic usage data (pages visited, browser type, referring URL) through standard server logs to help us improve the website.",
      },
      {
        heading: "2. How We Use Your Information",
        paragraphs: ["We use the information we collect to:"],
        list: [
          { text: "Deliver and manage the AI services you subscribe to." },
          { text: "Respond to your inquiries and schedule consultations." },
          { text: "Process payments and send billing-related communications." },
          { text: "Send updates about your project or changes to our service." },
          { text: "Improve the quality and performance of our website and services." },
        ],
        afterList: "We do not sell your personal information or use it for advertising purposes.",
      },
      {
        heading: "3. Data Sharing",
        paragraphs: [
          "We do not share your personal information with third parties except in the following limited cases:",
        ],
        list: [
          {
            label: "Payment processing:",
            text: "PayPal processes payments on our behalf and is subject to their own privacy policy.",
          },
          {
            label: "Service providers:",
            text: "Trusted tools we use to operate our business (e.g., scheduling, email delivery) that are bound by confidentiality obligations.",
          },
          {
            label: "Legal requirements:",
            text: "When required by law or to protect the rights and safety of Thynra or others.",
          },
        ],
      },
      {
        heading: "4. Data Security",
        paragraphs: [
          "We take reasonable measures to protect your personal information from unauthorized access, loss, or misuse. All data transmitted through our website is encrypted via HTTPS. Access to client project data is restricted to authorized personnel only.",
        ],
      },
      {
        heading: "5. Data Retention",
        paragraphs: [
          "We retain your personal information for as long as necessary to provide the services you've subscribed to and to comply with our legal obligations. You may request deletion of your data at any time by contacting us at hello@thynra.com.",
        ],
      },
      {
        heading: "6. Your Rights",
        paragraphs: ["You have the right to:"],
        list: [
          { text: "Access the personal information we hold about you." },
          { text: "Request correction of inaccurate data." },
          { text: "Request deletion of your data." },
          { text: "Opt out of non-essential communications at any time." },
        ],
        mailto: { before: "To exercise any of these rights, contact us at", after: "." },
      },
      {
        heading: "7. Cookies",
        paragraphs: [
          "Our website may use basic session cookies required for the site to function correctly. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, though this may affect certain site features.",
        ],
      },
      {
        heading: "8. Third-Party Links",
        paragraphs: [
          "Our website may contain links to third-party sites such as Calendly or PayPal. We are not responsible for the privacy practices of those services. We encourage you to review their respective privacy policies.",
        ],
      },
      {
        heading: "9. Changes to This Policy",
        paragraphs: [
          "We may update this Privacy Policy from time to time. When we do, we'll update the effective date at the top of this page. Continued use of our services after changes constitutes your acceptance of the updated policy.",
        ],
      },
      {
        heading: "10. Contact",
        mailto: { before: "Questions or concerns about this policy? Contact us at", after: "." },
      },
    ],
  },
  es: {
    backToHome: "Volver al inicio",
    title: "Política de Privacidad",
    intro:
      'Esta Política de Privacidad describe cómo Thynra ("nosotros", "nos" o "nuestro") recopila, usa y protege la información personal que nos proporcionas al usar nuestro sitio web y nuestros servicios en thynra.com.',
    sections: [
      {
        heading: "1. Información que recopilamos",
        paragraphs: ["Recopilamos la información que nos proporcionas directamente, incluida la siguiente:"],
        list: [
          {
            label: "Datos de contacto:",
            text: "nombre, dirección de correo electrónico, número de teléfono y nombre de la empresa cuando completas nuestros formularios de contacto o de reserva.",
          },
          {
            label: "Detalles del proyecto:",
            text: "descripciones, requisitos y otros contenidos que compartes durante la incorporación (onboarding) o al comunicarte con nosotros.",
          },
          {
            label: "Información de pago:",
            text: "datos de facturación procesados de forma segura a través de PayPal. No almacenamos los datos de tu tarjeta de pago en nuestros servidores.",
          },
        ],
        afterList:
          "También podemos recopilar datos básicos de uso (páginas visitadas, tipo de navegador, URL de referencia) mediante los registros estándar del servidor, para ayudarnos a mejorar el sitio web.",
      },
      {
        heading: "2. Cómo usamos tu información",
        paragraphs: ["Usamos la información que recopilamos para:"],
        list: [
          { text: "Prestar y gestionar los servicios de IA a los que te suscribes." },
          { text: "Responder a tus consultas y agendar reuniones de asesoría." },
          { text: "Procesar pagos y enviar comunicaciones relacionadas con la facturación." },
          { text: "Enviar novedades sobre tu proyecto o sobre cambios en nuestro servicio." },
          { text: "Mejorar la calidad y el rendimiento de nuestro sitio web y nuestros servicios." },
        ],
        afterList: "No vendemos tu información personal ni la usamos con fines publicitarios.",
      },
      {
        heading: "3. Comunicación de datos a terceros",
        paragraphs: [
          "No compartimos tu información personal con terceros, salvo en los siguientes casos limitados:",
        ],
        list: [
          {
            label: "Procesamiento de pagos:",
            text: "PayPal procesa los pagos en nuestro nombre y está sujeto a su propia política de privacidad.",
          },
          {
            label: "Proveedores de servicios:",
            text: "herramientas de confianza que usamos para operar nuestro negocio (p. ej., agendamiento de citas, envío de correos electrónicos) y que están sujetas a obligaciones de confidencialidad.",
          },
          {
            label: "Requisitos legales:",
            text: "cuando lo exija la ley o para proteger los derechos y la seguridad de Thynra o de otras personas.",
          },
        ],
      },
      {
        heading: "4. Seguridad de los datos",
        paragraphs: [
          "Adoptamos medidas razonables para proteger tu información personal contra el acceso no autorizado, la pérdida o el uso indebido. Todos los datos transmitidos a través de nuestro sitio web se cifran mediante HTTPS. El acceso a los datos de los proyectos de clientes está restringido exclusivamente al personal autorizado.",
        ],
      },
      {
        heading: "5. Conservación de los datos",
        paragraphs: [
          "Conservamos tu información personal durante el tiempo que sea necesario para prestar los servicios a los que te has suscrito y para cumplir con nuestras obligaciones legales. Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos a hello@thynra.com.",
        ],
      },
      {
        heading: "6. Tus derechos",
        paragraphs: ["Tienes derecho a:"],
        list: [
          { text: "Acceder a la información personal que tenemos sobre ti." },
          { text: "Solicitar la corrección de datos inexactos." },
          { text: "Solicitar la eliminación de tus datos." },
          { text: "Dejar de recibir comunicaciones no esenciales en cualquier momento." },
        ],
        mailto: { before: "Para ejercer cualquiera de estos derechos, escríbenos a", after: "." },
      },
      {
        heading: "7. Cookies",
        paragraphs: [
          "Nuestro sitio web puede usar cookies de sesión básicas, necesarias para que el sitio funcione correctamente. No usamos cookies de seguimiento ni de publicidad. Puedes desactivar las cookies en la configuración de tu navegador, aunque esto puede afectar a ciertas funciones del sitio.",
        ],
      },
      {
        heading: "8. Enlaces a terceros",
        paragraphs: [
          "Nuestro sitio web puede contener enlaces a sitios de terceros, como Calendly o PayPal. No somos responsables de las prácticas de privacidad de esos servicios. Te recomendamos revisar sus respectivas políticas de privacidad.",
        ],
      },
      {
        heading: "9. Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta Política de Privacidad ocasionalmente. Cuando lo hagamos, actualizaremos la fecha de entrada en vigor que figura al principio de esta página. El uso continuado de nuestros servicios después de los cambios constituye tu aceptación de la política actualizada.",
        ],
      },
      {
        heading: "10. Contacto",
        mailto: { before: "¿Tienes preguntas o inquietudes sobre esta política? Escríbenos a", after: "." },
      },
    ],
  },
});

export default function PrivacyPage() {
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
              <a href={localePath("/privacy", "en")} className="text-primary hover:text-accent transition-colors">
                versión en inglés
              </a>
              .
            </p>
          )}
        </div>

        <div className="space-y-8 text-foreground">

          <section>
            <p className="text-muted-foreground leading-relaxed">{t.intro}</p>
          </section>

          {t.sections.map((section) => {
            const paragraphs = section.paragraphs ?? [];
            // A lead-in paragraph followed by more content gets bottom spacing.
            const hasMoreAfterParagraphs = Boolean(section.list || section.afterList || section.mailto);
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
                      <li key={i}>
                        {item.label ? (
                          <>
                            <strong>{item.label}</strong> {item.text}
                          </>
                        ) : (
                          item.text
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {section.afterList && (
                  <p className="text-muted-foreground leading-relaxed mt-3">{section.afterList}</p>
                )}
                {section.mailto && (
                  <p className={section.list ? "text-muted-foreground leading-relaxed mt-3" : "text-muted-foreground leading-relaxed"}>
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
