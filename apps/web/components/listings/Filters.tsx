'use client';

import type { PropertyQuery } from '@/types';
import { CITIES, PROPERTY_TYPES, AMENITIES, propertyTypeLabel, formatINR } from '@/lib/format';

export function Filters({
  query,
  onChange,
  onReset,
}: {
  query: PropertyQuery;
  onChange: (patch: Partial<PropertyQuery>) => void;
  onReset: () => void;
}) {
  const toggleAmenity = (a: string) => {
    const set = new Set(query.amenities ?? []);
    if (set.has(a)) set.delete(a);
    else set.add(a);
    onChange({ amenities: Array.from(set), page: 1 });
  };

  return (
    <aside className="space-y-6 rounded-2xl border border-white/10 bg-surface/50 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button onClick={onReset} className="text-xs text-accent hover:underline">
          Reset
        </button>
      </div>

      <FilterGroup label="City">
        <select
          value={query.city ?? ''}
          onChange={(e) => onChange({ city: e.target.value, page: 1 })}
          className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
        >
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Listing">
        <div className="flex gap-2">
          {([['', 'Any'], ['sale', 'Buy'], ['rent', 'Rent']] as const).map(([v, l]) => (
            <button
              key={l}
              onClick={() => onChange({ listingType: v as PropertyQuery['listingType'], page: 1 })}
              className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium ${
                (query.listingType ?? '') === v
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-white/10 text-muted hover:text-text'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Type">
        <select
          value={query.propertyType ?? ''}
          onChange={(e) => onChange({ propertyType: e.target.value as PropertyQuery['propertyType'], page: 1 })}
          className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
        >
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {propertyTypeLabel(t)}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Bedrooms (min)">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((b) => (
            <button
              key={b}
              onClick={() => onChange({ bedrooms: b === 0 ? undefined : b, page: 1 })}
              className={`flex-1 rounded-lg border px-1 py-2 text-xs font-medium ${
                (query.bedrooms ?? 0) === b
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-white/10 text-muted hover:text-text'
              }`}
            >
              {b === 0 ? 'Any' : `${b}+`}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label={`Max price · ${query.maxPrice ? formatINR(query.maxPrice) : 'Any'}`}>
        <input
          type="range"
          min={1000000}
          max={250000000}
          step={1000000}
          value={query.maxPrice ?? 250000000}
          onChange={(e) =>
            onChange({
              maxPrice: parseInt(e.target.value) >= 250000000 ? undefined : parseInt(e.target.value),
              page: 1,
            })
          }
          className="w-full accent-[var(--accent)]"
        />
      </FilterGroup>

      <FilterGroup label="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => {
            const active = query.amenities?.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-2.5 py-1 text-[11px] ${
                  active
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-white/10 text-muted hover:text-text'
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted">{label}</p>
      {children}
    </div>
  );
}
