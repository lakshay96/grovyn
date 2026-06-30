import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { getProperties } from '@/lib/api';

export async function FeaturedProperties() {
  const { items } = await getProperties({ featured: true, limit: 4 });

  return (
    <Section id="featured">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Featured immersive listings"
          subtitle="A taste of what you can walk through today."
        />
        <Link
          href="/properties"
          className="text-sm font-medium text-accent hover:underline"
        >
          View all →
        </Link>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <PropertyCard key={p._id} property={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
