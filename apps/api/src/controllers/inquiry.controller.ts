import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Inquiry, Property } from "../models";
import { ApiError } from "../utils/ApiError";
import { logEvent } from "../services/analytics.service";

export async function createInquiry(req: Request, res: Response): Promise<void> {
  const body = req.body as {
    property: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    preferredDate?: string;
    type?: "visit" | "callback" | "info";
  };

  if (!Types.ObjectId.isValid(body.property)) throw ApiError.badRequest("Invalid property id");
  const property = await Property.findById(body.property).exec();
  if (!property) throw ApiError.notFound("Property not found");

  const inquiry = await Inquiry.create({
    ...body,
    user: req.user?.id ? new Types.ObjectId(req.user.id) : undefined,
  });

  void logEvent("inquiry", property._id, { type: inquiry.type });

  res.status(201).json({ inquiry });
}

export async function listInquiries(req: Request, res: Response): Promise<void> {
  let query: Record<string, unknown> = {};
  if (req.user!.role !== "admin") {
    const ids = await Property.find({ owner: req.user!.id }, "_id").exec();
    const ownedIds = ids.map((p) => p._id);
    query = { property: { $in: ownedIds } };
  }

  const items = await Inquiry.find(query)
    .sort({ createdAt: -1 })
    .populate("property", "title slug location.city price")
    .limit(200)
    .exec();
  res.json({ items });
}
