# 00 · Domain Analysis & Decision

> **Grovyn — The Immersive Property Marketplace**
> *"Walk through your next home before you ever set foot in it."*

The assignment offered three candidate domains for an **AR/VR-powered e-commerce experience**: **Real Estate**, **Jewelry**, and **General E-Commerce**. Before writing a single line of product, we ran each domain through a five-axis decision framework. This document captures that analysis and the rationale for choosing **Real Estate**.

---

## 1. The decision framework

We scored each domain (1–5, higher is better) across five axes that jointly predict whether a 24-hour build can read as a *funded company* rather than a class project:

| Axis | What it measures |
|---|---|
| **Market opportunity** | Size of the addressable market, deal value, willingness to pay, digitization gap |
| **AR/VR suitability** | How much the product *benefits* from spatial visualization vs. a flat photo |
| **Innovation potential** | Headroom to do something novel an evaluator hasn't seen ten times |
| **24h technical feasibility** | Can a genuinely impressive vertical slice ship in one day with web tech? |
| **WOW factor** | Likelihood the demo produces an audible reaction |

---

## 2. Scorecard

| Domain | Market Opportunity | AR/VR Suitability | Innovation Potential | 24h Feasibility | WOW Factor | **Total** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Real Estate** | **5** | **5** | **5** | **4** | **5** | **24** |
| Jewelry | 3 | 4 | 3 | 5 | 4 | 19 |
| General E-Commerce | 4 | 2 | 2 | 4 | 2 | 14 |

---

## 3. Domain-by-domain reasoning

### Real Estate — *chosen*

- **Market opportunity (5):** Real estate is the single largest asset class on earth. Indian residential real estate alone is a **~$300B+** market projected to cross **$1T by 2030**, yet property discovery is still dominated by static photo galleries and PDF brochures. The *average transaction value is enormous* (lakhs to crores), which means even a small conversion lift is worth real money — and justifies premium tooling.
- **AR/VR suitability (5):** This is the killer fit. A buyer cannot meaningfully judge *space* — flow, scale, light, the feel of a room — from photos. AR/VR is not a gimmick here; it is the closest possible substitute for the physical visit that drives the purchase. Spatial visualization maps **1:1** onto the buying decision.
- **Innovation potential (5):** Room to combine WebGL hero experiences, procedural 3D floor plans, WebXR placement, 360° tours, an **AI property concierge**, and a **multi-user virtual showroom** into one coherent spatial-commerce surface. Most competitors do *one* of these, none do all in a unified premium shell.
- **24h feasibility (4):** Achievable with React Three Fiber + WebXR + a procedural-geometry fallback (no dependence on heavy external 3D assets). The one point off reflects honest AR device-coverage limits, which we handle with graceful QR/desktop fallbacks.
- **WOW factor (5):** "Walk through the house in your browser, then drop it into your living room in AR, then tour it in 360°, then ask an AI which one fits your budget" is a demo that lands.

### Jewelry — strong runner-up

- Excellent for AR *try-on* (ring/necklace on hand/neck via face/hand tracking) and the smallest, easiest 3D assets, making it the **most feasible** in 24h.
- But the **market and deal-value ceiling is lower**, the innovation space is crowded (every luxury brand ships a try-on), and the experience is essentially a single AR feature rather than a platform. It wows, but it doesn't scale into a *company narrative* the way real estate does.

### General E-Commerce — rejected

- Large market, but **AR suitability is weak**: most SKUs (apparel, electronics, groceries) gain little from spatial rendering, and the few that do (furniture) are exactly what IKEA/Amazon already solved. Innovation potential is low and the WOW factor is muted because evaluators have seen "place-the-sofa" demos for years. Building it well in 24h produces a *competent* result, not a *memorable* one.

---

## 4. Why Real Estate wins — the one-paragraph version

Real estate is where **AR/VR stops being a feature and becomes the product**. It is the only one of the three where spatial understanding is *the* decision driver, where the transaction value justifies premium immersive tooling, and where we can stack six distinct WOW moments — WebGL hero, walkable 3D house, AR placement, 360° tour, AI concierge, live virtual showroom — into a single coherent platform. It maximizes every axis simultaneously: biggest market, best AR fit, most innovation headroom, and the strongest demo. The runner-up (jewelry) is *easier* but *smaller*; the loser (general e-comm) is *familiar* but *flat*. We optimized for the brief's actual intent — show what AR/VR commerce can become — and that points unambiguously at property.

---

## 5. Risks we accepted (and how we de-risk them)

| Risk | Mitigation |
|---|---|
| AR not supported on all devices | WebXR feature-detection → **QR "open on mobile"** affordance; desktop sees an interactive 3D fallback |
| Heavy 3D assets slow / unavailable | **Procedural 3D floor plan** generated from `rooms[]` — zero external dependency, works offline |
| AI requires paid API key | **Deterministic local heuristic** fallback for concierge, search, and recommendations (see `06-AI-PLAN.md`) |
| API/DB down during demo | Web app falls back to bundled `mockProperties` and still renders fully |

Every WOW moment has a fallback path, so the demo cannot hard-fail — a non-negotiable for a one-day, high-stakes build.
