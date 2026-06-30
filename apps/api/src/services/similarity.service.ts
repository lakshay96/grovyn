import { Property, type PropertyDoc } from "../models";

function similarityScore(base: PropertyDoc, cand: PropertyDoc): number {
  let score = 0;

  if (cand.location?.city === base.location?.city) score += 4;
  if (cand.propertyType === base.propertyType) score += 3;
  if (cand.listingType === base.listingType) score += 1.5;

  const basePrice = base.price || 1;
  const ratio = Math.abs(cand.price - basePrice) / basePrice;
  if (ratio <= 0.15) score += 3;
  else if (ratio <= 0.4) score += 1.5;

  const bedDiff = Math.abs((cand.bedrooms || 0) - (base.bedrooms || 0));
  if (bedDiff === 0) score += 2;
  else if (bedDiff === 1) score += 1;

  const baseAmenities = new Set((base.amenities || []).map((a) => a.toLowerCase()));
  const overlap = (cand.amenities || []).filter((a) =>
    baseAmenities.has(a.toLowerCase())
  ).length;
  score += Math.min(overlap, 4) * 0.5;

  if (cand.featured) score += 0.25;
  return score;
}

export async function findSimilar(
  baseId: string,
  limit = 6
): Promise<PropertyDoc[]> {
  const base = await Property.findById(baseId).exec();
  if (!base) return [];

  let candidates = await Property.find({
    _id: { $ne: base._id },
    status: { $ne: "sold" },
    $or: [
      { "location.city": base.location?.city },
      { propertyType: base.propertyType },
    ],
  })
    .limit(200)
    .exec();

  if (candidates.length < limit) {
    candidates = await Property.find({
      _id: { $ne: base._id },
      status: { $ne: "sold" },
    })
      .limit(200)
      .exec();
  }

  return candidates
    .map((cand) => ({ cand, score: similarityScore(base, cand) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.cand);
}
