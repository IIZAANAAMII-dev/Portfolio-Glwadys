'use client';

import { useLenis } from '@/hooks/useLenis';
import { IntroSection } from '@/sections/IntroSection';
import { HeroSection } from '@/sections/HeroSection';
import { SocialSection } from '@/sections/SocialSection';
import { GallerySection } from '@/sections/GallerySection';
import { BrandSection } from '@/sections/BrandSection';
import { StrategySection } from '@/sections/StrategySection';
import { JourneySection } from '@/sections/JourneySection';
import { WorkSection } from '@/sections/WorkSection';
import { YunaCaseStudy } from '@/sections/YunaCaseStudy';
import { MgcCaseStudy } from '@/sections/MgcCaseStudy';
import { ComptoirCaseStudy } from '@/sections/ComptoirCaseStudy';
import { ServicesSection } from '@/sections/ServicesSection';
import { ContactSection } from '@/sections/ContactSection';

type Props = {
  params: { locale: string };
};

export default function HomePage({ params: { locale } }: Props) {
  useLenis();

  return (
    <div className="relative w-full">
      <IntroSection />
      <HeroSection locale={locale} />
      <SocialSection />
      <GallerySection />
      <BrandSection />
      <StrategySection />
      <JourneySection />
      <WorkSection />
      <YunaCaseStudy />
      <MgcCaseStudy />
      <ComptoirCaseStudy />
      <ServicesSection />
      <ContactSection />
    </div>
  );
}
