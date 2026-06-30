# Grovyn — Web (apps/web)

**The Immersive Property Marketplace.** A Next.js 14 (App Router) + TypeScript +
Tailwind + React Three Fiber frontend for spatial real-estate commerce: a WebGL
landing experience, real-time 3D property models, WebXR AR placement, 360°
virtual tours, an AI concierge, live agent chat, and a multi-user virtual
showroom.

> Built to the shared contract in [`/SPEC.md`](../../SPEC.md).

---

## Quick start

```bash
cd apps/web
cp .env.local.example .env.local   # optional — app works with no backend
npm install
npm run dev                        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

### Environment

| Var | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | REST base (SPEC §5) |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:5000` | Socket.io URL (SPEC §6) |

**No backend required.** Every data fetch tries the API and falls back to
bundled mock data (`lib/mock.ts` — 8 properties) on any error, so the site is
fully alive offline. Auth, chat, showroom presence and AI all degrade
gracefully.

---

## Features

- **Landing `/`** — lazy-loaded R3F hero (rotating procedural city + hero house,
  night environment, bloom + vignette post-processing, contact shadows),
  scroll-reveal storytelling, interactive live 3D demo, featured listings, FAQ,
  CTA. Respects `prefers-reduced-motion` (static gradient fallback).
- **Listings `/properties`** — glass cards, faceted filters (city, type,
  listing, price, bedrooms, amenities), sort, debounced search with
  autocomplete, **voice search** (Web Speech API) and trending chips.
- **Detail `/properties/[slug]`** — the showpiece. Tabbed immersive viewer:
  - **3D** — procedural house from `rooms[]` (extruded volumes, labels,
    measurement hotspots, exploded view) + optional `.glb` via `useGLTF`, with
    an error boundary that falls back to the procedural model.
  - **AR** — WebXR `immersive-ar` via `@react-three/xr` with scale slider and
    reset; QR code + “Open on mobile” + Quick Look / Scene Viewer fallback on
    unsupported devices.
  - **360°** — drei sphere with equirectangular panorama, drag-to-look,
    clickable stop-to-stop hotspots, gradient sky-dome fallback.
  - Gallery + lightbox, specs, amenities, static map, agent card, inquiry form
    (`POST /inquiries`), **live socket chat**, similar + recently-viewed.
- **Compare `/compare`** — 2–4 properties side-by-side with spec table and mini
  rotating 3D thumbnails.
- **Wishlist `/wishlist`** — persisted saves + recently viewed.
- **Auth `/login` `/register`** — JWT via zustand; offline demo auth fallback.
- **Dashboard `/dashboard`** — recharts analytics (views area chart, type pie,
  conversion funnel, top properties bar) + listing management table.
- **AI Concierge** — app-wide floating assistant; `POST /ai/assistant` with
  property card suggestions, voice input, and a local heuristic fallback.
- **Showroom `/showroom`** — shared R3F room with socket presence avatars,
  click-to-teleport, and interactive property pedestals.

---

## Architecture

```
app/                 # App Router routes
components/
  ui/                # design system: GlassCard, MagneticButton, Section, Nav, Footer, PropertyCard
  three/             # R3F scenes (all dynamically imported, ssr:false) + lazy.tsx wrappers
  sections/          # landing storytelling sections
  detail/            # property-detail building blocks
  listings/          # search bar + filters
  concierge/         # AI assistant
  auth/              # auth form
lib/                 # api.ts (axios + mock fallback), mock.ts, socket.ts, format, hooks
store/               # zustand: auth, wishlist, compare, recent
types/               # shared TS models (mirror SPEC §4)
```

**Resilience (SPEC §8):** `lib/api.ts` wraps every call in `tryApi()` which
returns local data on failure. All 3D is dynamically imported with `{ ssr:false }`
and Suspense loaders, so SSR/build never touches WebGL. AR/voice/socket features
feature-detect and never throw on unsupported browsers.

---

## Deploy to Vercel

1. Import the repo; set **Root Directory** to `apps/web`.
2. Framework preset: **Next.js** (build `next build`, output auto).
3. Add env vars `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` (or omit to
   run on mock data).
4. Deploy. Image domains for Unsplash / qrserver / githubusercontent are
   allow-listed in `next.config.mjs`.

> The app builds and renders with zero backend, so a preview deploy works
> immediately.

---

## Accessibility & performance

- Dark theme only (SPEC §2 tokens), AA contrast, semantic HTML, visible focus
  rings, keyboard-navigable nav/forms/tabs.
- `prefers-reduced-motion` honoured globally (CSS) and per-component (3D, magnetic
  buttons, scroll cues).
- 3D uses adaptive DPR and lazy loading to hold 60 FPS; canvases mount only when
  their route/tab is active.
