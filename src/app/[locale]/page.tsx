import { notFound } from 'next/navigation';

import { ActOpeningHero } from '@/acts/ActOpeningHero';
import { ActSocial } from '@/acts/ActSocial';
import { ActPhone } from '@/acts/ActPhone';
import { ActImmersion } from '@/acts/ActImmersion';
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
      <div id="act-opening">
        <ActOpeningHero content={content} locale={locale} />
      </div>
      <div id="act-social">
        <ActSocial content={content} locale={locale} />
      </div>
      <div id="act-phone" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActPhone content={content} locale={locale} />
      </div>
      <div id="act-immersion" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActImmersion content={content} locale={locale} />
      </div>
      <div id="act-process" className="act-handoff-overlap">
        <ActProcess content={content} locale={locale} />
      </div>
      <div id="act-work" className="act-handoff-overlap">
        <ActWork content={content} locale={locale} />
      </div>
      <div id="act-journey">
        <ActJourney content={content} locale={locale} />
      </div>
      <div id="act-expertise" className="act-handoff-overlap">
        <ActExpertise content={content} locale={locale} />
      </div>
      <div id="act-contact" className="act-handoff-overlap">
        <ActContact content={content} locale={locale} />
      </div>
      <BottomNav content={content} locale={locale} />
    </>
  );
}
