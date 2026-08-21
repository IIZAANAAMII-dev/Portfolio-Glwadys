import { notFound } from 'next/navigation';

import { ActProcess } from '@/acts/ActProcess';
import { ActWork } from '@/acts/ActWork';
import { ActJourney } from '@/acts/ActJourney';
import { ActExpertise } from '@/acts/ActExpertise';
import { ActContact } from '@/acts/ActContact';
import { getContent } from '@/content';
import { isLocale } from '@/content/locales';
import { BottomNav } from '@/shell/BottomNav';
import { CinematicOpeningSequence } from '@/motion/CinematicOpeningSequence';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getContent(locale);

  return (
    <>
      <CinematicOpeningSequence content={content} locale={locale} />
      <div id="act-process" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActProcess content={content} locale={locale} />
      </div>
      <div id="act-work" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActWork content={content} locale={locale} />
      </div>
      <div id="act-journey">
        <ActJourney content={content} locale={locale} />
      </div>
      <div id="act-expertise" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActExpertise content={content} locale={locale} />
      </div>
      <div id="act-contact" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActContact content={content} locale={locale} />
      </div>
      <BottomNav content={content} locale={locale} />
    </>
  );
}
