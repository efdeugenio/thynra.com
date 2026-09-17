// Loads Thynra's own Sofia (AI receptionist) embeddable widget and drives it
// from the quiz result CTA. Sofia screens the prospect: she answers questions,
// qualifies, and books a discovery call — replacing the static Calendly link.
//
// The screening behaviour comes from the widget's `context` mechanism: a call
// started with { context: "screening" } prepends the tenant's `screening`
// primer (configured in widget_call_contexts) to Sofia's system prompt.
//
// Requires two build-time env vars (see .env / wrangler vars):
//   VITE_SOFIA_BUSINESS_ID        the Thynra-owned business with the widget enabled
//   VITE_SOFIA_WIDGET_ENDPOINT    receptionist base URL (defaults below)

const ENDPOINT =
  (import.meta.env.VITE_SOFIA_WIDGET_ENDPOINT as string | undefined)?.replace(/\/$/, "") ||
  "https://receptionist.thynra.com";
const BUSINESS_ID = (import.meta.env.VITE_SOFIA_BUSINESS_ID as string | undefined) || "";

type ThynraWidget = {
  startCall?: (opts?: { context?: string; extraContext?: string }) => Promise<void> | void;
  openChat?: () => void;
  closeChat?: () => void;
};

export type QuizContext = {
  level: string;
  totalScore: number;
  scores: { awareness: number; conversion: number; retention: number };
  weakestStage: string;
};

declare global {
  interface Window {
    thynra?: ThynraWidget;
  }
}

let loadPromise: Promise<void> | null = null;

/** True once a Thynra Sofia business id is configured at build time. */
export function sofiaConfigured(): boolean {
  return BUSINESS_ID.length > 0;
}

/** Inject the widget script once (idempotent). Self-injects Sofia's bubble. */
export function loadSofiaWidget(): Promise<void> {
  if (!sofiaConfigured()) {
    return Promise.reject(new Error("VITE_SOFIA_BUSINESS_ID is not set"));
  }
  if (typeof window === "undefined") return Promise.resolve();
  if (window.thynra?.startCall || window.thynra?.openChat) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `${ENDPOINT}/public/widget.js`;
    s.async = true;
    s.dataset.endpoint = ENDPOINT;
    s.dataset.businessId = BUSINESS_ID;
    s.dataset.title = "Sofia — Thynra";
    s.dataset.accent = "#4F46E5";
    s.onload = () => resolve();
    s.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Sofia widget"));
    };
    document.body.appendChild(s);
  });
  return loadPromise;
}

/**
 * Start a screening conversation with Sofia. Prefers a voice call (which
 * carries the screening primer); falls back to chat if voice is unavailable
 * or the visitor's browser blocks it.
 *
 * Pass `quiz` to inject the prospect's quiz results into Sofia's system
 * prompt so she can personalise the conversation from the first word.
 */
export async function talkToSofia(context = "screening", quiz?: QuizContext): Promise<void> {
  await loadSofiaWidget();
  const w = window.thynra;
  if (w?.startCall) {
    try {
      await w.startCall({
        context,
        ...(quiz && { extraContext: buildQuizExtraContext(quiz) }),
      });
      return;
    } catch {
      // Voice not configured / mic denied — fall back to chat below.
    }
  }
  w?.openChat?.();
}

function buildQuizExtraContext(q: QuizContext): string {
  return [
    "[Quiz Results — Front-Office AI Readiness]",
    `Level: ${q.level} (${q.totalScore}/24)`,
    `  Awareness:  ${q.scores.awareness}/8`,
    `  Conversion: ${q.scores.conversion}/8`,
    `  Retention:  ${q.scores.retention}/8`,
    `Weakest stage: ${q.weakestStage}`,
    "",
    `This prospect just completed our readiness quiz. Reference their level and`,
    `focus on how to improve their ${q.weakestStage} stage — that's their biggest gap.`,
  ].join("\n");
}

/** Open Sofia's chat panel (typing instead of talking). */
export async function chatWithSofia(): Promise<void> {
  await loadSofiaWidget();
  window.thynra?.openChat?.();
}
