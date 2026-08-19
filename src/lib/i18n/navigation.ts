import { Locale, defaultLocale, locales } from './messages';

const prefix = process.env.NODE_ENV === 'production' ? '' : '';

export function getLocale(pathname: string): Locale {
  const [first] = pathname.replace(prefix, '').split('/').filter(Boolean);
  return (locales as string[]).includes(first) ? (first as Locale) : defaultLocale;
}

export function getPathname(locale: Locale, path = '') {
  return `/${locale}${path}`;
}
