import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Property, User } from "../models";
import { ApiError } from "../utils/ApiError";
import { logEvent } from "../services/analytics.service";
import { findSimilar } from "../services/similarity.service";
import { pushRecent } from "../services/recommendation.service";
import { uniqueSlug } from "../utils/slug";
import type { PropertyQuery } from "../utils/schemas";

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildListQuery(q: PropertyQuery) {
  const filter: Record<string, unknown> = {};

  if (q.q) filter.$text = { $search: q.q };
  if (q.city) filter["location.city"] = new RegExp(`^${escapeRegex(q.city)}$`, "i");
  if (q.propertyType) filter.propertyType = q.propertyType;
  if (q.listingType) filter.listingType = q.listingType;
  if (typeof q.bedrooms === "number") filter.bedrooms = { $gte: q.bedrooms };
  if (typeof q.featured === "boolean") filter.featured = q.featured;

  if (typeof q.minPrice === "number" || typeof q.maxPrice === "number") {
    const price: Record<string, number> = {};
    if (typeof q.minPrice === "number") price.$gte = q.minPrice;
    if (typeof q.maxPrice === "number") price.$lte = q.maxPrice;
    filter.price = price;
  }

  if (q.amenities) {
    const list = q.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (list.length) {
      filter.amenities = { $all: list.map((a) => new RegExp(`^${escapeRegex(a)}$`, "i")) };
    }
  }

  let sort: Record<string, 1 | -1> = { createdAt: -1 };
  switch (q.sort) {
    case "price_asc":
      sort = { price: 1 };
      break;
    case "price_desc":
      sort = { price: -1 };
      break;
    case "popular":
      sort = { views: -1 };
      break;
    case "newest":
    default:
      sort = { createdAt: -1 };
  }

  return { filter, sort };
}

function isMissingTextIndex(err: unknown): boolean {
  const e = err as { code?: number; message?: string };
  return e?.code === 27 || /text index required/i.test(e?.message ?? "");
}

export async function listProperties(req: Request, res: Response): Promise<void> {
  const q = req.query as unknown as PropertyQuery;
  const { filter, sort } = buildListQuery(q);
  const skip = (q.page - 1) * q.limit;

  const run = async (f: Record<string, unknown>) => {
    const [items, total] = await Promise.all([
      Property.find(f).sort(sort).skip(skip).limit(q.limit).exec(),
      Property.countDocuments(f).exec(),
    ]);
    return { items, total };
  };

  let result: Awaited<ReturnType<typeof run>>;
  try {
    result = await run(filter);
  } catch (err) {
    if (!q.q || !isMissingTextIndex(err)) throw err;
    const escaped = escapeRegex(q.q);
    const fallback = { ...filter };
    delete fallback.$text;
    fallback.$or = [
      { title: new RegExp(escaped, "i") },
      { description: new RegExp(escaped, "i") },
    ];
    result = await run(fallback);
  }

  res.json({
    items: result.items,
    total: result.total,
    page: q.page,
    pages: Math.max(1, Math.ceil(result.total / q.limit)),
  });
}

async function trackRecentlyViewed(userId: string, propertyId: Types.ObjectId): Promise<void> {
  try {
    const user = await User.findById(userId).exec();
    if (!user) return;
    user.recentlyViewed = pushRecent(user.recentlyViewed, propertyId);
    await user.save();
  } catch {
    return;
  }
}

export async function getPropertyBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const property = await Property.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { new: true }
  ).exec();

  if (!property) throw ApiError.notFound("Property not found");

  void logEvent("view", property._id, { slug });
  if (req.user?.id) void trackRecentlyViewed(req.user.id, property._id);

  res.json({ property });
}

export async function createProperty(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;

  const baseForSlug = (body.slug as string) || (body.title as string);
  const slug = await uniqueSlug(baseForSlug, async (candidate) => {
    return (await Property.exists({ slug: candidate })) !== null;
  });

  const property = await Property.create({ ...body, slug, owner: req.user!.id });
  res.status(201).json({ property });
}

export async function updateProperty(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest("Invalid id");

  const property = await Property.findById(id).exec();
  if (!property) throw ApiError.notFound("Property not found");
  if (req.user!.role !== "admin" && String(property.owner) !== req.user!.id) {
    throw ApiError.forbidden("You do not own this property");
  }

  const update = { ...(req.body as Record<string, unknown>) };
  delete update.views;
  delete update.slug;

  const updated = await Property.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).exec();

  res.json({ property: updated ?? property });
}

export async function deleteProperty(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest("Invalid id");

  const property = await Property.findById(id).exec();
  if (!property) throw ApiError.notFound("Property not found");
  if (req.user!.role !== "admin" && String(property.owner) !== req.user!.id) {
    throw ApiError.forbidden("You do not own this property");
  }

  await property.deleteOne();
  await User.updateMany({}, { $pull: { wishlist: id, recentlyViewed: id } }).exec();

  res.json({ ok: true });
}

export async function similarProperties(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) throw ApiError.badRequest("Invalid id");

  const items = await findSimilar(id, 6);
  res.json({ items });
}
