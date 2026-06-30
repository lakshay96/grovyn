'use client';

import dynamic from 'next/dynamic';
import { CanvasLoader } from '@/components/ui/Spinner';

const loading = () => <CanvasLoader />;

export const LazyHeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading,
});

export const LazyPropertyViewer = dynamic(() => import('./PropertyViewer'), {
  ssr: false,
  loading,
});

export const LazyVirtualTour = dynamic(() => import('./VirtualTour'), {
  ssr: false,
  loading,
});

export const LazyARViewer = dynamic(() => import('./ARViewer'), {
  ssr: false,
  loading: () => <CanvasLoader label="Preparing AR…" />,
});

export const LazyShowroom = dynamic(() => import('./Showroom'), {
  ssr: false,
  loading: () => <CanvasLoader label="Entering showroom…" />,
});

export const LazyMiniThumb = dynamic(() => import('./MiniThumb'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-white/5" />,
});
