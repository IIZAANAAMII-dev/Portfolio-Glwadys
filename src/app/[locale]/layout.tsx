import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import localFont from 'next/font/local';
import '@/fonts/noto/index.css';
import type { ReactNode } from 'react';

import { getContent } from '@/content';
import { htmlLang, isLocale, locales, type Locale } from '@/content/locales';
import { CustomCursor } from '@/shell/CustomCursor';
import { Grain } from '@/shell/Grain';
import { SmoothScroll } from '@/shell/SmoothScroll';

import '@/styles/tokens.css';
import '@/styles/base.css';

/* Same licensed families, vendored from Fontsource: reproducible offline builds.
   Noto keeps unicode-range subsets and is only fetched for rendered glyphs. */
const bodoni = localFont({
  src: '../../fonts/bodoni/bodoni-moda-latin-standard-normal.woff2',
  weight: '400 900',
  display: 'swap',
  variable: '--font-bodoni',
});

const interTight = localFont({
  src: '../../fonts/inter/inter-tight-latin-wght-normal.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter-tight',
});

const kalam = localFont({
  src: '../../fonts/kalam/kalam-latin-400-normal.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-kalam',
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

  const fontVars = [bodoni.variable, interTight.variable, kalam.variable].join(' ');

  return (
    <html lang={htmlLang[typed]} className={fontVars} suppressHydrationWarning>
      <body data-locale={typed} suppressHydrationWarning>
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
