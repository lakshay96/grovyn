'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/format';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  reveal?: boolean;
}

export function Section({ children, className, id, reveal = true }: SectionProps) {
  if (!reveal) {
    return (
      <section id={id} className={cn('section-pad py-20 md:py-28', className)}>
        {children}
      </section>
    );
  }
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn('section-pad py-20 md:py-28', className)}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted md:text-lg">{subtitle}</p>}
    </div>
  );
}
