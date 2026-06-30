import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import './globals.css';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { Concierge } from '@/components/concierge/Concierge';

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const display = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Grovyn — The Immersive Property Marketplace',
  description:
    'Walk through your next home before you ever set foot in it. 3D property models, WebXR AR placement, 360° virtual tours and an AI concierge.',
  keywords: ['real estate', 'AR', 'VR', '3D property tour', 'virtual tour', 'Grovyn'],
  openGraph: {
    title: 'Grovyn — The Immersive Property Marketplace',
    description: 'Walk through your next home before you ever set foot in it.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen bg-bg text-text antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#0a0a0f] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <Nav />
          <main id="main" tabIndex={-1} className="relative">
            {children}
          </main>
          <Footer />
          <Concierge />
        </MotionConfig>
      </body>
    </html>
  );
}
