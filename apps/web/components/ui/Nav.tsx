'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { useAuth } from '@/store/auth';
import { useWishlist } from '@/store/wishlist';
import { useCompare } from '@/store/compare';
import { cn } from '@/lib/format';

const baseLinks = [
  { href: '/properties', label: 'Explore' },
  { href: '/compare', label: 'Compare' },
  { href: '/showroom', label: 'Showroom' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const wishCount = useWishlist((s) => s.ids.length);
  const compareCount = useCompare((s) => s.ids.length);

  const isStaff = user?.role === 'agent' || user?.role === 'admin';
  const links = isStaff
    ? [...baseLinks, { href: '/dashboard', label: 'Dashboard' }]
    : baseLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-bg/70 backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <nav className="section-pad flex h-16 items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-text',
                pathname.startsWith(l.href) && 'text-text'
              )}
            >
              {l.label}
              {l.href === '/compare' && compareCount > 0 && (
                <Badge>{compareCount}</Badge>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-muted transition-colors hover:text-accent ring-focus"
            aria-label="Wishlist"
          >
            <HeartIcon />
            {wishCount > 0 && <Badge>{wishCount}</Badge>}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-text hover:bg-white/5 ring-focus"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d8b25e] sm:inline-block ring-focus"
            >
              Sign in
            </Link>
          )}

          <button
            className="rounded-full p-2 text-text md:hidden ring-focus"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="section-pad flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted hover:bg-white/5 hover:text-text"
                >
                  {l.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={logout}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-danger hover:bg-white/5"
                >
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-[#0a0a0f]"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-[#0a0a0f]">
      {children}
    </span>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 5 5.2 5c2 0 3.4 1.2 4.3 2.6h.1C10.4 6.2 11.8 5 13.8 5 17 5 18.6 8.4 17 11.8 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}
