'use client';

import { motion } from 'framer-motion';
import { LazyHeroScene } from '@/components/three/lazy';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 grid-noise">
        {!reduced ? (
          <LazyHeroScene />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(109,106,255,0.18),transparent_60%),radial-gradient(circle_at_20%_70%,rgba(200,162,75,0.14),transparent_55%)]" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="section-pad relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            The immersive property marketplace
          </span>

          <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[1.02]">
            Walk through your{' '}
            <span className="gold-text">next home</span> before you ever set foot in it.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Grovyn turns listings into spaces. Explore homes in real-time 3D,
            place them in your room with AR, and tour them in 360° — guided by an
            AI concierge that learns what you love.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton href="/properties">Explore properties</MagneticButton>
            <MagneticButton href="/showroom" variant="ghost">
              Enter virtual showroom
            </MagneticButton>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              ['12K+', 'Immersive listings'],
              ['60 FPS', 'Real-time 3D'],
              ['4 cities', 'India · live'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-2xl font-bold text-text">{n}</dt>
                <dd className="text-xs text-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        animate={reduced ? {} : { y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <span className="h-2 w-1 rounded-full bg-accent" />
        </div>
      </motion.div>
    </section>
  );
}
