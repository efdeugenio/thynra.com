import { useEffect } from "react";

// Which door a visitor last used: "business" (/business, /es/negocios) or
// "enterprise" (/enterprise, /es/empresas). The neutral home reads it to offer
// "continue in …"; it never redirects (shared links and crawlers always get
// the page they asked for).
export type Door = "business" | "enterprise";
const KEY = "thynra_door";

export function readDoor(): Door | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "business" || v === "enterprise" ? v : null;
  } catch {
    return null;
  }
}

/** Call from each door's page so the neutral home can remember the choice. */
export function useRememberDoor(door: Door) {
  useEffect(() => {
    try {
      localStorage.setItem(KEY, door);
    } catch {
      /* storage unavailable: the home just won't offer the shortcut */
    }
  }, [door]);
}

/**
 * Sofia (the receptionist demo) is injected site-wide by index.html as
 * #ai-receptionist-widget. She belongs to the business door only; pages that
 * call this hide her bubble while mounted (CSS: html.hide-sofia in index.css).
 */
export function useHideSofiaBubble() {
  useEffect(() => {
    document.documentElement.classList.add("hide-sofia");
    return () => document.documentElement.classList.remove("hide-sofia");
  }, []);
}
