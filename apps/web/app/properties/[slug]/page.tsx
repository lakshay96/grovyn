import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProperty, getSimilar } from '@/lib/api';
import { mockProperties } from '@/lib/mock';
import { priceLabel, propertyTypeLabel, formatINR } from '@/lib/format';
import { Gallery } from '@/components/detail/Gallery';
import { ImmersiveTabs } from '@/components/detail/ImmersiveTabs';
import { InquiryForm } from '@/components/detail/InquiryForm';
import { LiveChat } from '@/components/detail/LiveChat';
import { MapStatic } from '@/components/detail/MapStatic';
import { RecordVisit } from '@/components/detail/RecordVisit';
import { ActionButtons } from '@/components/detail/WishlistButton';
import { PropertyCard } from '@/components/ui/PropertyCard';

export async function generateStaticParams() {
  return mockProperties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const property = await getProperty(params.slug);
  if (!property) return { title: 'Property — Grovyn' };
  return {
    title: `${property.title} — Grovyn`,
    description: property.description.slice(0, 150),
    openGraph: { images: property.images.slice(0, 1) },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getProperty(params.slug);
  if (!property) notFound();
  const similar = await getSimilar(property);

  const specs = [
    property.bedrooms > 0 && { label: 'Bedrooms', value: property.bedrooms },
    property.bathrooms > 0 && { label: 'Bathrooms', value: property.bathrooms },
    { label: 'Area', value: `${property.areaSqft.toLocaleString('en-IN')} sqft` },
    { label: 'Type', value: propertyTypeLabel(property.propertyType) },
    property.yearBuilt && { label: 'Year built', value: property.yearBuilt },
    property.rating && { label: 'Rating', value: `★ ${property.rating}` },
  ].filter(Boolean) as { label: string; value: string | number }[];

  return (
    <article className="section-pad pb-24 pt-24">
      <RecordVisit id={property._id} />

      <div className="mb-6">
        <nav className="mb-3 text-sm text-muted">
          <Link href="/properties" className="hover:text-accent">
            Properties
          </Link>{' '}
          / <span className="text-text">{property.title}</span>
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-muted">
                {property.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{property.title}</h1>
            <p className="mt-1 text-muted">
              {property.location.address}, {property.location.city}, {property.location.state}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-accent">{priceLabel(property)}</p>
            <div className="mt-3">
              <ActionButtons id={property._id} />
            </div>
          </div>
        </div>
      </div>

      <Gallery images={property.images} title={property.title} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-1 text-2xl font-bold">Step inside</h2>
            <p className="mb-5 text-sm text-muted">
              Explore in 3D, place it in your room with AR, or take the 360° tour.
            </p>
            <ImmersiveTabs property={property} />
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold">About this property</h2>
            <p className="leading-relaxed text-muted">{property.description}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">Key details</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-surface/40 p-4">
                  <p className="text-xs text-muted">{s.label}</p>
                  <p className="mt-1 text-lg font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          {property.amenities.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-surface/40 px-3 py-1.5 text-sm text-text"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-2xl font-bold">Location</h2>
            <MapStatic location={property.location} />
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-surface/50 p-5">
            <div className="flex items-center gap-3">
              {property.agent.avatarUrl ? (
                <Image
                  src={property.agent.avatarUrl}
                  alt={property.agent.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                  {property.agent.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold">{property.agent.name}</p>
                <p className="text-xs text-muted">Listing agent · Grovyn</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${property.agent.phone}`}
                className="rounded-full border border-white/10 py-2 text-center text-sm text-text hover:bg-white/5"
              >
                Call
              </a>
              <a
                href={`mailto:${property.agent.email}`}
                className="rounded-full border border-white/10 py-2 text-center text-sm text-text hover:bg-white/5"
              >
                Email
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface/50 p-5">
            <h3 className="mb-4 text-lg font-semibold">Request a tour</h3>
            <InquiryForm property={property} />
          </div>

          <LiveChat roomId={`property:${property._id}`} agentName={property.agent.name} />

          <div className="rounded-2xl border border-white/10 bg-surface/50 p-5">
            <h3 className="mb-2 text-sm font-semibold">Price breakdown</h3>
            <div className="space-y-1 text-sm">
              <Row label={property.listingType === 'rent' ? 'Monthly rent' : 'List price'} value={formatINR(property.price)} />
              <Row label="Per sqft" value={formatINR(Math.round(property.price / property.areaSqft))} />
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Similar properties</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-text">{value}</span>
    </div>
  );
}
