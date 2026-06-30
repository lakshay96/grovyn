'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/types';
import { getProperties, getWishlist } from '@/lib/api';
import { useWishlist } from '@/store/wishlist';
import { useRecent } from '@/store/recent';
import { useAuth } from '@/store/auth';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Spinner } from '@/components/ui/Spinner';

function MissingCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface/40 p-5">
      <div>
        <p className="text-sm font-semibold">Saved property</p>
        <p className="mt-1 text-xs text-muted">
          This listing is unavailable right now. It will reappear once it loads.
        </p>
      </div>
      <Link href="/properties" className="mt-3 text-xs text-accent hover:underline">
        Browse properties →
      </Link>
    </div>
  );
}

export function WishlistClient() {
  const user = useAuth((s) => s.user);
  const wish = useWishlist();
  const recent = useRecent();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pool, setPool] = useState<Property[]>([]);
  const [serverSaved, setServerSaved] = useState<Property[] | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    (async () => {
      setLoading(true);
      const [list, saved] = await Promise.all([
        getProperties({ limit: 100 }),
        user ? getWishlist() : Promise.resolve(null),
      ]);
      if (!active) return;
      setPool(list.items);
      setServerSaved(saved);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [mounted, user]);

  const byId = useMemo(() => {
    const map = new Map<string, Property>();
    pool.forEach((p) => map.set(p._id, p));
    (serverSaved ?? []).forEach((p) => map.set(p._id, p));
    return map;
  }, [pool, serverSaved]);

  const saved = useMemo<Property[]>(() => {
    if (user && serverSaved) return serverSaved;
    return wish.ids.map((id) => byId.get(id)).filter(Boolean) as Property[];
  }, [user, serverSaved, wish.ids, byId]);

  const missingIds = useMemo(() => {
    if (user && serverSaved) return [];
    return wish.ids.filter((id) => !byId.has(id));
  }, [user, serverSaved, wish.ids, byId]);

  const recentItems = useMemo(
    () => recent.ids.map((id) => byId.get(id)).filter(Boolean) as Property[],
    [recent.ids, byId]
  );

  const total = saved.length + missingIds.length;

  if (!mounted || loading) {
    return (
      <div className="section-pad flex min-h-[60svh] items-center justify-center pt-28">
        <Spinner label="Loading your wishlist…" />
      </div>
    );
  }

  return (
    <div className="section-pad pb-24 pt-28">
      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Your wishlist</h1>
        <p className="mt-2 text-muted">
          {total} saved {total === 1 ? 'property' : 'properties'}.
        </p>
      </header>

      {total === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface/50 p-12 text-center">
          <p className="text-lg font-medium">No saved properties yet.</p>
          <p className="mt-2 text-sm text-muted">Tap the heart on any listing to save it here.</p>
          <Link href="/properties" className="mt-4 inline-block text-sm text-accent hover:underline">
            Browse properties →
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p, i) => (
            <PropertyCard key={p._id} property={p} index={i} />
          ))}
          {missingIds.map((id) => (
            <MissingCard key={id} />
          ))}
        </div>
      )}

      {recentItems.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Recently viewed</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentItems.slice(0, 6).map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
