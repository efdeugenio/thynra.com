# thynra.com — Spanish site, lead magnets and attribution

_Added 2026-09-17 to support the Spanish YouTube channel (`personal-brand/youtube-channel-strategy.md`)._

## Architecture in one paragraph

Spanish lives at **`/es/…` inside the same SPA and the same Worker**. English stays at `/` with no URL changes.
- **Routing:** `client/src/App.tsx` nests the Spanish routes under `/es` (wouter `nest`), so the same page components serve both languages.
- **Copy:** each component holds its own text as `defineCopy({ en, es })` (`client/src/i18n`), and TypeScript rejects a Spanish block that doesn't match the English one.
- **Server-side HTML:** crawlers and link previews (WhatsApp, LinkedIn) don't run JavaScript, so the Worker rewrites `index.html` per route before sending it. It sets `<html lang>`, title, description, Open Graph, canonical, `hreflang` and the Sofia widget's `data-lang`, all from `shared/siteMeta.ts`.
- **No automatic redirect by language.** English visitors whose browser prefers Spanish see a one-time, dismissible suggestion.

**Rejected alternatives:**
- `es.thynra.com`: splits SEO authority and adds a second deploy and domain.
- A client-side language toggle on the same URLs: Google indexes one language only, and a YouTube description can't link to Spanish.
- An i18n library: the site doesn't need plural rules or ICU formatting yet, and colocated typed copy keeps both languages side by side for review.

## Adding or translating a page

1. Put the copy at the top of the component with `defineCopy({ en: {…}, es: {…} })` and render it via `const t = useCopy(copy)`.
2. Inside pages, `navigate("/x")` and `<Link href="/x">` stay in the current language. Plain `<a href>` needs `localePath("/x", locale)`.
3. If the page is new, add its route to `sharedRoutes()` in `App.tsx` and its title and description (both languages) to `shared/siteMeta.ts`.
4. English-only pages (pricing, checkout, onboarding) are listed with `locales: ["en"]`. Spanish URLs for pricing redirect to English.

**Spanish voice:** neutral Latin American Spanish, **tú**, team voice ("nosotros"), no "front office". The glossary is in the translation commits (Diagnóstico de IA, Recepcionista con IA, Visibilidad / Conversión / Fidelización).

## Lead magnets — `/es/recursos/<slug>`

Registry: `shared/resources.ts`. The page and the API both read it.

| Status | Page | `POST /api/resources/:slug` |
|---|---|---|
| `draft` | 404; visible with `?preview=1` (shows a banner) | Only `preview` requests, as a dry run (no email, no contact) |
| `waitlist` | Captures the email, promises to send it when ready | Confirmation email + Resend contact + operator notice |
| `available` | Captures the email, shows a download button | Same, with the file link in the email |

**To publish a resource:**
1. Put the file in `client/public/recursos/<slug>.pdf`, or use an absolute URL.
2. Set `fileUrl` and `status: "available"`.
3. Build and deploy.

Never mark `available` before the file exists.

## Attribution

`client/src/lib/attribution.ts` runs on every page load:
- **First touch:** the first visit with UTM parameters or an external referrer, kept 90 days in localStorage.
- **Last touch:** the latest visit with UTM parameters.

Both are sent with every lead: quiz, contact form and resources.

**Link convention for YouTube:**
`https://thynra.com/es/recursos/<slug>?utm_source=youtube&utm_medium=description&utm_campaign=<video-slug>`
Use `utm_medium=pinned_comment` for the pinned comment and `utm_medium=card` for cards.

**Where it shows up:**
- The operator notification email has a "Source" block.
- The Resend contact gets these properties: `locale`, `utm_source`, `utm_medium`, `utm_campaign`, `first_utm_source`, `first_utm_campaign`, `referrer`, `resource`.

## One-time setup outside the code

- **Resend → Contacts → Properties:** create `locale`, `utm_source`, `utm_medium`, `utm_campaign`, `first_utm_source`, `first_utm_campaign`, `referrer`, `resource`. Until then the Worker falls back to the original properties so leads are never lost, but the new tags won't be stored.
- **Optional segment:** `wrangler secret put RESEND_RESOURCE_SEGMENT_ID` for resource leads.
- **Cloudflare Web Analytics:** create a site in the dashboard, then set the var `CF_WEB_ANALYTICS_TOKEN` (the Worker injects the beacon).
- **Google Search Console:** submit `https://thynra.com/sitemap.xml`.

## Local development (ports per `~/.claude/ports.json`)

- `npm run dev:worker`: builds, then runs the real Worker on **3311** (API + per-locale HTML). Use it to check meta tags, the sitemap and the API.
- `npm run dev:web`: Vite with hot reload on **3310**; `/api` is proxied to 3311.
- Both are in `.claude/launch.json` (`thynra-worker`, `thynra-web`).
- The legacy `npm run dev` (Express, from Replit) doesn't match production and defaults to port 5000. Don't use it.
