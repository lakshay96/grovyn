# 02 · User Journeys

> How real people move through Grovyn. Each journey is written as a narrative + a flow diagram, grounded in the actual routes and sockets in `SPEC.md`.

---

## Personas at a glance

| Persona | Role | Primary journey |
|---|---|---|
| **Aanya** — aspirational buyer | `user` | Browse → 3D → AR → tour → inquiry |
| **Rohan** — NRI / remote buyer | `user` | Shortlist → 360° tour → virtual showroom (together) → agent chat |
| **Meera** — agent | `agent` | Create listing → manage → inquiry inbox → analytics |
| **Concierge** — AI layer | system | Conversational discovery across all journeys |

---

## Journey 1 — Buyer: from browse to inquiry (the hero loop)

**Narrative.** Aanya lands on the Grovyn home page. A WebGL hero pulls her in; within seconds she understands this isn't another listings site. She searches "3BHK Bengaluru with pool," lands on a filtered grid, and opens a villa. The detail page loads a **walkable 3D model** — she orbits it, steps through rooms, then taps **View in AR** to scale-check the layout against her own living room. Still curious about flow, she opens the **360° tour** and hops between rooms via hotspots. Convinced, she hits **Request a visit**, the inquiry is logged, and the funnel records every step she took.

```mermaid
flowchart LR
  A[WebGL hero landing] --> B[Search / filter<br/>GET /properties]
  B --> C[Property detail<br/>GET /properties/:slug<br/>logs 'view']
  C --> D[Walkable 3D model<br/>R3F / procedural floor plan]
  D --> E[View in AR<br/>WebXR · logs 'ar_launch']
  C --> F[360 virtual tour<br/>panoramas + hotspots · logs 'tour_open']
  E --> G[Wishlist / compare<br/>POST /wishlist/:id]
  F --> G
  G --> H[Request a visit<br/>POST /inquiries · logs 'inquiry']
  H --> I[Agent inbox + confirmation]
```

**Instrumented funnel:** `view → tour_open → ar_launch → inquiry` (each emits an `AnalyticsEvent`, surfaced in the agent/admin dashboard).

**Fallbacks along the path:**
- No WebXR? → **"Open on mobile / scan QR"** affordance; desktop keeps the interactive 3D view.
- No `.glb`? → **procedural 3D floor plan** from `rooms[]`.
- No panoramas? → gradient sky-dome tour still renders.
- API unreachable? → bundled `mockProperties` keeps the whole flow alive.

---

## Journey 2 — Remote buyer: touring together (the showroom)

**Narrative.** Rohan, in Dubai, has shortlisted a penthouse. He opens the **360° tour**, then invites his wife into the **multi-user virtual showroom**. Their avatars appear in the same space; as he moves, she sees him move (`presence:move` → `presence:state`). They discuss in **live chat**, which is persisted and also reaches the agent. When they have a question, the agent joins the same room and answers in real time. No flights, no time-zone gymnastics — a shared visit from two continents.

```mermaid
sequenceDiagram
  participant R as Rohan (browser)
  participant W as Wife (browser)
  participant S as Socket.io server
  participant A as Agent

  R->>S: room:join {roomId, user}
  S-->>R: chat:history {messages}
  W->>S: room:join {roomId, user}
  S-->>R: presence:state {peers:[wife]}
  S-->>W: presence:state {peers:[rohan]}
  R->>S: presence:move {position, rotationY}
  S-->>W: presence:state (updated)
  R->>S: chat:send {text}
  S-->>W: chat:new {message}
  A->>S: room:join (agent)
  A->>S: chat:send {text}
  S-->>R: chat:new {message}
  S-->>W: chat:new {message}
```

**Key point:** chat is **persisted** (`ChatMessage`) *and* broadcast, so the conversation survives reconnects and is visible to the agent later.

---

## Journey 3 — Agent: listing → leads → insight

**Narrative.** Meera signs in as an `agent`. She creates a listing — title, price, location, amenities, images, optional `.glb`, panoramas, and `rooms[]` for the procedural floor plan. It goes live and starts collecting views. Inquiries land in her **inbox** (`GET /inquiries`). On her **analytics dashboard** she sees the funnel — which listings get viewed, toured, AR-launched, and inquired about — so she knows exactly where to spend her follow-up energy.

```mermaid
flowchart LR
  L[Login as agent<br/>POST /auth/login] --> M[Create listing<br/>POST /properties]
  M --> N[Edit / manage<br/>PUT / DELETE /properties/:id]
  N --> O[Listing live<br/>accrues views + events]
  O --> P[Inquiry inbox<br/>GET /inquiries]
  O --> Q[Analytics dashboard<br/>GET /analytics/summary]
  Q --> R[Funnel + top properties<br/>view→tour→ar→inquiry]
  P --> S[Follow up with qualified leads]
  R --> S
```

---

## Journey 4 — AI concierge (cross-cutting)

**Narrative.** At any point, Aanya opens the concierge: *"Find me a 2BHK under ₹1.5Cr in Bengaluru near a park, good for resale."* The concierge interprets intent, queries the catalog, and replies conversationally with **suggested properties** inline. If an `OPENAI_API_KEY` is configured it uses an LLM; if not, it falls back to a **deterministic heuristic** that scores listings on the same signals — so the experience never breaks. On a property page she can also ask the concierge to **summarize the reviews**.

```mermaid
flowchart TD
  U[User message<br/>POST /ai/assistant] --> K{OPENAI_API_KEY set?}
  K -->|yes| L[LLM: intent + grounded reply]
  K -->|no| H[Heuristic: keyword + facet scoring]
  L --> M[Reply + suggestedProperties]
  H --> M
  M --> N[Rendered in chat with property cards]
  U2[Ask 'summarize reviews'<br/>POST /ai/summarize-reviews] --> S[Summary card]
```

**Why it matters:** the concierge turns Grovyn from a *filtered list* into a *conversation* — and the heuristic fallback guarantees it works in any environment, including the evaluator's offline laptop.

---

## Cross-journey principles

1. **Every immersive step is logged** → the funnel is the product's spine.
2. **Every immersive step has a fallback** → the demo cannot hard-fail.
3. **Real-time is shared, not solo** → chat + showroom make property *social*.
4. **AI is ambient** → discovery is conversational wherever you are.
