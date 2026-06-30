'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/format';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  type = 'button',
  disabled,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.25;
    setPos({ x, y });
  };

  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ring-focus select-none';
  const variants = {
    primary:
      'bg-accent text-[#0a0a0f] hover:bg-[#d8b25e] shadow-glow',
    ghost: 'bg-white/5 text-text hover:bg-white/10 border border-white/10',
    outline:
      'border border-accent/50 text-accent hover:bg-accent/10',
  };

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={cn(base, variants[variant], disabled && 'opacity-50 pointer-events-none', className)}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-block bg-transparent border-0 p-0"
    >
      {inner}
    </button>
  );
}
