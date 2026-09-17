import { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, CheckCircle2, Download, FileText, Mail, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { findResource } from "@shared/resources";
import { withLeadContext } from "@/lib/attribution";
import NotFound from "@/pages/not-found";

// Lead-magnet page: thynra.com/es/recursos/<slug>. Spanish only, because the
// traffic comes from the Spanish YouTube channel. Content comes from
// shared/resources.ts; the Worker validates the slug and sends the email.

type Phase = "form" | "sending" | "done";

export default function ResourcePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const resource = findResource(slug);
  const preview = new URLSearchParams(window.location.search).has("preview");
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  if (!resource || (resource.status === "draft" && !preview)) return <NotFound />;

  const waitlist = resource.status !== "available";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: "Revisa tu correo", description: "Escribe un correo válido para enviarte el recurso.", variant: "destructive" });
      return;
    }
    setPhase("sending");
    try {
      const res = await fetch(`/api/resources/${resource.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withLeadContext({ name: name.trim(), email: email.trim(), preview }, "es")),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "No se pudo enviar");
      setFileUrl(typeof data?.fileUrl === "string" ? data.fileUrl : null);
      setPhase("done");
    } catch {
      setPhase("form");
      toast({
        title: "No pudimos registrar tu correo",
        description: "Inténtalo de nuevo en un momento o escríbenos a hello@thynra.com.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Thynra
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">Recurso gratis</span>
        </div>
      </div>

      {preview && resource.status === "draft" && (
        <div className="bg-amber-100 text-amber-900 text-sm text-center py-2 px-4" role="status">
          Vista previa: este recurso está en borrador y no es visible para el público.
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] items-start">
        <section>
          {resource.video && (
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-5">
              <PlayCircle className="w-4 h-4 text-primary" />
              Complementa el video: <span className="text-foreground">{resource.video}</span>
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5 [text-wrap:balance]" data-testid="text-resource-title">
            {resource.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl">{resource.promise}</p>

          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Qué incluye</h2>
          <ul className="space-y-3 mb-8">
            {resource.includes.map((item) => (
              <li key={item} className="flex gap-3 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-primary flex-none mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            {resource.format}
          </p>
        </section>

        <aside className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-8">
          {phase !== "done" ? (
            <form onSubmit={submit} className="grid gap-4" noValidate>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {waitlist ? "Recíbelo apenas esté listo" : "Recíbelo gratis"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {waitlist
                    ? "Lo estamos terminando. Déjanos tu correo y te lo enviamos el día que salga."
                    : "Te lo enviamos a tu correo y también puedes descargarlo aquí mismo."}
                </p>
              </div>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Nombre <span className="text-muted-foreground font-normal">(opcional)</span></span>
                <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" data-testid="input-resource-name" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-foreground">Correo</span>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="tu@negocio.com"
                  data-testid="input-resource-email"
                />
              </label>
              <Button type="submit" disabled={phase === "sending"} className="gradient-bg text-white font-semibold" data-testid="button-resource-submit">
                <Mail className="w-4 h-4 mr-2" />
                {phase === "sending" ? "Enviando…" : waitlist ? "Avísame cuando salga" : "Enviarme el recurso"}
              </Button>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Te escribiremos solo sobre este recurso y contenido relacionado; puedes darte de baja en cualquier correo.
                Consulta la <Link href="/privacy" className="underline hover:text-primary">política de privacidad</Link>.
              </p>
            </form>
          ) : (
            <div className="grid gap-4" role="status" data-testid="resource-done">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {waitlist ? "Listo, te avisamos" : "Listo, revisa tu correo"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {waitlist
                  ? `Te enviaremos “${resource.title}” a ${email} en cuanto esté terminado.`
                  : `También te lo enviamos a ${email}.`}
              </p>
              {fileUrl && (
                <Button asChild className="gradient-bg text-white font-semibold">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar ahora
                  </a>
                </Button>
              )}
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-sm text-foreground font-medium mb-2">Mientras tanto</p>
                <p className="text-sm text-muted-foreground mb-3">
                  En 2 minutos te decimos dónde está perdiendo clientes tu negocio y por dónde empezar.
                </p>
                <Link href="/quiz" className="text-sm font-semibold text-primary hover:underline">
                  Hacer el diagnóstico gratis →
                </Link>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
