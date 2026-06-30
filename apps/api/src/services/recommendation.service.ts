import { Types } from "mongoose";
import { Property, User, type PropertyDoc } from "../models";
import { findSimilar } from "./similarity.service";

export interface RecommendationResult {
  items: PropertyDoc[];
  reason: string;
}

export async function recommendFor(
  userId?: string,
  limit = 8
): Promise<RecommendationResult> {
  if (userId) {
    const user = await User.findById(userId).exec();
    if (user) {
      const seedIds = [
        ...(user.wishlist || []),
        ...(user.recentlyViewed || []),
      ].map((id) => String(id));

      if (seedIds.length > 0) {
        const tally = new Map<string, { prop: PropertyDoc; hits: number }>();
        const seedSet = new Set(seedIds);

        for (const seed of seedIds.slice(0, 8)) {
          // eslint-disable-next-line no-await-in-loop
          const similar = await findSimilar(seed, 6);
          for (const p of similar) {
            const key = String(p._id);
            if (seedSet.has(key)) continue;
            const entry = tally.get(key);
            if (entry) entry.hits += 1;
            else tally.set(key, { prop: p, hits: 1 });
          }
        }

        const ranked = [...tally.values()]
          .sort((a, b) => b.hits - a.hits || (b.prop.views || 0) - (a.prop.views || 0))
          .slice(0, limit)
          .map((e) => e.prop);

        if (ranked.length > 0) {
          const basis =
            (user.wishlist?.length ?? 0) > 0 ? "your wishlist" : "what you recently viewed";
          return {
            items: ranked,
            reason: `Picked for you based on ${basis} — similar location, type, and price range.`,
          };
        }
      }
    }
  }

  const items = await Property.find({ status: { $ne: "sold" } })
    .sort({ featured: -1, views: -1, createdAt: -1 })
    .limit(limit)
    .exec();

  return {
    items,
    reason: "Trending now — the most-viewed and featured listings on Grovyn.",
  };
}

export function pushRecent(
  list: Types.ObjectId[],
  propertyId: Types.ObjectId,
  cap = 20
): Types.ObjectId[] {
  const filtered = list.filter((id) => !id.equals(propertyId));
  filtered.unshift(propertyId);
  return filtered.slice(0, cap);
}
