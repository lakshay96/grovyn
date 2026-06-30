import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Property, User } from "../models";
import { ApiError } from "../utils/ApiError";
import { logEvent } from "../services/analytics.service";
import { pushRecent } from "../services/recommendation.service";

export async function getWishlist(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!.id).populate("wishlist").exec();
  if (!user) throw ApiError.notFound("User not found");
  res.json({ items: user.wishlist.filter(Boolean) });
}

export async function toggleWishlist(req: Request, res: Response): Promise<void> {
  const { propertyId } = req.params;
  if (!Types.ObjectId.isValid(propertyId)) throw ApiError.badRequest("Invalid property id");

  const exists = await Property.exists({ _id: propertyId });
  if (!exists) throw ApiError.notFound("Property not found");

  const user = await User.findById(req.user!.id).exec();
  if (!user) throw ApiError.notFound("User not found");

  const pid = new Types.ObjectId(propertyId);
  const has = user.wishlist.some((id) => id.equals(pid));

  if (has) {
    user.wishlist = user.wishlist.filter((id) => !id.equals(pid));
  } else {
    user.wishlist.push(pid);
    void logEvent("wishlist", pid, { userId: user._id.toString() });
  }
  await user.save();

  res.json({ wishlist: user.wishlist.map((id) => id.toString()) });
}

export async function getRecentlyViewed(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!.id).populate("recentlyViewed").exec();
  if (!user) throw ApiError.notFound("User not found");
  res.json({ items: user.recentlyViewed.filter(Boolean) });
}

export async function recordRecentlyViewed(req: Request, res: Response): Promise<void> {
  const { propertyId } = req.params;
  if (!Types.ObjectId.isValid(propertyId)) throw ApiError.badRequest("Invalid property id");

  if (!(await Property.exists({ _id: propertyId }))) throw ApiError.notFound("Property not found");

  const user = await User.findById(req.user!.id).exec();
  if (!user) throw ApiError.notFound("User not found");

  user.recentlyViewed = pushRecent(user.recentlyViewed, new Types.ObjectId(propertyId));
  await user.save();

  res.json({ recentlyViewed: user.recentlyViewed.map((id) => id.toString()) });
}
