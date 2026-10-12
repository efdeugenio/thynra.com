import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EnterpriseHeader from "@/components/enterprise-header";
import Footer from "@/components/footer";
import { defineCopy, localePath, useCopy, useLocale } from "@/i18n";

// /security and /es/seguridad. Written for the person in IT who gets forwarded
// the enterprise page. Rule: only state what we actually do. No certifications,
// no uptime or response-time figures, no third-party audit claims. When a
// practice depends on the client's environment, say so instead of promising.
const copy = defineCopy({
  en: {
    eyebrow: "Security and data handling",
    title: "How we deploy AI agents, and what they can and cannot do.",
    intro:
      "This page is for the security and IT teams reviewing a project with Thynra. It describes the practices we apply by default. The specifics of each deployment are agreed in writing during the diagnostic, with your team.",
    sections: [
      {
        title: "Where it runs and where data lives",
        points: [
          "Agents are deployed in your organization's own cloud account, under your billing and your access controls.",
          "Models are reached through endpoints your team approves, over private connectivity where your provider supports it.",
          "Thynra does not keep a copy of your operational data. Test data used during the build is agreed with you and deleted at handover.",
          "Where you need it, data is separated by customer, country and business unit, and retrieval respects the permissions of the source system.",
        ],
      },
      {
        title: "Identity and access",
        points: [
          "Each agent has its own service identity. No shared or personal accounts.",
          "When an agent acts for a person, it uses delegated access with that person's permissions, never broader ones.",
          "Every tool an agent can use is on an explicit allow-list, and each call is checked against a policy before it runs.",
          "Credentials live in your secrets manager, never in code or configuration files, and are scoped to what each agent needs.",
          "Thynra's access to your environment is personal, time-bound and removed at the end of the engagement or whenever you decide.",
        ],
      },
      {
        title: "Human approval",
        points: [
          "Irreversible or external actions — filing with an authority, committing a price, releasing goods, moving money, sending on your behalf — are prepared by the agent and approved by a person.",
          "Approvers are assigned by role, and each approval is recorded with who, when and what was approved.",
          "Which actions require approval is defined with you, process by process, before the pilot starts.",
        ],
      },
      {
        title: "Untrusted input",
        points: [
          "Documents and messages from third parties are treated as untrusted. They can contain instructions designed to manipulate an AI model.",
          "The agent that reads external documents has no tools to send, write or approve. It returns structured data validated against a schema.",
          "A separate step, with separate permissions, decides what to do with that data.",
        ],
      },
      {
        title: "Logging and audit",
        points: [
          "Each run records who requested it, which agent acted, which model and version it used, which tools it called and with what result, and who approved.",
          "Logs are written to your logging and monitoring tools, under your retention policy.",
          "Every agent can be switched off independently, without affecting the rest.",
        ],
      },
      {
        title: "Quality before release",
        points: [
          "Each process has a set of test cases built from real (or realistic, anonymized) examples agreed with your team.",
          "Changes to prompts, tools or models are run against that set before reaching production.",
          "Code and infrastructure changes go through version control and review, in your repositories.",
        ],
      },
      {
        title: "Ownership and exit",
        points: [
          "The code, configuration and infrastructure-as-code are yours and live in your repositories.",
          "Handover includes documentation so your team can operate the system without us.",
          "The support subscription is optional. Ending it does not affect what is running.",
        ],
      },
      {
        title: "Certifications and questionnaires",
        points: [
          "Thynra does not hold SOC 2, ISO 27001 or similar certifications at this time.",
          "We sign an NDA before detailed conversations about your processes, and we complete your vendor security questionnaire as part of the diagnostic.",
        ],
      },
      {
        title: "Reporting a security concern",
        points: [
          "Write to hello@thynra.com with \"Security\" in the subject. For clients, the incident contact and process are agreed in the contract.",
        ],
      },
    ],
    ctaTitle: "Reviewing a project with us?",
    ctaBody: "We are happy to go through your questionnaire or architecture requirements on a call.",
    ctaLink: "Book a conversation",
  },
  es: {
    eyebrow: "Seguridad y manejo de datos",
    title: "Cómo desplegamos agentes de IA, y qué pueden y qué no pueden hacer.",
    intro:
      "Esta página es para los equipos de seguridad y TI que revisan un proyecto con Thynra. Describe las prácticas que aplicamos por defecto. Los detalles de cada despliegue se acuerdan por escrito durante el diagnóstico, con su equipo.",
    sections: [
      {
        title: "Dónde corre y dónde viven los datos",
        points: [
          "Los agentes se despliegan en la cuenta de nube de su organización, con su facturación y sus controles de acceso.",
          "Los modelos se consumen por endpoints que su equipo aprueba, por conexión privada cuando su proveedor la ofrece.",
          "Thynra no guarda copia de sus datos operativos. Los datos de prueba que se usan durante la construcción se acuerdan con ustedes y se eliminan en la entrega.",
          "Donde haga falta, los datos se separan por cliente, país y unidad de negocio, y las búsquedas respetan los permisos del sistema de origen.",
        ],
      },
      {
        title: "Identidad y acceso",
        points: [
          "Cada agente tiene su propia identidad de servicio. Nada de cuentas compartidas ni personales.",
          "Cuando un agente actúa por una persona, usa acceso delegado con los permisos de esa persona, nunca más amplios.",
          "Cada herramienta que un agente puede usar está en una lista explícita, y cada llamada se valida contra una política antes de ejecutarse.",
          "Las credenciales viven en su gestor de secretos, nunca en código ni en archivos de configuración, y se limitan a lo que cada agente necesita.",
          "El acceso de Thynra a su entorno es personal, temporal y se retira al terminar el proyecto o cuando ustedes lo decidan.",
        ],
      },
      {
        title: "Aprobación humana",
        points: [
          "Las acciones irreversibles o hacia afuera (presentar un trámite ante una autoridad, comprometer un precio, liberar mercancía, mover dinero, enviar a nombre de la empresa) las prepara el agente y las aprueba una persona.",
          "Los aprobadores se asignan por rol, y cada aprobación queda registrada con quién, cuándo y qué se aprobó.",
          "Qué acciones requieren aprobación se define con ustedes, proceso por proceso, antes de empezar el piloto.",
        ],
      },
      {
        title: "Información externa",
        points: [
          "Los documentos y mensajes de terceros se tratan como no confiables. Pueden traer instrucciones diseñadas para manipular a un modelo de IA.",
          "El agente que lee documentos externos no tiene herramientas para enviar, escribir ni aprobar. Devuelve datos estructurados y validados contra un esquema.",
          "Un paso aparte, con otros permisos, decide qué hacer con esos datos.",
        ],
      },
      {
        title: "Registro y auditoría",
        points: [
          "Cada ejecución registra quién la pidió, qué agente actuó, qué modelo y versión usó, qué herramientas llamó y con qué resultado, y quién aprobó.",
          "Los registros se escriben en sus herramientas de registro y monitoreo, con su política de retención.",
          "Cada agente se puede apagar por separado, sin afectar al resto.",
        ],
      },
      {
        title: "Calidad antes de cada cambio",
        points: [
          "Cada proceso tiene un conjunto de casos de prueba armado con ejemplos reales (o realistas y anonimizados) acordados con su equipo.",
          "Los cambios de instrucciones, herramientas o modelos se prueban contra ese conjunto antes de llegar a producción.",
          "Los cambios de código e infraestructura pasan por control de versiones y revisión, en sus repositorios.",
        ],
      },
      {
        title: "Propiedad y salida",
        points: [
          "El código, la configuración y la infraestructura como código son suyos y viven en sus repositorios.",
          "La entrega incluye documentación para que su equipo pueda operar el sistema sin nosotros.",
          "La suscripción de soporte es opcional. Terminarla no afecta lo que está funcionando.",
        ],
      },
      {
        title: "Certificaciones y cuestionarios",
        points: [
          "Thynra no cuenta por ahora con certificaciones SOC 2, ISO 27001 ni similares.",
          "Firmamos un acuerdo de confidencialidad antes de conversaciones detalladas sobre sus procesos, y respondemos su cuestionario de seguridad de proveedores como parte del diagnóstico.",
        ],
      },
      {
        title: "Reportar un problema de seguridad",
        points: [
          "Escriba a hello@thynra.com con \"Seguridad\" en el asunto. Para clientes, el contacto y el proceso ante incidentes se acuerdan en el contrato.",
        ],
      },
    ],
    ctaTitle: "¿Están evaluando un proyecto con nosotros?",
    ctaBody: "Podemos revisar su cuestionario o sus requisitos de arquitectura en una llamada.",
    ctaLink: "Agendar una conversación",
  },
});

export default function SecurityPage() {
  const t = useCopy(copy);
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t.eyebrow}</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-5 leading-tight" data-testid="text-security-title">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.intro}</p>
        </motion.header>

        <div className="mt-12 space-y-10">
          {t.sections.map((section) => (
            <section key={section.title} data-testid="security-section">
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5 marker:text-primary">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 bg-card border border-border rounded-xl p-8">
          <h2 className="text-xl font-bold mb-2">{t.ctaTitle}</h2>
          <p className="text-muted-foreground mb-4">{t.ctaBody}</p>
          <a href={`${localePath("/enterprise", locale)}#contact`} className="inline-flex items-center font-semibold text-primary hover:underline">
            {t.ctaLink}
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </a>
        </div>
      </main>
      <Footer variant="enterprise" />
    </div>
  );
}
