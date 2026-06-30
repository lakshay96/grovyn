# 05 · API Contract

> Clean reference for the REST + Socket.io contract from `SPEC.md §5–§6`, with example requests/responses. **Base URL:** `/api`. All JSON. Auth via `Authorization: Bearer <jwt>`.

**Error envelope (all endpoints):**
```json
{ "error": { "message": "Human-readable reason", "code": "OPTIONAL_CODE" } }
```
Returned with the correct HTTP status (`400/401/403/404/409/500`).

---

## 1. Auth

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/register` | — | `{name,email,password}` | `{ user, token }` |
| POST | `/auth/login` | — | `{email,password}` | `{ user, token }` |
| GET | `/auth/me` | Built | — | `{ user }` |

> `user` **never** includes `passwordHash`.

**Example — register**
```http
POST /api/auth/register
Content-Type: application/json

{ "name": "Aanya Rao", "email": "aanya@example.com", "password": "secret123" }
```
```json
{
  "user": { "_id": "664...", "name": "Aanya Rao", "email": "aanya@example.com", "role": "user", "wishlist": [], "recentlyViewed": [] },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Properties

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/properties` | — | filter/sort/paginate (below) |
| GET | `/properties/:slug` | — | increments `views`, logs `view` event |
| POST | `/properties` | agent/admin | create |
| PUT | `/properties/:id` | agent/admin | update |
| DELETE | `/properties/:id` | agent/admin | delete |
| GET | `/properties/:id/similar` | — | content-based similar listings |

**`GET /properties` query params:** `q, city, propertyType, listingType, minPrice, maxPrice, bedrooms, amenities (csv), sort (price_asc|price_desc|newest|popular), page=1, limit=12, featured`

**Example — list**
```http
GET /api/properties?city=Bengaluru&propertyType=villa&minPrice=10000000&amenities=Pool,Gym&sort=price_desc&page=1&limit=12
```
```json
{
  "items": [
    { "_id": "...", "slug": "villa-by-the-bay", "title": "Villa by the Bay", "price": 48500000,
      "listingType": "sale", "propertyType": "villa", "status": "available",
      "location": { "city": "Bengaluru", "state": "Karnataka", "country": "India", "lat": 12.97, "lng": 77.59 },
      "bedrooms": 4, "bathrooms": 5, "areaSqft": 4200,
      "amenities": ["Pool","Gym","Smart Home"], "images": ["https://..."],
      "featured": true, "rating": 4.7, "views": 312 }
  ],
  "total": 1, "page": 1, "pages": 1
}
```

**Example — detail**
```http
GET /api/properties/villa-by-the-bay
```
```json
{ "property": { "...full Property object including model3dUrl, panoramaUrls, rooms, tourHotspots, agent": "..." } }
```

**Example — create (agent)**
```http
POST /api/properties
Authorization: Bearer <agent-jwt>
Content-Type: application/json

{ "slug":"skyline-penthouse","title":"Skyline Penthouse","price":92000000,"listingType":"sale",
  "propertyType":"penthouse","location":{"address":"...","city":"Mumbai","state":"MH","country":"India","lat":19.07,"lng":72.87},
  "bedrooms":3,"bathrooms":4,"areaSqft":3100,"amenities":["Pool","Concierge"],"images":["https://..."],
  "rooms":[{"name":"Living","w":6,"d":5,"x":0,"z":0}] }
```
```json
{ "property": { "_id":"...","slug":"skyline-penthouse","views":0,"status":"available", "...":"..." } }
```

---

## 3. Search (hybrid)

| Method | Path | Returns |
|---|---|---|
| GET | `/search?q=...` | `{ items, suggestions: string[] }` (semantic + keyword scored) |
| GET | `/search/suggest?q=...` | `{ suggestions: string[] }` (autocomplete) |
| GET | `/search/trending` | `{ trending: string[] }` |

**Example**
```http
GET /api/search?q=sea facing 3bhk goa with pool
```
```json
{
  "items": [ { "slug":"goa-sunset-villa", "title":"Goa Sunset Villa", "_score": 0.91, "...":"..." } ],
  "suggestions": ["Sea-facing villas in Goa", "3BHK with private pool", "Beachfront apartments"]
}
```

---

## 4. Wishlist (auth)

| Method | Path | Returns |
|---|---|---|
| GET | `/wishlist` | `{ items: Property[] }` |
| POST | `/wishlist/:propertyId` | toggle → `{ wishlist: string[] }` |

```http
POST /api/wishlist/664abc...
Authorization: Bearer <jwt>
```
```json
{ "wishlist": ["664abc...", "664def..."] }
```

---

## 5. Recently viewed (auth)

| Method | Path | Returns |
|---|---|---|
| GET | `/me/recent` | `{ items: Property[] }` (capped 20) |

---

## 6. Recommendations

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/recommendations` | optional | `{ items: Property[], reason: string }` |

> Uses wishlist + recently-viewed signals when authenticated; falls back to **trending** otherwise.

```json
{ "items": [ {"slug":"...","title":"..."} ], "reason": "Because you saved 2 villas in Bengaluru" }
```

---

## 7. AI assistant

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/ai/assistant` | `{ messages:[{role,content}], context?:{propertyId?} }` | `{ reply, suggestedProperties? }` |
| POST | `/ai/summarize-reviews` | `{ propertyId }` | `{ summary }` |

> Falls back to a **deterministic heuristic** if `OPENAI_API_KEY` is empty.

```http
POST /api/ai/assistant
Content-Type: application/json

{ "messages":[{"role":"user","content":"2BHK under 1.5Cr in Bengaluru near a park"}] }
```
```json
{
  "reply": "I found 3 homes that fit. The Jayanagar Garden Flat is closest to a park and within budget.",
  "suggestedProperties": [ {"slug":"jayanagar-garden-flat","title":"Jayanagar Garden Flat","price":13800000} ]
}
```

---

## 8. Inquiries

| Method | Path | Auth | Body / Returns |
|---|---|---|---|
| POST | `/inquiries` | — | `{property,name,email,phone,message,preferredDate,type}` → `{ inquiry }` (logs event) |
| GET | `/inquiries` | agent/admin | → `{ items }` |

```http
POST /api/inquiries
Content-Type: application/json

{ "property":"664...", "name":"Aanya","email":"aanya@example.com","phone":"+91...",
  "message":"Can I visit this weekend?","preferredDate":"2026-07-04","type":"visit" }
```
```json
{ "inquiry": { "_id":"...","status":"new","type":"visit","createdAt":"2026-06-29T..." } }
```

---

## 9. Analytics (auth admin/agent)

| Method | Path | Auth | Returns |
|---|---|---|---|
| GET | `/analytics/summary` | agent/admin | dashboard payload (below) |
| POST | `/analytics/event` | public | `{type, property?, meta?}` (fire-and-forget) |

```json
{
  "totals": { "properties": 11, "users": 42, "inquiries": 18, "views": 1340, "arLaunches": 96 },
  "viewsByDay": [ {"date":"2026-06-22","count":210}, {"date":"2026-06-23","count":188} ],
  "topProperties": [ {"title":"Skyline Penthouse","views":312} ],
  "byType": [ {"type":"villa","count":4}, {"type":"apartment","count":5} ],
  "funnel": { "view": 1340, "tour": 420, "ar": 96, "inquiry": 18 }
}
```

---

## 10. Health

| Method | Path | Returns |
|---|---|---|
| GET | `/health` | `{ ok: true }` |

---

## 11. Socket.io contract

**URL:** `NEXT_PUBLIC_SOCKET_URL` · default namespace. Powers per-property chat + multi-user showroom presence.

**Client → Server**
| Event | Payload |
|---|---|
| `room:join` | `{ roomId, user:{id?,name,role} }` |
| `chat:send` | `{ roomId, text }` |
| `presence:move` | `{ roomId, position:[x,y,z], rotationY }` |

**Server → Client**
| Event | Payload |
|---|---|
| `chat:history` | `{ messages: ChatMessage[] }` (on join) |
| `chat:new` | `{ message: ChatMessage }` |
| `presence:state` | `{ peers: [{ id, name, position, rotationY }] }` |
| `presence:leave` | `{ id }` |

**Example flow**
```js
socket.emit("room:join", { roomId: "villa-by-the-bay", user: { name: "Aanya", role: "user" } });
socket.on("chat:history", ({ messages }) => render(messages));
socket.emit("chat:send", { roomId: "villa-by-the-bay", text: "Is parking included?" });
socket.on("chat:new", ({ message }) => append(message));
socket.emit("presence:move", { roomId: "villa-by-the-bay", position: [1.2, 0, -0.5], rotationY: 0.4 });
socket.on("presence:state", ({ peers }) => updateAvatars(peers));
```
