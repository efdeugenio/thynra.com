import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import thynraLogo from "@assets/Thynra logo_1760137533222.png";
import { defineCopy, localePath, useCopy, useLocale, useRouteHref } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useHideSofiaBubble, useRememberDoor } from "@/lib/door";

// Header for the enterprise pages (/enterprise, /security). Deliberately not
// the home navigation: no quiz button and no Sofia call. A visitor here is an
// operations or IT lead; the next step for them is a conversation.
const copy = defineCopy({
  en: {
    overview: "Enterprise",
    security: "Security",
    cta: "Book a conversation",
  },
  es: {
    overview: "Empresas",
    security: "Seguridad",
    cta: "Agendar conversación",
  },
});

export default function EnterpriseHeader() {
  const t = useCopy(copy);
  useHideSofiaBubble();
  useRememberDoor("enterprise");
  const locale = useLocale();
  const enterpriseHref = useRouteHref("/enterprise");
  const securityHref = useRouteHref("/security");
  // Plain <a>: on /enterprise only the hash changes, so the browser scrolls to
  // the form without a reload; from /security it is a normal navigation.
  const contactHref = `${localePath("/enterprise", locale)}#contact`;
  // "~" = absolute in wouter; a bare "/" inside the /es nest yields "/es/".
  const homeHref = `~${localePath("/", locale)}`;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={homeHref} className="flex items-center" data-testid="logo">
            <img src={thynraLogo} alt="Thynra" className="h-12 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href={enterpriseHref} className="text-secondary-foreground hover:text-primary transition-colors text-sm" data-testid="nav-enterprise-overview">
              {t.overview}
            </Link>
            <Link href={securityHref} className="text-secondary-foreground hover:text-primary transition-colors text-sm" data-testid="nav-enterprise-security">
              {t.security}
            </Link>
            <LanguageSwitcher />
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="nav-enterprise-cta">
              <a href={contactHref}>{t.cta}</a>
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild size="sm" className="bg-primary text-primary-foreground" data-testid="nav-enterprise-cta-mobile">
              <a href={contactHref}>{t.cta}</a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
