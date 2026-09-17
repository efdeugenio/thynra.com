// Lead-magnet registry for thynra.com/es/recursos/<slug>.
//
// One entry per resource promised in a YouTube video (see
// personal-brand/youtube-channel-strategy.md §Step 5). The client renders the
// page from this entry and the Worker validates requests against it, so adding
// a resource is one object here plus (optionally) a file in client/public.
//
// Status:
//   draft      page returns 404 unless ?preview=1; the API rejects requests
//   waitlist   page captures the email and promises to send it when ready
//   available  page captures the email, then shows and emails the download link
//
// Never publish a resource as "available" before the file exists.

export type ResourceStatus = "draft" | "waitlist" | "available";

export interface Resource {
  slug: string;
  locale: "es";
  status: ResourceStatus;
  /** What the viewer gets, as they'd say it. Used as the page H1 and email subject. */
  title: string;
  /** One sentence: why they want it right after the video. */
  promise: string;
  /** Three to five concrete things inside. */
  includes: string[];
  /** e.g. "PDF · 2 páginas", "Hoja de cálculo". */
  format: string;
  /** The video this resource extends (working title), shown as context. */
  video?: string;
  /** Public path or absolute URL of the file, required when status is "available". */
  fileUrl?: string;
}

export const RESOURCES: Resource[] = [
  {
    slug: "agente-gratis-de-whatsapp",
    locale: "es",
    status: "draft",
    title: "¿Te alcanza el agente de IA gratis de WhatsApp? 12 preguntas para decidir",
    promise:
      "Antes de configurar el agente de Meta en tu negocio, revisa si cubre lo que tus clientes realmente preguntan y dónde vas a necesitar algo más.",
    includes: [
      "12 preguntas para evaluar tu caso en 10 minutos",
      "Las situaciones donde el agente gratis se queda corto",
      "Qué revisar antes de dejarlo respondiendo solo",
    ],
    format: "PDF · 2 páginas",
    video: "Probé el agente de IA gratis de WhatsApp en un negocio real",
  },
  {
    slug: "hoja-de-diagnostico",
    locale: "es",
    status: "draft",
    title: "La hoja de diagnóstico que usamos en negocios reales",
    promise:
      "La misma hoja que usamos para encontrar dónde se le escapan los clientes a un negocio, antes de automatizar nada.",
    includes: [
      "El recorrido del cliente en tres tramos: te encuentran, te responden, vuelven",
      "Qué medir en cada tramo durante una semana",
      "Cómo elegir el primer proceso que vale la pena automatizar",
    ],
    format: "PDF · 1 página",
    video: "Visité un negocio y le dejé un agente de IA respondiendo su WhatsApp",
  },
  {
    slug: "claude-para-pymes",
    locale: "es",
    status: "draft",
    title: "10 proyectos de Claude para dueños de negocio",
    promise: "Las instrucciones listas para copiar de cada proyecto del curso, para armarlos en tu propia cuenta.",
    includes: [
      "10 proyectos con sus instrucciones completas",
      "Qué archivos cargar en cada uno",
      "Errores comunes y cómo evitarlos",
    ],
    format: "Documento de texto",
    video: "Claude para PYMEs: curso completo para dueños de negocio",
  },
  {
    slug: "plantilla-agente-whatsapp",
    locale: "es",
    status: "draft",
    title: "Plantilla: lo que tu agente de WhatsApp debe saber responder",
    promise:
      "La estructura que usamos para que un agente de IA responda bien a tus clientes y sepa cuándo pasarle la conversación a una persona.",
    includes: [
      "Las preguntas frecuentes que todo negocio de citas debe cubrir",
      "Lo que el agente nunca debe decir",
      "Reglas de traspaso a una persona",
    ],
    format: "Hoja de cálculo",
    video: "Construí un agente de IA que agenda citas por WhatsApp",
  },
  {
    slug: "reporte-semanal-del-dueno",
    locale: "es",
    status: "draft",
    title: "Plantilla del reporte semanal del dueño",
    promise: "Los números que conviene ver cada lunes, y cómo pedirle a la IA que los arme con tus propios datos.",
    includes: [
      "Los indicadores del reporte y de dónde sale cada uno",
      "La instrucción para generarlo con Claude",
      "Un ejemplo con datos ficticios",
    ],
    format: "Hoja de cálculo + instrucciones",
    video: "Le di a Claude los números de un negocio",
  },
  {
    slug: "que-te-encuentren-en-google-y-en-la-ia",
    locale: "es",
    status: "draft",
    title: "Que te encuentren en Google y en la IA: 15 pasos para negocios locales",
    promise:
      "Los pasos, ordenados por impacto, para aparecer en Google Maps y en las respuestas de ChatGPT y Gemini cuando alguien busca un negocio como el tuyo.",
    includes: [
      "Perfil de Google: lo que sí mueve la posición",
      "Reseñas: cómo pedirlas y responderlas sin sonar a robot",
      "Qué necesita tu sitio para que la IA te mencione",
    ],
    format: "Guía web",
  },
];

export function findResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

/** A resource the public can see (draft pages only render with ?preview=1). */
export function isPublic(resource: Resource): boolean {
  return resource.status !== "draft";
}
