'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Property } from '@/types';
import { priceLabel, propertyTypeLabel } from '@/lib/format';
import { useWishlist } from '@/store/wishlist';
import { useCompare } from '@/store/compare';

export function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const wish = useWishlist();
  const compare = useCompare();
  const wished = wish.ids.includes(property._id);
  const comparing = compare.ids.includes(property._id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="group glass relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glass"
    >
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-text backdrop-blur">
              {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {property.featured && (
              <span className="rounded-full bg-accent/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0a0a0f]">
                Featured
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-text/90">
            <span className="rounded-md bg-black/40 px-2 py-1 backdrop-blur">
              3D · AR · 360°
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => wish.toggle(property._id)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-text backdrop-blur transition-colors hover:bg-black/70 ring-focus"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={wished ? 'var(--accent)' : 'none'}
          stroke={wished ? 'var(--accent)' : 'currentColor'}
          strokeWidth="1.8"
        >
          <path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.2 5c2 0 3.4 1.2 4.3 2.6h.1C10.4 6.2 11.8 5 13.8 5 17 5 18.6 8.4 17 11.8 19.5 16.4 12 21 12 21z" />
        </svg>
      </button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/properties/${property.slug}`}>
            <h3 className="line-clamp-1 text-base font-semibold transition-colors group-hover:text-accent">
              {property.title}
            </h3>
          </Link>
          <span className="shrink-0 text-sm font-bold text-accent">
            {priceLabel(property)}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted">
          {property.location.address}, {property.location.city}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          {property.bedrooms > 0 && <Spec icon="bed" v={`${property.bedrooms} Bed`} />}
          {property.bathrooms > 0 && <Spec icon="bath" v={`${property.bathrooms} Bath`} />}
          <Spec icon="area" v={`${property.areaSqft.toLocaleString('en-IN')} sqft`} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted">
            {propertyTypeLabel(property.propertyType)}
          </span>
          <button
            onClick={() => compare.toggle(property._id)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium ring-focus transition-colors ${
              comparing
                ? 'bg-accent text-[#0a0a0f]'
                : 'border border-white/10 text-muted hover:text-text'
            }`}
          >
            {comparing ? 'Comparing ✓' : 'Compare'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({ icon, v }: { icon: 'bed' | 'bath' | 'area'; v: string }) {
  const paths: Record<string, React.ReactNode> = {
    bed: <path d="M3 12h18M3 12V7a2 2 0 012-2h14a2 2 0 012 2v5M3 17v-5M21 17v-5M6 9h4" />,
    bath: <path d="M4 12h16v3a3 3 0 01-3 3H7a3 3 0 01-3-3v-3zM6 12V6a2 2 0 012-2 2 2 0 012 2" />,
    area: <path d="M4 4h16v16H4zM4 9h16M9 4v16" />,
  };
  return (
    <span className="inline-flex items-center gap-1">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        {paths[icon]}
      </svg>
      {v}
    </span>
  );
}
