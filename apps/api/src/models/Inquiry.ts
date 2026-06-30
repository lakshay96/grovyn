import { Schema, model, Document, Types } from "mongoose";
import type { InquiryStatus, InquiryType } from "../types";

export interface InquiryDoc extends Document {
  _id: Types.ObjectId;
  property: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: string;
  type: InquiryType;
  status: InquiryStatus;
  createdAt: Date;
}

const inquirySchema = new Schema<InquiryDoc>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    preferredDate: { type: String },
    type: {
      type: String,
      enum: ["visit", "callback", "info"],
      default: "info",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Inquiry = model<InquiryDoc>("Inquiry", inquirySchema);
