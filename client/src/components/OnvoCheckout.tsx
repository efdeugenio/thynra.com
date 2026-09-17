import { useEffect, useRef, useState } from "react";

// Onvo's frontend SDK is loaded from a CDN script. Once loaded it exposes
// `window.onvo.pay({...}).render("#container")` which mounts an iframe
// payment widget into the named DOM element. The widget handles 3DS
// internally and fires onSuccess once the payment is confirmed.
//
// Docs (canonical): /Users/eugeniofernandez/projects/AI receptionist/onvopay-api.md
// (line 707 onwards — "Cargo recurrente" / "Pago único" sections).
const ONVO_SDK_URL = "https://sdk.onvopay.com/sdk.js";

interface OnvoPaySuccess {
  paymentMethodId?: string;
  paymentIntentId?: string;
  subscriptionId?: string;
}
interface OnvoPayError {
  paymentMethodId?: string;
  message?: string;
}
interface OnvoPayOptions {
  /** Stripe-Elements-style: pass either a paymentIntentId+paymentType=one_time,
   *  or a subscriptionId+paymentType=subscription (plus customerId in either case). */
  publicKey: string;
  paymentIntentId?: string;
  subscriptionId?: string;
  customerId?: string;
  paymentType?: "one_time" | "subscription";
  manualSubmit?: boolean;
  locale?: "es" | "en";
  onSuccess?: (r: OnvoPaySuccess) => void;
  onError?: (e: OnvoPayError) => void;
}
interface OnvoInstance {
  render: (selector: string) => void;
  submitPayment?: () => void;
}
interface OnvoGlobal {
  pay: (opts: OnvoPayOptions) => OnvoInstance;
}

declare global {
  interface Window {
    onvo?: OnvoGlobal;
  }
}

let scriptLoadPromise: Promise<void> | null = null;
function loadOnvoScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.onvo) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${ONVO_SDK_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("onvo-sdk-load-failed")));
      if (window.onvo) resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = ONVO_SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("onvo-sdk-load-failed"));
    document.head.appendChild(s);
  });
  return scriptLoadPromise;
}

export type OnvoCheckoutMode =
  | { kind: "subscription"; subscriptionId: string; customerId: string }
  | { kind: "one_time"; paymentIntentId: string; customerId?: string };

export interface OnvoCheckoutProps {
  publishableKey: string;
  mode: OnvoCheckoutMode;
  /** Called when Onvo confirms the payment. The widget closes itself. */
  onSuccess?: (r: OnvoPaySuccess) => void;
  /** Called on a payment failure inside the widget (declined card, etc.). */
  onError?: (e: OnvoPayError) => void;
  locale?: "es" | "en";
}

/**
 * Mounts the Onvo iframe payment widget. The widget handles card entry,
 * 3DS, and confirmation — it calls onSuccess with the relevant id once
 * the payment is confirmed.
 *
 * Two modes:
 *   - "subscription": confirms an existing Onvo Subscription (created
 *     server-side with paymentBehavior=allow_incomplete). SDK collects
 *     the card and POSTs to /v1/subscriptions/{id}/confirm internally.
 *   - "one_time": confirms an existing Onvo PaymentIntent. SDK collects
 *     the card and POSTs to /v1/payment-intents/{id}/confirm.
 *
 * The widget renders into a div with id="onvo-payments-widget" inside
 * this component (the SDK selector is fixed). Only one OnvoCheckout
 * should be mounted at a time on a page.
 */
export default function OnvoCheckout({
  publishableKey,
  mode,
  onSuccess,
  onError,
  locale = "es",
}: OnvoCheckoutProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Stable callback refs so the SDK doesn't re-read stale closures.
  const cbRef = useRef({ onSuccess, onError });
  cbRef.current = { onSuccess, onError };

  useEffect(() => {
    let cancelled = false;
    loadOnvoScript()
      .then(() => {
        if (cancelled) return;
        if (!window.onvo) {
          setError("Onvo SDK not available after load.");
          setLoading(false);
          return;
        }
        try {
          const opts: OnvoPayOptions = {
            publicKey: publishableKey,
            paymentType: mode.kind,
            locale,
            onSuccess: (r) => cbRef.current.onSuccess?.(r),
            onError: (e) => cbRef.current.onError?.(e),
          };
          if (mode.kind === "subscription") {
            opts.subscriptionId = mode.subscriptionId;
            opts.customerId = mode.customerId;
          } else {
            opts.paymentIntentId = mode.paymentIntentId;
            if (mode.customerId) opts.customerId = mode.customerId;
          }
          window.onvo.pay(opts).render("#onvo-payments-widget");
          setLoading(false);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown init error";
          setError(`Failed to mount checkout: ${msg}`);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "SDK load failed");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // We deliberately re-run only when the mode identity changes (e.g.
    // subscriptionId or paymentIntentId switches), not when callbacks
    // change — those are read through cbRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishableKey, mode.kind, "subscriptionId" in mode ? mode.subscriptionId : mode.paymentIntentId]);

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Cargando el formulario de pago…
        </div>
      )}
      {error && (
        <div className="border border-destructive/40 bg-destructive/5 text-destructive rounded-md p-4 text-sm">
          {error}
        </div>
      )}
      {/* Onvo's SDK mounts into this element by id. The id is fixed by us
          via the .render("#onvo-payments-widget") call above. */}
      <div id="onvo-payments-widget" />
    </div>
  );
}
