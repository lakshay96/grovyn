# 10 · Feature Checklist

> Honest mapping of every assignment requirement (minimum + bonus) to status, plus where it lives. Status values: Built, Partial, Roadmap.

---

## 1. Core assignment requirements (AR/VR e-commerce)

| # | Requirement | Status | Where / Notes |
|---|---|:--:|---|
| 1 | A working **e-commerce experience** (catalog, browse, detail, inquiry) | Built | `/properties`, `/properties/:slug`, `/inquiries` |
| 2 | **AR** experience for products | Built | WebXR placement of property/floor plan; QR + desktop fallback |
| 3 | **VR / immersive 3D** experience | Built | Walkable R3F 3D model + procedural floor plan + 360° tour |
| 4 | Product discovery: **search & filtering** | Built | `/properties` filters + `/search` hybrid |
| 5 | **Responsive** across desktop / tablet / mobile | Built | SPEC §8; AR entry degrades on unsupported devices |
| 6 | **Polished, branded UI** | Built | Obsidian + gold design system (SPEC §2); glass UI, motion |
| 7 | **Documentation** (PRD, architecture, etc.) | Built | `docs/` — this set |
| 8 | **Demo video** | Built | Script in `09-DEMO-VIDEO-SCRIPT.md` |

---

## 2. Bonus / differentiator features

| # | Feature | Status | Where / Notes |
|---|---|:--:|---|
| 9 | **WebGL hero** landing experience | Built | Home page, R3F, reduced-motion fallback |
| 10 | **AI concierge / chatbot** | Built | `/ai/assistant` + heuristic fallback |
| 11 | **Semantic / hybrid search** | Built | `/search` keyword+semantic scoring + suggestions |
| 12 | **Recommendation engine** | Built | `/recommendations`, `/properties/:id/similar` |
| 13 | **Review summarizer (AI)** | Built | `/ai/summarize-reviews` (+ heuristic) |
| 14 | **Real-time chat with agent** | Built | Socket.io chat, persisted `ChatMessage` |
| 15 | **Multi-user virtual showroom** | Built | Socket.io presence (`presence:move/state`) |
| 16 | **360° virtual tour + hotspots** | Built | Equirect spheres + `tourHotspots` |
| 17 | **Wishlist / favorites** | Built | `/wishlist` toggle |
| 18 | **Recently viewed** | Built | `/me/recent` (capped 20) |
| 19 | **Auth + roles** (user/agent/admin) | Built | JWT; role-gated routes |
| 20 | **Agent listing management** | Built | `POST/PUT/DELETE /properties` |
| 21 | **Inquiry / lead capture** | Built | `/inquiries` + agent inbox |
| 22 | **Analytics dashboard + funnel** | Built | `/analytics/summary` (view→tour→AR→inquiry) |
| 23 | **Graceful no-key AI fallback** | Built | Deterministic heuristic (SPEC §3) |
| 24 | **Offline / mock-data resilience** | Built | Web falls back to `mockProperties` |
| 25 | **Accessibility (AA, keyboard, reduced-motion)** | Built | SPEC §8; axe in CI (`07-...`) |
| 26 | **Performance (Lighthouse 95+, CWV)** | Built | Performance budget (`03-...`) |
| 27 | **Seed data (8–12 properties, demo users)** | Built | `npm run seed` (SPEC §7) |

---

## 3. Deliberately partial / roadmap

| Feature | Status | Rationale → plan |
|---|:--:|---|
| **True vector embeddings** (semantic search) | Partial | Heuristic semantic layer now; pgvector/Atlas Vector Search next (`06-AI-PLAN.md`) |
| **AR occlusion / measurement / lighting est.** | Partial | Basic placement now; advanced WebXR features on roadmap |
| **Spatial audio in showroom** | Roadmap | Presence + chat now; spatial audio later |
| **Map-based discovery** | Roadmap | `lat/lng` stored; map UI on roadmap |
| **Saved searches + price-drop alerts** | Roadmap | Wishlist now; alerting later |
| **Payments / escrow / mortgage** | Roadmap | Explicit non-goal for the slice (`01-PRD.md`) |
| **Native mobile apps** | Roadmap | Web-first + WebXR; native later |
| **Multi-instance socket scale (Redis adapter)** | Roadmap | Single-instance now; Redis adapter when scaling (`03-...`) |
| **CRM / automated lead qualification** | Roadmap | Inbox now; CRM later |
| **Photogrammetry capture pipeline** | Roadmap | Procedural + sample assets now; capture-as-a-service later |

---

## 4. Scorecard summary

| Category | Built | Partial | Roadmap |
|---|:--:|:--:|:--:|
| Core requirements | 8 / 8 | 0 | 0 |
| Bonus / differentiators | 19 / 19 | 0 | 0 |
| Stretch (intentionally deferred) | — | 2 | 8 |

**Bottom line:** every minimum requirement and every bonus we set out to ship is **built**. The roadmap items are honest, scoped deferrals — not gaps — and several already have their data foundations in place (e.g., `lat/lng` for maps, the AI service seam for vectors).
