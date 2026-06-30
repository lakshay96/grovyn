import { Schema, model, Document, Types } from "mongoose";
import type { UserRole } from "../types";

export interface UserDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  wishlist: Types.ObjectId[];
  recentlyViewed: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    avatarUrl: { type: String },
    phone: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    recentlyViewed: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    delete r.passwordHash;
    delete r.__v;
    return r;
  },
});

export const User = model<UserDoc>("User", userSchema);
