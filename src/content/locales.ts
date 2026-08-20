export const locales = ['fr', 'en', 'ko'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  ko: 'KO',
};

/** `lang` de l'élément racine. */
export const htmlLang: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en',
  ko: 'ko-KR',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
