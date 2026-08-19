'use client';

import React, { createContext, useContext } from 'react';
import { Locale, defaultLocale, getMessages, labels } from './messages';

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  labels: Record<Locale, string>;
}

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (key: string) => key,
  labels,
});

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const messages = getMessages(locale);
  const t = (key: string) => messages[key] || key;
  return <I18nContext.Provider value={{ locale, t, labels }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
