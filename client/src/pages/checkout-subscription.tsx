import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import OnvoCheckout from "@/components/OnvoCheckout";

async function finalizeExtras(subscriptionId: string, paymentMethodId: string) {
  // Called after the Onvo SDK confirms the Subscription. Charges any
  // one-time extras (e.g. setup fee) using the same PaymentMethod. The
  // server returns ok with charged:0 when there's nothing to do, so it's
  // safe to call unconditionally.
  const res = await fetch("/api/checkout/finalize-extras", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subscription_id: subscriptionId,
      payment_method_id: paymentMethodId,
    }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `finalize-extras returned ${res.status}`);
  }
}

interface CheckoutConfig {
  ok: true;
  publishable_key: string;
  onvo_subscription_id: string;
  onvo_customer_id: string;
  /** What the customer pays NOW (recurring + extras like setup fee). */
  total_today_cents: number;
  /** Per-cycle recurring amount (no extras). Used for "renews at …" caption. */
  recurring_amount_cents: number;
  extras_total_cents: number;
  has_extras: boolean;
  currency: "USD" | "CRC";
  billing_cycle: string;
  product_name: string;
}

type FetchState =
  | { status: "loading" }
  | { status: "ready"; config: CheckoutConfig }
  | { status: "completed" } // 410 — already paid / inactive
  | { status: "not_found" }
  | { status: "error"; message: string };

/**
 * Subscription checkout landing page.
 *
 * URL: /checkout/sub/:id
 *
 * Flow:
 *   1. Reads :id from the URL (the local subscription id we generated
 *      server-side; this IS the unguessable token).
 *   2. Fetches /api/checkout/config/:id from the Cloudflare Worker, which
 *      proxies the receptionist's public checkout-config endpoint.
 *   3. On success, mounts the OnvoCheckout component with the PaymentIntent
 *      id + publishable key. The Onvo iframe takes over from there.
 *   4. On Onvo SDK success, navigates to /checkout/success. The subscription
 *      will activate when the Onvo webhook fires server-side.
 */
export default function CheckoutSubscriptionPage() {
  const [, params] = useRoute<{ id: string }>("/checkout/sub/:id");
  const [, setLocation] = useLocation();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!params?.id) {
      setState({ status: "not_found" });
      return;
    }
    let cancelled = false;
    fetch(`/api/checkout/config/${encodeURIComponent(params.id)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setState({ status: "not_found" });
          return;
        }
        if (res.status === 410) {
          setState({ status: "completed" });
          return;
        }
        const body = (await res.json()) as Partial<CheckoutConfig> & {
          error?: string;
        };
        if (
          !res.ok ||
          !body.ok ||
          !body.onvo_subscription_id ||
          !body.onvo_customer_id ||
          !body.publishable_key
        ) {
          setState({
            status: "error",
            message: body.error ?? `Unexpected ${res.status} from checkout API.`,
          });
          return;
        }
        setState({ status: "ready", config: body as CheckoutConfig });
      })
      .catch((e) => {
        if (cancelled) return;
        setState({
          status: "error",
          message: e instanceof Error ? e.message : "Network error",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-xl mx-auto">
        {state.status === "loading" && (
          <Card>
            <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Cargando…
            </CardContent>
          </Card>
        )}

        {state.status === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle>Este checkout ya fue completado</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Tu suscripción ya está activa o este enlace expiró. Si necesitas
              ayuda, escríbenos a <a href="mailto:hello@thynra.com" className="underline">hello@thynra.com</a>.
            </CardContent>
          </Card>
        )}

        {state.status === "not_found" && (
          <Card>
            <CardHeader>
              <CardTitle>Enlace no encontrado</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              No encontramos esta sesión de pago. Verifica el enlace o vuelve
              a iniciar el proceso desde la página de precios.
            </CardContent>
          </Card>
        )}

        {state.status === "error" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Algo salió mal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              {state.message}
            </CardContent>
          </Card>
        )}

        {state.status === "ready" && (
          <Card>
            <CardHeader>
              <CardTitle>{state.config.product_name}</CardTitle>
              <div className="text-3xl font-bold mt-2">
                {formatMoney(state.config.total_today_cents, state.config.currency)}
              </div>
              {state.config.has_extras && (
                <div className="text-sm text-muted-foreground mt-1">
                  Hoy pagás{" "}
                  {formatMoney(state.config.total_today_cents, state.config.currency)}
                  . Renueva por{" "}
                  {formatMoney(
                    state.config.recurring_amount_cents,
                    state.config.currency,
                  )}
                  /{state.config.billing_cycle === "annual" ? "año" : "mes"}.
                </div>
              )}
            </CardHeader>
            <CardContent>
              <OnvoCheckout
                publishableKey={state.config.publishable_key}
                mode={{
                  kind: "subscription",
                  subscriptionId: state.config.onvo_subscription_id,
                  customerId: state.config.onvo_customer_id,
                }}
                onSuccess={async (result) => {
                  // After the Subscription is confirmed, charge any one-time
                  // extras (setup fee) using the same PaymentMethod we just
                  // tokenized. The endpoint is a no-op if there are none.
                  if (!params?.id || !result.paymentMethodId) {
                    setLocation("/checkout/success");
                    return;
                  }
                  try {
                    await finalizeExtras(params.id, result.paymentMethodId);
                    setLocation("/checkout/success");
                  } catch (err) {
                    setState({
                      status: "error",
                      message:
                        err instanceof Error
                          ? `Tu suscripción fue activada pero el cargo del setup no se pudo procesar. Escríbenos a hello@thynra.com con este mensaje: ${err.message}`
                          : "El cargo del setup no se pudo procesar.",
                    });
                  }
                }}
                onError={(e) =>
                  setState({
                    status: "error",
                    message: e.message ?? "El pago no se pudo procesar.",
                  })
                }
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function formatMoney(cents: number, currency: "USD" | "CRC"): string {
  const amount = cents / 100;
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  }
  return `₡${amount.toLocaleString("es-CR", { minimumFractionDigits: 0 })} CRC`;
}
