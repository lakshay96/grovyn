'use client';

import { useWishlist } from '@/store/wishlist';
import { useCompare } from '@/store/compare';
import { logEvent } from '@/lib/api';

export function ActionButtons({ id }: { id: string }) {
  const wish = useWishlist();
  const compare = useCompare();
  const wished = wish.ids.includes(id);
  const comparing = compare.ids.includes(id);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          wish.toggle(id);
          if (!wished) logEvent('wishlist', id);
        }}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ring-focus ${
          wished ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-text hover:bg-white/5'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.2 5c2 0 3.4 1.2 4.3 2.6h.1C10.4 6.2 11.8 5 13.8 5 17 5 18.6 8.4 17 11.8 19.5 16.4 12 21 12 21z" />
        </svg>
        {wished ? 'Saved' : 'Save'}
      </button>
      <button
        onClick={() => compare.toggle(id)}
        className={`rounded-full border px-4 py-2 text-sm font-medium ring-focus ${
          comparing ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-text hover:bg-white/5'
        }`}
      >
        {comparing ? 'Comparing ✓' : 'Compare'}
      </button>
    </div>
  );
}
