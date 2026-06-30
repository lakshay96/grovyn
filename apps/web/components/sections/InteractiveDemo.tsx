'use client';

import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { LazyMiniThumb } from '@/components/three/lazy';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { mockProperties } from '@/lib/mock';

export function InteractiveDemo() {
  const demo = mockProperties[0];
  return (
    <Section id="demo">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Try it now"
            title="A live 3D model. Right here."
            subtitle="This isn’t a video — it’s the real procedural renderer that powers every Grovyn listing, running at 60 FPS in your browser."
          />
          <ul className="mt-8 space-y-3">
            {[
              'Orbit, zoom and explode the floor plan',
              'Built from room dimensions — works fully offline',
              'Loads .glb realistic models when available',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5 9-9" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <MagneticButton href={`/properties/${demo.slug}`}>
              Open full experience
            </MagneticButton>
          </div>
        </div>

        <GlassCard className="relative h-[380px] overflow-hidden p-2">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <LazyMiniThumb rooms={demo.rooms} />
          </div>
          <span className="absolute bottom-4 left-4 rounded-full bg-bg/70 px-3 py-1.5 text-xs text-muted backdrop-blur">
            Auto-rotating preview
          </span>
        </GlassCard>
      </div>
    </Section>
  );
}
