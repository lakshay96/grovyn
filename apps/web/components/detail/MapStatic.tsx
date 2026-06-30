'use client';

import type { PropertyLocation } from '@/types';

export function MapStatic({ location }: { location: PropertyLocation }) {
  const { lat, lng } = location;
  const d = 0.018;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10">
      <iframe
        src={src}
        title={`Map of ${location.address}, ${location.city}`}
        loading="lazy"
        className="h-[260px] w-full grayscale-[0.3] invert-[0.92] hue-rotate-180"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent,rgba(10,10,15,0.45))]" />
      <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-bg/80 px-4 py-3 backdrop-blur">
        <p className="text-sm font-semibold">{location.address}</p>
        <p className="text-xs text-muted">
          {location.city}, {location.state}
        </p>
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-accent hover:underline"
        >
          Open in Maps →
        </a>
      </div>
    </div>
  );
}
