'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentState {
  ids: string[];
  visit: (id: string) => void;
}

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      visit: (id) =>
        set((s) => ({
          ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 12),
        })),
    }),
    { name: 'grovyn-recent' }
  )
);
