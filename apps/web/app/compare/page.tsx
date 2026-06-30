import type { Metadata } from 'next';
import { CompareClient } from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare — Grovyn',
  description: 'Compare properties side by side.',
};

export default function ComparePage() {
  return <CompareClient />;
}
