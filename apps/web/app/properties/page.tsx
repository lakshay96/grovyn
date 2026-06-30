import type { Metadata } from 'next';
import { getProperties } from '@/lib/api';
import { PropertiesClient } from './PropertiesClient';

export const metadata: Metadata = {
  title: 'Explore Properties — Grovyn',
  description: 'Browse immersive 3D property listings across India.',
};

export default async function PropertiesPage() {
  const { items } = await getProperties({ limit: 12, sort: 'newest' });
  return <PropertiesClient initial={items} />;
}
