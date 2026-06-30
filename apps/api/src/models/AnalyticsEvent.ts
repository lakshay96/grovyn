import { Schema, model, Document, Types } from "mongoose";
import type { AnalyticsEventType } from "../types";

export interface AnalyticsEventDoc extends Document {
  _id: Types.ObjectId;
  type: AnalyticsEventType;
  property?: Types.ObjectId;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const analyticsEventSchema = new Schema<AnalyticsEventDoc>(
  {
    type: {
      type: String,
      enum: ["view", "ar_launch", "tour_open", "inquiry", "wishlist", "search"],
      required: true,
      index: true,
    },
    property: { type: Schema.Types.ObjectId, ref: "Property", index: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AnalyticsEvent = model<AnalyticsEventDoc>(
  "AnalyticsEvent",
  analyticsEventSchema
);
