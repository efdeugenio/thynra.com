import { Link } from "wouter";
import { defineCopy, localePath, useCopy, useLocale, useRouteHref } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const copy = defineCopy({
  en: {
    tagline: "AI in production, one process at a time",
    what: "What",
    solutions: "Solutions",
    how: "How",
    quiz: "AI Readiness Check",
    enterprise: "Enterprise",
    security: "Security",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
  },
  es: {
    tagline: "IA en producción, un proceso a la vez",
    what: "Qué hacemos",
    solutions: "Soluciones",
    how: "Cómo trabajamos",
    quiz: "Diagnóstico de IA",
    enterprise: "Empresas",
    security: "Seguridad",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
  },
});

// Route links use wouter <Link>, which resolves inside the "/es" nest, so they
// already stay in the current locale. The home's section anchors point at the
// home (not a bare "#…"), so they also work from /enterprise and /security.
export default function Footer() {
  const t = useCopy(copy);
  const locale = useLocale();
  const home = localePath("/", locale);
  const enterpriseHref = useRouteHref("/enterprise");
  const securityHref = useRouteHref("/security");

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col" data-testid="text-footer-logo">
            <span className="text-xl font-bold text-primary leading-tight">
              Thynra
            </span>
            <span className="text-xs text-muted-foreground">
              {t.tagline}
            </span>
          </div>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-sm justify-center"
            data-testid="nav-footer-links"
          >
            <a href={`${home}#what`} className="hover:text-primary transition-colors">
              {t.what}
            </a>
            <a
              href={`${home}#solutions`}
              className="hover:text-primary transition-colors"
            >
              {t.solutions}
            </a>
            <a href={`${home}#how`} className="hover:text-primary transition-colors">
              {t.how}
            </a>
            <Link
              href="/quiz"
              className="hover:text-primary transition-colors"
              data-testid="link-footer-quiz"
            >
              {t.quiz}
            </Link>
            <Link href={enterpriseHref} className="hover:text-primary transition-colors" data-testid="link-footer-enterprise">
              {t.enterprise}
            </Link>
            <Link href={securityHref} className="hover:text-primary transition-colors" data-testid="link-footer-security">
              {t.security}
            </Link>
            <a href={`${home}#contact`} className="hover:text-primary transition-colors">
              {t.contact}
            </a>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              {t.privacy}
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              {t.terms}
            </Link>
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
