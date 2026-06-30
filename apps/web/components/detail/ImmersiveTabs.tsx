'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Property } from '@/types';
import { LazyPropertyViewer, LazyVirtualTour, LazyARViewer } from '@/components/three/lazy';
import { logEvent } from '@/lib/api';

type Tab = '3d' | 'ar' | 'tour';

const TABS: { id: Tab; label: string; sub: string }[] = [
  { id: '3d', label: '3D Model', sub: 'Orbit & explode' },
  { id: 'ar', label: 'View in AR', sub: 'In your room' },
  { id: 'tour', label: '360° Tour', sub: 'Step inside' },
];

export function ImmersiveTabs({ property }: { property: Property }) {
  const [tab, setTab] = useState<Tab>('3d');

  const select = (t: Tab) => {
    setTab(t);
    if (t === 'tour') logEvent('tour_open', property._id);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-surface/50 p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => select(t.id)}
            className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'text-[#0a0a0f]' : 'text-muted hover:text-text'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="immersive-tab"
                className="absolute inset-0 rounded-xl bg-accent"
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative flex flex-col items-center sm:flex-row sm:gap-2">
              <span>{t.label}</span>
              <span className="text-[10px] opacity-70">{t.sub}</span>
            </span>
          </button>
        ))}
      </div>

      <div>
        {tab === '3d' && <LazyPropertyViewer property={property} />}
        {tab === 'ar' && <LazyARViewer property={property} />}
        {tab === 'tour' && <LazyVirtualTour property={property} />}
      </div>
    </div>
  );
}
