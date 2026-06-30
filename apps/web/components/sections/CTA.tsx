'use client';

import { Section } from '@/components/ui/Section';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function CTA() {
  return (
    <Section id="cta">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-2 to-surface p-10 text-center md:p-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,162,75,0.18),transparent_60%)]" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
            Your next home is one <span className="gold-text">immersive tour</span> away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Start exploring in 3D today — no installs, no friction, fully alive
            even offline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <MagneticButton href="/properties">Explore properties</MagneticButton>
            <MagneticButton href="/register" variant="outline">
              Create free account
            </MagneticButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
