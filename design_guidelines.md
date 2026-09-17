# Thynra — Design Guidelines (Front-office AI)

_Updated 2026-05-09 with the Solutions section + team-voice pass. Replaces both the prior "AI subscription service" framing and the build-in-public posture from the first rebrand._

## Brand
- **Company name**: Thynra
- **Category**: Front-office AI for SMBs
- **Buyer line**: AI for every part of your business that talks to a customer.
- **Voice**: team. "we", "Thynra", "our". Never "I" anywhere on the site. (LinkedIn personal-brand voice is the opposite — see `voice_split_web_vs_linkedin.md` in personal-brand memory.)
- **Posture**: productized solutions. The site presents Thynra as a small, credible studio with three named offerings. Build-in-public framing belongs on LinkedIn, not on the web.

## Voice rules
- Use "we", "Thynra", or "our". Never "I", "my", "me" in body copy.
- Direct. Engineering-credible without being dev-only.
- Owner-operator audience first; peer practitioners second.
- Periods over compound clauses. Avoid em-dashes in load-bearing copy.
- No buzzword openers. No generic CTAs.
- Don't manufacture client outcomes, metrics, or testimonials. If a number is on the site, it must be sourceable.

## Site IA (home page sections, top to bottom)
1. **Hero** — category eyebrow + buyer-line headline + "Book a call" + "See our solutions"
2. **What front-office AI covers** (`#what`) — three stages: Awareness / Conversion / Retention
3. **Where SMBs lose customers** — five pain tiles
4. **Solutions** (`#solutions`) — three productized offerings:
   - **AI Receptionist** — voice + chat + WhatsApp + SMS, bilingual EN/ES (customer-initiated touchpoints)
   - **AI Front-Office Assistant** — owner-delegated drafting, follow-up, and outbound (owner-initiated touchpoints, paired with the Receptionist as the same AI persona in two roles)
   - **AI-Powered Web Subscription** — unlimited pages, AI-drafted updates live within 48 hours, hosting account and domain stay in the client's name
5. **How we work** (`#how`) — three-step engagement flow (discovery → diagnostic → build & ship)
6. **FAQ** — seven questions covering scope, fit, methodology, geography
7. **Contact** (`#contact`) — book a call (Calendly), email us, or send a message via the form
8. **Footer**

## Color & typography
Unchanged from prior guidelines.
- Inter (body) and Space Grotesk (headings) via Google Fonts.
- Light/dark mode supported.
- Primary blue accent. Charcoal text in light mode, off-white in dark.
- Section padding `py-20 lg:py-24`. Container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

## Component patterns
- shadcn/ui (Radix) primitives, Tailwind utilities, Framer Motion for entrance animations.
- Card: `bg-card border border-border rounded-xl`, hover state `hover:border-primary/50`.
- Eyebrow label: `text-xs font-semibold uppercase tracking-wider text-primary/70`.
- Section heading: `text-4xl font-bold text-foreground` with a max-width supporting paragraph beneath.
- CTA hierarchy: one primary `Book a call` per page region, secondary `Send a message`/`Email us`.

## What got removed across the two rebrand passes
- "500+ AI implementations", "98% Client Retention", "40% Cost Reduction" — manufactured metrics.
- John Doe testimonials, TechCorp awards — manufactured social proof.
- "$3,995/month subscription" PayPal flow — `pricing-section.tsx` and `PayPalButton.tsx` are no longer imported from `home.tsx`. Routes `/success` and `/cancel` still exist.
- Generic "Data Integration / AI Agents / Knowledge Systems / Analytics" services grid.
- "Currently building Sofia" hero tease and the "build-in-public" section — removed entirely. Build-in-public is implicit on LinkedIn, never on the web.
- Founder-"I" voice — replaced with team-"we" voice across hero, how-we-work, FAQ, contact, and footer.

## Conversion path
Single primary CTA across the site: **Book a call** → Calendly (`https://calendly.com/efdeugenio/apply-ai`).
- Secondary: email `hello@thynra.com`.
- Tertiary: send a message via the contact form (POSTs to `/api/contact`, persisted in `contact_requests` table via Drizzle).

## Solutions list (keep current)
The `client/src/components/solutions.tsx` component lists current productized offerings. Update as solutions are added or sunset:
- **AI Receptionist** — voice/chat/WhatsApp/SMS, bilingual EN/ES, books and qualifies. Customer-initiated. Backed by the AI receptionist project (`/Users/eugeniofernandez/projects/AI receptionist`).
- **AI Front-Office Assistant** — owner-delegated drafting (emails, DMs, replies), follow-ups on leads/quotes/messages, scheduling and outbound coordination. Owner-initiated. Same AI persona as the Receptionist; web copy says so explicitly to anchor the pairing. Backed internally by a Hermes-based messaging-agent framework (do not name Hermes publicly on the site per the voice-split memory).
- **AI-Powered Web Subscription** — modern stack deployed to the *client's own* hosting account (typically Cloudflare, Vercel, or Netlify free tier; do not name a specific provider publicly on the site — provider-agnostic in marketing copy). AI-drafted updates, human-reviewed, most go live within 48 hours. **Client owns the hosting account and the domain from day one; Thynra is the dev layer on top, not a middleman.** Backed by the work in `/Users/eugeniofernandez/projects/thynra.com` and `/Users/eugeniofernandez/projects/carolinaugalde.com/website`.

**Three explicit guardrails on this offering's marketing copy:**
1. **No specific hosting provider named on the site.** Cloudflare/Vercel/Netlify are internal delivery choices. Public copy says "modern infrastructure" or "modern stack."
2. **48-hour delivery framing, not same-day.** "Most updates live within 48 hours" leaves operational flex. Eugenio's internal target is 1–2 days; the public commit is the longer end of that range so we under-promise and over-deliver.
3. **Client owns hosting + domain.** This is a load-bearing trust signal against the agency-hostage pattern SMBs have been burned by. Always preserve it.

**On the Receptionist + Assistant pairing**: these are deliberately framed as one AI in two roles, not two separate products. The website copy makes that explicit ("One AI persona, two roles") so a buyer reading both cards sees a complete front-office system, not two competing offerings. The dividing line is direction of communication:
- *Customer-initiated* → Receptionist (autonomous, real-time, public)
- *Owner-initiated* → Assistant (delegated, supervised, drafts for approval)

## Files to know
- `client/src/pages/home.tsx` — top-level section composition.
- `client/src/components/hero-section.tsx` — hero copy.
- `client/src/components/benefits-section.tsx` — three-stage explainer (Awareness / Conversion / Retention).
- `client/src/components/pain-section.tsx` — five-pain tile section.
- `client/src/components/solutions.tsx` — three productized solutions.
- `client/src/components/how-it-works.tsx` — three-step engagement flow.
- `client/src/components/faq-section.tsx` — Q&A.
- `client/src/components/contact-section.tsx` — book-a-call card + email card + contact form (no PayPal).
- `client/src/components/navigation.tsx` — sticky top nav with section anchors.
- `client/src/components/footer.tsx` — minimal footer with section anchors + legal links.
- `client/src/components/build-in-public.tsx` — REMOVED in the second pass.

## Notes for future edits
- Any change to positioning copy must keep the awareness/conversion/retention matrix intact unless the niche is being repositioned.
- Solutions list is the source of truth for what Thynra offers. Update when offerings change.
- If a future request introduces founder-"I" voice or build-in-public framing on the web, push back — that's LinkedIn territory per `voice_split_web_vs_linkedin.md` in personal-brand memory.
