import type { Metadata } from 'next';
import { getProperties } from '@/lib/api';
import { ShowroomClient } from './ShowroomClient';

export const metadata: Metadata = {
  title: 'Virtual Showroom — Grovyn',
  description: 'A shared 3D room where visitors explore properties together.',
};

export default async function ShowroomPage() {
  const { items } = await getProperties({ featured: true, limit: 4 });
  return <ShowroomClient properties={items} />;
}
