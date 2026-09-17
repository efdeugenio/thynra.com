// Lead attribution: where did this visitor come from?
//
// First touch is kept for 90 days (the YouTube video that introduced us);
// last touch is the most recent visit that carried UTM parameters (the video
// that brought them back to convert). Both ride along on every lead we send to
// /api/contact and /api/resources, so a lead in Resend and in the operator
// email says which video or post produced it.

export interface Touch {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string; // external referrer host only, e.g. "youtube.com"
  landing_path?: string;
  at: string; // ISO timestamp
}

export interface Attribution {
  first?: Touch;
  last?: Touch;
}

const FIRST_KEY = "thynra_first_touch";
const LAST_KEY = "thynra_last_touch";
const FIRST_TOUCH_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function read(key: string): Touch | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Touch) : undefined;
  } catch {
    return undefined;
  }
}

function write(key: string, touch: Touch) {
  try {
    localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    /* storage unavailable (private mode, blocked): attribution is best-effort */
  }
}

function externalReferrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host && host !== window.location.hostname.replace(/^www\./, "") ? host : undefined;
  } catch {
    return undefined;
  }
}

/** Call once per page load, before rendering. */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = { at: new Date().toISOString(), landing_path: window.location.pathname };
  let hasUtm = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      touch[key] = value.slice(0, 120);
      hasUtm = true;
    }
  }
  const referrer = externalReferrerHost();
  if (referrer) touch.referrer = referrer;
  if (!hasUtm && !referrer) return; // internal navigation or a direct visit: nothing new to record

  const first = read(FIRST_KEY);
  const expired = first && Date.now() - Date.parse(first.at) > FIRST_TOUCH_TTL_MS;
  if (!first || expired) write(FIRST_KEY, touch);
  if (hasUtm) write(LAST_KEY, touch);
}

export function getAttribution(): Attribution {
  return { first: read(FIRST_KEY), last: read(LAST_KEY) };
}

/** Adds locale + attribution to a lead payload sent to the Worker. */
export function withLeadContext<T extends object>(body: T, locale: "en" | "es"): T & { locale: string; attribution: Attribution } {
  return { ...body, locale, attribution: getAttribution() };
}
