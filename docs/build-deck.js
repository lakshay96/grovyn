/**
 * Grovyn — Investor / Evaluator Pitch Deck generator (pptxgenjs)
 *
 * Premium minimal dark aesthetic: obsidian background, gold accent.
 * Run when a shell with Node is available:
 *
 *   cd docs
 *   npm install pptxgenjs
 *   node build-deck.js
 *   # optional, to shrink the file:
 *   # python /path/to/pptx-skill/scripts/rezip.py Grovyn-Pitch-Deck.pptx
 *
 * Output: docs/Grovyn-Pitch-Deck.pptx
 */
const pptxgen = require("pptxgenjs");

// ---- Brand tokens (SPEC §2) ----
const BG = "0A0A0F";        // obsidian
const SURFACE = "14141C";
const SURFACE2 = "1C1C28";
const TEXT = "F5F5F7";
const MUTED = "9A9AB0";
const GOLD = "C8A24B";
const INDIGO = "6D6AFF";
const SUCCESS = "36D399";

const HEAD = "Georgia";      // serif display (graceful, premium); QA with slack
const BODY = "Calibri";      // safe sans body

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Grovyn";
pres.title = "Grovyn — The Immersive Property Marketplace";
const W = 13.3, H = 7.5;

const makeShadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.35 });

function base(slide) {
  slide.background = { color: BG };
}
// Small gold "G" motif mark, repeated top-left on content slides
function mark(slide) {
  slide.addShape(pres.shapes.OVAL, { x: 0.55, y: 0.45, w: 0.34, h: 0.34, fill: { color: GOLD } });
  slide.addText("G", { x: 0.55, y: 0.45, w: 0.34, h: 0.34, fontFace: HEAD, fontSize: 16, bold: true, color: BG, align: "center", valign: "middle", margin: 0 });
  slide.addText("GROVYN", { x: 0.98, y: 0.45, w: 3, h: 0.34, fontFace: BODY, fontSize: 11, bold: true, color: MUTED, charSpacing: 3, valign: "middle", margin: 0 });
}
function kicker(slide, txt) {
  slide.addText(txt.toUpperCase(), { x: 0.7, y: 1.25, w: 11, h: 0.4, fontFace: BODY, fontSize: 12, bold: true, color: GOLD, charSpacing: 3, margin: 0 });
}
function title(slide, txt, y = 1.65) {
  slide.addText(txt, { x: 0.7, y, w: 12, h: 1.1, fontFace: HEAD, fontSize: 38, bold: true, color: TEXT, margin: 0 });
}
function card(slide, x, y, w, h, fill = SURFACE) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, rectRadius: 0.08, shadow: makeShadow() });
}

// ---------- 1. Cover ----------
(() => {
  const s = pres.addSlide(); base(s);
  s.addShape(pres.shapes.OVAL, { x: 9.2, y: -2.2, w: 7, h: 7, fill: { color: SURFACE2 } });
  s.addShape(pres.shapes.OVAL, { x: 10.6, y: -0.6, w: 3.2, h: 3.2, fill: { color: GOLD, transparency: 80 } });
  s.addShape(pres.shapes.OVAL, { x: 0.7, y: 0.7, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s.addText("G", { x: 0.7, y: 0.7, w: 0.5, h: 0.5, fontFace: HEAD, fontSize: 22, bold: true, color: BG, align: "center", valign: "middle", margin: 0 });
  s.addText("GROVYN", { x: 1.32, y: 0.72, w: 5, h: 0.46, fontFace: BODY, fontSize: 15, bold: true, color: TEXT, charSpacing: 4, valign: "middle", margin: 0 });
  s.addText("THE IMMERSIVE PROPERTY MARKETPLACE", { x: 0.75, y: 3.0, w: 11, h: 0.5, fontFace: BODY, fontSize: 13, bold: true, color: GOLD, charSpacing: 3, margin: 0 });
  s.addText("Walk through your next home\nbefore you ever set foot in it.", { x: 0.7, y: 3.5, w: 11.5, h: 2.2, fontFace: HEAD, fontSize: 50, bold: true, color: TEXT, lineSpacingMultiple: 1.02, margin: 0 });
  s.addText("Spatial commerce for real estate — WebGL · 3D · AR · 360° tours · AI concierge · live showroom", { x: 0.72, y: 6.1, w: 11.5, h: 0.5, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0 });
  s.addNotes("Open on the brand. Three seconds to signal 'this is different.' Read the tagline slowly, then move.");
})();

// ---------- 2. Problem ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "The problem");
  title(s, "The biggest purchase of your life,\nthe flattest shopping experience online.");
  const items = [
    ["Space is invisible in photos", "Buyers can't judge flow, scale, or light from 2D galleries."],
    ["Site visits don't scale", "Physical tours bottleneck buyers and agents — and exclude remote buyers."],
    ["Discovery is high-friction", "Endless filtered lists; nothing conveys the feeling of a home."],
    ["Agents fly blind", "No signal on what drives intent, so follow-up is guesswork."],
  ];
  let x = 0.7, y = 3.6, w = 5.85, h = 1.5, gx = 0.3, gy = 0.3;
  items.forEach((it, i) => {
    const cx = x + (i % 2) * (w + gx), cy = y + Math.floor(i / 2) * (h + gy);
    card(s, cx, cy, w, h);
    s.addText(it[0], { x: cx + 0.3, y: cy + 0.22, w: w - 0.6, h: 0.4, fontFace: BODY, fontSize: 16, bold: true, color: TEXT, margin: 0 });
    s.addText(it[1], { x: cx + 0.3, y: cy + 0.66, w: w - 0.6, h: 0.7, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0 });
  });
  s.addNotes("Frame the gap: highest-value, most emotional purchase — gated behind the least immersive experience on the internet.");
})();

// ---------- 3. Solution ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "The solution");
  title(s, "Every listing becomes a place\nyou can actually experience.");
  s.addText("Grovyn turns a property page into a spatial-commerce surface: walk through it in 3D, drop it into your room in AR, tour it in 360°, and discuss it live — with an agent or an AI concierge.", { x: 0.7, y: 3.5, w: 11.8, h: 1.0, fontFace: BODY, fontSize: 16, color: MUTED, margin: 0 });
  const steps = ["Discover", "Walk in 3D", "Place in AR", "Tour 360°", "Talk & decide"];
  let x = 0.7, w = 2.3, h = 1.4, gap = 0.18, y = 5.0;
  steps.forEach((t, i) => {
    const cx = x + i * (w + gap);
    card(s, cx, y, w, h, SURFACE);
    s.addText(`0${i + 1}`, { x: cx + 0.25, y: y + 0.22, w: w - 0.5, h: 0.5, fontFace: HEAD, fontSize: 22, bold: true, color: GOLD, margin: 0 });
    s.addText(t, { x: cx + 0.25, y: y + 0.78, w: w - 0.5, h: 0.5, fontFace: BODY, fontSize: 14, bold: true, color: TEXT, margin: 0 });
  });
  s.addNotes("This is the hero loop. Each step is also a WOW moment, and each has a graceful fallback so nothing breaks.");
})();

// ---------- 4. Product / feature highlights ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "The product");
  title(s, "Six immersive moments, one premium shell.");
  const feats = [
    ["WebGL hero", "An obsidian, gold-accented landing that signals 'different' in 3 seconds."],
    ["Walkable 3D", "Real-time R3F models — with procedural floor plans when no asset exists."],
    ["WebXR AR", "Drop the space into your room from the browser. No app install."],
    ["360° tours", "Hotspot navigation through equirectangular panoramas."],
    ["AI concierge", "Conversational discovery that recommends real listings."],
    ["Live showroom", "Multi-user presence + live agent chat over Socket.io."],
  ];
  let x = 0.7, y = 3.3, w = 3.86, h = 1.55, gx = 0.26, gy = 0.26;
  feats.forEach((f, i) => {
    const cx = x + (i % 3) * (w + gx), cy = y + Math.floor(i / 3) * (h + gy);
    card(s, cx, cy, w, h);
    s.addShape(pres.shapes.OVAL, { x: cx + 0.28, y: cy + 0.26, w: 0.16, h: 0.16, fill: { color: GOLD } });
    s.addText(f[0], { x: cx + 0.56, y: cy + 0.18, w: w - 0.8, h: 0.4, fontFace: BODY, fontSize: 16, bold: true, color: TEXT, margin: 0 });
    s.addText(f[1], { x: cx + 0.3, y: cy + 0.66, w: w - 0.6, h: 0.8, fontFace: BODY, fontSize: 12.5, color: MUTED, margin: 0 });
  });
  s.addNotes("Most competitors do one of these. None do all six in a unified, premium shell.");
})();

// ---------- 5. AR/VR differentiation ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Why AR/VR — and why it never breaks");
  title(s, "Spatial isn't a gimmick here.\nIt's the closest thing to being there.");
  const rows = [
    ["Real-time 3D walk-through", "React Three Fiber + procedural geometry"],
    ["WebXR AR placement", "Browser-native; QR + desktop fallback on unsupported devices"],
    ["360° tour + hotspots", "Gradient sky-dome fallback if panoramas are missing"],
    ["Graceful degradation", "Every immersive feature has a path that cannot hard-fail"],
  ];
  let y = 3.6;
  rows.forEach((r, i) => {
    card(s, 0.7, y, 11.9, 0.82);
    s.addText(r[0], { x: 1.0, y: y + 0.12, w: 5.6, h: 0.6, fontFace: BODY, fontSize: 16, bold: true, color: TEXT, valign: "middle", margin: 0 });
    s.addText(r[1], { x: 6.6, y: y + 0.12, w: 5.8, h: 0.6, fontFace: BODY, fontSize: 13.5, color: MUTED, valign: "middle", margin: 0 });
    y += 0.96;
  });
  s.addNotes("Differentiator: not just immersive, but resilient. The demo cannot break on the evaluator's device.");
})();

// ---------- 6. AI layer ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "The intelligence layer");
  title(s, "An AI concierge that works\neven with no API key.");
  card(s, 0.7, 3.4, 5.8, 3.3);
  s.addText("AI surfaces", { x: 1.0, y: 3.6, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: GOLD, margin: 0 });
  s.addText([
    { text: "Property concierge — conversational discovery", options: { bullet: true, color: TEXT, breakLine: true } },
    { text: "Hybrid semantic + keyword search", options: { bullet: true, color: TEXT, breakLine: true } },
    { text: "Content-based recommendations", options: { bullet: true, color: TEXT, breakLine: true } },
    { text: "AI review summarizer", options: { bullet: true, color: TEXT } },
  ], { x: 1.0, y: 4.1, w: 5.2, h: 2.3, fontFace: BODY, fontSize: 15, color: TEXT, paraSpaceAfter: 10, margin: 0 });
  card(s, 6.8, 3.4, 5.8, 3.3, SURFACE2);
  s.addText("Graceful fallback", { x: 7.1, y: 3.6, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: GOLD, margin: 0 });
  s.addText("If OPENAI_API_KEY is empty, every surface degrades to a deterministic local heuristic — facet extraction + scoring — returning the identical response shape. Fully functional offline.", { x: 7.1, y: 4.1, w: 5.2, h: 1.5, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0 });
  s.addText("Roadmap: real embeddings → vector DB → RAG + voice concierge.", { x: 7.1, y: 5.9, w: 5.2, h: 0.6, fontFace: BODY, fontSize: 13, italic: true, color: INDIGO, margin: 0 });
  s.addNotes("The headline: intelligence that never goes dark. Same response shape both paths, so the frontend is agnostic.");
})();

// ---------- 7. Market / TAM ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Market");
  title(s, "The largest asset class on earth\nis still shopped with JPEGs.");
  const stats = [
    ["$1T+", "Indian residential real estate by 2030"],
    ["₹ lakhs–crores", "Average transaction value — premium tooling pays for itself"],
    ["~0%", "Listings today with native 3D + AR + AI in one place"],
  ];
  let x = 0.7, y = 3.5, w = 3.86, h = 2.3, gx = 0.26;
  stats.forEach((st, i) => {
    const cx = x + i * (w + gx);
    card(s, cx, y, w, h);
    s.addText(st[0], { x: cx + 0.3, y: y + 0.4, w: w - 0.6, h: 1.0, fontFace: HEAD, fontSize: 40, bold: true, color: GOLD, margin: 0 });
    s.addText(st[1], { x: cx + 0.3, y: y + 1.45, w: w - 0.6, h: 0.7, fontFace: BODY, fontSize: 13.5, color: MUTED, margin: 0 });
  });
  s.addText("A small conversion lift on a crore-scale transaction is real money — which is exactly why premium immersive tooling has a home here.", { x: 0.7, y: 6.05, w: 11.9, h: 0.7, fontFace: BODY, fontSize: 14, italic: true, color: MUTED, margin: 0 });
  s.addNotes("Numbers are directional, framed honestly. The point: huge market, near-zero immersive penetration.");
})();

// ---------- 8. Architecture ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Architecture");
  title(s, "Built to ship in a day,\narchitected to scale for years.");
  const cols = [
    ["Web", "Next.js 14 · TS · Tailwind", "R3F · WebXR · 360 · Framer Motion · socket client"],
    ["API", "Express · Mongoose · JWT", "Hybrid search · AI service · Socket.io · analytics"],
    ["Data & assets", "MongoDB Atlas · Cloudinary", "Procedural 3D · optional OpenAI · mock fallback"],
  ];
  let x = 0.7, y = 3.4, w = 3.86, h = 3.0, gx = 0.26;
  cols.forEach((c, i) => {
    const cx = x + i * (w + gx);
    card(s, cx, y, w, h);
    s.addText(c[0], { x: cx + 0.3, y: y + 0.28, w: w - 0.6, h: 0.5, fontFace: HEAD, fontSize: 22, bold: true, color: GOLD, margin: 0 });
    s.addText(c[1], { x: cx + 0.3, y: y + 0.95, w: w - 0.6, h: 0.6, fontFace: BODY, fontSize: 14, bold: true, color: TEXT, margin: 0 });
    s.addText(c[2], { x: cx + 0.3, y: y + 1.6, w: w - 0.6, h: 1.2, fontFace: BODY, fontSize: 13, color: MUTED, margin: 0 });
  });
  s.addText("Two independently deployable apps · Vercel + Render · Lighthouse 95+ · 60 FPS · graceful fallbacks everywhere", { x: 0.7, y: 6.55, w: 11.9, h: 0.5, fontFace: BODY, fontSize: 13, italic: true, color: MUTED, margin: 0 });
  s.addNotes("Monorepo, two deployable apps. Performance and resilience are first-class, not afterthoughts.");
})();

// ---------- 9. Traction / demo ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Traction & demo");
  title(s, "Not just beautiful — a measurable marketplace.");
  card(s, 0.7, 3.4, 7.4, 3.2);
  s.addText("The funnel we instrument", { x: 1.0, y: 3.6, w: 6.8, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: GOLD, margin: 0 });
  const funnel = [["View", "1,340"], ["Tour", "420"], ["AR launch", "96"], ["Inquiry", "18"]];
  let fy = 4.15;
  funnel.forEach((f) => {
    s.addText(f[0], { x: 1.0, y: fy, w: 3, h: 0.5, fontFace: BODY, fontSize: 15, bold: true, color: TEXT, valign: "middle", margin: 0 });
    s.addText(f[1], { x: 5.6, y: fy, w: 2.2, h: 0.5, fontFace: HEAD, fontSize: 18, bold: true, color: GOLD, align: "right", valign: "middle", margin: 0 });
    fy += 0.6;
  });
  card(s, 8.3, 3.4, 4.3, 3.2, SURFACE2);
  s.addText("Live demo highlights", { x: 8.6, y: 3.6, w: 3.7, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: GOLD, margin: 0 });
  s.addText([
    { text: "WebGL hero", options: { bullet: true, breakLine: true } },
    { text: "Walkable 3D house", options: { bullet: true, breakLine: true } },
    { text: "AR placement on phone", options: { bullet: true, breakLine: true } },
    { text: "360° tour", options: { bullet: true, breakLine: true } },
    { text: "AI concierge", options: { bullet: true, breakLine: true } },
    { text: "Multi-user showroom", options: { bullet: true } },
  ], { x: 8.6, y: 4.1, w: 3.7, h: 2.3, fontFace: BODY, fontSize: 13.5, color: TEXT, paraSpaceAfter: 6, margin: 0 });
  s.addNotes("Sample funnel numbers from seeded analytics — show the dashboard is real. Then cue the video.");
})();

// ---------- 10. Business model ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Business model");
  title(s, "Free for buyers. The supply side pays.");
  const streams = [
    ["Agent / brokerage SaaS", "Tiered subscriptions for listing slots, 3D/AR tooling, analytics", "Primary"],
    ["Featured placement", "Pay-to-feature listings (flag already in the schema)", "Primary"],
    ["Lead marketplace", "Per-qualified-inquiry pricing", "Secondary"],
    ["Immersive production", "Premium 3D / 360 capture-as-a-service — the moat", "Expansion"],
  ];
  let y = 3.5;
  streams.forEach((st) => {
    card(s, 0.7, y, 11.9, 0.74);
    s.addText(st[0], { x: 1.0, y: y + 0.1, w: 4.3, h: 0.55, fontFace: BODY, fontSize: 15, bold: true, color: TEXT, valign: "middle", margin: 0 });
    s.addText(st[1], { x: 5.3, y: y + 0.1, w: 5.6, h: 0.55, fontFace: BODY, fontSize: 13, color: MUTED, valign: "middle", margin: 0 });
    s.addText(st[2], { x: 11.0, y: y + 0.1, w: 1.4, h: 0.55, fontFace: BODY, fontSize: 12, bold: true, color: GOLD, align: "right", valign: "middle", margin: 0 });
    y += 0.86;
  });
  s.addText("Classic high-margin marketplace SaaS — buyer liquidity is free; reach, tooling, and qualified intent are paid.", { x: 0.7, y: 6.9, w: 11.9, h: 0.4, fontFace: BODY, fontSize: 13, italic: true, color: MUTED, margin: 0 });
  s.addNotes("Liquidity before monetization. Charge the side that gets economic value: agents.");
})();

// ---------- 11. Roadmap ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Roadmap");
  title(s, "From immersive MVP to spatial-commerce platform.");
  const phases = [
    ["Now", "Immersive MVP", "WebGL · 3D · AR · 360 · AI · showroom · funnel"],
    ["0–3 mo", "Liquidity & polish", "Agent onboarding · map search · real vectors · alerts"],
    ["3–6 mo", "Two-sided marketplace", "Agent SaaS · lead marketplace · capture-as-a-service"],
    ["6–12 mo", "Platform", "Full WebXR multiplayer · RAG/voice · price intelligence"],
  ];
  let x = 0.7, y = 3.5, w = 2.92, h = 3.0, gx = 0.18;
  phases.forEach((p, i) => {
    const cx = x + i * (w + gx);
    card(s, cx, y, w, h, i === 0 ? SURFACE2 : SURFACE);
    s.addText(p[0], { x: cx + 0.25, y: y + 0.25, w: w - 0.5, h: 0.45, fontFace: BODY, fontSize: 13, bold: true, color: GOLD, charSpacing: 2, margin: 0 });
    s.addText(p[1], { x: cx + 0.25, y: y + 0.8, w: w - 0.5, h: 0.7, fontFace: HEAD, fontSize: 18, bold: true, color: TEXT, margin: 0 });
    s.addText(p[2], { x: cx + 0.25, y: y + 1.6, w: w - 0.5, h: 1.2, fontFace: BODY, fontSize: 12.5, color: MUTED, margin: 0 });
  });
  s.addNotes("Sequencing logic: liquidity, then monetize the paying side, then defensibility through immersive production + AI.");
})();

// ---------- 12. Team / ask ----------
(() => {
  const s = pres.addSlide(); base(s); mark(s);
  kicker(s, "Team & ask");
  title(s, "A focused team for an immersive future.");
  card(s, 0.7, 3.4, 5.8, 3.2);
  s.addText("How we work", { x: 1.0, y: 3.6, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: GOLD, margin: 0 });
  s.addText([
    { text: "Product & strategy — Principal-PM rigor", options: { bullet: true, breakLine: true } },
    { text: "Frontend — Next.js 14, R3F, WebXR, motion", options: { bullet: true, breakLine: true } },
    { text: "Backend — Express, Mongo, Socket.io, AI", options: { bullet: true, breakLine: true } },
    { text: "Design — premium, minimal, futuristic", options: { bullet: true } },
  ], { x: 1.0, y: 4.1, w: 5.2, h: 2.3, fontFace: BODY, fontSize: 14.5, color: TEXT, paraSpaceAfter: 10, margin: 0 });
  card(s, 6.8, 3.4, 5.8, 3.2, SURFACE2);
  s.addText("The ask", { x: 7.1, y: 3.6, w: 5.2, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: GOLD, margin: 0 });
  s.addText("Capital and partners to fill supply, ship real-vector AI, and scale immersive multiplayer — turning the largest asset class's discovery experience into spatial commerce.", { x: 7.1, y: 4.1, w: 5.2, h: 1.6, fontFace: BODY, fontSize: 14, color: MUTED, margin: 0 });
  s.addText("Liquidity → monetization → defensibility.", { x: 7.1, y: 5.95, w: 5.2, h: 0.5, fontFace: BODY, fontSize: 14, italic: true, color: INDIGO, margin: 0 });
  s.addNotes("Tie the ask to the roadmap sequencing. Confident, not grandiose.");
})();

// ---------- 13. Closing ----------
(() => {
  const s = pres.addSlide(); base(s);
  s.addShape(pres.shapes.OVAL, { x: -2.5, y: 3.5, w: 7, h: 7, fill: { color: SURFACE2 } });
  s.addShape(pres.shapes.OVAL, { x: 0.7, y: 0.7, w: 0.5, h: 0.5, fill: { color: GOLD } });
  s.addText("G", { x: 0.7, y: 0.7, w: 0.5, h: 0.5, fontFace: HEAD, fontSize: 22, bold: true, color: BG, align: "center", valign: "middle", margin: 0 });
  s.addText("GROVYN", { x: 1.32, y: 0.72, w: 5, h: 0.46, fontFace: BODY, fontSize: 15, bold: true, color: TEXT, charSpacing: 4, valign: "middle", margin: 0 });
  s.addText("The future of how we buy homes.", { x: 0.7, y: 3.0, w: 12, h: 1.2, fontFace: HEAD, fontSize: 46, bold: true, color: TEXT, margin: 0 });
  s.addText("Walk through your next home before you ever set foot in it.", { x: 0.72, y: 4.3, w: 12, h: 0.6, fontFace: BODY, fontSize: 18, color: GOLD, margin: 0 });
  s.addText("Premium · Immersive · Intelligent", { x: 0.72, y: 6.3, w: 12, h: 0.5, fontFace: BODY, fontSize: 13, color: MUTED, charSpacing: 3, margin: 0 });
  s.addNotes("Land calmly on obsidian + gold. Restate the tagline. Stop.");
})();

pres.writeFile({ fileName: "Grovyn-Pitch-Deck.pptx" }).then((f) => console.log("Wrote", f));
