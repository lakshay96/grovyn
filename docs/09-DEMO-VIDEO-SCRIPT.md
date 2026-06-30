# 09 · Demo Video Script

> **Length:** 3:30–4:30 · **Tone:** confident, cinematic, premium. Dark UI, gold accents, calm VO.
> **Goal:** make the evaluator feel they're watching a funded company's launch film. Every beat is a WOW moment with a fallback so nothing can break on camera.

---

## Pre-flight

- Two browser windows ready (for the showroom multiplayer beat).
- A real phone on the same network for the AR beat (plus the desktop QR fallback as backup).
- Seeded data loaded; reduced-motion off; 60 FPS confirmed.
- Record 1440p, then export 1080p. Keep cuts tight; let the product breathe.

---

## Shot list & script

### 0:00 — Cold open (WebGL hero) · 0:00–0:20
- **On screen:** Grovyn home page. WebGL hero in motion — obsidian canvas, gold accent, large display type. Slow push-in.
- **On-screen text:** *Grovyn — The Immersive Property Marketplace.*
- **VO:** "Buying a home still starts with flat photos and a phone call. We thought the most important purchase of your life deserved better."
- **Why it lands:** instant "this is different" in three seconds.

### 0:20 — The promise · 0:20–0:35
- **On screen:** tagline reveal, then a smooth scroll past glass cards / feature beats.
- **On-screen text:** *"Walk through your next home before you ever set foot in it."*
- **VO:** "Grovyn turns every listing into a place you can actually experience — in 3D, in AR, in 360, and in conversation."

### 0:35 — Discovery (search + grid) · 0:35–0:55
- **Action:** type into search — *"sea-facing 3BHK in Goa with a pool."* Results resolve; apply a filter; hover a glass property card (magnetic).
- **VO:** "Search the way you think. Hybrid search understands meaning, not just keywords — and it works even offline."
- **Cut to:** open the Goa villa.

### 0:55 — The walkable 3D house (WOW #1) · 0:55–1:25
- **Action:** property detail loads the **3D model**. Orbit, zoom, step through rooms. Then toggle the **procedural 3D floor plan** generated from `rooms[]`.
- **On-screen text (lower third):** *Real-time WebGL · React Three Fiber*
- **VO:** "This isn't a photo. It's a real-time model you can walk through — and when a 3D asset isn't available, Grovyn builds the floor plan procedurally, so every listing is explorable."

### 1:25 — AR placement (WOW #2) · 1:25–1:55
- **Action:** tap **View in AR**. Cut to **phone screen capture**: WebXR session, place the property/floor plan into the real room, walk around it, scale-check.
- **On-screen text:** *WebXR · no app install*
- **VO:** "Then bring it into your world. With WebXR, buyers drop the space into their own room — straight from the browser, no app required." (Cut back to desktop showing the **QR fallback** for unsupported devices.)

### 1:55 — 360° virtual tour (WOW #3) · 1:55–2:20
- **Action:** open the **360° tour**; drag to look around; click a **hotspot** to jump rooms.
- **On-screen text:** *Immersive 360° tour · hotspot navigation*
- **VO:** "Prefer to feel the light and the flow? Step inside a full 360 tour and move room to room — like you're really there."

### 2:20 — AI concierge (WOW #4) · 2:20–2:50
- **Action:** open the **AI concierge**. Type *"Which of these is best for resale under ₹1.5 crore?"* Concierge replies conversationally with **property cards** inline. Briefly show it still working with the key removed.
- **On-screen text:** *AI concierge · graceful offline fallback*
- **VO:** "An AI concierge that knows the catalog — recommending real listings, answering in plain language. And because it falls back to a local engine, it never goes dark."

### 2:50 — Live showroom + chat (WOW #5) · 2:50–3:20
- **Action:** **split screen / two windows.** Both users enter the **virtual showroom**; avatars move in sync (presence). They chat live; an **agent** joins and replies in real time.
- **On-screen text:** *Multi-user showroom · live agent chat · Socket.io*
- **VO:** "Touring is better together. In Grovyn's virtual showroom, buyers explore the same space in real time — and talk to a live agent without leaving the listing."

### 3:20 — Proof: the funnel · 3:20–3:45
- **Action:** open the **agent / admin analytics dashboard**. Show the **funnel** (view → tour → AR → inquiry), top properties, views-by-day.
- **On-screen text:** *Every immersive moment, measured.*
- **VO:** "It's not just beautiful — it's a marketplace. Grovyn measures the full funnel, turning immersive engagement into qualified intent for agents."

### 3:45 — Close · 3:45–4:10
- **On screen:** return to hero; logo + tagline; calm fade on obsidian + gold.
- **On-screen text:** *Grovyn — the future of how we buy homes.*
- **VO:** "Premium. Immersive. Intelligent. Grovyn — walk through your next home before you ever set foot in it."

---

## Capture tips

| Beat | Tip |
|---|---|
| Hero | Record at 60 FPS; one smooth push-in, no jitter |
| 3D | Slow, deliberate orbits read better than fast spins |
| AR | Good lighting on a flat floor; pre-scan the surface before rolling |
| Tour | Snap between hotspots — don't over-drag |
| Concierge | Pre-type the prompt; let the answer animate in |
| Showroom | Pre-join both windows; rehearse the avatar move + chat exchange |
| Dashboard | Have seeded events so the funnel looks alive |

## Backup plan (if anything wobbles on the day)
- AR device fails → show the **desktop QR + 3D fallback** and narrate it as the graceful-degradation feature.
- API hiccup → the app runs on **mock data**; keep rolling.
- Keep a pre-recorded clean take of each WOW beat to intercut if needed.
