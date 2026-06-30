import { Hero } from '@/components/sections/Hero';
import { Highlights } from '@/components/sections/Highlights';
import { InteractiveDemo } from '@/components/sections/InteractiveDemo';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { WhyGrovyn } from '@/components/sections/WhyGrovyn';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <InteractiveDemo />
      <FeaturedProperties />
      <WhyGrovyn />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
