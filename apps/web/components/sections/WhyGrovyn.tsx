'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';

const steps = [
  {
    n: '01',
    title: 'Discover',
    body: 'Search by city, budget or vibe — or just talk to the concierge. Voice search and trending chips get you moving fast.',
  },
  {
    n: '02',
    title: 'Experience',
    body: 'Walk the home in 3D, drop it in your living room with AR, and take the 360° tour from any device.',
  },
  {
    n: '03',
    title: 'Decide together',
    body: 'Compare side-by-side, save to your wishlist, chat live with the agent, and meet in the shared showroom.',
  },
];

export function WhyGrovyn() {
  return (
    <Section id="why" className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(200,162,75,0.08),transparent_50%)]" />
      <SectionHeading
        eyebrow="Why Grovyn"
        title="From scrolling to standing inside."
        subtitle="The old way wastes weekends on site visits. Grovyn compresses discovery to decision into one immersive flow."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative"
          >
            <span className="text-5xl font-extrabold text-white/10">{s.n}</span>
            <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            {i < steps.length - 1 && (
              <span className="absolute right-0 top-8 hidden h-px w-12 bg-gradient-to-r from-accent/50 to-transparent md:block" />
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
