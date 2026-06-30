import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const roomSchema = z.object({
  name: z.string(),
  w: z.number(),
  d: z.number(),
  x: z.number(),
  z: z.number(),
});

const hotspotSchema = z.object({
  panoramaIndex: z.number().int().nonnegative(),
  label: z.string(),
  yaw: z.number(),
  pitch: z.number(),
  target: z.number().optional(),
});

const locationSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lat: z.number(),
  lng: z.number(),
});

const agentSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
});

export const createPropertySchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  listingType: z.enum(["sale", "rent"]),
  propertyType: z.enum(["apartment", "villa", "plot", "commercial", "penthouse"]),
  status: z.enum(["available", "under_offer", "sold"]).optional(),
  location: locationSchema,
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  areaSqft: z.number().nonnegative(),
  yearBuilt: z.number().int().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  model3dUrl: z.string().optional(),
  panoramaUrls: z.array(z.string()).optional(),
  floorPlanUrl: z.string().optional(),
  rooms: z.array(roomSchema).optional(),
  tourHotspots: z.array(hotspotSchema).optional(),
  agent: agentSchema,
  featured: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const inquirySchema = z.object({
  property: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().min(1),
  preferredDate: z.string().optional(),
  type: z.enum(["visit", "callback", "info"]).optional(),
});

export const analyticsEventSchema = z.object({
  type: z.enum(["view", "ar_launch", "tour_open", "inquiry", "wishlist", "search"]),
  property: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

export const assistantSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
  context: z.object({ propertyId: z.string().optional() }).optional(),
});

export const summarizeSchema = z.object({
  propertyId: z.string().min(1),
});

export const propertyQuerySchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  propertyType: z.enum(["apartment", "villa", "plot", "commercial", "penthouse"]).optional(),
  listingType: z.enum(["sale", "rent"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  amenities: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "popular"]).optional(),
  page: z.coerce.number().int().positive().max(10000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  featured: z
    .enum(["true", "false", "1", "0"])
    .transform((v) => v === "true" || v === "1")
    .optional(),
});

export type PropertyQuery = z.infer<typeof propertyQuerySchema>;
