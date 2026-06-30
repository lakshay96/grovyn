# 01 · Product Requirements Document

> **Grovyn — The Immersive Property Marketplace**
> *"Walk through your next home before you ever set foot in it."*
> Status: MVP (24h vertical slice) · Owner: Product · Audience: Eng, Design, Evaluators

---

## 1. Vision

Buying a home is the largest, most emotional purchase most people ever make — and it still begins with **flat photographs and a phone call**. Grovyn replaces the photo gallery with a **spatial-commerce surface**: every listing is a place you can walk through in 3D, drop into your own room in AR, tour in 360°, and discuss live with an agent or an AI concierge. Our north star is to **collapse the distance between discovering a property online and standing inside it** — until the browser visit *is* the visit.

---

## 2. Problem

| Problem | Today's reality | Cost |
|---|---|---|
| **Space is invisible in photos** | Buyers can't judge flow, scale, or light from 2D galleries | Wasted site visits, slow decisions, mismatched expectations |
| **High-friction discovery** | Endless filtered lists; nothing conveys *feeling* | Buyers churn; agents chase cold leads |
| **Site visits don't scale** | Physical tours are the bottleneck for both sides | NRIs / out-of-city buyers excluded; agents drown in logistics |
| **Trust gap** | "Will it actually look like this?" | Drop-off at the most valuable stage of the funnel |
| **Agents fly blind** | No signal on which listings or features drive intent | Poor prioritization, weak follow-up |

**One-line problem statement:** *The most expensive purchase decision people make is gated behind the least immersive shopping experience on the internet.*

---

## 3. Target users & personas

### Persona A — **Aanya, the Aspirational Buyer** (primary)
- 29, dual-income urban professional, first serious home purchase, browses at night on mobile + laptop.
- **Jobs:** shortlist quickly, *feel* the space before committing a Saturday to visits, compare confidently, get questions answered instantly.
- **Pains:** photos lie about size; weekends lost to disappointing visits; agents slow to reply.
- **Grovyn win:** 3D walk-through + AR scale check + AI concierge answers at 11pm.

### Persona B — **Rohan, the NRI / Remote Buyer** (high-value)
- 38, based in Dubai, buying in Bengaluru as investment, cannot visit easily.
- **Jobs:** evaluate properties remotely with confidence; tour with family across time zones; talk to a real agent.
- **Grovyn win:** 360° tours + **multi-user virtual showroom** (tour together, live) + persistent agent chat.

### Persona C — **Meera, the Agent** (supply side)
- 34, manages 15–40 active listings, lives in WhatsApp and spreadsheets.
- **Jobs:** publish rich listings fast, capture qualified leads, see what's converting.
- **Grovyn win:** listing management, inquiry inbox, and an **analytics funnel** (view → tour → AR → inquiry).

### Persona D — **Admin / Platform Operator**
- Oversees catalog quality and platform health; needs aggregate analytics and moderation.

---

## 4. Value proposition

| Audience | Value |
|---|---|
| **Buyers** | "See it like you're there." Confidence before the commute. |
| **Agents** | "Qualified intent, not cold clicks." Immersive listings + a measurable funnel. |
| **Platform** | A defensible, premium, **spatial-commerce** brand in a market still shipping JPEGs. |

**Positioning:** *Apple Vision Pro meets Zillow.* Premium, minimal, futuristic — the obvious home for the next decade of property discovery.

---

## 5. Goals & non-goals

### Goals (MVP)
1. Ship a **WebGL hero** landing that signals "this is different" within 3 seconds.
2. Render every property as a **walkable 3D model / procedural floor plan**.
3. Ship **WebXR AR placement** with a graceful mobile-QR fallback.
4. Ship **360° virtual tours** with hotspot navigation.
5. Ship an **AI property concierge** (with no-key heuristic fallback).
6. Ship **live agent chat** + a **multi-user virtual showroom** over Socket.io.
7. Ship **search, filtering, wishlist, recommendations, inquiries, and an analytics dashboard**.
8. Hit **Lighthouse 95+** and graceful degradation everywhere.

### Non-goals (explicitly out of scope for the slice)
- Real payments / escrow / mortgage origination.
- Native iOS/Android apps (web-first; AR via WebXR).
- Production-grade vector DB (heuristic now; roadmap later — see `06-AI-PLAN.md`).
- Photogrammetry pipeline / automated 3D capture (we use procedural + sample assets).
- Multi-tenant brokerage RBAC beyond `user / agent / admin`.

---

## 6. Hidden / implicit requirements surfaced

The brief says "AR/VR e-commerce." A literal reading ships a try-on toy. Reading it as a *Principal PM* surfaces what actually makes it credible:

| Surfaced requirement | Why it matters |
|---|---|
| **Graceful degradation on every immersive feature** | AR isn't universal; a demo that hard-fails on the evaluator's laptop is dead. |
| **Offline / no-key resilience** | The app must be fully functional without a paid AI key or a live DB (mock fallback). |
| **A real funnel, not just features** | "E-commerce" implies conversion — so we instrument view → tour → AR → inquiry. |
| **Two-sided product** | Listings need a supply side (agents) to feel like a marketplace, not a gallery. |
| **Performance as a feature** | 3D + premium brand only impress if they're *fast* (60 FPS, Lighthouse 95+). |
| **Accessibility & reduced-motion** | Immersive ≠ inaccessible; `prefers-reduced-motion`, keyboard nav, AA contrast. |
| **Trust signals** | Ratings, agent identity, review summaries — buyers need to believe what they see. |

Surfacing these is the difference between a tech demo and a product.

---

## 7. Scope — MVP vs. roadmap

| Capability | MVP (now) | Roadmap |
|---|:---:|---|
| WebGL hero landing | ✅ | Generative scene variants |
| Property catalog + filters + search | ✅ | Map-based discovery, saved searches |
| 3D model / procedural floor plan | ✅ | Photogrammetry capture, furniture staging |
| WebXR AR placement | ✅ | Occlusion, measurement tools, lighting estimation |
| 360° virtual tour + hotspots | ✅ | Dollhouse view, guided cinematic tours |
| AI concierge (heuristic + optional LLM) | ✅ | RAG over docs, voice concierge |
| Hybrid search | ✅ | True vector embeddings + reranking |
| Recommendations | ✅ | Collaborative filtering, learned ranking |
| Live agent chat | ✅ | Video, scheduling, co-browsing |
| Multi-user virtual showroom | ✅ | Spatial audio, full WebXR multiplayer |
| Wishlist / recently viewed | ✅ | Price-drop & status alerts |
| Inquiries + agent inbox | ✅ | CRM, automated qualification |
| Analytics funnel dashboard | ✅ | Cohorts, attribution, A/B testing |

---

## 8. Success metrics

| Layer | Metric | Target (directional) |
|---|---|---|
| **Activation** | % of sessions that open a 3D/AR/360 experience | > 40% |
| **Engagement** | Avg. immersive dwell time per session | > 90s |
| **Funnel** | view → tour → AR → inquiry conversion | Track + optimize each step |
| **Lead quality** | Inquiries per 100 immersive sessions | > 5 |
| **Performance** | Lighthouse Performance / A11y | **95+ / 95+** |
| **Resilience** | Features functional with no API key / no DB | **100%** |

---

## 9. Competitive landscape

| Player | What they do | Gap Grovyn exploits |
|---|---|---|
| **Zillow / 99acres / Magicbricks** | Massive listings, photo-first | No native walkable 3D + AR + AI in one premium shell |
| **Matterport** | Best-in-class 3D capture | A *capture tool*, not a consumer marketplace; no AI concierge or showroom |
| **Redfin / Opendoor** | Transactions & iBuying | US-centric, not immersive-first |
| **Furniture AR (IKEA Place)** | Place-the-sofa AR | Single feature, wrong vertical |

**Grovyn's wedge:** the only product that fuses **immersive discovery + AI + live multiplayer** into one branded, premium spatial-commerce platform.

---

## 10. Monetization / business model

| Stream | Mechanic | Stage |
|---|---|---|
| **Agent / brokerage SaaS** | Tiered subscriptions for listing slots, 3D/AR tooling, analytics | Primary |
| **Featured placement** | Pay-to-feature listings (`featured` flag already in schema) | Primary |
| **Lead marketplace** | Per-qualified-inquiry pricing for agents | Secondary |
| **Immersive production** | Premium 3D/360 capture-as-a-service | Expansion |
| **Concierge premium** | AI + human white-glove buyer concierge | Expansion |
| **Developer launches** | Sponsored virtual showrooms for new projects | Expansion |

**Why it works:** the buyer side is free (drives liquidity), and the *supply side pays* for reach, tooling, and qualified intent — the classic high-margin marketplace SaaS shape, with immersive production as a defensible moat.
