import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 ${className ?? ''}`}
      aria-label="Grovyn home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
          <defs>
            <linearGradient id="glogo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e9cf8a" />
              <stop offset="1" stopColor="#a07f2d" />
            </linearGradient>
          </defs>
          <path
            d="M16 3 L28 10 V22 L16 29 L4 22 V10 Z"
            fill="none"
            stroke="url(#glogo)"
            strokeWidth="1.6"
          />
          <path d="M16 9 L22 12.5 V19 L16 22.5 L10 19 V12.5 Z" fill="url(#glogo)" opacity="0.9" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight">Grovyn</span>
    </Link>
  );
}
