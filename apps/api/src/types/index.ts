import { Types } from "mongoose";


export type UserRole = "user" | "agent" | "admin";

export type ListingType = "sale" | "rent";
export type PropertyType =
  | "apartment"
  | "villa"
  | "plot"
  | "commercial"
  | "penthouse";
export type PropertyStatus = "available" | "under_offer" | "sold";

export interface GeoLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Room {
  name: string;
  w: number;
  d: number;
  x: number;
  z: number;
}

export interface TourHotspot {
  panoramaIndex: number;
  label: string;
  yaw: number;
  pitch: number;
  target?: number;
}

export interface AgentInfo {
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
}

export type InquiryType = "visit" | "callback" | "info";
export type InquiryStatus = "new" | "contacted" | "closed";

export type AnalyticsEventType =
  | "view"
  | "ar_launch"
  | "tour_open"
  | "inquiry"
  | "wishlist"
  | "search";

export interface ChatSender {
  id?: string;
  name: string;
  role: string;
}

export interface AuthPrincipal {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

export type Id = Types.ObjectId | string;
