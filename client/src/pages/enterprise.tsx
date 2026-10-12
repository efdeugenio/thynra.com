import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileSearch,
  Fingerprint,
  KeyRound,
  Layers,
  Lock,
  Mail,
  Power,
  ScrollText,
  ServerCog,
  ShieldCheck,
  UserCheck,
  Workflow,
} from "lucide-react";
import EnterpriseHeader from "@/components/enterprise-header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { withLeadContext } from "@/lib/attribution";
import { defineCopy, localePath, useCopy, useLocale, useRouteHref } from "@/i18n";

// /enterprise and /es/empresas. Same method as the SMB home (one process to
// production, fixed scope, then the next) in the register an operations or IT
// lead reads: control, integration, audit. Rules for this page:
//   - No logos, client names, metrics or certifications we don't hold.
//   - Industry cards are labelled as examples of application, not case studies.
//   - Ownership: the client owns the code and the deployment; support is an
//     optional subscription. (Platform licensing is deliberately not offered.)
const copy = defineCopy({
  en: {
    eyebrow: "For operations and IT teams",
    title: "AI agents inside your real processes, with the control your IT team requires.",
    subtitle:
      "We take one process to production, connected to the systems you already run and measured against a baseline you agree with. Then we scale on the same foundation, one process at a time.",
    primaryCta: "Book a diagnostic conversation",
    secondaryCta: "How we handle security",

    problemEyebrow: "The problem",
    problemTitle: "Most AI pilots never leave the demo.",
    problems: [
      {
        title: "Security can't approve it",
        body: "Shared credentials, data sent who knows where, no record of what the agent did. The pilot dies in the security review, not in the business case.",
      },
      {
        title: "It doesn't touch the real systems",
        body: "The demo works on a spreadsheet. Production lives in your ERP, your TMS, your document repository — and nobody planned that integration.",
      },
      {
        title: "Nobody owns what happens next",
        body: "A vendor ships a prototype and moves on. When the model changes or a process shifts, nobody is watching, measuring or fixing it.",
      },
    ],

    methodEyebrow: "How we work",
    methodTitle: "You don't need an AI transformation. You need one process in production.",
    methodSubtitle:
      "The same staircase we use with small businesses, sized for an organization: each step has a fixed scope, a date and a deliverable you keep whether or not we continue.",
    steps: [
      {
        when: "2–4 weeks · fixed price",
        title: "Diagnostic",
        body: "We map the candidate processes with operations and IT, review your systems and access, and choose the one with the clearest return and the lowest risk. You get a written architecture, a prioritized roadmap and a baseline to measure against.",
      },
      {
        when: "Paid by milestone",
        title: "Pilot: one process to production",
        body: "One process, inside your environment, connected to the real systems and with human approval where it matters. Payment is tied to milestones — a working demo, then acceptance — not to hours.",
      },
      {
        when: "Process by process",
        title: "Scale on the same foundation",
        body: "The identity, approvals and audit trail built for the first process are reused by the next one. That is why the second process costs less than the first.",
      },
      {
        when: "Optional · monthly",
        title: "Support and operation",
        body: "Monitoring, continuous evaluation, adjustments when your processes or the models change, and new playbooks. A subscription with defined scope and response times.",
      },
    ],

    controlEyebrow: "Built-in control",
    controlTitle: "What your IT team will ask, answered in the architecture.",
    controlSubtitle:
      "These are not features we add at the end. They are the conditions under which an agent gets deployed at all.",
    controls: [
      {
        title: "Its own identity per agent",
        body: "No shared accounts. Each agent authenticates as itself, and when it acts for a person it carries that person's permissions — never more.",
      },
      {
        title: "Least privilege, per tool",
        body: "An agent that reads shipment status cannot write to the system of record. Every tool call is checked against a policy, regardless of what the prompt says.",
      },
      {
        title: "Humans approve the irreversible",
        body: "Filing, committing a price, releasing goods, moving money: the agent prepares, a person with the right role approves, and the approval is recorded.",
      },
      {
        title: "External documents are untrusted",
        body: "The agent that reads invoices and emails from third parties has no tools to send or write. It hands over structured, validated data — so instructions hidden in a document have nowhere to go.",
      },
      {
        title: "Your data stays in your environment",
        body: "We deploy in your own cloud account, with models reached through private endpoints that your team approves. Separation by customer, country and business unit where you need it.",
      },
      {
        title: "Full audit trail and an off switch",
        body: "Who asked, which agent acted, which tools it called, who approved. And every agent can be switched off without touching the rest.",
      },
    ],
    securityLink: "Read how we handle security and data",

    examplesEyebrow: "Examples of application",
    examplesTitle: "Where agents usually start.",
    examplesNote:
      "Illustrative examples of the kind of process we take to production — not client case studies.",
    examples: [
      {
        sector: "Logistics and customs",
        items: [
          "Pre-validating commercial invoices before they reach the customs specialist: missing fields, inconsistencies, suggested tariff classification",
          "Shipment status for customers, limited to their own shipments",
          "Pickup scheduling and draft quotes for a person to approve",
        ],
      },
      {
        sector: "Health and regulated services",
        items: [
          "Intake and document checks before an appointment or a claim",
          "Scheduling, reminders and follow-up within your privacy rules",
          "Drafts for clinical or administrative staff, never sent unsupervised",
        ],
      },
      {
        sector: "Service operations",
        items: [
          "Classifying and routing incoming requests across email, portal and WhatsApp",
          "Internal assistant over your procedures and policies, with the same permissions as the source",
          "A weekly report assembled from scattered systems",
        ],
      },
    ],

    ownershipEyebrow: "Ownership",
    ownershipTitle: "What we build is yours.",
    ownershipBody:
      "The code, the configuration, the integrations and the deployment belong to your organization and live in your environment from day one. If you want us to keep it running, there is an optional support subscription. If you don't, your team takes it over with the documentation we hand over.",
    ownershipPoints: [
      "Code and infrastructure-as-code delivered to your repositories",
      "Deployed in your cloud account, under your billing",
      "Documentation and handover so your team can operate it",
      "Support subscription optional, never a condition",
    ],

    faqTitle: "Frequently asked questions",
    faqs: [
      {
        question: "Where does our data live?",
        answer:
          "In your environment. We deploy inside your own cloud account and use model endpoints your team approves, reached privately. Thynra does not keep a copy of your operational data. The specifics are agreed in the diagnostic, together with your security team.",
      },
      {
        question: "Which AI models do you use? Can we change them later?",
        answer:
          "We use models from providers your organization approves, and the architecture is designed so the model can be swapped without rebuilding the process. We don't tie a project to a single provider.",
      },
      {
        question: "How do you integrate with our existing systems?",
        answer:
          "Through the APIs and integration options your systems already offer, with service accounts scoped to what each agent needs. Whether a system exposes a usable integration is one of the first questions we answer in the diagnostic, because it changes the scope and the price of the pilot.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. Everything we build for your organization is delivered to your repositories and deployed in your environment. Support afterwards is an optional subscription.",
      },
      {
        question: "Do you sign NDAs and complete security questionnaires?",
        answer:
          "Yes. We sign an NDA before any detailed conversation about your processes and answer your vendor security questionnaire as part of the diagnostic.",
      },
      {
        question: "Do you have security certifications?",
        answer:
          "Not at this time, and we won't claim otherwise. What we offer instead is an architecture where your data stays in your environment under your own controls, and full transparency on how each agent is built and what it can do.",
      },
      {
        question: "What does it cost?",
        answer:
          "The diagnostic is a fixed price agreed before it starts. The pilot is priced by milestone once the diagnostic has defined the process and the integrations. Support is a monthly subscription with a defined scope. We don't sell open-ended hourly projects.",
      },
      {
        question: "Do you also work with small businesses?",
        answer:
          "Yes — it is the same method, packaged for an owner-operated business.",
        link: "See our small-business offer",
      },
    ],

    contactEyebrow: "Next step",
    contactTitle: "Tell us which process you have in mind.",
    contactSubtitle:
      "A 45-minute conversation with no cost or commitment. We'll tell you whether it is a good first candidate and what the diagnostic would cover.",
    form: {
      name: "Name *",
      email: "Work email *",
      company: "Company *",
      role: "Role",
      process: "Which process would you like to start with? *",
      processPlaceholder:
        "What happens today, who does it, roughly how much volume. Any detail helps.",
      systems: "Main systems involved",
      systemsPlaceholder: "e.g. ERP, TMS, CRM, document repository, email",
      submit: "Request the conversation",
      sending: "Sending...",
      orEmail: "Or write to us at",
    },
    successTitle: "Request received.",
    successDescription: "We'll reply within one business day to set a time.",
    errorTitle: "Something went wrong.",
    errorDescription: "Please try again or email hello@thynra.com directly.",
    validationTitle: "Please check the form",
    validation: {
      name: "Name must be at least 2 characters",
      email: "Please enter a valid email",
      company: "Please tell us the company",
      process: "Please describe the process in a few words",
    },
  },
  es: {
    eyebrow: "Para equipos de operaciones y TI",
    title: "Agentes de IA dentro de sus procesos reales, con el control que exige su equipo de TI.",
    subtitle:
      "Llevamos un proceso a producción, conectado a los sistemas que ya usan y medido contra una línea base acordada. Después escalamos sobre la misma base, un proceso a la vez.",
    primaryCta: "Agendar una conversación de diagnóstico",
    secondaryCta: "Cómo manejamos la seguridad",

    problemEyebrow: "El problema",
    problemTitle: "La mayoría de los pilotos de IA nunca salen de la demo.",
    problems: [
      {
        title: "Seguridad no lo puede aprobar",
        body: "Credenciales compartidas, datos enviados quién sabe a dónde, ningún registro de lo que hizo el agente. El piloto muere en la revisión de seguridad, no en el caso de negocio.",
      },
      {
        title: "No toca los sistemas reales",
        body: "La demo funciona sobre una hoja de cálculo. La producción vive en su ERP, su TMS o su repositorio de documentos, y nadie planeó esa integración.",
      },
      {
        title: "Nadie se hace cargo de lo que sigue",
        body: "Un proveedor entrega un prototipo y se va. Cuando cambia el modelo o cambia el proceso, nadie lo está vigilando, midiendo ni corrigiendo.",
      },
    ],

    methodEyebrow: "Cómo trabajamos",
    methodTitle: "No necesitan una transformación con IA. Necesitan un proceso en producción.",
    methodSubtitle:
      "La misma escalera que usamos con pymes, dimensionada para una organización: cada paso tiene alcance fijo, fecha y un entregable que queda en sus manos, sigamos o no.",
    steps: [
      {
        when: "2 a 4 semanas · precio fijo",
        title: "Diagnóstico",
        body: "Mapeamos con operaciones y TI los procesos candidatos, revisamos sistemas y accesos, y elegimos el de retorno más claro y menor riesgo. Reciben una arquitectura por escrito, una hoja de ruta priorizada y una línea base para medir.",
      },
      {
        when: "Pago por hitos",
        title: "Piloto: un proceso en producción",
        body: "Un proceso, dentro de su entorno, conectado a los sistemas reales y con aprobación humana donde importa. El pago va atado a hitos (demostración funcional y aceptación), no a horas.",
      },
      {
        when: "Proceso por proceso",
        title: "Escalar sobre la misma base",
        body: "La identidad, las aprobaciones y la trazabilidad que se construyeron para el primer proceso las reutiliza el siguiente. Por eso el segundo proceso cuesta menos que el primero.",
      },
      {
        when: "Opcional · mensual",
        title: "Soporte y operación",
        body: "Monitoreo, evaluación continua, ajustes cuando cambian sus procesos o los modelos, y nuevos flujos. Una suscripción con alcance y tiempos de respuesta definidos.",
      },
    ],

    controlEyebrow: "Control desde el diseño",
    controlTitle: "Lo que va a preguntar su equipo de TI, resuelto en la arquitectura.",
    controlSubtitle:
      "No son funciones que se agregan al final. Son las condiciones para que un agente se despliegue.",
    controls: [
      {
        title: "Identidad propia para cada agente",
        body: "Nada de cuentas compartidas. Cada agente se autentica como sí mismo y, cuando actúa por una persona, lleva los permisos de esa persona y nunca más.",
      },
      {
        title: "Mínimo privilegio por herramienta",
        body: "Un agente que consulta el estado de un embarque no puede escribir en el sistema principal. Cada llamada a una herramienta se valida contra una política, diga lo que diga el prompt.",
      },
      {
        title: "Lo irreversible lo aprueba una persona",
        body: "Presentar un trámite, comprometer un precio, liberar mercancía o mover dinero: el agente prepara, una persona con el rol correcto aprueba y la aprobación queda registrada.",
      },
      {
        title: "Los documentos externos no son de confianza",
        body: "El agente que lee facturas y correos de terceros no tiene herramientas para enviar ni para escribir. Entrega datos estructurados y validados, así que una instrucción escondida en un documento no tiene a dónde ir.",
      },
      {
        title: "Sus datos se quedan en su entorno",
        body: "Desplegamos en la cuenta de nube de su organización, con modelos aprobados por su equipo y accedidos por conexión privada. Separación por cliente, país y unidad de negocio donde haga falta.",
      },
      {
        title: "Trazabilidad completa y botón de apagado",
        body: "Quién lo pidió, qué agente actuó, qué herramientas usó y quién aprobó. Y cada agente se puede apagar sin tocar el resto.",
      },
    ],
    securityLink: "Ver cómo manejamos la seguridad y los datos",

    examplesEyebrow: "Ejemplos de aplicación",
    examplesTitle: "Por dónde suelen empezar los agentes.",
    examplesNote:
      "Ejemplos ilustrativos del tipo de proceso que llevamos a producción. No son casos de clientes.",
    examples: [
      {
        sector: "Logística y aduanas",
        items: [
          "Prevalidación de facturas comerciales antes de que lleguen al especialista aduanero: campos faltantes, inconsistencias y clasificación arancelaria sugerida",
          "Estado de embarques para clientes, limitado a sus propios embarques",
          "Agenda de recolectas y borradores de cotización para que una persona apruebe",
        ],
      },
      {
        sector: "Salud y servicios regulados",
        items: [
          "Recepción y revisión de documentos antes de una cita o un reclamo",
          "Agenda, recordatorios y seguimiento dentro de sus reglas de privacidad",
          "Borradores para personal clínico o administrativo, nunca enviados sin supervisión",
        ],
      },
      {
        sector: "Operaciones de servicio",
        items: [
          "Clasificación y ruteo de solicitudes entrantes por correo, portal y WhatsApp",
          "Asistente interno sobre sus procedimientos y políticas, con los mismos permisos que la fuente",
          "Un reporte semanal armado desde sistemas dispersos",
        ],
      },
    ],

    ownershipEyebrow: "Propiedad",
    ownershipTitle: "Lo que construimos es suyo.",
    ownershipBody:
      "El código, la configuración, las integraciones y el despliegue pertenecen a su organización y viven en su entorno desde el primer día. Si quieren que lo mantengamos funcionando, hay una suscripción de soporte opcional. Si no, su equipo lo asume con la documentación que entregamos.",
    ownershipPoints: [
      "Código e infraestructura como código entregados en sus repositorios",
      "Desplegado en su cuenta de nube y con su facturación",
      "Documentación y traspaso para que su equipo lo pueda operar",
      "Suscripción de soporte opcional, nunca una condición",
    ],

    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "¿Dónde viven nuestros datos?",
        answer:
          "En su entorno. Desplegamos dentro de la cuenta de nube de su organización y usamos modelos que su equipo aprueba, accedidos por conexión privada. Thynra no guarda copia de sus datos operativos. Los detalles se acuerdan en el diagnóstico, junto con su equipo de seguridad.",
      },
      {
        question: "¿Qué modelos de IA usan? ¿Se pueden cambiar después?",
        answer:
          "Usamos modelos de proveedores que su organización aprueba, y la arquitectura está pensada para cambiar el modelo sin reconstruir el proceso. No atamos un proyecto a un solo proveedor.",
      },
      {
        question: "¿Cómo se integran con nuestros sistemas?",
        answer:
          "Por las APIs y opciones de integración que sus sistemas ya ofrecen, con cuentas de servicio limitadas a lo que cada agente necesita. Si un sistema tiene o no una integración utilizable es de las primeras preguntas que respondemos en el diagnóstico, porque cambia el alcance y el precio del piloto.",
      },
      {
        question: "¿De quién es el código?",
        answer:
          "De ustedes. Todo lo que construimos para su organización se entrega en sus repositorios y se despliega en su entorno. El soporte posterior es una suscripción opcional.",
      },
      {
        question: "¿Firman acuerdos de confidencialidad y cuestionarios de seguridad?",
        answer:
          "Sí. Firmamos un acuerdo de confidencialidad antes de cualquier conversación detallada sobre sus procesos, y respondemos su cuestionario de seguridad de proveedores como parte del diagnóstico.",
      },
      {
        question: "¿Tienen certificaciones de seguridad?",
        answer:
          "Por ahora no, y no vamos a decir lo contrario. Lo que ofrecemos es una arquitectura donde sus datos se quedan en su entorno, bajo sus propios controles, y total transparencia sobre cómo está construido cada agente y qué puede hacer.",
      },
      {
        question: "¿Cuánto cuesta?",
        answer:
          "El diagnóstico tiene un precio fijo acordado antes de empezar. El piloto se cotiza por hitos una vez que el diagnóstico definió el proceso y las integraciones. El soporte es una suscripción mensual con alcance definido. No vendemos proyectos por horas sin límite.",
      },
      {
        question: "¿También trabajan con pymes?",
        answer: "Sí. Es el mismo método, empaquetado para un negocio manejado por su dueño.",
        link: "Ver la oferta para pymes",
      },
    ],

    contactEyebrow: "Siguiente paso",
    contactTitle: "Cuéntenos qué proceso tienen en mente.",
    contactSubtitle:
      "Una conversación de 45 minutos, sin costo ni compromiso. Les decimos si es un buen primer candidato y qué cubriría el diagnóstico.",
    form: {
      name: "Nombre *",
      email: "Correo de trabajo *",
      company: "Empresa *",
      role: "Cargo",
      process: "¿Con qué proceso les gustaría empezar? *",
      processPlaceholder:
        "Qué pasa hoy, quién lo hace y cuánto volumen tiene, aproximadamente. Cualquier detalle ayuda.",
      systems: "Sistemas principales involucrados",
      systemsPlaceholder: "Ej.: ERP, TMS, CRM, repositorio de documentos, correo",
      submit: "Solicitar la conversación",
      sending: "Enviando...",
      orEmail: "O escríbanos a",
    },
    successTitle: "Solicitud recibida.",
    successDescription: "Le respondemos en un día hábil para coordinar la hora.",
    errorTitle: "Algo salió mal.",
    errorDescription: "Inténtelo de nuevo o escríbanos directamente a hello@thynra.com.",
    validationTitle: "Revise el formulario",
    validation: {
      name: "El nombre debe tener al menos 2 caracteres",
      email: "Ingrese un correo válido",
      company: "Indíquenos la empresa",
      process: "Describa el proceso en pocas palabras",
    },
  },
});

type EnterpriseCopy = (typeof copy)["en"];

const PROBLEM_ICONS = [ShieldCheck, ServerCog, Workflow];
const STEP_ICONS = [FileSearch, ClipboardCheck, Layers, Power];
const CONTROL_ICONS = [Fingerprint, KeyRound, UserCheck, Lock, ServerCog, ScrollText];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div className="text-center mb-14" {...fade}>
      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-3">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 max-w-3xl mx-auto">{title}</h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}

function makeSchema(v: EnterpriseCopy["validation"]) {
  return z.object({
    name: z.string().trim().min(2, v.name),
    email: z.string().trim().email(v.email),
    company: z.string().trim().min(2, v.company),
    role: z.string().optional(),
    process: z.string().trim().min(10, v.process),
    systems: z.string().optional(),
  });
}

type EnterpriseForm = z.infer<ReturnType<typeof makeSchema>>;
const EMPTY: EnterpriseForm = { name: "", email: "", company: "", role: "", process: "", systems: "" };

function EnterpriseContact({ t }: { t: EnterpriseCopy }) {
  const locale = useLocale();
  const { toast } = useToast();
  const [form, setForm] = useState<EnterpriseForm>(EMPTY);
  const schema = makeSchema(t.validation);

  const mutation = useMutation({
    mutationFn: (data: EnterpriseForm) =>
      apiRequest(
        "POST",
        "/api/contact",
        withLeadContext(
          {
            kind: "enterprise",
            name: data.name,
            email: data.email,
            company: data.company,
            role: data.role,
            systems: data.systems,
            message: data.process,
          },
          locale,
        ),
      ),
    onSuccess: () => {
      toast({ title: t.successTitle, description: t.successDescription });
      setForm(EMPTY);
    },
    onError: () => {
      toast({ title: t.errorTitle, description: t.errorDescription, variant: "destructive" });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: t.validationTitle, description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    mutation.mutate(parsed.data);
  };

  const field = (key: keyof EnterpriseForm) => ({
    value: form[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <section id="contact" className="py-20 bg-background scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={t.contactEyebrow} title={t.contactTitle} subtitle={t.contactSubtitle} />
        <motion.div {...fade}>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={submit} className="space-y-5" data-testid="form-enterprise">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.name}</label>
                    <Input {...field("name")} required autoComplete="name" data-testid="input-enterprise-name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.email}</label>
                    <Input type="email" {...field("email")} required autoComplete="email" data-testid="input-enterprise-email" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.company}</label>
                    <Input {...field("company")} required autoComplete="organization" data-testid="input-enterprise-company" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.form.role}</label>
                    <Input {...field("role")} autoComplete="organization-title" data-testid="input-enterprise-role" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.process}</label>
                  <Textarea
                    {...field("process")}
                    placeholder={t.form.processPlaceholder}
                    rows={5}
                    required
                    data-testid="textarea-enterprise-process"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.form.systems}</label>
                  <Input {...field("systems")} placeholder={t.form.systemsPlaceholder} data-testid="input-enterprise-systems" />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-bg text-white py-3 rounded-lg font-semibold"
                  disabled={mutation.isPending}
                  data-testid="button-submit-enterprise"
                >
                  {mutation.isPending ? t.form.sending : t.form.submit}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {t.form.orEmail}{" "}
                  <a href="mailto:hello@thynra.com" className="text-primary hover:underline inline-flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    hello@thynra.com
                  </a>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function EnterpriseFAQ({ t }: { t: EnterpriseCopy }) {
  const [open, setOpen] = useState<number | null>(null);
  const locale = useLocale();
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 className="text-4xl font-bold text-center mb-14" {...fade}>
          {t.faqTitle}
        </motion.h2>
        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <div key={faq.question} className="bg-card border border-border rounded-lg" data-testid={`enterprise-faq-${index}`}>
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-muted transition-colors"
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                <ChevronDown
                  className={`text-muted-foreground transform transition-transform flex-shrink-0 ${open === index ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      <p>{faq.answer}</p>
                      {"link" in faq && faq.link && (
                        <Link href={`~${localePath("/", locale)}`} className="inline-flex items-center mt-3 font-medium text-primary hover:underline">
                          {faq.link}
                          <ArrowRight className="ml-1.5 w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EnterprisePage() {
  const t = useCopy(copy);
  const securityHref = useRouteHref("/security");

  // Arriving from another page at /enterprise#contact: the SPA renders after
  // the browser's own anchor jump, so scroll once the section exists.
  useEffect(() => {
    if (window.location.hash !== "#contact") return;
    const id = window.setTimeout(() => document.getElementById("contact")?.scrollIntoView(), 50);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-muted to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            data-testid="text-enterprise-eyebrow"
          >
            {t.eyebrow}
          </motion.span>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="text-enterprise-title"
          >
            {t.title}
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.subtitle}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button asChild className="gradient-bg text-white px-6 py-3 h-auto max-w-full whitespace-normal text-center rounded-lg text-base font-semibold" data-testid="button-enterprise-hero-cta">
              <a href="#contact">
                {t.primaryCta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Link href={securityHref} className="inline-flex items-center font-semibold text-primary hover:underline" data-testid="link-enterprise-hero-security">
              <ShieldCheck className="mr-1.5 w-4 h-4" />
              {t.secondaryCta}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={t.problemEyebrow} title={t.problemTitle} />
          <div className="grid md:grid-cols-3 gap-6">
            {t.problems.map((p, i) => {
              const Icon = PROBLEM_ICONS[i];
              return (
                <motion.div key={p.title} className="bg-card border border-border rounded-xl p-8" {...fade} transition={{ duration: 0.6, delay: i * 0.1 }}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Method */}
      <section id="how" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={t.methodEyebrow} title={t.methodTitle} subtitle={t.methodSubtitle} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <motion.div key={s.title} className="bg-card border border-border rounded-xl p-8" {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} data-testid={`card-enterprise-step-${i + 1}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="text-xs text-primary uppercase tracking-wide font-semibold mb-2">{s.when}</p>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Control */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={t.controlEyebrow} title={t.controlTitle} subtitle={t.controlSubtitle} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.controls.map((c, i) => {
              const Icon = CONTROL_ICONS[i];
              return (
                <motion.div key={c.title} className="bg-card border border-border rounded-xl p-8" {...fade} transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{c.body}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href={securityHref} className="inline-flex items-center font-semibold text-primary hover:underline">
              {t.securityLink}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={t.examplesEyebrow} title={t.examplesTitle} subtitle={t.examplesNote} />
          <div className="grid md:grid-cols-3 gap-6">
            {t.examples.map((ex, i) => (
              <motion.div key={ex.sector} className="bg-card border border-border rounded-xl p-8" {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} data-testid={`card-enterprise-example-${i + 1}`}>
                <h3 className="text-xl font-bold mb-4">{ex.sector}</h3>
                <ul className="space-y-3 text-sm text-foreground">
                  {ex.items.map((item) => (
                    <li key={item} className="flex items-start">
                      <Check className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ownership */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="bg-card border border-border rounded-xl p-8 sm:p-10" {...fade} data-testid="card-enterprise-ownership">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t.ownershipEyebrow}</span>
            <h2 className="text-3xl font-bold mt-2 mb-4">{t.ownershipTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{t.ownershipBody}</p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-foreground">
              {t.ownershipPoints.map((point) => (
                <li key={point} className="flex items-start">
                  <Check className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <EnterpriseFAQ t={t} />
      <EnterpriseContact t={t} />
      <Footer />
    </div>
  );
}
