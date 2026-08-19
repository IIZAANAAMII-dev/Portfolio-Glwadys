import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Archivo, Instrument_Serif, JetBrains_Mono, Noto_Sans_KR } from 'next/font/google';
import { locales } from '@/i18n';
import '@/experience/styles/tokens.css';
import '@/experience/styles/experience.css';
import '@/experience/styles/acts.css';

/**
 * Self-hosted at build time by next/font — no render-blocking request to
 * fonts.googleapis.com and no layout shift. Archivo carries a width axis, which
 * is what lets the hero name condense to fill a line at poster scale.
 */
const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-display',
});

const editorial = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-editorial',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const hangul = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-hangul',
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations('meta');

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://glwadysdalleau.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: '/fr', en: '/en', ko: '/ko' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
      url: `/${locale}`,
      siteName: 'Glwadys Dalleau',
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description') },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!locales.map(String).includes(locale)) notFound();

  const messages = await getMessages();
  const fonts = [display.variable, editorial.variable, mono.variable, hangul.variable].join(' ');

  return (
    <html lang={locale} className={fonts}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
