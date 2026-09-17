import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { alternateUrl, switchLocale, useLocale, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  es: { short: "ES", name: "Español" },
};

/** EN | ES toggle. A real link (crawlable, works without JS); click does a full load. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <div className={cn("inline-flex items-center rounded-md border border-border text-xs font-semibold", className)} role="group" aria-label={locale === "es" ? "Idioma" : "Language"}>
      {(["en", "es"] as const).map((l) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={active ? undefined : typeof window !== "undefined" ? alternateUrl(l) : undefined}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            title={LABELS[l].name}
            onClick={(e) => {
              if (active) return;
              e.preventDefault();
              switchLocale(l);
            }}
            className={cn(
              "px-2 py-1 first:rounded-l-md last:rounded-r-md transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-secondary-foreground hover:text-primary cursor-pointer",
            )}
            data-testid={`lang-${l}`}
          >
            {LABELS[l].short}
          </a>
        );
      })}
    </div>
  );
}

/**
 * One-time, dismissible suggestion on the English site for visitors whose
 * browser prefers Spanish. Never redirects: shared links and search engines
 * always get the page they asked for.
 */
export function LanguageSuggestion() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (locale !== "en") return;
    try {
      if (localStorage.getItem("thynra_locale") || localStorage.getItem("thynra_lang_hint_dismissed")) return;
    } catch {
      return;
    }
    const prefersSpanish = (navigator.languages || [navigator.language]).some((l) => l?.toLowerCase().startsWith("es"));
    setVisible(prefersSpanish);
  }, [locale]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem("thynra_lang_hint_dismissed", "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20 text-sm" lang="es">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3">
        <span className="text-foreground">¿Prefieres leer en español?</span>
        <a
          href={alternateUrl("es")}
          onClick={(e) => {
            e.preventDefault();
            switchLocale("es");
          }}
          className="font-semibold text-primary hover:underline"
          data-testid="lang-suggestion-es"
        >
          Ver el sitio en español
        </a>
        <button type="button" onClick={dismiss} aria-label="Cerrar" className="ml-1 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
