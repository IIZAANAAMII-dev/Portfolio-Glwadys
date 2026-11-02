import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import localFont from 'next/font/local';
import '@/fonts/noto/index.css';
import type { ReactNode } from 'react';

import { getContent } from '@/content';
import { htmlLang, isLocale, locales, type Locale } from '@/content/locales';
import { ChapterCurtain } from '@/shell/ChapterCurtain';
import { CustomCursor } from '@/shell/CustomCursor';
import { Grain } from '@/shell/Grain';
import { SmoothScroll } from '@/shell/SmoothScroll';

import '@/styles/tokens.css';
import '@/styles/base.css';

/* Same licensed families, vendored from Fontsource: reproducible offline builds.
   Noto keeps unicode-range subsets and is only fetched for rendered glyphs. */
/* Le romain ET l'italique : le site compose en italique Didone (signature,
   Expertise, manifeste, décisions). Sans le vrai fichier, le navigateur
   penchait le romain — un faux italique, sans les formes calligraphiques. */
const bodoni = localFont({
  src: [
    { path: '../../fonts/bodoni/bodoni-moda-latin-standard-normal.woff2', weight: '400 900', style: 'normal' },
    { path: '../../fonts/bodoni/bodoni-moda-latin-standard-italic.woff2', weight: '400 900', style: 'italic' },
  ],
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

/* Exécuté de façon synchrone avant que le corps ne soit peint. */
const PRE_PAINT = "document.documentElement.setAttribute('data-js','')";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* Adresse publique : variable explicite, sinon le domaine de production
   Vercel du projet. Les URL de partage (canonical, og:image) sont absolues. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://portfolio-glwadys.vercel.app');

/** Open Graph attend `langue_TERRITOIRE`, pas une balise BCP 47. */
const ogLocale: Record<Locale, string> = { fr: 'fr_FR', en: 'en_GB', ko: 'ko_KR' };

export const viewport: Viewport = {
  themeColor: '#0b0908',
  colorScheme: 'dark',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { meta, hero } = getContent(locale);
  const image = {
    url: `/og/og-${locale}.jpg`,
    width: 1200,
    height: 630,
    alt: `${hero.firstName} ${hero.lastName} — ${meta.title.split(' — ').pop()}`,
  };
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    applicationName: `${hero.firstName} ${hero.lastName}`,
    authors: [{ name: `${hero.firstName} ${hero.lastName}` }],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
        'x-default': '/fr',
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      siteName: `${hero.firstName} ${hero.lastName}`,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image],
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

  /* Données structurées : la personne, son métier, ses langues, ses liens. */
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${content.hero.firstName} ${content.hero.lastName}`,
    jobTitle: content.opening.role.join(' · '),
    description: content.meta.description,
    url: `${SITE_URL}/${typed}`,
    image: `${SITE_URL}/og/og-${typed}.jpg`,
    email: `mailto:${content.contact.email}`,
    sameAs: [content.contact.linkedin],
    knowsLanguage: ['fr', 'en', 'ko'],
    address: { '@type': 'PostalAddress', addressLocality: 'Marseille', addressCountry: 'FR' },
  };

  const fontVars = [bodoni.variable, interTight.variable, kalam.variable].join(' ');

  return (
    <html lang={htmlLang[typed]} className={fontVars} suppressHydrationWarning>
      <body data-locale={typed} suppressHydrationWarning>
        {/* Avant le premier rendu : signale que le film va s'armer. Les actes
            suivants, empilés sous la couverture par les marges de raccord,
            restent masqués jusqu'à l'hydratation (base.css). Sans JS, le
            document se lit à plat. */}
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
        />
        <a className="skip-link" href="#main">
          {content.a11y.skipToContent}
        </a>
        <SmoothScroll>
          <main id="main">{children}</main>
        </SmoothScroll>
        <Grain />
        <ChapterCurtain />
        <CustomCursor />
      </body>
    </html>
  );
}
