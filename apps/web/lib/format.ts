import type { Property } from '@/types';

export function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

export function priceLabel(p: Property): string {
  return p.listingType === 'rent' ? `${formatINR(p.price)}/mo` : formatINR(p.price);
}

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export function propertyTypeLabel(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export const CITIES = ['Mumbai', 'Bengaluru', 'Goa', 'Gurugram'];
export const PROPERTY_TYPES = [
  'apartment',
  'villa',
  'plot',
  'commercial',
  'penthouse',
] as const;
export const AMENITIES = [
  'Pool',
  'Infinity Pool',
  'Gym',
  'Smart Home',
  'Sea View',
  'Concierge',
  'Private Lift',
  'Garden',
  'EV Charging',
  'Home Theatre',
  'Spa',
  'Parking',
];
