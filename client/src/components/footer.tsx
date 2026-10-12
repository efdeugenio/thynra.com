import { Link } from "wouter";
import { defineCopy, localePath, useCopy, useLocale } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const copy = defineCopy({
  en: {
    tagline: "AI agents in production, one process at a time",
    business: "For businesses",
    enterprise: "Enterprise",
    what: "What",
    solutions: "Solutions",
    how: "How",
    quiz: "AI Readiness Check",
    security: "Security",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
  },
  es: {
    tagline: "Agentes de IA en producción, un proceso a la vez",
    business: "Negocios",
    enterprise: "Empresas",
    what: "Qué hacemos",
    solutions: "Soluciones",
    how: "Cómo trabajamos",
    quiz: "Diagnóstico de IA",
    security: "Seguridad",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
  },
});

/**
 * Three footers, one per door:
 *  - "home"       neutral home: both doors, security, legal.
 *  - "business"   /business (/es/negocios) and its flows: home sections, quiz,
 *                 the enterprise door, legal.
 *  - "enterprise" /enterprise and /security: only their own links and legal.
 *                 No small-business references there (Eugenio, 2026-10-12).
 *
 * Plain <a> with absolute localized hrefs: section anchors need a full path to
 * work from other pages, and "~"-free Link hrefs would get the /es nest prefix
 * twice for translated slugs.
 */
export default function Footer({ variant = "business" }: { variant?: "home" | "business" | "enterprise" }) {
  const t = useCopy(copy);
  const locale = useLocale();
  const path = (p: string) => localePath(p, locale);
  const business = path("/business");
  const cls = "hover:text-primary transition-colors";

  const links: { href: string; label: string; testid?: string }[] =
    variant === "enterprise"
      ? [
          { href: path("/enterprise"), label: t.enterprise, testid: "link-footer-enterprise" },
          { href: path("/security"), label: t.security, testid: "link-footer-security" },
          { href: `${path("/enterprise")}#contact`, label: t.contact },
        ]
      : variant === "home"
        ? [
            { href: business, label: t.business, testid: "link-footer-business" },
            { href: path("/enterprise"), label: t.enterprise, testid: "link-footer-enterprise" },
            { href: path("/security"), label: t.security, testid: "link-footer-security" },
          ]
        : [
            { href: `${business}#what`, label: t.what },
            { href: `${business}#solutions`, label: t.solutions },
            { href: `${business}#how`, label: t.how },
            { href: path("/quiz"), label: t.quiz, testid: "link-footer-quiz" },
            { href: path("/enterprise"), label: t.enterprise, testid: "link-footer-enterprise" },
            { href: `${business}#contact`, label: t.contact },
          ];

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href={`~${path("/")}`} className="flex flex-col" data-testid="text-footer-logo">
            <span className="text-xl font-bold text-primary leading-tight">Thynra</span>
            <span className="text-xs text-muted-foreground">{t.tagline}</span>
          </Link>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-sm justify-center"
            data-testid="nav-footer-links"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} className={cls} data-testid={l.testid}>
                {l.label}
              </a>
            ))}
            <a href={path("/privacy")} className={cls} data-testid="link-privacy">
              {t.privacy}
            </a>
            <a href={path("/terms")} className={cls} data-testid="link-terms">
              {t.terms}
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-3">
          <span>© {new Date().getFullYear()} Thynra · hello@thynra.com</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
