
export type ListingType = 'sale' | 'rent';
export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'plot'
  | 'commercial'
  | 'penthouse';
export type PropertyStatus = 'available' | 'under_offer' | 'sold';

export interface PropertyLocation {
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

export interface Agent {
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
}

export interface Property {
  _id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  location: PropertyLocation;
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
  agent: Agent;
  featured: boolean;
  rating?: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  avatarUrl?: string;
  phone?: string;
  wishlist: string[];
  recentlyViewed: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Inquiry {
  property: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: string;
  type: 'visit' | 'callback' | 'info';
}

export interface ChatMessage {
  _id?: string;
  roomId: string;
  sender: { id?: string; name: string; role: string };
  text: string;
  createdAt: string;
}

export interface PropertyQuery {
  q?: string;
  city?: string;
  propertyType?: PropertyType | '';
  listingType?: ListingType | '';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  amenities?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  featured?: boolean;
}

export interface PropertyListResponse {
  items: Property[];
  total: number;
  page: number;
  pages: number;
}

export interface AnalyticsSummary {
  totals: {
    properties: number;
    users: number;
    inquiries: number;
    views: number;
    arLaunches: number;
  };
  viewsByDay: { date: string; count: number }[];
  topProperties: { title: string; views: number }[];
  byType: { type: string; count: number }[];
  funnel: { view: number; tour: number; ar: number; inquiry: number };
}

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
