import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  const cols = [
    {
      title: 'Explore',
      links: [
        { href: '/properties', label: 'All Properties' },
        { href: '/properties?propertyType=penthouse', label: 'Penthouses' },
        { href: '/properties?propertyType=villa', label: 'Villas' },
        { href: '/showroom', label: 'Virtual Showroom' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { href: '/compare', label: 'Compare' },
        { href: '/wishlist', label: 'Wishlist' },
        { href: '/dashboard', label: 'Agent Dashboard' },
        { href: '/login', label: 'Sign in' },
      ],
    },
    {
      title: 'Immersive',
      links: [
        { href: '/properties', label: '3D Models' },
        { href: '/properties', label: 'AR Placement' },
        { href: '/properties', label: '360° Tours' },
        { href: '/properties', label: 'AI Concierge' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-surface/40">
      <div className="section-pad py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Grovyn is the immersive property marketplace. Walk through your
              next home in 3D, place it in your room with AR, and tour it in
              360° — before you ever set foot in it.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="text-sm font-semibold text-text">{c.title}</h3>
              <ul className="mt-4 space-y-2">
                {c.links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Grovyn. Spatial commerce for real estate.</p>
          <p className="gold-text font-medium">
            Walk through your next home before you ever set foot in it.
          </p>
        </div>
      </div>
    </footer>
  );
}
