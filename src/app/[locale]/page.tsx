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
      <ActScrollStory content={content} locale={locale} />
      <ActProcess content={content} locale={locale} />
      <ActWork content={content} locale={locale} />
      <ActJourney content={content} />
      <ActExpertise content={content} />
      <ActContact content={content} />
      <BottomNav content={content} />
    </>
  );
}
