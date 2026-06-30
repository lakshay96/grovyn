'use client';

import { useState } from 'react';
import type { Property } from '@/types';
import { LazyShowroom } from '@/components/three/lazy';
import { useAuth } from '@/store/auth';

export function ShowroomClient({ properties }: { properties: Property[] }) {
  const user = useAuth((s) => s.user);
  const [name, setName] = useState(user?.name ?? '');
  const [entered, setEntered] = useState(false);

  return (
    <div className="section-pad pb-24 pt-28">
      <header className="mb-8 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Live · multi-user
        </span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">Virtual showroom</h1>
        <p className="mt-2 text-muted">
          Enter a shared 3D gallery. See other visitors as avatars, teleport by
          clicking the floor, and open featured listings from glowing pedestals.
          Presence syncs over sockets — and gracefully shows just you if the
          server is offline.
        </p>
      </header>

      {!entered ? (
        <div className="max-w-md rounded-2xl border border-white/10 bg-surface/50 p-6">
          <label className="mb-2 block text-sm font-medium">Your display name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aria"
            className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2.5 text-sm text-text outline-none focus:border-accent/50"
          />
          <button
            onClick={() => setEntered(true)}
            disabled={!name.trim()}
            className="mt-4 w-full rounded-full bg-accent py-3 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d8b25e] disabled:opacity-50 ring-focus"
          >
            Enter showroom
          </button>
        </div>
      ) : (
        <LazyShowroom name={name} properties={properties} />
      )}
    </div>
  );
}
