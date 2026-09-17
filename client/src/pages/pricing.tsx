import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";

/**
 * Self-serve pricing page for the launch wedge (AI Receptionist, CR dental
 * market). Two plans: Mensual ($129/mo + $499 setup) or Anual ($99/mo).
 *
 * Prices are listed NET. The billing country decides the IVA treatment
 * (Ley 9635): Costa Rica → 13% IVA added on top (the card is charged the
 * IVA-inclusive amount); anywhere else → export of services, tasa 0%, the
 * card is charged the net price. The selector is geo-prefilled from the
 * Worker's /api/geo (Cloudflare edge country) but always user-overridable —
 * the IP is a UX hint, never the tax decision.
 *
 * Flow:
 *   1. Customer picks a plan + enters business email (+ country, tax id).
 *   2. POST /api/checkout/start with `{email, plan, country, tax_id}`.
 *   3. Worker maps plan + country → Onvo Price ids (CR variants are
 *      IVA-inclusive), forwards to the receptionist's internal endpoint,
 *      which creates business + Onvo Customer + Subscription and returns
 *      `{checkout_path}`.
 *   4. Browser navigates to /checkout/sub/:id — that page mounts the
 *      embedded Onvo SDK card form.
 */

// Net catalog amounts in cents — display only; the amounts actually charged
// come from the Onvo Prices the Worker resolves. Keep in sync with the Onvo
// catalog (scripts/sync-onvo-prices.mjs).
const NET_MONTHLY_CENTS = 12900;
const NET_SETUP_CENTS = 49900;
const NET_ANNUAL_CENTS = 118800;
const IVA_BPS = 1300;

const grossUp = (cents: number) => Math.round((cents * (10000 + IVA_BPS)) / 10000);
const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

// ISO 3166-1 alpha-2 codes offered in the selector. Rendered with the
// browser's Spanish display names and sorted alphabetically at runtime;
// Costa Rica is pinned first as the home market.
const COUNTRY_CODES = [
  "CR", "US", "CA", "MX", "GT", "SV", "HN", "NI", "PA", "BZ", "CO", "VE",
  "EC", "PE", "BO", "PY", "UY", "AR", "CL", "BR", "DO", "CU", "PR", "JM",
  "TT", "BS", "BB", "HT", "ES", "PT", "FR", "DE", "IT", "NL", "BE", "LU",
  "CH", "AT", "GB", "IE", "DK", "SE", "NO", "FI", "IS", "PL", "CZ", "SK",
  "HU", "RO", "BG", "GR", "HR", "SI", "RS", "UA", "EE", "LV", "LT", "MT",
  "CY", "TR", "IL", "AE", "SA", "QA", "KW", "BH", "OM", "JO", "EG", "MA",
  "TN", "ZA", "NG", "KE", "GH", "IN", "PK", "BD", "LK", "CN", "HK", "TW",
  "JP", "KR", "SG", "MY", "TH", "VN", "PH", "ID", "AU", "NZ",
];

function countryOptions(): { code: string; name: string }[] {
  let display: Intl.DisplayNames | null = null;
  try {
    display = new Intl.DisplayNames(["es"], { type: "region" });
  } catch {
    // Very old browsers — fall back to raw codes.
  }
  const opts = COUNTRY_CODES.map((code) => ({
    code,
    name: display?.of(code) ?? code,
  }));
  const cr = opts.filter((o) => o.code === "CR");
  const rest = opts
    .filter((o) => o.code !== "CR")
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  return [...cr, ...rest];
}

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const [plan, setPlan] = useState<"receptionist_monthly" | "receptionist_annual">(
    "receptionist_monthly",
  );
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("CR");
  const [taxId, setTaxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = useMemo(countryOptions, []);

  // Geo-prefill the selector once. Errors are fine — CR stays the default.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo")
      .then((r) => (r.ok ? r.json() : null))
      .then((body: { country?: string | null } | null) => {
        const c = body?.country;
        if (!cancelled && typeof c === "string" && COUNTRY_CODES.includes(c)) {
          setCountry(c);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const isCR = country === "CR";

  // What the card is actually charged today / per cycle. CR pays the
  // IVA-inclusive amounts; everyone else (export of services) pays net.
  const monthlyCycle = isCR ? grossUp(NET_MONTHLY_CENTS) : NET_MONTHLY_CENTS;
  const setupToday = isCR ? grossUp(NET_SETUP_CENTS) : NET_SETUP_CENTS;
  const annualCycle = isCR ? grossUp(NET_ANNUAL_CENTS) : NET_ANNUAL_CENTS;
  const totalToday =
    plan === "receptionist_monthly" ? monthlyCycle + setupToday : annualCycle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Tu correo electrónico es requerido.");
      return;
    }
    // Business name + tax id are required: they go on the factura
    // electrónica (and for exports, the tax/VAT id is the reverse-charge
    // evidence that the sale is B2B).
    if (!businessName.trim()) {
      setError("El nombre del negocio es requerido (aparece en tu factura).");
      return;
    }
    if (taxId.trim().length < 3) {
      setError(
        isCR
          ? "La cédula es requerida (aparece en tu factura)."
          : "Tax / VAT ID is required (it appears on your invoice).",
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          business_name: businessName.trim(),
          country,
          tax_id: taxId.trim(),
          plan,
        }),
      });
      const body = (await res.json()) as
        | { ok: true; checkout_path: string }
        | { error: string; message?: string };
      if (!res.ok || !("ok" in body)) {
        setError(
          ("message" in body && body.message) ||
            ("error" in body && body.error) ||
            `Error ${res.status}`,
        );
        setSubmitting(false);
        return;
      }
      // SPA-navigate to the embedded checkout page. The page fetches config
      // from the Worker and mounts the Onvo SDK in subscription mode.
      setLocation(body.checkout_path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setSubmitting(false);
    }
  };

  const monthlyFeatures = [
    "Sofia atiende llamadas y WhatsApp 24/7",
    "Reservas en tu calendario en tiempo real",
    "Bilingüe español-inglés nativo",
    "Resumen de cada conversación por correo",
    "Setup de $499 (una sola vez)",
  ];
  const annualFeatures = [
    "Todo lo del Plan Mensual",
    "Setup incluido (ahorras $499)",
    "Ahorro de $360 al año vs mensual",
    "Pausa o cancela al final del ciclo",
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">AI Receptionist</h1>
          <p className="text-muted-foreground">
            Tu recepcionista bilingüe que nunca duerme. Elige tu plan y empezamos hoy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card
            className={`cursor-pointer transition-all ${plan === "receptionist_monthly" ? "border-primary border-2 shadow-lg" : "border"}`}
            onClick={() => setPlan("receptionist_monthly")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Plan Mensual</CardTitle>
              <div className="text-4xl font-bold mt-2">
                $129<span className="text-base font-normal text-muted-foreground"> /mes{isCR ? " + IVA" : ""}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                + $499 setup (una sola vez){isCR ? " + IVA" : ""}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {monthlyFeatures.map((f) => (
                  <li key={f} className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${plan === "receptionist_annual" ? "border-primary border-2 shadow-lg" : "border"}`}
            onClick={() => setPlan("receptionist_annual")}
          >
            <CardHeader>
              <CardTitle className="text-2xl">
                Plan Anual <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded ml-1">Ahorra $360</span>
              </CardTitle>
              <div className="text-4xl font-bold mt-2">
                $99<span className="text-base font-normal text-muted-foreground"> /mes{isCR ? " + IVA" : ""}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Facturado anualmente — $1,188 al año{isCR ? " + IVA" : ""}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {annualFeatures.map((f) => (
                  <li key={f} className="flex items-start">
                    <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Empezar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo de tu negocio</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@tunegocio.com"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="business_name">Nombre del negocio</Label>
                <Input
                  id="business_name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Clínica Dental Lumen"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">País de facturación</Label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={submitting}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tax_id">
                    {isCR ? "Cédula jurídica o física" : "Tax / VAT ID"}
                  </Label>
                  <Input
                    id="tax_id"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder={isCR ? "3-101-123456" : "EIN / VAT number"}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive border border-destructive/40 bg-destructive/5 rounded p-3">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {`Pagar ${usd(totalToday)} hoy${isCR ? " (IVA incluido)" : ""}`}
              </Button>
              <div className="text-xs text-muted-foreground text-center space-y-1">
                {plan === "receptionist_monthly" ? (
                  <p>
                    {usd(monthlyCycle)}/mes + {usd(setupToday)} setup única vez.
                    Renueva a {usd(monthlyCycle)}/mes.
                  </p>
                ) : (
                  <p>Renueva a {usd(annualCycle)}/año.</p>
                )}
                <p>
                  {isCR
                    ? "Precios + IVA (13%) para negocios en Costa Rica."
                    : "IVA 0% — exportación de servicios (cliente fuera de Costa Rica)."}
                </p>
                <p>
                  Vas a Onvo Pay (procesador costarricense). Aceptamos Visa, Mastercard y SINPE Móvil.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
