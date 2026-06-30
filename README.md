<div align="center">

# Grovyn — The Immersive Property Marketplace

**Walk through your next home before you ever set foot in it.**

An AR/VR real-estate platform: a WebGL landing experience, 3D property models,
WebXR AR placement, 360° virtual tours, an AI property concierge, live agent
chat, and a multi-user virtual showroom.

`Next.js 14` · `React Three Fiber` · `WebXR` · `Express` · `MongoDB` · `Socket.io` · `TypeScript`

</div>

---

## What's inside

```
grovyn/
├── apps/
│   ├── web/        Next.js 14 (App Router) + TS + Tailwind + R3F + WebXR
│   └── api/        Express + Mongoose + JWT + Socket.io
├── docs/           Domain analysis, PRD, architecture, API, deck, demo script
├── SPEC.md         Shared data models, API and socket contract
└── README.md
```

`SPEC.md` documents the data shapes, REST endpoints and socket events both apps
share — read it first to understand the system end to end.

## Highlights

- **Immersive WebGL landing** — lazy-loaded R3F hero (rotating procedural city +
  glass house, environment lighting, contact shadows, bloom), scroll-reveal
  storytelling, reduced-motion fallback.
- **3D property viewer** — procedural house generated from each listing's
  `rooms[]` plus optional `.glb` loading, exploded view, measurement hotspots,
  orbit controls, PBR + contact shadows.
- **AR ("View in your room")** — WebXR `immersive-ar` via `@react-three/xr`
  with scale + reset; QR / Quick Look / Scene Viewer fallback on unsupported
  devices.
- **360° virtual tours** — equirectangular panoramas with clickable
  stop-to-stop hotspots and a sky-dome fallback.
- **AI property concierge** — chat assistant that returns a reply + suggested
  listings; works with or without an OpenAI key (deterministic heuristic
  fallback).
- **Hybrid search + voice search**, **wishlist + compare**, **JWT auth**,
  **agent/admin analytics dashboard**, **live socket chat**, and a
  **multi-user virtual showroom** with presence avatars.
- **Resilient by design** — the web app falls back to bundled mock data if the
  API is unreachable, so it stays usable even with no backend running.

## Quickstart

Requires **Node 18+**. MongoDB is optional for the frontend (it falls back to
mock data) and required for real persistence.

**1 — Backend** (`apps/api`)
```bash
cd apps/api
cp .env.example .env          # set MONGODB_URI, a strong JWT_SECRET, OPENAI_API_KEY (optional)
npm install
npm run seed                  # loads 10 demo properties + demo users (needs Mongo)
npm run dev                   # http://localhost:5050  (GET /api/health)
```

Generate a strong `JWT_SECRET` with `openssl rand -hex 32`. The server refuses to
boot in production with a weak or missing secret.

**2 — Frontend** (`apps/web`)
```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5050/api
npm install
npm run dev                        # http://localhost:3000
```

**Demo accounts** (after seeding): `demo@grovyn.in` · `agent@grovyn.in` ·
`admin@grovyn.in` — all password `password123`.

## Deployment

| Layer | Service | Notes |
|---|---|---|
| Web | **Vercel** | Root `apps/web`. Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`. |
| API | **Render / Railway** | Root `apps/api`. Build `npm install && npm run build`, start `npm start`. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `OPENAI_API_KEY` (optional). |
| DB | **MongoDB Atlas** | Free tier; whitelist the API host. |
| Media | Unsplash URLs (seeded) / Cloudinary (optional) | No upload pipeline required for the demo. |

Full step-by-step in `docs/08-DEPLOYMENT.md`.

## Documentation

The `docs/` folder is a complete product package: `00-DOMAIN-ANALYSIS`,
`01-PRD`, `02-USER-JOURNEYS`, `03-ARCHITECTURE`, `04-DATA-MODEL`,
`05-API-CONTRACT`, `06-AI-PLAN`, `07-TESTING-STRATEGY`, `08-DEPLOYMENT`,
`09-DEMO-VIDEO-SCRIPT`, `10-FEATURE-CHECKLIST`, `11-ROADMAP`, plus the pitch
deck (`build-deck.js` + `DECK-OUTLINE.md`).

## License

MIT
