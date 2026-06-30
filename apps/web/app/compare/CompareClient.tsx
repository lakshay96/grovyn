'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/types';
import { getProperties } from '@/lib/api';
import { useCompare } from '@/store/compare';
import { priceLabel, propertyTypeLabel } from '@/lib/format';
import { LazyMiniThumb } from '@/components/three/lazy';
import { Spinner } from '@/components/ui/Spinner';

export function CompareClient() {
  const compare = useCompare();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pool, setPool] = useState<Property[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    (async () => {
      setLoading(true);
      const res = await getProperties({ limit: 100 });
      if (!active) return;
      setPool(res.items);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [mounted]);

  const byId = useMemo(() => {
    const map = new Map<string, Property>();
    pool.forEach((p) => map.set(p._id, p));
    return map;
  }, [pool]);

  const selected = useMemo(
    () => compare.ids.map((id) => byId.get(id)).filter(Boolean) as Property[],
    [compare.ids, byId]
  );
  const missingIds = useMemo(
    () => compare.ids.filter((id) => !byId.has(id)),
    [compare.ids, byId]
  );

  const columns = selected.length + missingIds.length;

  const rows: { label: string; get: (p: Property) => string }[] = [
    { label: 'Price', get: (p) => priceLabel(p) },
    { label: 'City', get: (p) => p.location.city },
    { label: 'Type', get: (p) => propertyTypeLabel(p.propertyType) },
    { label: 'Listing', get: (p) => (p.listingType === 'rent' ? 'For Rent' : 'For Sale') },
    { label: 'Bedrooms', get: (p) => String(p.bedrooms || '—') },
    { label: 'Bathrooms', get: (p) => String(p.bathrooms || '—') },
    { label: 'Area', get: (p) => `${p.areaSqft.toLocaleString('en-IN')} sqft` },
    { label: 'Per sqft', get: (p) => `₹${Math.round(p.price / p.areaSqft).toLocaleString('en-IN')}` },
    { label: 'Year built', get: (p) => String(p.yearBuilt ?? '—') },
    { label: 'Rating', get: (p) => (p.rating ? `★ ${p.rating}` : '—') },
    { label: 'Amenities', get: (p) => p.amenities.slice(0, 4).join(', ') },
  ];

  if (!mounted || loading) {
    return (
      <div className="section-pad flex min-h-[60svh] items-center justify-center pt-28">
        <Spinner label="Loading comparison…" />
      </div>
    );
  }

  return (
    <div className="section-pad pb-24 pt-28">
      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Compare properties</h1>
        <p className="mt-2 text-muted">
          {columns}/4 selected — add up to four from any listing card.
        </p>
      </header>

      {columns === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface/50 p-12 text-center">
          <p className="text-lg font-medium">Nothing to compare yet.</p>
          <p className="mt-2 text-sm text-muted">Tap “Compare” on any property card to add it here.</p>
          <Link href="/properties" className="mt-4 inline-block text-sm text-accent hover:underline">
            Browse properties →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: `160px repeat(${columns}, minmax(0,1fr))` }}>
            <div />
            {selected.map((p) => (
              <div key={p._id} className="rounded-2xl border border-white/10 bg-surface/40 p-2">
                <div className="relative h-32 overflow-hidden rounded-xl">
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="25vw" />
                </div>
                <div className="mt-2 h-28 overflow-hidden rounded-xl">
                  <LazyMiniThumb rooms={p.rooms} />
                </div>
                <div className="mt-2 flex items-start justify-between gap-2 px-1">
                  <Link href={`/properties/${p.slug}`} className="line-clamp-1 text-sm font-semibold hover:text-accent">
                    {p.title}
                  </Link>
                  <button
                    onClick={() => compare.remove(p._id)}
                    aria-label="Remove"
                    className="text-muted hover:text-danger"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {missingIds.map((id) => (
              <div key={id} className="rounded-2xl border border-white/10 bg-surface/40 p-2">
                <div className="flex h-32 items-center justify-center rounded-xl bg-white/5 text-center text-xs text-muted">
                  Listing unavailable
                </div>
                <div className="mt-2 flex items-start justify-between gap-2 px-1">
                  <span className="line-clamp-1 text-sm font-semibold text-muted">Saved property</span>
                  <button
                    onClick={() => compare.remove(id)}
                    aria-label="Remove"
                    className="text-muted hover:text-danger"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 ? 'bg-surface/30' : ''}>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted">{row.label}</th>
                      {selected.map((p) => (
                        <td key={p._id} className="px-4 py-3 text-text">
                          {row.get(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            onClick={compare.clear}
            className="mt-6 rounded-full border border-white/10 px-4 py-2 text-sm text-muted hover:text-text"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}
