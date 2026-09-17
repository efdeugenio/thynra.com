import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { defineCopy, useCopy, useLocale, localePath } from "@/i18n";

const PRIVACY_EMAIL = "privacy@thynra.com";

const copy = defineCopy({
  en: {
    backToHome: "Back to home",
    title: "Data Deletion Instructions",
    lastUpdated: "Last updated: March 2026",
    request: {
      heading: "How to Request Data Deletion",
      body: "If you have connected your social media accounts (Instagram, TikTok, or Facebook) to Thynra and would like your data deleted, you can request deletion by emailing us at:",
    },
    stored: {
      heading: "What Data We Store",
      body: "When you connect a social account, Thynra stores:",
      items: [
        "OAuth access tokens for your connected accounts",
        "Platform user IDs (Instagram, TikTok, Facebook Page)",
        "Post history (titles, publication status, platform URLs)",
      ],
    },
    after: {
      heading: "What Happens After Your Request",
      body: "We will delete all tokens and associated data for your account within 30 days of receiving your request. You will receive a confirmation email when deletion is complete.",
    },
    revoke: {
      heading: "Revoking Access Directly",
      body: "You can also revoke Thynra's access to your accounts directly from each platform:",
      items: [
        { label: "Facebook / Instagram:", text: "Settings → Security → Apps and Websites → Remove Thynra" },
        { label: "TikTok:", text: "Profile → Settings → Apps → Manage app permissions → Remove Thynra" },
      ],
    },
    contact: {
      heading: "Contact",
      before: "For any questions about your data, contact us at",
      after: ".",
    },
  },
  es: {
    backToHome: "Volver al inicio",
    title: "Instrucciones para la eliminación de datos",
    lastUpdated: "Última actualización: marzo de 2026",
    request: {
      heading: "Cómo solicitar la eliminación de datos",
      body: "Si conectaste tus cuentas de redes sociales (Instagram, TikTok o Facebook) a Thynra y quieres que se eliminen tus datos, puedes solicitar la eliminación escribiéndonos a:",
    },
    stored: {
      heading: "Qué datos almacenamos",
      body: "Cuando conectas una cuenta de redes sociales, Thynra almacena:",
      items: [
        "Tokens de acceso OAuth de tus cuentas conectadas",
        "ID de usuario en cada plataforma (Instagram, TikTok, página de Facebook)",
        "Historial de publicaciones (títulos, estado de publicación, URL en las plataformas)",
      ],
    },
    after: {
      heading: "Qué ocurre después de tu solicitud",
      body: "Eliminaremos todos los tokens y los datos asociados a tu cuenta en un plazo de 30 días a partir de la recepción de tu solicitud. Recibirás un correo electrónico de confirmación cuando se haya completado la eliminación.",
    },
    revoke: {
      heading: "Revocar el acceso directamente",
      body: "También puedes revocar el acceso de Thynra a tus cuentas directamente desde cada plataforma:",
      items: [
        { label: "Facebook / Instagram:", text: "Configuración → Seguridad → Apps y sitios web → Eliminar Thynra" },
        { label: "TikTok:", text: "Perfil → Configuración → Apps → Administrar permisos de apps → Eliminar Thynra" },
      ],
    },
    contact: {
      heading: "Contacto",
      before: "Si tienes cualquier pregunta sobre tus datos, escríbenos a",
      after: ".",
    },
  },
});

export default function DataDeletionPage() {
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
          <p className="text-muted-foreground text-sm">{t.lastUpdated}</p>
          {locale === "es" && (
            <p className="text-muted-foreground text-sm mt-2">
              Esta traducción se ofrece por conveniencia. Si hubiera diferencias, prevalece la{" "}
              <a href={localePath("/data-deletion", "en")} className="text-primary hover:text-accent transition-colors">
                versión en inglés
              </a>
              .
            </p>
          )}
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">{t.request.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.request.body}</p>
            <p className="mt-4 font-medium text-primary">{PRIVACY_EMAIL}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t.stored.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.stored.body}</p>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc list-inside">
              {t.stored.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t.after.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.after.body}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t.revoke.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.revoke.body}</p>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc list-inside">
              {t.revoke.items.map((item, i) => (
                <li key={i}>
                  <strong>{item.label}</strong> {item.text}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">{t.contact.heading}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t.contact.before} <span className="text-primary">{PRIVACY_EMAIL}</span>
              {t.contact.after}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
