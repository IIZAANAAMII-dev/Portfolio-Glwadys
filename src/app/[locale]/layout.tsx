import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { getContent } from '@/content';
import { htmlLang, isLocale, locales, type Locale } from '@/content/locales';
import { CustomCursor } from '@/shell/CustomCursor';
import { Grain } from '@/shell/Grain';
import { SmoothScroll } from '@/shell/SmoothScroll';

import '@/styles/tokens.css';
import '@/styles/base.css';

/* Polices définies en CSS ; évite la dépendance réseau de next/font pendant le build CI. */

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
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${base}/${locale}/`,
      languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `${base}/${l}/`])),
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

  return (
    <html lang={htmlLang[typed]} suppressHydrationWarning>
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
