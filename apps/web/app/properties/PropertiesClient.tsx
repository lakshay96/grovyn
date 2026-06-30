'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property, PropertyQuery } from '@/types';
import { getProperties, logEvent } from '@/lib/api';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { SearchBar } from '@/components/listings/SearchBar';
import { Filters } from '@/components/listings/Filters';
import { Spinner } from '@/components/ui/Spinner';

const SORTS: { v: NonNullable<PropertyQuery['sort']>; l: string }[] = [
  { v: 'newest', l: 'Newest' },
  { v: 'price_asc', l: 'Price ↑' },
  { v: 'price_desc', l: 'Price ↓' },
  { v: 'popular', l: 'Popular' },
];

export function PropertiesClient({ initial }: { initial: Property[] }) {
  const [query, setQuery] = useState<PropertyQuery>({ sort: 'newest', page: 1, limit: 12 });
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Property[]>(initial);
  const [total, setTotal] = useState(initial.length);
  const [loading, setLoading] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const didMount = useRef(false);
  const didSearchMount = useRef(false);

  const run = useCallback(async (q: PropertyQuery) => {
    setLoading(true);
    const res = await getProperties(q);
    setItems(res.items);
    setTotal(res.total);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!didSearchMount.current) {
      didSearchMount.current = true;
      return;
    }
    const t = setTimeout(() => {
      setQuery((prev) => ({ ...prev, q: search || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    run(query);
    if (query.q) logEvent('search', undefined, { q: query.q });
  }, [query, run]);

  const patch = (p: Partial<PropertyQuery>) => setQuery((prev) => ({ ...prev, ...p }));
  const reset = () => {
    setSearch('');
    setQuery({ sort: 'newest', page: 1, limit: 12 });
  };

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (query.city) chips.push({ label: query.city, clear: () => patch({ city: undefined }) });
    if (query.propertyType) chips.push({ label: query.propertyType, clear: () => patch({ propertyType: undefined }) });
    if (query.listingType) chips.push({ label: query.listingType, clear: () => patch({ listingType: undefined }) });
    if (query.bedrooms) chips.push({ label: `${query.bedrooms}+ bed`, clear: () => patch({ bedrooms: undefined }) });
    (query.amenities ?? []).forEach((a) =>
      chips.push({ label: a, clear: () => patch({ amenities: query.amenities?.filter((x) => x !== a) }) })
    );
    return chips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="section-pad pb-24 pt-28">
      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Explore properties</h1>
        <p className="mt-2 text-muted">
          {total} immersive {total === 1 ? 'listing' : 'listings'} you can walk through in 3D.
        </p>
      </header>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} onSubmit={(v) => setSearch(v)} />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMobileFilters((v) => !v)}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-text hover:bg-white/5 lg:hidden"
          >
            Filters {activeChips.length > 0 && `(${activeChips.length})`}
          </button>
          <AnimatePresence>
            {activeChips.map((c) => (
              <motion.button
                key={c.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={c.clear}
                className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5 text-xs font-medium capitalize text-accent"
              >
                {c.label}
                <span className="text-accent/70">✕</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.v}
              onClick={() => patch({ sort: s.v, page: 1 })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                query.sort === s.v ? 'bg-accent text-[#0a0a0f]' : 'border border-white/10 text-muted hover:text-text'
              }`}
            >
              {s.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className={`${mobileFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <Filters query={query} onChange={patch} onReset={reset} />
          </div>
        </div>

        <div>
          {loading ? (
            <Spinner label="Curating listings…" />
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-surface/50 p-12 text-center">
              <p className="text-lg font-medium">No properties match those filters.</p>
              <button onClick={reset} className="mt-4 text-sm text-accent hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
