import { notFound } from 'next/navigation';

import { ActScrollStory } from '@/acts/ActScrollStory';
import { ActProcess } from '@/acts/ActProcess';
import { ActWork } from '@/acts/ActWork';
import { ActJourney } from '@/acts/ActJourney';
import { ActExpertise } from '@/acts/ActExpertise';
import { ActContact } from '@/acts/ActContact';
import { getContent } from '@/content';
import { isLocale } from '@/content/locales';
import { BottomNav } from '@/shell/BottomNav';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getContent(locale);

  return (
    <>
      <div id="act-scroll-story">
        <ActScrollStory content={content} locale={locale} />
      </div>
      <div id="act-process">
        <ActProcess content={content} locale={locale} />
      </div>
      <div id="act-work">
        <ActWork content={content} locale={locale} />
      </div>
      <div id="act-journey">
        <ActJourney content={content} locale={locale} />
      </div>
      <div id="act-expertise">
        <ActExpertise content={content} />
      </div>
      <div id="act-contact">
        <ActContact content={content} />
      </div>
      <BottomNav content={content} locale={locale} />
    </>
  );
}
