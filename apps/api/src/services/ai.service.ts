import { env } from "../config/env";
import { Property, type PropertyDoc } from "../models";
import type { ChatTurn } from "../types";
import { tokenize } from "../utils/text";

export interface AssistantResult {
  reply: string;
  suggestedProperties?: PropertyDoc[];
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

interface ParsedIntent {
  city?: string;
  bedrooms?: number;
  maxPrice?: number;
  minPrice?: number;
  propertyType?: string;
  listingType?: "sale" | "rent";
}

const KNOWN_CITIES = [
  "mumbai", "bengaluru", "bangalore", "goa", "gurugram", "gurgaon",
  "delhi", "pune", "hyderabad", "chennai",
];
const KNOWN_TYPES = ["apartment", "villa", "plot", "commercial", "penthouse"];

function parseIntent(message: string): ParsedIntent {
  const text = message.toLowerCase();
  const intent: ParsedIntent = {};

  for (const c of KNOWN_CITIES) {
    if (text.includes(c)) {
      intent.city = c === "bangalore" ? "bengaluru" : c === "gurgaon" ? "gurugram" : c;
      break;
    }
  }

  for (const t of KNOWN_TYPES) {
    if (text.includes(t)) {
      intent.propertyType = t;
      break;
    }
  }

  if (/\brent(al)?\b|\blease\b/.test(text)) intent.listingType = "rent";
  else if (/\bbuy\b|\bsale\b|\bpurchase\b/.test(text)) intent.listingType = "sale";

  const bed = text.match(/(\d+)\s*(?:bhk|bed|bedroom)/);
  if (bed) intent.bedrooms = Number(bed[1]);

  const crore = text.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore)/);
  const lakh = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)/);
  if (crore) intent.maxPrice = Math.round(parseFloat(crore[1]) * 1e7);
  else if (lakh) intent.maxPrice = Math.round(parseFloat(lakh[1]) * 1e5);
  else {
    const num = text.match(/(?:under|below|budget|upto|up to|max)\D*([\d,]{5,})/);
    if (num) intent.maxPrice = Number(num[1].replace(/,/g, ""));
  }

  return intent;
}

function intentToQuery(intent: ParsedIntent): Record<string, unknown> {
  const q: Record<string, unknown> = { status: { $ne: "sold" } };
  if (intent.city) q["location.city"] = new RegExp(`^${intent.city}$`, "i");
  if (intent.propertyType) q.propertyType = intent.propertyType;
  if (intent.listingType) q.listingType = intent.listingType;
  if (typeof intent.bedrooms === "number") q.bedrooms = { $gte: intent.bedrooms };
  if (typeof intent.maxPrice === "number") q.price = { $lte: intent.maxPrice };
  return q;
}

function templateReply(intent: ParsedIntent, matches: PropertyDoc[]): string {
  const parts: string[] = [];
  const criteria: string[] = [];
  if (intent.bedrooms) criteria.push(`${intent.bedrooms}+ BHK`);
  if (intent.propertyType) criteria.push(intent.propertyType);
  if (intent.city) criteria.push(`in ${capitalize(intent.city)}`);
  if (intent.listingType) criteria.push(`to ${intent.listingType === "rent" ? "rent" : "buy"}`);
  if (intent.maxPrice) criteria.push(`under ${INR.format(intent.maxPrice)}`);

  if (matches.length === 0) {
    parts.push(
      criteria.length
        ? `I couldn't find listings matching ${criteria.join(", ")} right now.`
        : "I couldn't find a matching listing for that just yet."
    );
    parts.push(
      "Try widening your budget or exploring nearby cities like Mumbai, Bengaluru, Goa, or Gurugram."
    );
    return parts.join(" ");
  }

  parts.push(
    criteria.length
      ? `Here are ${matches.length} option${matches.length > 1 ? "s" : ""} matching ${criteria.join(", ")}:`
      : `Here are ${matches.length} listings you might like:`
  );

  for (const p of matches.slice(0, 3)) {
    parts.push(
      `\n• ${p.title} — ${INR.format(p.price)}, ${p.bedrooms} BHK in ${p.location.city}` +
        (p.areaSqft ? ` (${p.areaSqft} sqft)` : "")
    );
  }
  parts.push("\nWant a 3D walkthrough or a virtual tour of any of these? Just say the word.");
  return parts.join("");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function heuristicAssistant(messages: ChatTurn[]): Promise<AssistantResult> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const message = lastUser?.content ?? "";

  const intent = parseIntent(message);
  const query = intentToQuery(intent);

  let matches = await Property.find(query)
    .sort({ featured: -1, views: -1 })
    .limit(6)
    .exec();

  if (matches.length === 0) {
    const tokens = tokenize(message);
    if (tokens.length) {
      const all = await Property.find({ status: { $ne: "sold" } }).limit(200).exec();
      matches = all
        .map((p) => {
          const hay = `${p.title} ${p.description} ${p.location.city} ${p.amenities.join(" ")}`.toLowerCase();
          const score = tokens.reduce((n, t) => (hay.includes(t) ? n + 1 : n), 0);
          return { p, score };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((s) => s.p);
    }
  }

  return {
    reply: templateReply(intent, matches),
    suggestedProperties: matches.slice(0, 4),
  };
}

async function openAiChat(
  messages: ChatTurn[],
  systemPrompt: string
): Promise<string | null> {
  const safeMessages = messages
    .filter((m) => m.role !== "system")
    .slice(-12)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
      }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn("[ai] OpenAI returned", res.status, "— falling back to heuristic");
      return null;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[ai] OpenAI call failed:", (err as Error)?.message);
    return null;
  }
}

export async function runAssistant(
  messages: ChatTurn[],
  context?: { propertyId?: string }
): Promise<AssistantResult> {
  const heuristic = await heuristicAssistant(messages);

  if (!env.openAiKey) {
    return heuristic;
  }

  const sample = await Property.find({ status: { $ne: "sold" } })
    .sort({ featured: -1, views: -1 })
    .limit(12)
    .select("title price bedrooms location.city propertyType listingType")
    .exec();

  let focus = "";
  if (context?.propertyId) {
    const p = await Property.findById(context.propertyId).exec();
    if (p) {
      focus = `\nThe user is currently viewing: ${p.title} (${INR.format(p.price)}, ${p.bedrooms} BHK ${p.propertyType} in ${p.location.city}).`;
    }
  }

  const catalog = sample
    .map(
      (p) =>
        `- ${p.title}: ${INR.format(p.price)}, ${p.bedrooms} BHK ${p.propertyType} (${p.listingType}) in ${p.location.city}`
    )
    .join("\n");

  const systemPrompt =
    "You are Grovyn's friendly real-estate concierge for an immersive AR/VR property marketplace in India. " +
    "Answer concisely and helpfully. Recommend from the catalog below when relevant; never invent listings. " +
    "Prices are in INR.\n\nCATALOG:\n" +
    catalog +
    focus;

  const reply = await openAiChat(messages, systemPrompt);

  return {
    reply: reply ?? heuristic.reply,
    suggestedProperties: heuristic.suggestedProperties,
  };
}

export async function summarizeReviews(propertyId: string): Promise<string> {
  const p = await Property.findById(propertyId).exec();
  if (!p) throw new Error("Property not found");

  const ratingLine = p.rating
    ? `Rated ${p.rating.toFixed(1)}/5 by visitors.`
    : "No aggregate rating yet, but interest is strong.";
  const topAmenities = (p.amenities || []).slice(0, 4).join(", ");

  const facts =
    `${p.title} is a ${p.bedrooms} BHK ${p.propertyType} in ${p.location.city}. ` +
    `${ratingLine} ` +
    (topAmenities ? `Standout amenities: ${topAmenities}. ` : "") +
    `${p.areaSqft} sqft, listed for ${INR.format(p.price)} (${p.listingType}). ` +
    `${p.views} prospective buyers have viewed it.`;

  if (!env.openAiKey) {
    return (
      `Visitors highlight the ${p.location.city} location and the ${p.bedrooms}-bedroom layout. ` +
      (topAmenities ? `Amenities like ${topAmenities} are frequently praised. ` : "") +
      `${ratingLine} At ${INR.format(p.price)}, it's seen as ${valueVerdict(p.price, p.areaSqft)} for the space (${p.areaSqft} sqft).`
    );
  }

  const reply = await openAiChat(
    [
      {
        role: "user",
        content:
          "Write a warm 2-3 sentence summary of what prospective buyers tend to love about this property, based only on these facts:\n" +
          facts,
      },
    ],
    "You summarize property sentiment concisely and honestly. Do not fabricate specific quotes or numbers beyond the facts given."
  );

  return reply ?? facts;
}

function valueVerdict(price: number, sqft: number): string {
  const perSqft = sqft > 0 ? price / sqft : 0;
  if (perSqft === 0) return "fairly priced";
  if (perSqft < 12000) return "excellent value";
  if (perSqft < 25000) return "competitively priced";
  return "premium but well-positioned";
}
