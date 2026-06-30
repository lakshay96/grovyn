'use client';

import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';

const features = [
  {
    title: 'Real-time 3D models',
    body: 'Every listing renders as an explorable 3D space — orbit it, explode the floor plan, inspect each room with measurement hotspots.',
    icon: 'cube',
    accent: '#6d6aff',
  },
  {
    title: 'AR in your room',
    body: 'WebXR places a scaled model in your physical space. No app install — and a QR fallback for every other device.',
    icon: 'ar',
    accent: '#c8a24b',
  },
  {
    title: '360° virtual tours',
    body: 'Step inside with drag-to-look panoramas and clickable hotspots that walk you stop to stop through the home.',
    icon: 'pano',
    accent: '#36d399',
  },
  {
    title: 'AI property concierge',
    body: 'Describe the vibe, budget, or city. The concierge curates a shortlist you can tour instantly — with voice if you prefer.',
    icon: 'ai',
    accent: '#4ea8de',
  },
  {
    title: 'Live agent chat',
    body: 'Talk to the listing agent in real time, right from the property page, with messages synced over sockets.',
    icon: 'chat',
    accent: '#b388eb',
  },
  {
    title: 'Multi-user showroom',
    body: 'Invite family into a shared 3D room. See each other as avatars, teleport around, and discuss listings together.',
    icon: 'users',
    accent: '#f87272',
  },
];

const ICONS: Record<string, React.ReactNode> = {
  cube: <path d="M12 2l9 5v10l-9 5-9-5V7zM12 2v20M3 7l9 5 9-5" />,
  ar: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" />,
  pano: <path d="M3 12a9 4 0 0018 0 9 4 0 00-18 0zM12 3v18" />,
  ai: <path d="M12 2l2.4 5.6L20 9l-4.5 3.8L17 19l-5-3-5 3 1.5-6.2L4 9l5.6-1.4z" />,
  chat: <path d="M4 5h16v11H8l-4 4z" />,
  users: <path d="M8 11a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M17 11a3 3 0 100-6M22 20a6 6 0 00-7-5.9" />,
};

export function Highlights() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="The platform"
        title="Listings, reimagined as spaces."
        subtitle="Six capabilities that turn browsing into experiencing. Every one degrades gracefully — nothing breaks, even offline."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            <GlassCard hover className="h-full p-6">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${f.accent}22`, color: f.accent }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {ICONS[f.icon]}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
