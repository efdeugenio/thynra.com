import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Clock, MessageCircle, PlayCircle, Video, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { withLeadContext } from "@/lib/attribution";
import { DIAGNOSTICO, INTAKE_LIMITS, formatCRC } from "@shared/diagnostico";

// thynra.com/es/diagnostico-express — the first paid yes. The owner describes
// the process that costs them the most, pays once, and gets a recorded video
// back in WhatsApp. No call, no calendar. Spanish only (see shared/diagnostico.ts).

const price = formatCRC(DIAGNOSTICO.priceCRC);

const RECEIVES = [
  "Los tres procesos de tu negocio que automatizaríamos primero",
  "En qué orden, y por qué ese orden",
  "Qué te ahorraría cada uno, en horas o en clientes que hoy se pierden",
  "Qué necesitaría estar en orden antes de construir el primero",
];

const STEPS = [
  { icon: MessageCircle, title: "Nos cuentas tu proceso", body: "Cómo funciona hoy, con tus palabras. Cinco minutos, sin formularios eternos." },
  { icon: CheckCircle2, title: `Pagas ${price}`, body: "Una sola vez, IVA incluido. Sin suscripción." },
  { icon: Video, title: "Recibes el video", body: `Un video de unos ${DIAGNOSTICO.videoMinutes} minutos por WhatsApp, en ${DIAGNOSTICO.deliveryDays} días hábiles.` },
];

type Field = "name" | "email" | "whatsapp" | "business" | "process";

export default function DiagnosticoPage() {
  const { toast } = useToast();
  const cancelled = new URLSearchParams(window.location.search).has("cancelado");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [business, setBusiness] = useState("");
  const [isOwner, setIsOwner] = useState(true);
  const [tools, setTools] = useState("");
  const [processText, setProcessText] = useState("");
  const [invalid, setInvalid] = useState<Set<Field>>(new Set());
  const [sending, setSending] = useState(false);
  const [fallback, setFallback] = useState<string | null>(null);

  const validate = (): Set<Field> => {
    const bad = new Set<Field>();
    if (!name.trim()) bad.add("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) bad.add("email");
    if (whatsapp.replace(/\D/g, "").length < 8) bad.add("whatsapp");
    if (!business.trim()) bad.add("business");
    if (processText.trim().length < INTAKE_LIMITS.processMin) bad.add("process");
    return bad;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bad = validate();
    setInvalid(bad);
    if (bad.size) {
      toast({
        title: "Revisa los campos marcados",
        description: bad.has("process")
          ? `Cuéntanos un poco más de tu proceso (mínimo ${INTAKE_LIMITS.processMin} caracteres).`
          : "Nos falta un dato para poder enviarte el video.",
        variant: "destructive",
      });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/diagnostico/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          withLeadContext(
            {
              name: name.trim(),
              email: email.trim(),
              whatsapp: whatsapp.trim(),
              business: business.trim(),
              isOwner,
              tools: tools.trim(),
              process: processText.trim(),
            },
            "es",
          ),
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data?.url === "string") {
        window.location.assign(data.url);
        return;
      }
      if (Array.isArray(data?.fields)) setInvalid(new Set(data.fields as Field[]));
      // Payment couldn't open, but the Worker already captured the intake.
      if (data?.error === "payments_unavailable" || data?.error === "checkout_failed") {
        setFallback(data.message);
      } else {
        toast({ title: "No pudimos continuar", description: data?.message || "Inténtalo de nuevo en un momento.", variant: "destructive" });
      }
    } catch {
      toast({
        title: "No pudimos continuar",
        description: "Revisa tu conexión e inténtalo de nuevo, o escríbenos a hello@thynra.com.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const fieldClass = (f: Field) => (invalid.has(f) ? "border-destructive focus-visible:ring-destructive" : "");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Thynra
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">Diagnóstico Express</span>
        </div>
      </div>

      {cancelled && (
        <div className="bg-amber-100 text-amber-900 text-sm text-center py-2 px-4" role="status" data-testid="banner-cancelled">
          No se completó el pago, así que no se te cobró nada. Tus datos siguen aquí si quieres intentarlo otra vez.
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] items-start">
        <section>
          <p className="text-sm font-semibold text-primary mb-4">Para dueños y encargados de negocios de servicios</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5 [text-wrap:balance]" data-testid="text-diagnostico-title">
            Cuéntanos cómo funciona tu negocio hoy. Te respondemos con un video de qué arreglar primero.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Sin llamada y sin agenda. Revisamos tu proceso real y te grabamos un video de {DIAGNOSTICO.videoMinutes} minutos
            con los tres procesos que automatizaríamos primero, en orden. Lo ves cuando quieras, y es tuyo, sigas con
            nosotros o no.
          </p>
          {/* On mobile the form stacks below the whole explanation; put the price and the ask up top too. */}
          <a
            href="#pedir"
            className="lg:hidden inline-flex items-center justify-center w-full gradient-bg text-white font-semibold rounded-md px-4 py-3 mb-10"
            data-testid="link-dx-jump"
          >
            Pedir mi diagnóstico · {price}
          </a>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Qué recibes</h2>
          <ul className="space-y-3 mb-10">
            {RECEIVES.map((item) => (
              <li key={item} className="flex gap-3 text-foreground">
                <ListOrdered className="w-5 h-5 text-primary flex-none mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Cómo funciona</h2>
          <ol className="grid gap-4 sm:grid-cols-3 mb-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold text-muted-foreground/30">0{i + 1}</span>
                  </div>
                  <p className="font-semibold text-foreground mb-1">{step.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </li>
              );
            })}
          </ol>

          <div className="bg-primary/5 border border-primary/30 rounded-xl p-6">
            <p className="font-semibold text-foreground mb-2">Si después quieres que lo construyamos</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lo que pagas por el Diagnóstico Express se descuenta completo de la etapa uno. Así el primer paso nunca es
              dinero perdido: o te llevas el plan, o se vuelve parte de la construcción.
            </p>
          </div>
        </section>

        <aside id="pedir" className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-8 scroll-mt-4">
          {fallback ? (
            <div className="grid gap-4" role="status" data-testid="diagnostico-fallback">
              <MessageCircle className="w-10 h-10 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Recibimos tus datos</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{fallback}</p>
              <p className="text-sm text-muted-foreground">No se te cobró nada.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4" noValidate>
              <div>
                <p className="text-3xl font-bold text-foreground" data-testid="text-diagnostico-price">{price}</p>
                <p className="text-sm text-muted-foreground">Pago único, IVA incluido</p>
              </div>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Tu nombre</span>
                <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={INTAKE_LIMITS.name} autoComplete="name" className={fieldClass("name")} data-testid="input-dx-name" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Tu WhatsApp</span>
                <Input
                  type="tel"
                  inputMode="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  maxLength={INTAKE_LIMITS.whatsapp}
                  autoComplete="tel"
                  placeholder="+506 8888 8888"
                  className={fieldClass("whatsapp")}
                  data-testid="input-dx-whatsapp"
                />
                <span className="text-xs text-muted-foreground">Ahí te enviamos el video.</span>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Tu correo</span>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={INTAKE_LIMITS.email}
                  autoComplete="email"
                  placeholder="tu@negocio.com"
                  className={fieldClass("email")}
                  data-testid="input-dx-email"
                />
                <span className="text-xs text-muted-foreground">Para el comprobante de pago.</span>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Tu negocio</span>
                <Input
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  maxLength={INTAKE_LIMITS.business}
                  placeholder="Ej.: clínica dental en Escazú"
                  className={fieldClass("business")}
                  data-testid="input-dx-business"
                />
              </label>

              <fieldset className="grid gap-2 text-sm">
                <legend className="font-medium text-foreground mb-1.5">¿Eres el dueño o encargado del negocio?</legend>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="owner" checked={isOwner} onChange={() => setIsOwner(true)} className="accent-primary" data-testid="radio-dx-owner-yes" />
                    Sí
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="owner" checked={!isOwner} onChange={() => setIsOwner(false)} className="accent-primary" data-testid="radio-dx-owner-no" />
                    No, trabajo ahí
                  </label>
                </div>
              </fieldset>

              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">El proceso que más te está costando</span>
                <Textarea
                  value={processText}
                  onChange={(e) => setProcessText(e.target.value)}
                  maxLength={INTAKE_LIMITS.processMax}
                  rows={6}
                  placeholder="Ej.: Los pacientes nos escriben por WhatsApp para agendar. Contesta la recepcionista cuando puede; en la tarde se acumulan y algunos se van con otra clínica. Llevamos la agenda en Google Calendar."
                  className={fieldClass("process")}
                  data-testid="input-dx-process"
                />
                <span className="text-xs text-muted-foreground">
                  Cómo funciona hoy, quién lo hace y dónde se traba. Con tus palabras; no hace falta que sea técnico.
                </span>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">
                  Qué usas hoy <span className="text-muted-foreground font-normal">(opcional)</span>
                </span>
                <Input
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  maxLength={INTAKE_LIMITS.tools}
                  placeholder="WhatsApp Business, Excel, agenda en papel…"
                  data-testid="input-dx-tools"
                />
              </label>

              <Button type="submit" disabled={sending} className="gradient-bg text-white font-semibold" data-testid="button-dx-submit">
                {sending ? "Abriendo el pago…" : `Pedir mi diagnóstico · ${price}`}
              </Button>
              <p className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                <Clock className="w-4 h-4 flex-none" />
                Te llevamos al pago seguro de Onvo. El video llega en {DIAGNOSTICO.deliveryDays} días hábiles desde el pago.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Usamos estos datos solo para tu diagnóstico y para darte seguimiento. Consulta la{" "}
                <Link href="/privacy" className="underline hover:text-primary">política de privacidad</Link>.
              </p>
            </form>
          )}
        </aside>
      </main>
    </div>
  );
}

export function DiagnosticoThanksPage() {
  const ref = new URLSearchParams(window.location.search).get("ref");
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Thynra
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">Diagnóstico Express</span>
        </div>
      </div>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center" role="status" data-testid="diagnostico-thanks">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Listo. Tu diagnóstico va en camino.</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          En los próximos {DIAGNOSTICO.deliveryDays} días hábiles te enviamos por WhatsApp un video de unos{" "}
          {DIAGNOSTICO.videoMinutes} minutos con los tres procesos que automatizaríamos primero en tu negocio. También te
          llega el comprobante al correo.
        </p>
        <div className="bg-card border border-border rounded-xl p-6 text-left mb-8">
          <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Mientras tanto
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si se te ocurre algo más sobre tu proceso (una captura, un ejemplo de mensaje, un número), respóndenos el correo
            de confirmación. Todo lo que nos mandes mejora el video.
          </p>
        </div>
        {ref && <p className="text-xs text-muted-foreground">Referencia: {ref}</p>}
      </main>
    </div>
  );
}
