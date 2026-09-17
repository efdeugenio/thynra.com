// Cloudflare Worker entry point
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// Note: Static files are served by Cloudflare Pages/Workers automatically
// We don't need to handle static files in the worker code

// ----------------------------------------------------------------------------
// Resend email helper. thynra.com is a verified sending domain in Resend (the
// receptionist platform sends auth@thynra.com), so any @thynra.com From works.
// Requires the RESEND_API_KEY secret on this Worker:
//   wrangler secret put RESEND_API_KEY
// Optional vars/secrets:
//   CONTACT_FROM_EMAIL     default "Thynra <hello@thynra.com>"
//   OPERATOR_NOTIFY_EMAIL  default "hello@thynra.com" (where leads land)
// ----------------------------------------------------------------------------
async function sendViaResend(env, { from, to, subject, text, html, replyTo, attachments }) {
  if (!env.RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        ...(text ? { text } : {}),
        ...(html ? { html } : {}),
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(Array.isArray(attachments) && attachments.length
          ? { attachments }
          : {}),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[resend] send failed', res.status, detail);
      return { ok: false, error: `resend ${res.status}` };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('[resend] send error', err);
    return { ok: false, error: String(err) };
  }
}

// Upsert a contact into Resend using the current top-level Contacts API
// (POST /contacts). The legacy /audiences/{id}/contacts path is deprecated in
// favor of Segments, so we tag each lead with properties and (optionally) drop
// it into a named Segment by id for the nurture flows.
//   wrangler secret put RESEND_QUIZ_SEGMENT_ID   (id of the "Quiz leads" segment)
async function addContactToResend(env, { email, name, company, source, level, weakestStage, segmentId }) {
  if (!env.RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || '';
  const lastName = parts.join(' ');

  // Custom properties make the contact segmentable (e.g. source=quiz,
  // readiness_level=Reactive). These keys must be predefined in
  // Resend → Audience → Properties, or the API rejects them — hence the retry
  // below strips properties so lead capture never fails on a config mismatch.
  const properties = {};
  if (source) properties.source = source;
  if (company) properties.company = company;
  if (level) properties.readiness_level = level;
  if (weakestStage) properties.weakest_stage = weakestStage;

  const post = (body) =>
    fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  const base = {
    email,
    first_name: firstName || undefined,
    last_name: lastName || undefined,
    unsubscribed: false,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
  };

  try {
    const withProps =
      Object.keys(properties).length > 0 ? { ...base, properties } : base;
    let res = await post(withProps);
    // Properties not defined in the dashboard? Retry without them so the
    // contact still lands — capturing the lead matters more than the tags.
    if (!res.ok && withProps !== base) {
      const detail = await res.text().catch(() => '');
      console.warn('[resend] contact create with properties failed, retrying bare', res.status, detail);
      res = await post(base);
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[resend] contact create failed', res.status, detail);
      return { ok: false, error: `resend ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error('[resend] contact create error', err);
    return { ok: false, error: String(err) };
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

// Branded HTML confirmation email for the quiz. Mirrors the on-site report at
// a glance; the full breakdown + 30/60/90 plan rides along as the PDF attachment.
function quizConfirmHtml({ name, level, scores, weakestStage }) {
  const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi there,';
  const rows = scores
    ? ['awareness', 'conversion', 'retention']
        .map((k) => {
          const v = scores[k];
          if (typeof v !== 'number') return '';
          const label = k.charAt(0).toUpperCase() + k.slice(1);
          const pct = Math.round((v / 8) * 100);
          return `
          <tr>
            <td style="padding:6px 0;font:14px/1.4 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#374151;width:120px">${label}</td>
            <td style="padding:6px 0;width:100%">
              <div style="background:#EEF0F6;border-radius:4px;height:8px;width:100%">
                <div style="background:#4F46E5;border-radius:4px;height:8px;width:${pct}%"></div>
              </div>
            </td>
            <td style="padding:6px 0 6px 12px;font:600 14px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1F2433;white-space:nowrap">${v}/8</td>
          </tr>`;
        })
        .join('')
    : '';
  return `<!doctype html><html><body style="margin:0;background:#F5F6FB;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #E5E7EB">
    <tr><td style="background:linear-gradient(135deg,#4F46E5,#8B5CF6);padding:22px 28px">
      <div style="font:700 18px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#fff;letter-spacing:.5px">THYNRA</div>
      <div style="font:12px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#E4E2FB;margin-top:2px">AI Readiness</div>
    </td></tr>
    <tr><td style="padding:28px">
      <p style="font:15px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#374151;margin:0 0 18px">${greeting}</p>
      ${level ? `<div style="background:#F0EFFF;border-left:4px solid #4F46E5;border-radius:0 8px 8px 0;padding:14px 18px;margin:0 0 20px">
        <div style="font:600 11px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#4F46E5;letter-spacing:.8px;text-transform:uppercase;margin-bottom:4px">Your readiness level</div>
        <div style="font:700 20px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1F2433">${escapeHtml(level)}</div>
      </div>` : ''}
      ${rows ? `<div style="margin:0 0 18px">
        <div style="font:600 12px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#6B7280;letter-spacing:.6px;text-transform:uppercase;margin-bottom:10px">Stage breakdown</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </div>` : ''}
      ${weakestStage ? `<div style="background:#FEF9ED;border:1px solid #FCD34D;border-radius:10px;padding:14px 16px;margin:0 0 22px">
        <div style="font:600 13px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#92400E;margin-bottom:4px">⚡ Biggest opportunity: ${escapeHtml(weakestStage)}</div>
        <div style="font:13px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#78350F">This is the stage with the most upside right now. The PDF attached has a 30/60/90-day action plan tailored to this gap.</div>
      </div>` : `<p style="font:15px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#374151;margin:0 0 22px">Your full breakdown and a personalized 30/60/90-day action plan are attached as a PDF.</p>`}
      <a href="https://thynra.com/quiz" style="display:inline-block;background:#4F46E5;color:#fff;text-decoration:none;font:600 15px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:12px 22px;border-radius:8px">Talk to Sofia about your result</a>
      <p style="font:13px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#9AA0AC;margin:22px 0 0">
        Want a human second opinion? Just reply to this email. — Thynra
      </p>
    </td></tr>
  </table>
  </body></html>`;
}

// Extract quiz fields from the summary text generated by reportSummaryText().
// Format: "Front-Office AI Readiness assessment\nResult: [level] (score N/24)\n
//          Awareness N/8, Conversion N/8, Retention N/8\nWeakest stage: [stage]"
// Used as a fallback when the caller doesn't send explicit structured fields.
function parseQuizFromMessage(msg) {
  const out = {};
  const lvl = msg.match(/Result:\s*([^(\n]+?)(?:\s*\(score\s*\d+\/\d+\))?(?:\n|$)/i);
  if (lvl) out.level = lvl[1].trim();
  const sc = msg.match(/Awareness\s+(\d+)\/8[,\s]+Conversion\s+(\d+)\/8[,\s]+Retention\s+(\d+)\/8/i);
  if (sc) out.scores = { awareness: +sc[1], conversion: +sc[2], retention: +sc[3] };
  const wk = msg.match(/Weakest stage:\s*([^\n]+)/i);
  if (wk) out.weakestStage = wk[1].trim();
  return out;
}

// API routes
app.post('/api/contact', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }

  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 120) : '';
  const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 200) : '';
  const company = typeof body?.company === 'string' ? body.company.trim().slice(0, 120) : '';
  const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 5000) : '';

  // Optional structured quiz fields (used to enrich the email + PDF attachment).
  // Prefer explicit fields from the body; fall back to parsing message text so
  // the email is always rich even if the client omits the structured fields.
  let level = typeof body?.level === 'string' ? body.level.trim().slice(0, 80) : '';
  let weakestStage = typeof body?.weakestStage === 'string' ? body.weakestStage.trim().slice(0, 40) : '';
  let scores =
    body?.scores && typeof body.scores === 'object'
      ? {
          awareness: Number(body.scores.awareness) || 0,
          conversion: Number(body.scores.conversion) || 0,
          retention: Number(body.scores.retention) || 0,
        }
      : null;
  if (!level || !scores || !weakestStage) {
    const parsed = parseQuizFromMessage(message);
    if (!level && parsed.level) level = parsed.level;
    if (!scores && parsed.scores) scores = parsed.scores;
    if (!weakestStage && parsed.weakestStage) weakestStage = parsed.weakestStage;
  }
  // Base64 PDF (no data: prefix). Cap ~3MB of base64 to stay well within limits.
  const pdfBase64 =
    typeof body?.pdfBase64 === 'string' && body.pdfBase64.length < 3_000_000
      ? body.pdfBase64
      : '';
  const pdfFilename =
    typeof body?.pdfFilename === 'string' && body.pdfFilename
      ? body.pdfFilename.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80)
      : 'Thynra-AI-Readiness-Report.pdf';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: 'invalid_body', message: 'A valid email is required.' }, 400);
  }
  if (!message) {
    return c.json({ error: 'invalid_body', message: 'message is required.' }, 400);
  }

  const fromEmail = c.env.CONTACT_FROM_EMAIL || 'Thynra <hello@thynra.com>';
  const operatorTo = c.env.OPERATOR_NOTIFY_EMAIL || 'hello@thynra.com';
  // The quiz embeds a "Front-Office AI Readiness assessment" header in message.
  const isQuiz = /Front-Office AI Readiness/i.test(message);
  const subjectTag = isQuiz ? 'AI Readiness Check lead' : 'New contact';

  // 1) Operator notification — this is the lead capture.
  const operatorText = [
    `New ${isQuiz ? 'quiz' : 'contact'} submission via thynra.com`,
    ``,
    `Name:     ${name || '(not provided)'}`,
    `Email:    ${email}`,
    `Business: ${company || '(not provided)'}`,
    ``,
    message,
  ].join('\n');

  const opResult = await sendViaResend(c.env, {
    from: fromEmail,
    to: operatorTo,
    replyTo: email,
    subject: `${subjectTag}: ${name || email}${company ? ` — ${company}` : ''}`,
    text: operatorText,
  });

  // 2) Confirmation to the submitter (best-effort; never blocks the response).
  const confirmText = isQuiz
    ? [
        `Hi ${name || 'there'},`,
        ``,
        `Thanks for completing the AI Readiness Check. Here's a copy of your result:`,
        ``,
        message,
        ``,
        `Your full breakdown and a personalized 30/60/90-day plan are attached as a PDF.`,
        `Want to talk it through? Sofia, our AI receptionist, can walk you through it: https://thynra.com/quiz`,
        ``,
        `— Thynra`,
      ].join('\n')
    : [
        `Hi ${name || 'there'},`,
        ``,
        `Thanks for reaching out to Thynra. We received your message and will reply within a day.`,
        ``,
        `— Thynra`,
      ].join('\n');

  const confirmHtml = isQuiz
    ? quizConfirmHtml({ name, level, scores, weakestStage })
    : undefined;
  const confirmAttachments =
    isQuiz && pdfBase64
      ? [{ filename: pdfFilename, content: pdfBase64 }]
      : undefined;

  if (opResult.ok) {
    c.executionCtx?.waitUntil?.(
      sendViaResend(c.env, {
        from: fromEmail,
        to: email,
        replyTo: operatorTo,
        subject: isQuiz ? 'Your AI Readiness Check results' : 'We got your message — Thynra',
        text: confirmText,
        html: confirmHtml,
        attachments: confirmAttachments,
      }),
    );
    // 3) Add the lead to Resend Contacts for nurture (best-effort). Properties
    //    tag it; quiz leads also drop into the "Quiz leads" segment by id.
    c.executionCtx?.waitUntil?.(
      addContactToResend(c.env, {
        email,
        name,
        company,
        source: isQuiz ? 'quiz' : 'contact',
        level,
        weakestStage,
        segmentId: isQuiz ? c.env.RESEND_QUIZ_SEGMENT_ID : undefined,
      }),
    );
  }

  if (!opResult.ok) {
    return c.json({ error: 'email_failed', message: opResult.error }, 502);
  }
  return c.json({ success: true, message: 'Contact request sent' });
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
