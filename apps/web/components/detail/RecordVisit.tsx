'use client';

import { useEffect } from 'react';
import { useRecent } from '@/store/recent';
import { logEvent } from '@/lib/api';

export function RecordVisit({ id }: { id: string }) {
  const visit = useRecent((s) => s.visit);
  useEffect(() => {
    visit(id);
    logEvent('view', id);
  }, [id, visit]);
  return null;
}
