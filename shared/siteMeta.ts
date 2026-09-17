// Per-route, per-locale page metadata. The Worker uses it to rewrite
// index.html before it leaves the edge (so link previews in WhatsApp, LinkedIn
// and Google see the right language), and to build /sitemap.xml. The client
// uses it to keep document.title in sync during in-app navigation.

import { findResource, isPublic, RESOURCES } from "./resources";

export type SiteLocale = "en" | "es";
export const SITE_ORIGIN = "https://thynra.com";

interface PageText {
  title: string;
  description: string;
}

interface RouteMeta {
  /** English-style path; a trailing "*" matches any suffix. */
  path: string;
  /** Locales this page exists in. */
  locales: SiteLocale[];
  /** false = add noindex and leave out of the sitemap. */
  index: boolean;
  text: Partial<Record<SiteLocale, PageText>>;
}

const ROUTES: RouteMeta[] = [
  {
    path: "/",
    locales: ["en", "es"],
    index: true,
    text: {
      en: {
        title: "Thynra — AI that helps service businesses win and keep customers",
        description:
          "Most service businesses lose customers in the same three places: they can't find you, nobody answers, they don't come back. Find yours in 2 minutes, then we automate it.",
      },
      es: {
        title: "Thynra — IA para que tu negocio consiga y conserve clientes",
        description:
          "La mayoría de los negocios de servicios pierden clientes en los mismos tres puntos: no te encuentran, nadie les responde, no vuelven. Descubre dónde los pierde el tuyo en 2 minutos y lo automatizamos.",
      },
    },
  },
  {
    path: "/quiz",
    locales: ["en", "es"],
    index: true,
    text: {
      en: {
        title: "AI Readiness Check — Thynra",
        description:
          "Six questions, two minutes. See where your business is losing customers and which workflow to automate first, with a free PDF plan.",
      },
      es: {
        title: "Diagnóstico de IA para tu negocio — Thynra",
        description:
          "Seis preguntas, dos minutos. Descubre dónde está perdiendo clientes tu negocio y qué proceso automatizar primero, con un plan gratis en PDF.",
      },
    },
  },
  {
    path: "/privacy",
    locales: ["en", "es"],
    index: true,
    text: {
      en: { title: "Privacy Policy — Thynra", description: "How Thynra collects, uses and protects your information." },
      es: { title: "Política de privacidad — Thynra", description: "Cómo Thynra recopila, usa y protege tu información." },
    },
  },
  {
    path: "/terms",
    locales: ["en", "es"],
    index: true,
    text: {
      en: { title: "Terms of Service — Thynra", description: "The terms that govern the use of Thynra's website and services." },
      es: { title: "Términos del servicio — Thynra", description: "Los términos que rigen el uso del sitio y los servicios de Thynra." },
    },
  },
  {
    path: "/data-deletion",
    locales: ["en", "es"],
    index: true,
    text: {
      en: { title: "Data Deletion — Thynra", description: "How to request deletion of your data from Thynra." },
      es: { title: "Eliminación de datos — Thynra", description: "Cómo solicitar que Thynra elimine tus datos." },
    },
  },
  {
    path: "/pricing/ai-receptionist",
    locales: ["en"],
    index: true,
    text: { en: { title: "AI Receptionist pricing — Thynra", description: "Plans for Thynra's AI Receptionist." } },
  },
  { path: "/checkout/*", locales: ["en"], index: false, text: {} },
  { path: "/onboarding/*", locales: ["en"], index: false, text: {} },
];

export interface ResolvedMeta {
  locale: SiteLocale;
  /** English-style path, without the locale prefix. */
  path: string;
  title: string;
  description: string;
  index: boolean;
  canonical: string;
  /** Absolute URLs of this page in each locale it exists in. */
  alternates: Partial<Record<SiteLocale, string>>;
}

const FALLBACK: Record<SiteLocale, PageText> = {
  en: ROUTES[0].text.en!,
  es: ROUTES[0].text.es!,
};

export function localizePath(path: string, locale: SiteLocale): string {
  if (locale === "en") return path;
  return path === "/" ? "/es" : `/es${path}`;
}

export function splitLocale(pathname: string): { locale: SiteLocale; path: string } {
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const rest = pathname.slice(3);
    return { locale: "es", path: rest === "" ? "/" : rest };
  }
  return { locale: "en", path: pathname || "/" };
}

function matchRoute(path: string): RouteMeta | undefined {
  const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return ROUTES.find((r) =>
    r.path.endsWith("*") ? normalized.startsWith(r.path.slice(0, -1)) : r.path === normalized,
  );
}

export function resolveMeta(pathname: string, opts: { preview?: boolean } = {}): ResolvedMeta {
  const { locale, path } = splitLocale(pathname);

  // Spanish resource pages: /es/recursos/<slug>
  const resourceMatch = locale === "es" ? /^\/recursos\/([a-z0-9-]+)\/?$/.exec(path) : null;
  if (resourceMatch) {
    const resource = findResource(resourceMatch[1]);
    const url = `${SITE_ORIGIN}/es/recursos/${resourceMatch[1]}`;
    if (resource && (isPublic(resource) || opts.preview)) {
      return {
        locale,
        path,
        title: `${resource.title} — Thynra`,
        description: resource.promise,
        index: isPublic(resource),
        canonical: url,
        alternates: { es: url },
      };
    }
  }

  const route = matchRoute(path);
  const exists = route && route.locales.includes(locale);
  const text = (exists && route.text[locale]) || FALLBACK[locale];
  const alternates: Partial<Record<SiteLocale, string>> = {};
  if (route) {
    for (const l of route.locales) alternates[l] = SITE_ORIGIN + localizePath(path, l);
  }
  return {
    locale,
    path,
    title: text.title,
    description: text.description,
    index: Boolean(exists && route.index),
    canonical: SITE_ORIGIN + localizePath(path, locale),
    alternates,
  };
}

/** Every indexable URL with its alternates, for /sitemap.xml. */
export function sitemapEntries(): { loc: string; alternates: Partial<Record<SiteLocale, string>> }[] {
  const entries: { loc: string; alternates: Partial<Record<SiteLocale, string>> }[] = [];
  for (const route of ROUTES) {
    if (!route.index || route.path.endsWith("*")) continue;
    const alternates: Partial<Record<SiteLocale, string>> = {};
    for (const l of route.locales) alternates[l] = SITE_ORIGIN + localizePath(route.path, l);
    for (const l of route.locales) entries.push({ loc: alternates[l]!, alternates });
  }
  for (const r of RESOURCES) {
    if (!isPublic(r)) continue;
    const loc = `${SITE_ORIGIN}/es/recursos/${r.slug}`;
    entries.push({ loc, alternates: { es: loc } });
  }
  return entries;
}
