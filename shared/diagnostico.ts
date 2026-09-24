// Diagnóstico Express — the first paid yes on Thynra's ladder
// (personal-brand/launch-6m.md §M3, positioning-progressive-adoption.md step 5).
//
// The owner describes the process that costs them the most; we reply with a
// recorded ~5-minute video over WhatsApp: the three things we'd automate
// first, in order, and what each is worth to them.
//
// This file is the single source of truth for the offer's terms. The page
// renders them and the Worker charges them, so a price change is one edit here.
//
// Spanish only: the traffic comes from the Spanish channel, and the buyer is
// charged in colones with CR IVA included. An English version would need its
// own currency and tax treatment (exports of services are 0% IVA, Ley 9635).

export const DIAGNOSTICO = {
  slug: "diagnostico-express",
  /** Onvo metadata tag; the webhook only acts on sessions carrying it. */
  product: "diagnostico_express",
  /** Charged amount, IVA 13% included. Onvo has no tax engine. */
  priceCRC: 19_900,
  ivaRate: 0.13,
  /** Business days from payment to the video landing in WhatsApp. */
  deliveryDays: 3,
  videoMinutes: 5,
} as const;

/** Colones → Onvo minor units (céntimos). */
export function diagnosticoAmountMinor(): number {
  return DIAGNOSTICO.priceCRC * 100;
}

/** Net + IVA split of the IVA-inclusive price, for the operator's records. */
export function diagnosticoTaxSplit(): { net: number; iva: number } {
  const net = Math.round(DIAGNOSTICO.priceCRC / (1 + DIAGNOSTICO.ivaRate));
  return { net, iva: DIAGNOSTICO.priceCRC - net };
}

export function formatCRC(amount: number): string {
  return `₡${amount.toLocaleString("es-CR")}`;
}

// Intake limits, enforced in the browser and again in the Worker. The process
// description is carried in Onvo metadata (values max 500 chars, 50 keys), so
// it is split into 500-char chunks there.
export const INTAKE_LIMITS = {
  name: 120,
  email: 200,
  whatsapp: 30,
  business: 160,
  tools: 300,
  processMin: 40,
  processMax: 2000,
} as const;

export const METADATA_CHUNK = 500;
