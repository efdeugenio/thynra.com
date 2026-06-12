// Cloudflare Worker entry point
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Note: Static files are served by Cloudflare Pages/Workers automatically
// We don't need to handle static files in the worker code

// API routes
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json();
    // For now, just return success - you'll need to implement database logic
    return c.json({ success: true, message: 'Contact form submitted' });
  } catch (error) {
    return c.json({ error: 'Failed to submit contact request' }, 500);
  }
});

app.post('/api/booking', async (c) => {
  try {
    const body = await c.req.json();
    // For now, just return success - you'll need to implement database logic
    return c.json({ success: true, message: 'Booking request submitted' });
  } catch (error) {
    return c.json({ error: 'Failed to submit booking request' }, 500);
  }
});

// Intake form submission for paid customers
// ============================================================================
// Onvo Pay self-serve checkout — proxies to the receptionist app's internal
// endpoints (authed with THYNRA_INTERNAL_KEY shared secret).
//
// Flow:
//   1. Customer fills email + clicks "Pagar" on the pricing section.
//   2. Browser POSTs /api/checkout/start to this Worker.
//   3. Worker forwards to receptionist /api/internal/checkout/start-subscription.
//   4. Receptionist orchestrates (ensure business + Onvo Customer + Subscription)
//      and returns { subscription_id, checkout_path }.
//   5. Browser navigates to checkout_path (/checkout/sub/:id, served by the
//      SPA which mounts the OnvoCheckout React component).
//   6. The component fetches /api/checkout/config/:id to get the PaymentIntent
//      id + publishable key, then mounts the Onvo SDK widget.
//
// We never expose THYNRA_INTERNAL_KEY or ONVO_SECRET_KEY to the browser.
// The publishable key is fetched per-checkout via the config endpoint.
// ============================================================================

function getReceptionistBase(env) {
  const base = env.RECEPTIONIST_BASE_URL;
  if (!base) return null;
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

// Map of plan names → Onvo Price ids. Per-plan env vars so test / live
// environments use different Onvo Prices without code changes. The React
// app POSTs a plan NAME (e.g. "receptionist_monthly"); we resolve to the
// concrete Onvo price ids here so the browser never sees them.
//
// Required wrangler secrets per plan (run scripts/sync-onvo-prices.mjs):
//   ONVO_PRICE_RECEPTIONIST_MONTHLY     (recurring, NET — export customers)
//   ONVO_PRICE_RECEPTIONIST_MONTHLY_CR  (recurring, +13% IVA included — CR)
//   ONVO_PRICE_RECEPTIONIST_ANNUAL      (recurring, NET — export customers)
//   ONVO_PRICE_RECEPTIONIST_ANNUAL_CR   (recurring, +13% IVA included — CR)
//   ONVO_PRICE_SETUP_FEE                (one-time, NET; bundled with monthly.
//                                        The receptionist grosses it up +13%
//                                        for CR customers at charge time —
//                                        PaymentIntents take arbitrary
//                                        amounts, so no CR variant needed.)
//
// Why per-country price ids: Onvo has no tax engine — it charges a Price
// as-is. CR-consumed services carry 13% IVA; exports of services are 0%
// (Ley 9635). Onvo Subscriptions charge an immutable Price, so the IVA-
// inclusive CR amounts need their own catalog Prices.
//
// We only know IDs at this layer; the receptionist looks up each Price in
// Onvo at checkout-start to derive amount/currency/interval. That keeps Onvo
// as the single source of truth — change a Price in Onvo's dashboard and
// the next checkout uses the new amount automatically, no Worker redeploy.
// product_name is display copy (Spanish marketing-side) so it stays here.
function resolvePlan(plan, env, country) {
  const isCR = country === 'CR';
  switch (plan) {
    case 'receptionist_monthly': {
      const monthly = isCR
        ? env.ONVO_PRICE_RECEPTIONIST_MONTHLY_CR
        : env.ONVO_PRICE_RECEPTIONIST_MONTHLY;
      const setup = env.ONVO_PRICE_SETUP_FEE;
      if (!monthly || !setup) return { ok: false };
      return {
        ok: true,
        product_name: 'AI Receptionist — Plan Mensual',
        recurring_price_ids: [monthly],
        one_time_price_ids: [setup],
      };
    }
    case 'receptionist_annual': {
      const annual = isCR
        ? env.ONVO_PRICE_RECEPTIONIST_ANNUAL_CR
        : env.ONVO_PRICE_RECEPTIONIST_ANNUAL;
      if (!annual) return { ok: false };
      return {
        ok: true,
        product_name: 'AI Receptionist — Plan Anual',
        recurring_price_ids: [annual],
        one_time_price_ids: [],
      };
    }
    default:
      return { ok: false };
  }
}

// Geo hint for the pricing page's country selector. Cloudflare resolves the
// visitor's country at the edge (request.cf.country). This is a UX default
// only — the customer can override, and the tax decision uses what they
// SUBMIT, never the IP.
app.get('/api/geo', (c) => {
  const country = c.req.raw?.cf?.country;
  return c.json({ country: typeof country === 'string' ? country : null });
});

app.post('/api/checkout/start', async (c) => {
  const base = getReceptionistBase(c.env);
  if (!base) {
    return c.json({ error: 'checkout_not_configured', message: 'RECEPTIONIST_BASE_URL not set.' }, 503);
  }
  if (!c.env.THYNRA_INTERNAL_KEY) {
    return c.json({ error: 'checkout_not_configured', message: 'THYNRA_INTERNAL_KEY not set.' }, 503);
  }
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  if (!body || typeof body !== 'object' || typeof body.email !== 'string' || typeof body.plan !== 'string') {
    return c.json({ error: 'invalid_body', message: 'email and plan are required.' }, 400);
  }

  // Business name + tax id are REQUIRED — both go on the factura
  // electrónica (and the tax/VAT id doubles as reverse-charge evidence
  // for export sales). The pricing page enforces this too; this is the
  // server-side backstop.
  const business_name =
    typeof body.business_name === 'string' && body.business_name.trim().length >= 2
      ? body.business_name.trim().slice(0, 120)
      : undefined;
  if (!business_name) {
    return c.json({ error: 'invalid_body', message: 'business_name is required (it appears on the invoice).' }, 400);
  }
  const tax_id =
    typeof body.tax_id === 'string' && body.tax_id.trim().length >= 3
      ? body.tax_id.trim().slice(0, 40)
      : undefined;
  if (!tax_id) {
    return c.json({ error: 'invalid_body', message: 'tax_id is required (it appears on the invoice).' }, 400);
  }

  // Billing country decides which Onvo Price set we charge (CR = IVA-
  // inclusive variants, elsewhere = net/export). Default CR — the safe
  // (over-taxed) failure mode if the client ever omits it.
  const country =
    typeof body.country === 'string' && /^[A-Za-z]{2}$/.test(body.country)
      ? body.country.toUpperCase()
      : 'CR';

  const resolved = resolvePlan(body.plan, c.env, country);
  if (!resolved.ok) {
    return c.json({ error: 'unknown_plan', message: `Plan "${body.plan}" is not configured (check ONVO_PRICE_* secrets).` }, 400);
  }

  try {
    const upstream = await fetch(`${base}/api/internal/checkout/start-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': c.env.THYNRA_INTERNAL_KEY,
      },
      body: JSON.stringify({
        email: body.email,
        business_name,
        country,
        tax_id,
        product_sku: 'ai_receptionist',
        product_name: resolved.product_name,
        recurring_price_ids: resolved.recurring_price_ids,
        one_time_price_ids: resolved.one_time_price_ids,
      }),
    });
    const text = await upstream.text();
    const data = text ? JSON.parse(text) : null;
    return c.json(data, upstream.status);
  } catch (err) {
    console.error('checkout/start upstream error', err);
    return c.json({ error: 'upstream_unreachable' }, 502);
  }
});

// ============================================================================
// Self-serve onboarding form — proxies to receptionist's internal endpoint.
// The business_id in the URL IS the unguessable token (issued by checkout
// and emailed to the customer in the welcome email). No customer session;
// internal-key gates the Worker→receptionist hop.
// ============================================================================

// Public endpoint — customer enters their email to receive their
// onboarding link again. The receptionist always returns { ok: true }
// to prevent enumeration of valid customer emails; we forward verbatim.
// Defined BEFORE the parameterized routes below so the static segment
// wins matching regardless of Hono's router internals.
app.post('/api/onboarding/resend-link', async (c) => {
  const base = getReceptionistBase(c.env);
  if (!base || !c.env.THYNRA_INTERNAL_KEY) {
    return c.json({ error: 'onboarding_not_configured' }, 503);
  }
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  try {
    const upstream = await fetch(`${base}/api/internal/onboarding/resend-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': c.env.THYNRA_INTERNAL_KEY,
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    const data = text ? JSON.parse(text) : null;
    return c.json(data, upstream.status);
  } catch (err) {
    console.error('onboarding resend-link upstream error', err);
    return c.json({ error: 'upstream_unreachable' }, 502);
  }
});

app.get('/api/onboarding/:business_id', async (c) => {
  const base = getReceptionistBase(c.env);
  if (!base || !c.env.THYNRA_INTERNAL_KEY) {
    return c.json({ error: 'onboarding_not_configured' }, 503);
  }
  const id = c.req.param('business_id');
  try {
    const upstream = await fetch(
      `${base}/api/internal/onboarding/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: { 'X-Internal-Key': c.env.THYNRA_INTERNAL_KEY },
      },
    );
    const text = await upstream.text();
    const data = text ? JSON.parse(text) : null;
    return c.json(data, upstream.status);
  } catch (err) {
    console.error('onboarding GET upstream error', err);
    return c.json({ error: 'upstream_unreachable' }, 502);
  }
});

app.post('/api/onboarding/:business_id', async (c) => {
  const base = getReceptionistBase(c.env);
  if (!base || !c.env.THYNRA_INTERNAL_KEY) {
    return c.json({ error: 'onboarding_not_configured' }, 503);
  }
  const id = c.req.param('business_id');
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  try {
    const upstream = await fetch(
      `${base}/api/internal/onboarding/${encodeURIComponent(id)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Key': c.env.THYNRA_INTERNAL_KEY,
        },
        body: JSON.stringify(body),
      },
    );
    const text = await upstream.text();
    const data = text ? JSON.parse(text) : null;
    return c.json(data, upstream.status);
  } catch (err) {
    console.error('onboarding POST upstream error', err);
    return c.json({ error: 'upstream_unreachable' }, 502);
  }
});

// After the SDK confirms the subscription on the browser, we charge any
// one-time extras (e.g. setup fee) using the same PaymentMethod. Browser
// calls this with {subscription_id, payment_method_id}.
app.post('/api/checkout/finalize-extras', async (c) => {
  const base = getReceptionistBase(c.env);
  if (!base) {
    return c.json({ error: 'checkout_not_configured' }, 503);
  }
  if (!c.env.THYNRA_INTERNAL_KEY) {
    return c.json({ error: 'checkout_not_configured' }, 503);
  }
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  if (!body || typeof body.subscription_id !== 'string' || typeof body.payment_method_id !== 'string') {
    return c.json({ error: 'invalid_body', message: 'subscription_id and payment_method_id required.' }, 400);
  }
  try {
    const upstream = await fetch(`${base}/api/internal/checkout/finalize-extras`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': c.env.THYNRA_INTERNAL_KEY,
      },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    const data = text ? JSON.parse(text) : null;
    return c.json(data, upstream.status);
  } catch (err) {
    console.error('checkout/finalize-extras upstream error', err);
    return c.json({ error: 'upstream_unreachable' }, 502);
  }
});

app.get('/api/checkout/config/:id', async (c) => {
  const base = getReceptionistBase(c.env);
  if (!base) {
    return c.json({ error: 'checkout_not_configured' }, 503);
  }
  const id = c.req.param('id');
  // The local subscription id (10 random chars after the "sub_" prefix) IS
  // the unguessable token; no extra auth needed for the config endpoint.
  // Receptionist returns 410 once the subscription is no longer pending.
  try {
    const upstream = await fetch(`${base}/api/billing/onvo/checkout-config/${encodeURIComponent(id)}`);
    const text = await upstream.text();
    const data = text ? JSON.parse(text) : null;
    return c.json(data, upstream.status);
  } catch (err) {
    console.error('checkout/config upstream error', err);
    return c.json({ error: 'upstream_unreachable' }, 502);
  }
});


// Catch-all route to serve the React app
app.get('*', async (c) => {
  // For API routes, let them pass through
  if (c.req.path.startsWith('/api/')) {
    return c.text('Not Found', 404);
  }

  // Serve index.html for all other routes so React Router handles client-side navigation
  const url = new URL(c.req.url);
  url.pathname = '/index.html';
  return c.env.ASSETS.fetch(new Request(url.toString()));
});

export default app;
