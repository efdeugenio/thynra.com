# Thynra — Front-office AI for SMBs

_Updated 2026-05-09. Reflects the Solutions section + team-voice pass on top of the prior front-office AI rebrand._

## Overview

Thynra is a front-office AI studio that builds productized AI systems for owner-operated SMBs. The site positions Thynra as a small team (not a solo founder) with three named solutions: AI Receptionist, YouTube & Social Media Automation, and AI-Powered Web Subscription.

**Brand identity:**
- Company name: Thynra
- Domain: thynra.com
- Category: Front-office AI
- Buyer line: AI for every part of your business that talks to a customer.
- Voice: team ("we"/"our"/"Thynra"). Never first-person on the web.

The site replaces the previous "AI subscription service" / "Thinking for the new era" framing AND the founder-built-in-public framing from the first rebrand pass. No fabricated metrics, no fake testimonials, no founder-"I" voice on the web.

## Conversion path
- **Primary CTA**: Book a 30-minute discovery call via Calendly (`https://calendly.com/efdeugenio/apply-ai`).
- **Secondary**: Send a message through the contact form (POSTs to `/api/contact`, persisted in the `contact_requests` table).
- **Tertiary**: Email `hello@thynra.com` directly.

The PayPal subscription flow ($3,995/month) is currently disabled at the home page level. The code remains in `client/src/components/pricing-section.tsx` and `client/src/components/PayPalButton.tsx`. The `/success` and `/cancel` routes still exist but are unreachable from the rebranded home page. Re-enable when there is a real productized offer to sell from a checkout.

Note: the AI-Powered Web Subscription offering on the site is described as a subscription, but the conversion flow is "book a call" — not self-serve checkout. The PayPal flow is dormant until a productized self-serve subscription is actually live.

## Solutions

Three productized solutions are featured in `client/src/components/solutions.tsx`:

1. **AI Receptionist** — voice + chat + WhatsApp + SMS, bilingual EN/ES (PT/FR wired). Books, qualifies, captures leads, routes to human. *Customer-initiated touchpoints.* Backed by the `/Users/eugeniofernandez/projects/AI receptionist` codebase.
2. **AI Front-Office Assistant** — owner-delegated drafting (emails, DMs, replies), follow-ups on leads and quotes, scheduling with prospects, outbound coordination. Drafts in the owner's voice for approval; does not talk to customers unsupervised. *Owner-initiated touchpoints.* Framed as the same AI persona as the Receptionist, acting in the owner's direction instead of the customer's. Tech-stack-agnostic on the public site (do not mention Hermes/OpenClaw in marketing copy per the voice-split memory).
3. **AI-Powered Web Subscription** — modern stack deployed to the *client's own* hosting account (typically Cloudflare, Vercel, or Netlify free tier; provider-agnostic in public copy). AI-drafted updates, human-reviewed, most go live within 48 hours. Unlimited pages and updates, flat monthly fee. **Client owns the hosting account and the domain — Thynra is the dev layer on top, not a middleman.** Leveraging the work behind `/Users/eugeniofernandez/projects/thynra.com` and `/Users/eugeniofernandez/projects/carolinaugalde.com/website`.

Three guardrails for future edits to this card's copy: (1) never name a specific hosting provider on the public site, (2) public delivery commit is "within 48 hours," not "same day" — internal target is 1–2 days, (3) the "client owns hosting + domain" line is load-bearing against the agency-hostage pattern; preserve it.

**On the Receptionist + Assistant pairing**: the two are framed as one AI in two roles. Dividing line is direction — customer-initiated vs owner-initiated. This avoids the two cards competing and gives buyers a complete front-office system narrative.

## User Preferences

Preferred communication style: simple, everyday language. Owner-operator audience first.

## System Architecture

### Frontend Architecture
React 18 + TypeScript:

- **Component Library**: Radix UI components with shadcn/ui.
- **Styling**: Tailwind CSS with custom CSS variables for theming.
- **State Management**: TanStack Query (React Query).
- **Routing**: Wouter.
- **Animations**: Framer Motion.
- **Forms**: React Hook Form with Zod validation.

### Backend Architecture
Express.js with TypeScript in ESM format:

- **API Design**: RESTful endpoints for contact and booking form submissions.
- **Validation**: Zod schemas.
- **Storage**: Abstracted storage layer with Drizzle/Postgres.
- **Error Handling**: Centralized middleware.
- **Development Tools**: Hot reloading with Vite integration.

### Database Schema
PostgreSQL with Drizzle ORM:

- **Users Table**: Basic user management.
- **Contact Requests**: Customer inquiry form submissions with optional company and phone fields.
- **Booking Requests**: Currently unused — Calendly handles bookings.

### Build and Deployment
- **Frontend**: Vite.
- **Backend**: esbuild (ESM output).
- **Database**: Drizzle Kit.
- **Deployment target**: Cloudflare Worker (`wrangler.toml`, `worker.js`).

## Site IA (post-rebrand, second pass)

Sections on the home page, top to bottom (managed in `client/src/pages/home.tsx`):
1. Hero — category + buyer-line + book-a-call CTA + "See our solutions" anchor
2. **What front-office AI covers** (`#what`) — three-stage explainer (Awareness / Conversion / Retention)
3. **Where SMBs lose customers** — five pain tiles
4. **Solutions** (`#solutions`) — three productized offerings (NEW in second pass)
5. **How we work** (`#how`) — three-step engagement flow
6. **FAQ** — seven questions
7. **Contact** (`#contact`) — book a call + email + contact form
8. **Footer**

## What got removed across the two rebrand passes
- Manufactured metrics ("500+ AI implementations", "98% Client Retention", "40% Cost Reduction").
- Fake testimonials (John Doe / TechCorp).
- "$3,995/month subscription" PayPal flow (code preserved, removed from home).
- Generic "Data Integration / AI Agents / Knowledge Systems / Analytics" services grid.
- Slogan "Thinking for the new era".
- "Currently building Sofia" hero tease and the build-in-public section (second pass).
- Founder-"I" voice across all sections (second pass).

## Voice split (read this before editing copy)
The web (this codebase) uses team voice — "we", "Thynra", "our". The LinkedIn personal brand uses "I" voice with build-in-public posture. They are deliberately different. Don't bleed one into the other. See `voice_split_web_vs_linkedin.md` in `~/.claude/projects/-Users-eugeniofernandez-projects-personal-brand/memory/`.

## External Dependencies

### Core Framework Dependencies
- React, Express.js, TypeScript

### Database and ORM
- Drizzle ORM, @neondatabase/serverless, connect-pg-simple

### UI and Styling
- Radix UI, Tailwind CSS, Framer Motion, Lucide React

### Form Handling and Validation
- React Hook Form, Zod, @hookform/resolvers

### Data Fetching and State Management
- TanStack Query, date-fns

### Development and Build Tools
- Vite, esbuild, PostCSS, TSX

### Payment (currently dormant in the home page)
- @paypal/paypal-server-sdk

The application is deployed via a Cloudflare Worker (`wrangler.toml`).
