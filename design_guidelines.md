# Thynra AI Agency - Design Guidelines

## Design Approach
**Reference-Based**: Inspired by Designjoy's clean professionalism + Linear's precision typography + Stripe's trustworthy aesthetic. Focus on conversion-optimized layouts that communicate expertise and reliability.

**Core Principle**: Business credibility through visual restraint and strategic emphasis on results.

## Color Palette

**Light Mode:**
- Primary: 240 15% 15% (Deep charcoal - headlines/primary text)
- Secondary: 240 8% 45% (Muted slate - body text)
- Accent: 210 100% 45% (Professional blue - CTAs, links)
- Background: 0 0% 99% (Soft white)
- Surface: 240 10% 96% (Light gray cards)

**Dark Mode:**
- Primary: 0 0% 98% (Off-white text)
- Secondary: 240 5% 75% (Light gray body)
- Accent: 210 100% 55% (Brighter blue)
- Background: 240 15% 8% (Rich dark)
- Surface: 240 10% 12% (Elevated cards)

## Typography
**Fonts**: Inter (primary), Space Grotesk (headings/accents) via Google Fonts
- Hero H1: 4xl-6xl, font-bold, Space Grotesk, tracking-tight
- Section H2: 3xl-5xl, font-bold, tight leading
- H3: xl-2xl, font-semibold
- Body: base-lg, leading-relaxed, Inter
- Accents: uppercase tracking-wide for labels

## Layout System
**Spacing Units**: Primarily 4, 8, 12, 16, 20, 24, 32 (tailwind units)
- Section padding: py-24 md:py-32 lg:py-40
- Container: max-w-7xl, consistent px-6 md:px-12
- Content blocks: gap-12 to gap-20
- Micro-spacing: p-4, p-6, p-8 for cards

## Core Sections & Components

### Hero Section
Full-viewport impactful header (min-h-screen) with:
- Large hero image (right 60%): Abstract AI visualization - neural networks, data flows, or futuristic workspace (high-quality, professional photography with blue/purple tech tones)
- Left content area (40%): Headline "Thinking for the new era" + subheading about AI solutions + dual CTA (primary "View Plans" + outline "See Case Studies" with backdrop-blur-sm bg-white/10)
- Floating trust indicators: "500+ AI implementations" badge

### Subscription Plans (Designjoy-inspired)
Two-column comparison (lg:grid-cols-2):
- **Standard Plan** card: Clean white/dark surface, includes list of deliverables, pause/cancel anytime notice, monthly pricing
- **Premium Plan** card: Subtle gradient border (accent color), "Most Popular" badge, enhanced features, priority support
- Each card: large pricing display, bullet features with checkmarks, prominent CTA button

### Services Grid
3-column grid (lg:grid-cols-3):
- Data Integration, AI Agents, Knowledge Systems, Analytics cards
- Each: icon placeholder (<!-- CUSTOM ICON: service-specific -->), title, 2-3 line description
- Hover: subtle lift with shadow-lg transition

### Results/Metrics Section
4-column stats bar (lg:grid-cols-4):
- "500+ Implementations", "98% Client Retention", "40% Cost Reduction", "24/7 AI Support"
- Large numbers (4xl-5xl) with labels below

### Case Studies
Alternating image-text layout:
- Row 1: Image left (client dashboard screenshot) + results right
- Row 2: Results left + image right (AI visualization)
- Each: client logo, key metrics, testimonial quote

### Process/How It Works
Horizontal timeline (3 steps):
- Step numbers in accent circles, connecting lines
- Subscribe → Integrate → Scale phases
- Brief description under each

### FAQ Accordion
Single column, max-w-3xl centered:
- Clean expansion panels, plus/minus icons
- Focus on business concerns: ROI, implementation time, security

### Final CTA Section
Centered, contained:
- Bold headline "Ready to Transform Your Business?"
- Supporting text about risk-free trial
- Primary CTA "Start Your Subscription"
- Small print: "No contracts, pause anytime"

### Footer
3-column (md:grid-cols-3):
- Brand + tagline
- Quick links (Services, Pricing, Case Studies)
- Contact + LinkedIn/Twitter icons

## Interactions
- Minimal, purposeful animations only
- CTAs: scale-105 on hover, shadow enhancements
- Cards: translate-y-1 subtle lift
- NO distracting scroll effects or background animations

## Images Strategy

**Hero Image**: Right-aligned (60% width on desktop), abstract AI/neural network visualization or modern tech workspace - high-quality stock from Unsplash (search: "artificial intelligence abstract" or "data visualization blue")

**Case Study Images** (2-3): Product dashboard screenshots or AI system interfaces - clean, professional screenshots showing real implementations

**All images**: Professional, blue-toned color grading, optimized for web, subtle overlays for text readability where needed

## Trust Elements
- Client logos strip below hero (grayscale, hover color)
- Security badges in footer
- "As featured in" media mentions
- Real metrics with sources

This creates a conversion-optimized, professional AI agency site that builds trust through visual clarity and strategic emphasis on business results.