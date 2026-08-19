import { ReactNode } from 'react';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Navbar } from '@/ui/Navbar';
import { Footer } from '@/ui/Footer';
import { CustomCursor } from '@/ui/CustomCursor';
import { ChapterIndexModal } from '@/ui/ChapterIndexModal';
import { BehindSwitch } from '@/ui/BehindSwitch';
import { NoiseOverlay } from '@/ui/NoiseOverlay';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import '@/styles/globals.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations('meta');
  const baseUrl = 'https://glwadysdalleau.com';

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: '/fr',
        en: '/en',
        ko: '/ko',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
      url: `/${locale}`,
      siteName: 'Glwadys Dalleau — Creative Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!locales.map(String).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-background-dark text-foreground-light overflow-x-hidden"
        style={
          {
            '--font-editorial': "'Playfair Display', Georgia, serif",
            '--font-sans': "'Plus Jakarta Sans', system-ui, sans-serif",
            '--font-mono': "'JetBrains Mono', monospace",
            '--font-hangul': "'Noto Sans KR', 'Plus Jakarta Sans', sans-serif",
          } as React.CSSProperties
        }
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CustomCursor />
          <NoiseOverlay />
          <Navbar locale={locale} />
          <ChapterIndexModal locale={locale} />
          <BehindSwitch locale={locale} />
          <main className="relative z-10">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
