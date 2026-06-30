import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] items-center justify-center px-4 text-center">
      <div>
        <p className="gold-text text-7xl font-extrabold">404</p>
        <h1 className="mt-4 text-2xl font-bold">This space doesn’t exist.</h1>
        <p className="mt-2 text-muted">The property or page you’re looking for moved or was never built.</p>
        <Link
          href="/properties"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d8b25e]"
        >
          Explore properties
        </Link>
      </div>
    </div>
  );
}
