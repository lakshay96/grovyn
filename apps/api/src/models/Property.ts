import { Schema, model, Document, Types } from "mongoose";
import type {
  AgentInfo,
  GeoLocation,
  ListingType,
  PropertyStatus,
  PropertyType,
  Room,
  TourHotspot,
} from "../types";

export interface PropertyDoc extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  location: GeoLocation;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  yearBuilt?: number;
  amenities: string[];
  images: string[];
  model3dUrl?: string;
  panoramaUrls: string[];
  floorPlanUrl?: string;
  rooms?: Room[];
  tourHotspots?: TourHotspot[];
  agent: AgentInfo;
  featured: boolean;
  rating?: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<Room>(
  {
    name: { type: String, required: true },
    w: { type: Number, required: true },
    d: { type: Number, required: true },
    x: { type: Number, required: true },
    z: { type: Number, required: true },
  },
  { _id: false }
);

const hotspotSchema = new Schema<TourHotspot>(
  {
    panoramaIndex: { type: Number, required: true },
    label: { type: String, required: true },
    yaw: { type: Number, required: true },
    pitch: { type: Number, required: true },
    target: { type: Number },
  },
  { _id: false }
);

const propertySchema = new Schema<PropertyDoc>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    listingType: { type: String, enum: ["sale", "rent"], required: true },
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "plot", "commercial", "penthouse"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["available", "under_offer", "sold"],
      default: "available",
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    areaSqft: { type: Number, required: true },
    yearBuilt: { type: Number },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    model3dUrl: { type: String },
    panoramaUrls: { type: [String], default: [] },
    floorPlanUrl: { type: String },
    rooms: { type: [roomSchema], default: undefined },
    tourHotspots: { type: [hotspotSchema], default: undefined },
    agent: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      avatarUrl: { type: String },
    },
    featured: { type: Boolean, default: false, index: true },
    rating: { type: Number },
    views: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

propertySchema.index(
  { title: "text", description: "text", "location.city": "text" },
  { weights: { title: 5, "location.city": 3, description: 1 }, name: "property_text" }
);

propertySchema.set("toJSON", {
  transform(_doc, ret) {
    const r = ret as unknown as Record<string, unknown>;
    delete r.__v;
    return r;
  },
});

export const Property = model<PropertyDoc>("Property", propertySchema);
