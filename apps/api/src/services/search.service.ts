import { Property, type PropertyDoc } from "../models";
import { tokenize, tokenOverlap } from "../utils/text";


interface ScoredProperty {
  property: PropertyDoc;
  score: number;
}

const FIELD_WEIGHTS = {
  title: 5,
  city: 4,
  propertyType: 3,
  amenities: 2.5,
  description: 1,
} as const;

function fieldText(p: PropertyDoc) {
  return {
    title: p.title || "",
    city: p.location?.city || "",
    propertyType: p.propertyType || "",
    amenities: (p.amenities || []).join(" "),
    description: p.description || "",
  };
}

function scoreProperty(p: PropertyDoc, queryTokens: string[], rawQuery: string): number {
  if (queryTokens.length === 0) return 0;
  const fields = fieldText(p);
  let score = 0;

  for (const [field, weight] of Object.entries(FIELD_WEIGHTS) as [
    keyof typeof FIELD_WEIGHTS,
    number
  ][]) {
    const value = fields[field];
    const valueLower = value.toLowerCase();
    const fieldTokens = tokenize(value);

    let keyword = 0;
    for (const qt of queryTokens) if (valueLower.includes(qt)) keyword += 1;

    const overlap = tokenOverlap(queryTokens, fieldTokens);

    score += weight * (keyword + overlap * 2);
  }

  if (rawQuery.trim().length > 2 && fields.title.toLowerCase().includes(rawQuery.toLowerCase())) {
    score += 8;
  }

  score += Math.log10((p.views || 0) + 1) * 0.5;
  if (p.featured) score += 0.5;

  return score;
}

export async function hybridSearch(
  query: string,
  limit = 12
): Promise<PropertyDoc[]> {
  const queryTokens = tokenize(query);
  const all = await Property.find({ status: { $ne: "sold" } }).limit(500).exec();

  const scored: ScoredProperty[] = all
    .map((property) => ({ property, score: scoreProperty(property, queryTokens, query) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s) => s.property);
}

export async function suggest(query: string, limit = 8): Promise<string[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const props = await Property.find({}, "title location.city propertyType")
    .limit(300)
    .exec();

  const pool = new Set<string>();
  for (const p of props) {
    pool.add(p.title);
    if (p.location?.city) pool.add(`${p.propertyType} in ${p.location.city}`);
    pool.add(p.location?.city ?? "");
  }

  return [...pool]
    .filter((s) => s && s.toLowerCase().includes(q))
    .sort((a, b) => a.length - b.length)
    .slice(0, limit);
}

export async function trending(limit = 8): Promise<string[]> {
  const { AnalyticsEvent } = await import("../models");

  const fromEvents = await AnalyticsEvent.aggregate<{ _id: string; count: number }>([
    { $match: { type: "search", "meta.q": { $type: "string", $ne: "" } } },
    { $group: { _id: { $toLower: "$meta.q" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]).catch(() => []);

  const terms = fromEvents.map((e) => e._id).filter(Boolean);
  if (terms.length >= 4) return terms.slice(0, limit);

  const cities = await Property.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$location.city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]).catch(() => []);

  const fallback = [
    ...cities.map((c) => c._id).filter(Boolean),
    "Sea-view apartments",
    "Luxury villas with pool",
    "Penthouses in Mumbai",
  ];

  return [...new Set([...terms, ...fallback])].slice(0, limit);
}
