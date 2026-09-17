import { createContext, useContext, type ReactNode } from "react";

// Locales live in the URL: English at "/", Spanish under "/es/". The router
// nests the Spanish tree under "/es" (see App.tsx), so inside a page
// `navigate("/quiz")` and `<Link href="/quiz">` already stay in the current
// locale. Only plain <a href> tags and cross-locale jumps need `localePath`.
export type Locale = "en" | "es";
export const LOCALES: readonly Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

// Copy lives next to the component that renders it:
//
//   const copy = defineCopy({ en: { title: "Hi" }, es: { title: "Hola" } });
//   const t = useCopy(copy);
//
// The Spanish block must match the English block's shape exactly, so a
// missing or misspelled key is a type error, not a blank on the live site.
export function defineCopy<T>(copy: { en: T; es: NoInfer<T> }): { en: T; es: T } {
  return copy;
}

export function useCopy<T>(copy: { en: T; es: T }): T {
  return copy[useLocale()];
}

/** Absolute path for `path` (an English-style path like "/quiz") in `locale`. */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return clean === "/" ? "/es" : `/es${clean}`;
}

/** Splits an absolute pathname into its locale and the English-style path. */
export function parseLocalePath(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const rest = pathname.slice(3);
    return { locale: "es", path: rest === "" ? "/" : rest };
  }
  return { locale: "en", path: pathname || "/" };
}

/** The same page in the other language, keeping query string and hash. */
export function alternateUrl(target: Locale): string {
  const { path } = parseLocalePath(window.location.pathname);
  return localePath(path, target) + window.location.search + window.location.hash;
}

/** Full page load, so the server sends the right <html lang>, meta tags and widget language. */
export function switchLocale(target: Locale) {
  try {
    localStorage.setItem("thynra_locale", target);
  } catch {
    /* storage unavailable: switching still works */
  }
  window.location.assign(alternateUrl(target));
}
