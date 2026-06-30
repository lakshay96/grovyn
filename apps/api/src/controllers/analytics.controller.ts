import type { Request, Response } from "express";
import { AnalyticsEvent, Inquiry, Property, User } from "../models";
import { logEvent } from "../services/analytics.service";

export async function summary(_req: Request, res: Response): Promise<void> {
  const [
    properties,
    users,
    inquiries,
    viewAgg,
    arAgg,
    viewsByDay,
    topProperties,
    byType,
    funnelAgg,
  ] = await Promise.all([
    Property.countDocuments().exec(),
    User.countDocuments().exec(),
    Inquiry.countDocuments().exec(),
    AnalyticsEvent.countDocuments({ type: "view" }).exec(),
    AnalyticsEvent.countDocuments({ type: "ar_launch" }).exec(),

    AnalyticsEvent.aggregate<{ date: string; count: number }>([
      {
        $match: {
          type: "view",
          createdAt: { $gte: new Date(Date.now() - 30 * 864e5) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: "$_id", count: 1 } },
      { $sort: { date: 1 } },
    ]).exec(),

    Property.find({}, "title views")
      .sort({ views: -1 })
      .limit(8)
      .exec(),

    Property.aggregate<{ type: string; count: number }>([
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
      { $project: { _id: 0, type: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]).exec(),

    AnalyticsEvent.aggregate<{ _id: string; count: number }>([
      { $match: { type: { $in: ["view", "tour_open", "ar_launch", "inquiry"] } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]).exec(),
  ]);

  const funnelMap = new Map(funnelAgg.map((f) => [f._id, f.count]));

  res.json({
    totals: {
      properties,
      users,
      inquiries,
      views: viewAgg,
      arLaunches: arAgg,
    },
    viewsByDay,
    topProperties: topProperties.map((p) => ({ title: p.title, views: p.views })),
    byType,
    funnel: {
      view: funnelMap.get("view") ?? 0,
      tour: funnelMap.get("tour_open") ?? 0,
      ar: funnelMap.get("ar_launch") ?? 0,
      inquiry: funnelMap.get("inquiry") ?? 0,
    },
  });
}

export async function ingestEvent(req: Request, res: Response): Promise<void> {
  const { type, property, meta } = req.body as {
    type: Parameters<typeof logEvent>[0];
    property?: string;
    meta?: Record<string, unknown>;
  };
  void logEvent(type, property, meta);
  res.status(202).json({ ok: true });
}
