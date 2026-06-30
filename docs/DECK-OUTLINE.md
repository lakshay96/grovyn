# Grovyn — Pitch Deck Outline (slide-by-slide)

> Source of truth for `Grovyn-Pitch-Deck.pptx`. The generator script `docs/build-deck.js` (pptxgenjs) produces the .pptx directly from this content.
>
> **To generate:**
> ```bash
> cd docs
> npm install pptxgenjs
> node build-deck.js          # → Grovyn-Pitch-Deck.pptx
> ```

**Aesthetic:** premium minimal dark. Obsidian background `#0A0A0F`, gold accent `#C8A24B`, indigo secondary `#6D6AFF`, off-white text `#F5F5F7`, muted `#9A9AB0`. Serif display headlines (Georgia), safe sans body (Calibri). Repeated gold "G" mark motif top-left. Glass-style rounded cards with soft shadows. Minimal text per slide; speaker notes carry the narrative.

---

## Slide 1 — Cover
- **Headline:** "Walk through your next home before you ever set foot in it."
- **Eyebrow:** THE IMMERSIVE PROPERTY MARKETPLACE
- **Sub:** Spatial commerce for real estate — WebGL · 3D · AR · 360° tours · AI concierge · live showroom
- **Visual:** gold "G" lockup; large obsidian field with a soft surface orb + gold glow top-right.
- **Notes:** Open on the brand. Three seconds to signal "this is different."

## Slide 2 — Problem
- **Eyebrow:** THE PROBLEM
- **Headline:** "The biggest purchase of your life, the flattest shopping experience online."
- **2×2 cards:** Space is invisible in photos · Site visits don't scale · Discovery is high-friction · Agents fly blind.
- **Notes:** Highest-value, most emotional purchase — gated behind the least immersive experience on the internet.

## Slide 3 — Solution
- **Eyebrow:** THE SOLUTION
- **Headline:** "Every listing becomes a place you can actually experience."
- **Body:** Walk through in 3D, drop into your room in AR, tour in 360°, discuss live with an agent or AI concierge.
- **5-step rail:** Discover → Walk in 3D → Place in AR → Tour 360° → Talk & decide.
- **Notes:** The hero loop; each step is a WOW moment with a fallback.

## Slide 4 — Product (feature highlights)
- **Eyebrow:** THE PRODUCT
- **Headline:** "Six immersive moments, one premium shell."
- **2×3 grid:** WebGL hero · Walkable 3D · WebXR AR · 360° tours · AI concierge · Live showroom (each with one-line description, gold dot icon).
- **Notes:** Competitors do one; none do all six in one premium shell.

## Slide 5 — AR/VR differentiation
- **Eyebrow:** WHY AR/VR — AND WHY IT NEVER BREAKS
- **Headline:** "Spatial isn't a gimmick here. It's the closest thing to being there."
- **4 rows:** Real-time 3D (R3F + procedural) · WebXR AR (QR/desktop fallback) · 360° + hotspots (sky-dome fallback) · Graceful degradation (cannot hard-fail).
- **Notes:** Not just immersive — resilient. Demo can't break on the evaluator's device.

## Slide 6 — AI layer
- **Eyebrow:** THE INTELLIGENCE LAYER
- **Headline:** "An AI concierge that works even with no API key."
- **Left card — AI surfaces:** concierge · hybrid search · recommendations · review summarizer.
- **Right card — Graceful fallback:** deterministic local heuristic, identical response shape, fully offline. Roadmap: embeddings → vector DB → RAG/voice.
- **Notes:** Intelligence that never goes dark; frontend is agnostic to which path ran.

## Slide 7 — Market / TAM
- **Eyebrow:** MARKET
- **Headline:** "The largest asset class on earth is still shopped with JPEGs."
- **3 stat callouts:** $1T+ (Indian residential by 2030) · ₹ lakhs–crores (avg transaction) · ~0% (listings with native 3D+AR+AI together).
- **Footer:** small conversion lift on a crore-scale deal is real money → premium tooling has a home.
- **Notes:** Huge market, near-zero immersive penetration. Numbers directional/honest.

## Slide 8 — Architecture
- **Eyebrow:** ARCHITECTURE
- **Headline:** "Built to ship in a day, architected to scale for years."
- **3 columns:** Web (Next.js 14, R3F, WebXR) · API (Express, Mongo, Socket.io, AI) · Data & assets (Atlas, Cloudinary, procedural 3D, mock fallback).
- **Footer:** two deployable apps · Vercel + Render · Lighthouse 95+ · 60 FPS · fallbacks everywhere.
- **Notes:** Performance and resilience are first-class.

## Slide 9 — Traction / demo
- **Eyebrow:** TRACTION & DEMO
- **Headline:** "Not just beautiful — a measurable marketplace."
- **Left card — funnel:** View 1,340 → Tour 420 → AR 96 → Inquiry 18.
- **Right card — demo highlights:** WebGL hero · walkable 3D · AR on phone · 360° tour · AI concierge · multi-user showroom.
- **Notes:** Seeded analytics make the dashboard real; then cue the video.

## Slide 10 — Business model
- **Eyebrow:** BUSINESS MODEL
- **Headline:** "Free for buyers. The supply side pays."
- **4 rows:** Agent/brokerage SaaS (Primary) · Featured placement (Primary) · Lead marketplace (Secondary) · Immersive production / capture-as-a-service (Expansion — the moat).
- **Notes:** Liquidity before monetization; charge the side that gets economic value.

## Slide 11 — Roadmap
- **Eyebrow:** ROADMAP
- **Headline:** "From immersive MVP to spatial-commerce platform."
- **4 phase cards:** Now (MVP) · 0–3 mo (liquidity & polish) · 3–6 mo (two-sided marketplace) · 6–12 mo (platform: WebXR multiplayer, RAG/voice, price intelligence).
- **Notes:** Sequencing — liquidity, then monetize, then defensibility.

## Slide 12 — Team & ask
- **Eyebrow:** TEAM & ASK
- **Headline:** "A focused team for an immersive future."
- **Left card — how we work:** product/strategy · frontend · backend · design.
- **Right card — the ask:** capital + partners to fill supply, ship real-vector AI, scale immersive multiplayer. "Liquidity → monetization → defensibility."
- **Notes:** Tie the ask to roadmap sequencing.

## Slide 13 — Closing
- **Headline:** "The future of how we buy homes."
- **Tagline:** Walk through your next home before you ever set foot in it.
- **Footer:** Premium · Immersive · Intelligent.
- **Notes:** Land calmly on obsidian + gold. Restate tagline. Stop.

---

### Notes on count
13 slides as specified, comfortably within the 12–16 range. To extend toward 16, optional inserts: a dedicated **User Journey** slide (the hero loop diagram), a **Competitive landscape** slide (Zillow/Matterport/IKEA gap table), and a **Why now** slide (WebXR maturity + AI inflection). These map directly to `02-USER-JOURNEYS.md`, `01-PRD.md §9`, and `00-DOMAIN-ANALYSIS.md`.
