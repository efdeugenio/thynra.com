import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

/**
 * Onboarding-link recovery page.
 *
 * The customer lost the welcome email and wants the onboarding link
 * again. They enter their billing email and the server (anti-enumeration)
 * always returns the SAME confirmation regardless of whether the email
 * matched. If it matched + is eligible, the link reminder fires.
 *
 * URL: /onboarding/resend
 */
export default function OnboardingResendPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Tu correo es requerido.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding/resend-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      // Server returns ok:true regardless of whether the email matched
      // (anti-enumeration). Treat any 2xx as success.
      if (!res.ok) {
        setError(`Error ${res.status}. Intentá de nuevo en unos minutos.`);
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de red");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-md mx-auto">
        {submitted ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Listo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                Si encontramos una cuenta con ese correo y el onboarding aún
                no se ha completado, te enviamos el enlace en los próximos
                minutos.
              </p>
              <p>
                Si no llega en una hora, escribinos a{" "}
                <a className="underline" href="mailto:hello@thynra.com">
                  hello@thynra.com
                </a>{" "}
                y te ayudamos manualmente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Reenviar enlace de onboarding</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                ¿Perdiste el correo de bienvenida? Ingresá el correo con el
                que pagaste y te volvemos a enviar el enlace de
                configuración.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo de tu negocio</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@tunegocio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive border border-destructive/40 bg-destructive/5 rounded p-3">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Enviar enlace
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Por seguridad, no confirmamos si tu correo está registrado o no.
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
