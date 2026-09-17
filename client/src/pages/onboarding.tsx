import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

const DAYS = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" },
] as const;
type DayKey = (typeof DAYS)[number]["key"];

type DayHours = { open: string; close: string } | null;
type BusinessHours = Record<DayKey, DayHours>;

interface OnboardingState {
  ok: true;
  business_id: string;
  name: string;
  billing_email: string;
  industry: string | null;
  website: string | null;
  timezone: string;
  languages: string[];
  business_hours: BusinessHours;
  receptionist_name: string;
  greeting: string;
  voice_persona: string | null;
  qualification_criteria: string | null;
  booking_policy: string | null;
}

type Status =
  | { kind: "loading" }
  | { kind: "ready"; state: OnboardingState }
  | { kind: "submitting"; state: OnboardingState }
  | { kind: "submitted" }
  | { kind: "completed_already" } // 410 from GET
  | { kind: "not_found" }
  | { kind: "error"; message: string };

export default function OnboardingPage() {
  const [, params] = useRoute<{ business_id: string }>("/onboarding/:business_id");
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.business_id) {
      setStatus({ kind: "not_found" });
      return;
    }
    let cancelled = false;
    fetch(`/api/onboarding/${encodeURIComponent(params.business_id)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) return setStatus({ kind: "not_found" });
        if (res.status === 410) return setStatus({ kind: "completed_already" });
        const body = (await res.json()) as Partial<OnboardingState> & { error?: string };
        if (!res.ok || !body.ok || !body.business_id) {
          return setStatus({
            kind: "error",
            message: body.error ?? `Error ${res.status}`,
          });
        }
        setStatus({ kind: "ready", state: body as OnboardingState });
      })
      .catch((e) =>
        cancelled
          ? undefined
          : setStatus({
              kind: "error",
              message: e instanceof Error ? e.message : "network error",
            }),
      );
    return () => {
      cancelled = true;
    };
  }, [params?.business_id]);

  const updateState = (patch: Partial<OnboardingState>) => {
    setStatus((s) =>
      s.kind === "ready" || s.kind === "submitting"
        ? { kind: s.kind, state: { ...s.state, ...patch } }
        : s,
    );
  };

  const updateDay = (day: DayKey, hours: DayHours) => {
    if (status.kind !== "ready" && status.kind !== "submitting") return;
    updateState({
      business_hours: { ...status.state.business_hours, [day]: hours },
    });
  };

  const submit = async () => {
    if (status.kind !== "ready") return;
    setErrorMsg(null);
    const s = status.state;
    setStatus({ kind: "submitting", state: s });
    try {
      const res = await fetch(`/api/onboarding/${encodeURIComponent(s.business_id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: s.name.trim(),
          industry: s.industry?.trim() || undefined,
          website: s.website?.trim() || "",
          timezone: s.timezone,
          languages: s.languages,
          business_hours: s.business_hours,
          receptionist_name: s.receptionist_name.trim(),
          greeting: s.greeting.trim(),
          voice_persona: s.voice_persona?.trim() || undefined,
          qualification_criteria: s.qualification_criteria?.trim() || undefined,
          booking_policy: s.booking_policy?.trim() || undefined,
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; details?: unknown };
      if (!res.ok || !body.ok) {
        setStatus({ kind: "ready", state: s });
        setErrorMsg(
          body.error === "validation_failed"
            ? "Faltan campos o tienen un formato inválido. Revisá los campos en rojo."
            : (body.error ?? `Error ${res.status}`),
        );
        return;
      }
      setStatus({ kind: "submitted" });
    } catch (e) {
      setStatus({ kind: "ready", state: s });
      setErrorMsg(e instanceof Error ? e.message : "Error de red");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {status.kind === "loading" && (
          <Card>
            <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
              Cargando…
            </CardContent>
          </Card>
        )}

        {status.kind === "not_found" && (
          <Card>
            <CardHeader>
              <CardTitle>Enlace no válido</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                No encontramos esta sesión de onboarding. Verificá que copiaste el enlace completo del correo de bienvenida.
              </p>
              <p>
                ¿Perdiste el correo?{" "}
                <a className="underline" href="/onboarding/resend">
                  Pedí un enlace nuevo aquí
                </a>.
              </p>
              <p className="text-sm">
                O escribinos a{" "}
                <a className="underline" href="mailto:hello@thynra.com">hello@thynra.com</a>.
              </p>
            </CardContent>
          </Card>
        )}

        {status.kind === "completed_already" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Ya completaste el onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Estamos terminando la configuración técnica de tu cuenta. Te avisamos por correo apenas Sofia esté activa (normalmente el mismo día).
            </CardContent>
          </Card>
        )}

        {status.kind === "submitted" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6 mr-2" />
                ¡Listo!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>Recibimos tus datos. Eugenio recibe una alerta automática y va a terminar la configuración (número de Sofia, dominio de correos, calendario) en las próximas horas.</p>
              <p>Te avisamos por correo cuando esté todo activo. Cualquier consulta:{" "}
                <a className="underline" href="mailto:hello@thynra.com">hello@thynra.com</a>.
              </p>
            </CardContent>
          </Card>
        )}

        {status.kind === "error" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Algo salió mal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              {status.message}
            </CardContent>
          </Card>
        )}

        {(status.kind === "ready" || status.kind === "submitting") && (
          <Card>
            <CardHeader>
              <CardTitle>Configurá tu AI Receptionist</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                5 minutos. Cuando termines, terminamos la configuración técnica y activamos a tu recepcionista.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business basics */}
              <section className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Tu negocio</h3>

                <div>
                  <Label htmlFor="name">Nombre del negocio*</Label>
                  <Input
                    id="name"
                    value={status.state.name}
                    onChange={(e) => updateState({ name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="industry">Rubro</Label>
                    <Input
                      id="industry"
                      placeholder="Ej. Odontología, Spa, Consultorio"
                      value={status.state.industry ?? ""}
                      onChange={(e) => updateState({ industry: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio web (opcional)</Label>
                    <Input
                      id="website"
                      placeholder="https://"
                      value={status.state.website ?? ""}
                      onChange={(e) => updateState({ website: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Input
                    id="timezone"
                    value={status.state.timezone}
                    onChange={(e) => updateState({ timezone: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Por defecto: America/Costa_Rica</p>
                </div>

                <div>
                  <Label>Idiomas que Sofia debe hablar*</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={status.state.languages.includes("es")}
                        onCheckedChange={(checked) => {
                          const next = new Set(status.state.languages);
                          if (checked) next.add("es"); else next.delete("es");
                          updateState({ languages: Array.from(next) });
                        }}
                      />
                      Español
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={status.state.languages.includes("en")}
                        onCheckedChange={(checked) => {
                          const next = new Set(status.state.languages);
                          if (checked) next.add("en"); else next.delete("en");
                          updateState({ languages: Array.from(next) });
                        }}
                      />
                      Inglés
                    </label>
                  </div>
                </div>
              </section>

              {/* Hours */}
              <section className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Horarios</h3>
                {DAYS.map(({ key, label }) => {
                  const hrs = status.state.business_hours[key];
                  const isOpen = hrs !== null;
                  return (
                    <div key={key} className="grid grid-cols-[80px_60px_1fr_1fr] gap-2 items-center">
                      <span className="text-sm">{label}</span>
                      <Checkbox
                        checked={isOpen}
                        onCheckedChange={(checked) =>
                          updateDay(key, checked ? { open: "09:00", close: "17:00" } : null)
                        }
                      />
                      <Input
                        type="time"
                        disabled={!isOpen}
                        value={hrs?.open ?? ""}
                        onChange={(e) => isOpen && updateDay(key, { open: e.target.value, close: hrs!.close })}
                      />
                      <Input
                        type="time"
                        disabled={!isOpen}
                        value={hrs?.close ?? ""}
                        onChange={(e) => isOpen && updateDay(key, { open: hrs!.open, close: e.target.value })}
                      />
                    </div>
                  );
                })}
              </section>

              {/* Receptionist */}
              <section className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Tu recepcionista</h3>

                <div>
                  <Label htmlFor="receptionist_name">Nombre de la recepcionista*</Label>
                  <Input
                    id="receptionist_name"
                    value={status.state.receptionist_name}
                    onChange={(e) => updateState({ receptionist_name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Por defecto "Sofia". Elegí algo que se sienta natural en los idiomas que seleccionaste.</p>
                </div>

                <div>
                  <Label htmlFor="greeting">Saludo inicial*</Label>
                  <Textarea
                    id="greeting"
                    rows={2}
                    placeholder="Hola, soy Sofia de [tu negocio], ¿en qué puedo ayudarte?"
                    value={status.state.greeting}
                    onChange={(e) => updateState({ greeting: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="voice_persona">Tono y personalidad (opcional)</Label>
                  <Textarea
                    id="voice_persona"
                    rows={3}
                    placeholder="Ej. Cálida y profesional, usa 'usted', menciona el nombre del paciente cuando sea posible."
                    value={status.state.voice_persona ?? ""}
                    onChange={(e) => updateState({ voice_persona: e.target.value })}
                  />
                </div>
              </section>

              {/* Sales/booking rules */}
              <section className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Reglas (opcional)</h3>

                <div>
                  <Label htmlFor="qualification_criteria">¿Qué hace que un lead sea bueno?</Label>
                  <Textarea
                    id="qualification_criteria"
                    rows={3}
                    placeholder="Ej. Pacientes nuevos para limpieza o ortodoncia. No tomamos urgencias odontológicas fuera de horario."
                    value={status.state.qualification_criteria ?? ""}
                    onChange={(e) => updateState({ qualification_criteria: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="booking_policy">Política de citas</Label>
                  <Textarea
                    id="booking_policy"
                    rows={3}
                    placeholder="Ej. Citas con 24h de anticipación. Las cancelaciones con menos de 6h cobran 50%."
                    value={status.state.booking_policy ?? ""}
                    onChange={(e) => updateState({ booking_policy: e.target.value })}
                  />
                </div>
              </section>

              {errorMsg && (
                <div className="border border-destructive/40 bg-destructive/5 text-destructive rounded-md p-3 text-sm">
                  {errorMsg}
                </div>
              )}

              <Button
                onClick={submit}
                disabled={status.kind === "submitting"}
                className="w-full"
              >
                {status.kind === "submitting" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enviar y activar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
