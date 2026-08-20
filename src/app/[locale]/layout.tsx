import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Bodoni_Moda, Inter_Tight, Kalam, Noto_Sans_KR } from 'next/font/google';
import type { ReactNode } from 'react';

import { getContent } from '@/content';
import { htmlLang, isLocale, locales, type Locale } from '@/content/locales';
import { CustomCursor } from '@/shell/CustomCursor';
import { Grain } from '@/shell/Grain';
import { SmoothScroll } from '@/shell/SmoothScroll';

import '@/styles/tokens.css';
import '@/styles/base.css';

/* Polices auto-hébergées par next/font : aucune requête vers un tiers,
   aucun CLS. Les trois sont sous SIL Open Font License 1.1. */

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni',
  // Axe optique exploité : `font-optical-sizing: auto` dans base.css.
  axes: ['opsz'],
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

/* Accent manuscrit volontairement limité aux annotations courtes. */
const kalam = Kalam({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kalam',
  weight: '400',
});

/* Chargé uniquement lorsque /ko l'utilise réellement : pas de preload. */
const notoKR = Noto_Sans_KR({
  display: 'swap',
  variable: '--font-noto-kr',
  weight: ['400', '500'],
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { meta } = getContent(locale);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: htmlLang[locale],
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed: Locale = locale;
  const content = getContent(typed);

  const fontVars = [bodoni.variable, interTight.variable, kalam.variable, notoKR.variable].join(' ');

  return (
    <html lang={htmlLang[typed]} className={fontVars}>
      <body data-locale={typed}>
        <a className="skip-link" href="#main">
          {content.a11y.skipToContent}
        </a>
        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
        <Grain />
        <CustomCursor />
      </body>
    </html>
  );
}
