# thynra.com — Site v2 IA Spec

_Draft for approval · June 2026. Aligns the live site with the latest personal-brand strategy (offer ladder, AI-maturity quiz, GBP/reputation engine, 5 POCs). Approve the shape here before any code changes._

## Locked decisions (from our strategy review)

1. **Demote "Front Office," don't delete it.** It survives as the category descriptor, not the hero promise. The hero leads with pain + the diagnostic.
2. **Primary CTA = the AI-maturity quiz.** "Talk to Sofia" drops to secondary.
3. **Solutions reorganized by the customer journey + an operations axis** (see §3), with the 5 POCs as the named workflows — so the quiz result routes straight into the matching lane.
4. **Fold the "AI Front-Office Assistant" into the Receptionist** ("…and it handles your follow-ups too"). No standalone card.
5. **Awareness = the GBP / Reputation & Local-SEO engine (POC3)**, not content-SEO-as-a-service. (Content-SEO research is repurposed for thynra's *own* inbound blog, not sold as a client product.)
6. **Reconcile the dormant $3,995/mo anchor** with the strategy's $500–1,500/mo SMB single-workflow band.

---

## 0. Post-launch pivot — "front office" dropped from buyer-facing copy (DONE + DEPLOYED)

After review, we judged "front office" to be consultant jargon a cold SMB owner won't recognize (the tell: the site needed a FAQ to *define* its own category). Decision: keep it as an internal/SEO term only, and replace it everywhere the buyer reads with the plain-English umbrella **"AI that helps you get and keep more customers"** — plain-but-specific, not generic. Swept across hero, nav, footer, benefits, pain, contact, FAQ (the "what does front-office AI mean?" Q became "What exactly do you do?"), the quiz page + report, the PDF, and the confirmation email. Quiz level names: "Reactive/Responsive/Autonomous Front Office" → "…Business." The only "Front-Office" strings remaining are 3 invisible plumbing tokens (the quiz→Sofia/worker payload header + its detection regex in `worker.js`) — kept in lockstep so lead capture still fires. "Receptionist"/"front desk" survive at the Receptionist-solution level (concrete there). This supersedes the "front-office" framing in §2–§6 below.

## 1. The funnel we're building toward

```
Quiz (lead magnet, diagnoses 2 axes)
   → result names the workflow costing you most
   → routes to the matching Solution lane
   → CTA: book audit / Talk to Sofia
   → Sprint (fixed-scope build) → Retainer
```

The quiz already exists at `/quiz` and is wired into nav, footer, the Resend email, and Sofia. v2's job is to **make it the spine of the site**, not a buried link.

---

## 2. Section-by-section change map

Home sections live in `client/src/pages/home.tsx`. Order is unchanged unless noted.

| # | Section / file | Current state | v2 change | Strategy source |
|---|---|---|---|---|
| 1 | **Hero** `hero-section.tsx` | Eyebrow "Front-office AI for SMBs"; H1 "AI for every part of your business that talks to a customer"; CTAs **Talk to Sofia** / See our solutions | Pain + diagnostic lead. **Primary CTA → quiz; Talk to Sofia secondary.** Front-office becomes the small eyebrow, not the H1 promise. (Draft copy §4) | quiz funnel; pain-first positioning |
| 2 | **What front-office covers** `benefits-section.tsx` (#what) | 3 stages: Awareness / Conversion / Retention | Keep the 3-stage spine; **add a 4th "Operations" tile** so the delivery axis the strategy measures has a home. Awareness tile re-pointed to "get found + reviews." | quiz 2-axis model (Captación-Retención + Delivery) |
| 3 | **Where SMBs lose customers** `pain-section.tsx` | Pain tiles (Missed calls, Slow follow-up, …) | Keep; align tiles to the quiz's pains (speed-to-lead ~42h industry avg, no-shows, lapsed clients, scattered reviews, admin load). Each pain → its solution lane. | quiz §4 dolores |
| 4 | **Solutions** `solutions.tsx` (#solutions) | 3 product cards (Receptionist / Assistant / Web Subscription) | **Full re-cut by journey + ops axis** (see §3 below). Assistant folded in. Awareness = GBP engine. | offer one-pager; 5 POCs |
| 5 | **How we work** `how-it-works.tsx` (#how) | 3 steps: Discovery call / Diagnostic / Build & ship | Reframe as the **offer ladder**: Quiz/Audit → Sprint (fixed scope, 2 wks) → Retainer. **Section header reuses rejected H1 C: "You don't need an AI transformation. You need one workflow off your plate."** | side-hustle-strategy offer ladder |
| 6 | **FAQ** `faq-section.tsx` | 7 questions | Add: "What does the quiz tell me?", "Do you work with clinics?" (beachhead proof), pricing transparency. | quiz; beachhead niche |
| 7 | **Contact** `contact-section.tsx` (#contact) | Book a call + email + form | Keep. Secondary to the quiz now. | — |
| — | **Navigation / Footer** | Quiz link present | Promote quiz to a button in nav (not just a link). | CTA hierarchy |

---

## 3. The Solutions re-cut (the biggest change)

Reorganize from "3 products by who-the-AI-talks-to" into **the customer journey + the operations axis**, with POCs as named workflows. This is what lets the quiz result route in cleanly.

**Awareness — get found & trusted**
- **Reputation & Local-SEO engine** (POC3): review monitoring + drafted responses, post-visit review nudges (review velocity → map-pack ranking), GBP audit + posts. _This is the new Awareness anchor._
- **AI-Powered Web Subscription**: your site is where Awareness lands. Owns hosting + domain, 48h updates. (Kept; positioned as the *foundation* the rest plugs into.)

**Conversion — answer & book in the next 5 minutes**
- **AI Receptionist** (POC1 missed-call): voice/chat/WhatsApp/SMS, bilingual, books + qualifies. **Now includes the folded Assistant capability** — "and it drafts your follow-ups, quotes, and replies for your approval." One AI, surfaced as one card.
- **Appointment reminders + no-show recovery** (POC2).

**Retention — win back & keep**
- **Recall / reactivation** (POC5): win back lapsed clients/patients, runs on the report's data plumbing.

**Operations — run it without drowning** _(the delivery axis)_
- **Owner's weekly report** (POC4): auto-generated from messy data. _Your data-engineering edge — competitors can't copy this._

> Quiz payoff: "Weak on Captación → start with the Receptionist + Reputation engine." "Strong customer-side, drowning in ops → start with the Owner's Report." The result page becomes a router into these lanes.

---

## 4. Draft hero copy (for approval — pick a direction)

**Eyebrow (keep, demoted):** `Front-office AI for service businesses`

**H1 — LOCKED:** *"Most service businesses lose customers in the same three places. Find yours in 2 minutes."*
- Quiz-native: names a finite pattern, lowers defensiveness ("you're not special, there's a known map"), bakes the low-commitment CTA into the headline, and "three places" maps to the Awareness/Conversion/Retention spine.
- "Three places you lose customers" = the customer axis. Operations is sold separately (where you *drown*, not where you lose customers).
- _Rejected:_ A ("workflow" too abstract for a cold skim); C sells the sprint, not the diagnostic — **reused as the How-We-Work section header** (see §2 row 5).

**Subhead:** name the felt pains — the lead nobody called back (industry avg response ~42h), the patient who never rebooked, the reviews nobody answers.

**Primary CTA:** `Take the 2-minute AI readiness quiz` → `/quiz`
**Secondary CTA:** `Talk to Sofia now` (the live receptionist demo stays — it's proof)

---

## 5. Pricing reconciliation — LOCKED: (b)

**Keep checkout dormant; quote retainer pricing only on calls** until a real self-serve productized tier exists. Matches replit.md's existing note. No pricing shown on the home page; the quiz → audit → call carries the conversation. Revisit when a productized self-serve subscription is genuinely live.

---

## 6. What we are NOT changing

- Team voice on the web (no founder-"I"). Per the voice-split memory.
- No fabricated metrics / fake testimonials.
- "Client owns hosting + domain" line on the Web Subscription (load-bearing against agency lock-in).
- The 3-stage Awareness/Conversion/Retention explainer survives — we add Operations, not replace it.

---

## 7. Open questions — RESOLVED

1. **Hero H1** — ✅ Option B (see §4).
2. **Niche** — ✅ **Stay fully horizontal (SMBs).** Revisit clinic-first customization only after the first 3 customers. No clinic-specific copy in v2; Sofia/Carolina stay as proof, not as a vertical pitch.
3. **Pricing** — ✅ Option (b): checkout stays dormant (see §5).

---

## 8. Build status

1. ✅ **DONE + DEPLOYED** — Hero CTA swap (quiz primary, Sofia secondary) + H1 B. `hero-section.tsx`, `navigation.tsx`.
2. ✅ **DONE + DEPLOYED** — Solutions re-cut into 4 journey/ops lanes (Awareness = Reputation & Local Presence, Conversion = Receptionist w/ folded Assistant, Retention = Recall & Reactivation, Operations = Owner's Weekly Report) + "not sure which? take the check" CTA. `solutions.tsx`.
3. ✅ **DONE + DEPLOYED** — Benefits: added Operations tile (4-up grid). `benefits-section.tsx`.
4. ✅ **DONE + DEPLOYED** — How-we-work → 4-step offer ladder (Check → Audit → Sprint → Keep-it-running) with C header. `how-it-works.tsx`.
5. ✅ **DONE + DEPLOYED** — Pain tiles re-ordered + stage tags mapping each pain to its lane; FAQ adds "free AI check" + pricing Qs, points "new clients" at the check. `pain-section.tsx`, `faq-section.tsx`.
6. ✅ **DONE + DEPLOYED** — Quiz result page routes into solution lanes via **option (b): inline**. A "Your fastest win" card renders on the result page, keyed off `weakestStage()`, showing the matching solution (name, tagline, bullets): `awareness` → Reputation & Local Presence, `conversion` → AI Receptionist, `retention` → Recall & Reactivation. Placed right after the "Where we'd start" reco; "Talk to Sofia" remains the CTA below it. `pages/quiz.tsx` (new `STAGE_SOLUTION` map). The quiz scores 3 stages (no operations axis — ops isn't quiz-diagnosed, which is fine).

All six items deployed to the `thynra` Cloudflare worker, live on thynra.com. `vite build` + `tsc` clean.

