# Grovyn API

Backend for **Grovyn — The Immersive Property Marketplace**.
Node + Express + TypeScript + MongoDB (Mongoose) + JWT + Socket.io.

The API degrades gracefully: it boots even if MongoDB is unreachable, and all AI
features work **without** an OpenAI key (a deterministic local heuristic answers
using the property catalog).

---

## Quick start

```bash
cd apps/api
cp .env.example .env          # adjust values as needed
npm install
npm run seed                  # requires a reachable MongoDB; idempotent
npm run dev                   # http://localhost:5000
```

Health check:

```bash
curl http://localhost:5000/api/health      # → { "ok": true, "db": "connected" }
```

### npm scripts

| Script        | What it does                                            |
| ------------- | ------------------------------------------------------- |
| `npm run dev` | Hot-reload dev server via `tsx watch src/index.ts`      |
| `npm run build` | Type-check + compile to `dist/` with `tsc`            |
| `npm start`   | Run the compiled server (`node dist/index.js`)          |
| `npm run seed`| Clear + insert 10 properties and 3 demo users (idempotent) |
| `npm run lint`| `tsc --noEmit` type check                               |

---

## Environment variables (`.env`)

| Var              | Default                                  | Notes                                            |
| ---------------- | ---------------------------------------- | ------------------------------------------------ |
| `PORT`           | `5000`                                   | HTTP + Socket.io port                            |
| `MONGODB_URI`    | `mongodb://127.0.0.1:27017/grovyn`       | Local or Atlas URI                               |
| `JWT_SECRET`     | `change-me-in-prod`                      | **Set a strong value in prod**                   |
| `JWT_EXPIRES`    | `7d`                                     | Token lifetime                                   |
| `CLIENT_ORIGIN`  | `http://localhost:3000`                  | CORS + Socket.io origin (the web app)            |
| `OPENAI_API_KEY` | *(empty)*                                | Optional. Empty → local heuristic AI fallback    |

---

## Demo users (after `npm run seed`)

| Role  | Email             | Password      |
| ----- | ----------------- | ------------- |
| agent | `agent@grovyn.in` | `password123` |
| user  | `demo@grovyn.in`  | `password123` |
| admin | `admin@grovyn.in` | `password123` |

---

## REST API (base `/api`)

| Method | Path                          | Auth          | Description                                    |
| ------ | ----------------------------- | ------------- | ---------------------------------------------- |
| GET    | `/health`                     | —             | Liveness + DB status                           |
| POST   | `/auth/register`              | —             | `{name,email,password}` → `{user, token}`      |
| POST   | `/auth/login`                 | —             | `{email,password}` → `{user, token}`           |
| GET    | `/auth/me`                    | bearer        | Current user                                   |
| GET    | `/properties`                 | —             | Filter/sort/paginate → `{items,total,page,pages}` |
| GET    | `/properties/:slug`           | —             | Detail; increments views, logs `view` event    |
| POST   | `/properties`                 | agent/admin   | Create (auto-slug)                             |
| PUT    | `/properties/:id`             | agent/admin   | Update                                         |
| DELETE | `/properties/:id`             | agent/admin   | Delete                                         |
| GET    | `/properties/:id/similar`     | —             | Content-based similar listings                 |
| GET    | `/search?q=`                  | —             | Hybrid keyword+semantic → `{items,suggestions}`|
| GET    | `/search/suggest?q=`          | —             | Autocomplete → `{suggestions}`                 |
| GET    | `/search/trending`            | —             | `{trending}`                                   |
| GET    | `/wishlist`                   | bearer        | Wishlist items                                 |
| POST   | `/wishlist/:propertyId`       | bearer        | Toggle → `{wishlist}`                           |
| GET    | `/me/recent`                  | bearer        | Recently viewed items                          |
| POST   | `/me/recent/:propertyId`      | bearer        | Record a recently-viewed property              |
| GET    | `/recommendations`            | optional      | `{items, reason}`                              |
| POST   | `/ai/assistant`               | optional      | Concierge → `{reply, suggestedProperties?}`    |
| POST   | `/ai/summarize-reviews`       | —             | `{propertyId}` → `{summary}`                    |
| POST   | `/inquiries`                  | optional      | Create inquiry; logs event                     |
| GET    | `/inquiries`                  | agent/admin   | List inquiries                                 |
| GET    | `/analytics/summary`          | agent/admin   | Dashboard aggregations                         |
| POST   | `/analytics/event`            | —             | Fire-and-forget event ingestion                |

`/auth/*` is rate-limited (30 requests / 15 min / IP).

Error envelope: `{ "error": { "message": string, "code"?: string } }`.

---

## Socket.io (default namespace, URL = `SOCKET_URL`)

Per-property chat rooms (persisted history) + multi-user showroom presence.

**Client → server:** `room:join {roomId,user}`, `chat:send {roomId,text}`,
`presence:move {roomId,position,rotationY}`

**Server → client:** `chat:history {messages}` (on join), `chat:new {message}`,
`presence:state {peers}`, `presence:leave {id}`

CORS origin = `CLIENT_ORIGIN`.

---

## Project structure

```
src/
├── config/        env + lazy Mongo connection
├── models/        Mongoose schemas (User, Property, Inquiry, ChatMessage, AnalyticsEvent)
├── controllers/   request handlers
├── routes/        Express routers (mounted under /api)
├── middleware/    auth, validation (zod), error handler, rate limiter
├── services/      search, similarity, recommendations, AI, analytics
├── sockets/       Socket.io chat + presence
├── utils/         ApiError, asyncHandler, jwt, slug, text, zod schemas
├── seed/          seed script + procedural catalog data
├── types/         shared TS types + Express augmentation
├── app.ts         Express app factory
└── index.ts       HTTP + Socket.io bootstrap
```

---

## Deploy to Render

1. **New → Web Service**, point at this repo, root directory `apps/api`.
2. **Build command:** `npm install && npm run build`
3. **Start command:** `npm start`
4. **Environment:** add `MONGODB_URI` (Mongo Atlas), `JWT_SECRET`,
   `CLIENT_ORIGIN` (your Vercel web URL), and optionally `OPENAI_API_KEY`.
   `PORT` is provided by Render automatically.
5. After first deploy, optionally run `npm run seed` once from a shell with the
   production `MONGODB_URI` set.

> Socket.io works over Render's web service (HTTP upgrade). Ensure the web app's
> `NEXT_PUBLIC_SOCKET_URL` points at the Render URL and that `CLIENT_ORIGIN`
> matches the web origin for CORS.
```
