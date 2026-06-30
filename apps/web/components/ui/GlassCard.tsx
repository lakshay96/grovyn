'use client';

import { cn } from '@/lib/format';
import { forwardRef } from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover, glow, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        'glass rounded-2xl',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-glass',
        glow && 'shadow-glow',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);

GlassCard.displayName = 'GlassCard';
