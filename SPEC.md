# Grovyn — Shared Build Contract (SPEC)

> **Product:** **Grovyn** — *The Immersive Property Marketplace.*
> Tagline: **"Walk through your next home before you ever set foot in it."**
> A spatial-commerce platform for real estate: WebGL landing, 3D property
> models, WebXR AR placement, 360° virtual tours, an AI property concierge,
> live agent chat, and a multi-user virtual showroom.

This file documents the data shapes and route paths both apps are built against.
Do not change them without updating this file.

---

## 1. Monorepo layout

```
grovyn/
├── apps/
│   ├── web/        # Next.js 14 (App Router) + TS + Tailwind + R3F
│   └── api/        # Node + Express + Mongoose + JWT + Socket.io
├── docs/           # PRD, architecture, schema, API, deck
├── SPEC.md         # this file
└── README.md       # root quickstart
```

Each app is **independently installable** (its own `package.json`). No root
workspace tooling required — keeps deployment to Vercel (web) + Render (api)
trivial.

---

## 2. Brand & design system

- **Aesthetic:** premium, minimal, futuristic. Deep obsidian canvas, glass
  surfaces used sparingly, warm metallic-gold accent. Think Apple Vision Pro
  meets Linear.
- **Color tokens (CSS vars in `globals.css`):**
  - `--bg: #0A0A0F` (obsidian)  ·  `--surface: #14141C`  ·  `--surface-2: #1C1C28`
  - `--text: #F5F5F7`  ·  `--muted: #9A9AB0`
  - `--accent: #C8A24B` (gold)  ·  `--accent-2: #6D6AFF` (electric indigo)
  - `--success: #36D399` · `--danger: #F87272`
- **Type:** display = "Clash Display" or fallback `Sora`; body = `Inter`.
  Use `next/font`. Generous spacing, large hero type (clamp to ~7rem).
- **Motion:** Framer Motion for UI, GSAP optional for scroll. Always respect
  `prefers-reduced-motion`. Target 60 FPS; lazy-load all 3D.
- **Components:** glass cards, magnetic buttons, scroll-reveal, sticky nav with
  blur. Dark mode is the default (and only required) theme.

---

## 3. Environment variables

**apps/api/.env**
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/grovyn      # or Mongo Atlas URI
JWT_SECRET=change-me-in-prod
JWT_EXPIRES=7d
CLIENT_ORIGIN=http://localhost:3000
OPENAI_API_KEY=                                    # optional; AI falls back to local heuristic
```

**apps/web/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

> **AI must degrade gracefully:** if `OPENAI_API_KEY` is empty, recommendation /
> assistant / semantic-search endpoints use a deterministic local heuristic
> (embedding-free scoring) so the app is fully functional offline.

---

## 4. Data models (Mongoose)

### User
```ts
{
  _id, name: string, email: string (unique, lowercase),
  passwordHash: string,
  role: "user" | "agent" | "admin" = "user",
  avatarUrl?: string,
  phone?: string,
  wishlist: ObjectId[]  // Property refs
  recentlyViewed: ObjectId[]  // capped 20
  createdAt, updatedAt
}
```

### Property
```ts
{
  _id,
  slug: string (unique),
  title: string,
  description: string,
  price: number,                       // in INR
  listingType: "sale" | "rent",
  propertyType: "apartment" | "villa" | "plot" | "commercial" | "penthouse",
  status: "available" | "under_offer" | "sold" = "available",
  location: {
    address: string, city: string, state: string, country: string,
    lat: number, lng: number
  },
  bedrooms: number, bathrooms: number,
  areaSqft: number,
  yearBuilt?: number,
  amenities: string[],                 // e.g. ["Pool","Gym","Smart Home"]
  images: string[],                    // hero + gallery (Unsplash URLs ok)
  model3dUrl?: string,                 // .glb URL (Khronos/3D sample or placeholder)
  panoramaUrls: string[],              // equirectangular 360 tour stops
  floorPlanUrl?: string,               // image; 3D floor plan rendered from rooms[]
  rooms?: { name: string, w: number, d: number, x: number, z: number }[], // for procedural 3D floor plan
  tourHotspots?: { panoramaIndex: number, label: string, yaw: number, pitch: number, target?: number }[],
  agent: { name: string, phone: string, email: string, avatarUrl?: string },
  featured: boolean = false,
  rating?: number, views: number = 0,
  createdAt, updatedAt
}
```

### Inquiry
```ts
{ _id, property: ObjectId, user?: ObjectId,
  name, email, phone, message,
  preferredDate?: string, type: "visit" | "callback" | "info" = "info",
  status: "new" | "contacted" | "closed" = "new", createdAt }
```

### ChatMessage  (persisted; also broadcast via socket)
```ts
{ _id, roomId: string, sender: { id?, name, role }, text: string, createdAt }
```

### AnalyticsEvent
```ts
{ _id, type: "view" | "ar_launch" | "tour_open" | "inquiry" | "wishlist" | "search",
  property?: ObjectId, meta?: object, createdAt }
```

---

## 5. REST API contract  (base: `/api`)

All JSON. Auth via `Authorization: Bearer <jwt>`. Errors:
`{ error: { message: string, code?: string } }` with proper HTTP status.

### Auth
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/register` | `{name,email,password}` | `{user, token}` |
| POST | `/auth/login` | `{email,password}` | `{user, token}` |
| GET | `/auth/me` | — (auth) | `{user}` |

`user` never includes `passwordHash`.

### Properties
| Method | Path | Notes |
|---|---|---|
| GET | `/properties` | query: `q, city, propertyType, listingType, minPrice, maxPrice, bedrooms, amenities (csv), sort (price_asc|price_desc|newest|popular), page=1, limit=12, featured`. Returns `{ items: Property[], total, page, pages }` |
| GET | `/properties/:slug` | increments `views`, logs `view` event → `{ property }` |
| POST | `/properties` | auth role agent/admin → `{ property }` |
| PUT | `/properties/:id` | auth agent/admin |
| DELETE | `/properties/:id` | auth agent/admin |
| GET | `/properties/:id/similar` | content-based similar → `{ items }` |

### Search (hybrid)
| GET | `/search?q=...` | semantic+keyword scored results → `{ items, suggestions: string[] }` |
| GET | `/search/suggest?q=...` | autocomplete → `{ suggestions: string[] }` |
| GET | `/search/trending` | → `{ trending: string[] }` |

### Wishlist (auth)
| GET | `/wishlist` | → `{ items: Property[] }` |
| POST | `/wishlist/:propertyId` | toggle → `{ wishlist: string[] }` |

### Recently viewed (auth)
| GET | `/me/recent` | → `{ items: Property[] }` |

### Recommendations
| GET | `/recommendations` | auth optional; uses wishlist+recent or trending fallback → `{ items: Property[], reason: string }` |

### AI assistant
| POST | `/ai/assistant` | `{ messages: {role,content}[], context?: {propertyId?} }` → `{ reply: string, suggestedProperties?: Property[] }`. Falls back to heuristic if no key. |
| POST | `/ai/summarize-reviews` | `{ propertyId }` → `{ summary }` |

### Inquiries
| POST | `/inquiries` | `{property, name,email,phone,message,preferredDate,type}` → `{ inquiry }`, logs event |
| GET | `/inquiries` | auth agent/admin → `{ items }` |

### Analytics (auth admin/agent)
| GET | `/analytics/summary` | → `{ totals:{properties,users,inquiries,views,arLaunches}, viewsByDay:[{date,count}], topProperties:[{title,views}], byType:[{type,count}], funnel:{view,tour,ar,inquiry} }` |
| POST | `/analytics/event` | `{type, property?, meta?}` (public, fire-and-forget) |

### Health
| GET | `/health` | → `{ ok: true }` |

---

## 6. Socket.io events  (namespace default, URL = SOCKET_URL)

**Real-time chat (per property room) + multi-user virtual showroom presence.**

Client → server:
- `room:join` `{ roomId, user:{id?,name,role} }`
- `chat:send` `{ roomId, text }`
- `presence:move` `{ roomId, position:[x,y,z], rotationY }`   // showroom avatars

Server → client:
- `chat:history` `{ messages: ChatMessage[] }`  (on join)
- `chat:new` `{ message: ChatMessage }`
- `presence:state` `{ peers: { id, name, position, rotationY }[] }`
- `presence:leave` `{ id }`

---

## 7. Seed data (`npm run seed`)

Seed **8–12 properties** across Mumbai, Bengaluru, Goa, Gurugram with:
- Real Unsplash image URLs (architecture/interior queries).
- `model3dUrl`: use a public sample `.glb` (e.g. Khronos
  `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/...`)
  OR leave undefined and the web app renders a procedural 3D house from `rooms[]`.
- `panoramaUrls`: 1–3 equirectangular images (Unsplash/poly haven style) per
  property for the 360 tour. If unavailable, web app shows a gradient sky dome.
- `rooms[]`: 4–6 rooms with w/d/x/z so the web app can render a **procedural 3D
  floor plan** (no external asset needed — guaranteed to work offline).
- 1 demo `agent` user (email `agent@grovyn.in` / `password123`) and 1 normal
  user (`demo@grovyn.in` / `password123`), 1 admin (`admin@grovyn.in`).

---

## 8. Non-negotiables

- **TypeScript** everywhere. `npm run build` must pass before shipping.
- **Graceful fallbacks**: no feature may hard-crash if Mongo/AI/3D-asset is
  missing. The web app must render with mock data if API is unreachable
  (`NEXT_PUBLIC_API_URL` fetch fails → fall back to bundled `mockProperties`).
- **Responsive**: desktop, tablet, mobile. AR/VR entry points degrade to a
  "Open on mobile / scan QR" affordance on unsupported devices.
- **Accessibility**: semantic HTML, keyboard nav, `prefers-reduced-motion`,
  visible focus states, AA contrast.
- **No secrets in code.** Read from env.
