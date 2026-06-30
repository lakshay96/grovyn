'use client';

import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';

const quotes = [
  {
    text: 'We shortlisted three homes in an evening — in AR, on the sofa. Saved us four weekends of site visits.',
    name: 'Aditi & Rohan',
    role: 'Bought in Mumbai',
  },
  {
    text: 'The 360° tour sold the Goa villa before my clients ever flew down. This is the future of listings.',
    name: 'Caleb Fernandes',
    role: 'Agent, North Goa',
  },
  {
    text: 'The concierge actually understood “calm, light-filled, near the lake.” It curated exactly that.',
    name: 'Meera Iyer',
    role: 'Renter, Bengaluru',
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Loved by buyers & agents"
        title="Decisions, made with confidence."
        center
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {quotes.map((q) => (
          <GlassCard key={q.name} className="flex flex-col p-6">
            <div className="mb-4 flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2l2.4 5.6L20 9l-4.5 3.8L17 19l-5-3-5 3 1.5-6.2L4 9l5.6-1.4z" />
                </svg>
              ))}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-text">“{q.text}”</p>
            <div className="mt-5">
              <p className="text-sm font-semibold">{q.name}</p>
              <p className="text-xs text-muted">{q.role}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
