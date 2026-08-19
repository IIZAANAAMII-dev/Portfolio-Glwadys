import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { locales, defaultLocale, Locale, getMessages } from '@/lib/i18n/messages';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return {
    title: 'Glwadys Dalleau — Social Media & Brand Content',
    description: getMessages((params.locale as Locale) || defaultLocale)['hero.headline'] || '',
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  return (
    <I18nProvider locale={locale}>
      <div lang={locale}>{children}</div>
    </I18nProvider>
  );
}
