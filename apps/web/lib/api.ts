import axios, { AxiosError } from 'axios';
import type {
  Property,
  PropertyListResponse,
  PropertyQuery,
  AnalyticsSummary,
  Inquiry,
  User,
  AssistantMessage,
} from '@/types';
import {
  mockProperties,
  mockTrending,
  mockAnalytics,
} from './mock';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('grovyn_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

async function tryApi<T>(call: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await call();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      const e = err as AxiosError;
      // eslint-disable-next-line no-console
      console.warn('[grovyn] API fallback', e.message);
    }
    return fallback();
  }
}

function storedIds(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { ids?: string[] } };
    return parsed.state?.ids ?? [];
  } catch {
    return [];
  }
}

function filterMock(query: PropertyQuery): PropertyListResponse {
  let items = [...mockProperties];
  const q = query.q?.toLowerCase().trim();
  if (q) {
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.propertyType.includes(q) ||
        p.amenities.some((a) => a.toLowerCase().includes(q))
    );
  }
  if (query.city) items = items.filter((p) => p.location.city === query.city);
  if (query.propertyType)
    items = items.filter((p) => p.propertyType === query.propertyType);
  if (query.listingType)
    items = items.filter((p) => p.listingType === query.listingType);
  if (query.minPrice != null) items = items.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice != null) items = items.filter((p) => p.price <= query.maxPrice!);
  if (query.bedrooms != null)
    items = items.filter((p) => p.bedrooms >= query.bedrooms!);
  if (query.amenities && query.amenities.length)
    items = items.filter((p) => {
      const have = p.amenities.map((x) => x.toLowerCase());
      return query.amenities!.every((a) => have.includes(a.toLowerCase()));
    });
  if (query.featured) items = items.filter((p) => p.featured);

  switch (query.sort) {
    case 'price_asc':
      items.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      items.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      items.sort((a, b) => b.views - a.views);
      break;
    case 'newest':
    default:
      items.sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
  }

  const page = query.page || 1;
  const limit = query.limit || 12;
  const total = items.length;
  const paged = items.slice((page - 1) * limit, page * limit);
  return { items: paged, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

function toParams(query: PropertyQuery): Record<string, string | number> {
  const p: Record<string, string | number> = {};
  if (query.q) p.q = query.q;
  if (query.city) p.city = query.city;
  if (query.propertyType) p.propertyType = query.propertyType;
  if (query.listingType) p.listingType = query.listingType;
  if (query.minPrice != null) p.minPrice = query.minPrice;
  if (query.maxPrice != null) p.maxPrice = query.maxPrice;
  if (query.bedrooms != null) p.bedrooms = query.bedrooms;
  if (query.amenities?.length) p.amenities = query.amenities.join(',');
  if (query.sort) p.sort = query.sort;
  if (query.featured) p.featured = 'true';
  p.page = query.page || 1;
  p.limit = query.limit || 12;
  return p;
}

export function getProperties(query: PropertyQuery = {}): Promise<PropertyListResponse> {
  return tryApi(
    async () => {
      const { data } = await api.get<PropertyListResponse>('/properties', {
        params: toParams(query),
      });
      return data;
    },
    () => filterMock(query)
  );
}

export function getProperty(slug: string): Promise<Property | null> {
  return tryApi(
    async () => {
      const { data } = await api.get<{ property: Property }>(`/properties/${slug}`);
      return data.property;
    },
    () => mockProperties.find((p) => p.slug === slug) ?? null
  );
}

export function getSimilar(property: Property): Promise<Property[]> {
  return tryApi(
    async () => {
      const { data } = await api.get<{ items: Property[] }>(
        `/properties/${property._id}/similar`
      );
      return data.items;
    },
    () =>
      mockProperties
        .filter(
          (p) =>
            p._id !== property._id &&
            (p.propertyType === property.propertyType ||
              p.location.city === property.location.city)
        )
        .slice(0, 3)
  );
}

export function getWishlist(): Promise<Property[]> {
  return tryApi(
    async () => {
      const { data } = await api.get<Property[] | { items: Property[] }>('/wishlist');
      return Array.isArray(data) ? data : data.items;
    },
    () => {
      const ids = storedIds('grovyn-wishlist');
      return mockProperties.filter((p) => ids.includes(p._id));
    }
  );
}

export function getSuggestions(q: string): Promise<string[]> {
  if (!q.trim()) return Promise.resolve([]);
  return tryApi(
    async () => {
      const { data } = await api.get<{ suggestions: string[] }>(
        '/search/suggest',
        { params: { q } }
      );
      return data.suggestions;
    },
    () => {
      const lower = q.toLowerCase();
      const pool = new Set<string>();
      mockProperties.forEach((p) => {
        if (p.title.toLowerCase().includes(lower)) pool.add(p.title);
        if (p.location.city.toLowerCase().includes(lower)) pool.add(p.location.city);
        p.amenities.forEach((a) => {
          if (a.toLowerCase().includes(lower)) pool.add(a);
        });
      });
      return Array.from(pool).slice(0, 6);
    }
  );
}

export function getTrending(): Promise<string[]> {
  return tryApi(
    async () => {
      const { data } = await api.get<{ trending: string[] }>('/search/trending');
      return data.trending;
    },
    () => mockTrending
  );
}

export function getRecommendations(): Promise<{ items: Property[]; reason: string }> {
  return tryApi(
    async () => {
      const { data } = await api.get<{ items: Property[]; reason: string }>(
        '/recommendations'
      );
      return data;
    },
    () => ({
      items: mockProperties.filter((p) => p.featured).slice(0, 4),
      reason: 'Trending immersive listings',
    })
  );
}

export function getAnalytics(): Promise<AnalyticsSummary> {
  return tryApi(
    async () => {
      const { data } = await api.get<AnalyticsSummary>('/analytics/summary');
      return data;
    },
    () => mockAnalytics
  );
}

export async function postInquiry(
  inquiry: Inquiry
): Promise<{ ok: boolean; offline?: boolean }> {
  try {
    await api.post('/inquiries', inquiry);
    return { ok: true };
  } catch {
    return { ok: false, offline: true };
  }
}

export function logEvent(type: string, property?: string, meta?: object): void {
  api.post('/analytics/event', { type, property, meta }).catch(() => {});
}

function heuristicReply(messages: AssistantMessage[]): {
  reply: string;
  suggestedProperties: Property[];
} {
  const last = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const q = last.toLowerCase();
  let pool = [...mockProperties];

  if (/goa|beach|villa/.test(q)) pool = pool.filter((p) => /goa/i.test(p.location.city) || p.propertyType === 'villa');
  if (/mumbai/.test(q)) pool = pool.filter((p) => p.location.city === 'Mumbai');
  if (/bengaluru|bangalore/.test(q)) pool = pool.filter((p) => p.location.city === 'Bengaluru');
  if (/rent/.test(q)) pool = pool.filter((p) => p.listingType === 'rent');
  if (/penthouse/.test(q)) pool = pool.filter((p) => p.propertyType === 'penthouse');
  if (/pool/.test(q)) pool = pool.filter((p) => p.amenities.some((a) => /pool/i.test(a)));
  if (pool.length === 0) pool = mockProperties.filter((p) => p.featured);

  const picks = pool.slice(0, 3);
  const reply = picks.length
    ? `Here are ${picks.length} immersive ${picks.length === 1 ? 'match' : 'matches'} I'd tour first. You can walk each one in 3D, place it in your room with AR, or take the 360° tour. Want me to narrow by budget or city?`
    : `I couldn't find an exact match, but tell me your budget, preferred city, or must-have amenities and I'll curate a shortlist you can walk through in 3D.`;
  return { reply, suggestedProperties: picks };
}

export function askAssistant(
  messages: AssistantMessage[],
  context?: { propertyId?: string }
): Promise<{ reply: string; suggestedProperties: Property[] }> {
  return tryApi(
    async () => {
      const { data } = await api.post<{
        reply: string;
        suggestedProperties?: Property[];
      }>('/ai/assistant', { messages, context });
      return { reply: data.reply, suggestedProperties: data.suggestedProperties ?? [] };
    },
    () => heuristicReply(messages)
  );
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  const { data } = await api.post<{ user: User; token: string }>('/auth/register', {
    name,
    email,
    password,
  });
  return data;
}

export function mockAuth(name: string, email: string): { user: User; token: string } {
  return {
    user: {
      _id: 'demo-' + Math.random().toString(36).slice(2, 8),
      name: name || email.split('@')[0],
      email,
      role: email.startsWith('agent') || email.startsWith('admin') ? 'agent' : 'user',
      wishlist: [],
      recentlyViewed: [],
    },
    token: 'demo-token-' + Math.random().toString(36).slice(2),
  };
}
