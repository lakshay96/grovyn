'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';

const faqs = [
  {
    q: 'Do I need to install an app for AR?',
    a: 'No. Grovyn uses WebXR, so AR runs in your browser on supported phones. On other devices you get a QR code and an AR Quick Look / Scene Viewer link.',
  },
  {
    q: 'Are the 3D models real?',
    a: 'Yes. Every listing renders a procedural 3D model from its room dimensions, and loads a realistic .glb when the agent provides one. It all runs at 60 FPS.',
  },
  {
    q: 'Will it work on my older laptop?',
    a: 'Grovyn adapts resolution to your device and respects reduced-motion preferences. If WebGL isn’t available, the site still works with rich static visuals.',
  },
  {
    q: 'Is the AI concierge always available?',
    a: 'Yes. It uses a smart local heuristic when no AI key is configured, so recommendations and chat keep working — even fully offline.',
  },
  {
    q: 'Can my family tour a home with me?',
    a: 'Absolutely. The multi-user virtual showroom lets several people share one 3D room, see each other as avatars, and discuss listings live.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <SectionHeading eyebrow="Questions" title="Everything you’re wondering." center />
      <div className="mx-auto mt-12 max-w-2xl divide-y divide-white/10">
        {faqs.map((f, i) => (
          <div key={f.q} className="py-4">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 text-left ring-focus"
              aria-expanded={open === i}
            >
              <span className="text-base font-medium">{f.q}</span>
              <span className={`text-accent transition-transform ${open === i ? 'rotate-45' : ''}`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden text-sm leading-relaxed text-muted"
                >
                  <span className="block pt-3">{f.a}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}
