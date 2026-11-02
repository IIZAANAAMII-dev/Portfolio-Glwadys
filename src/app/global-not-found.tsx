import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';

import '@/styles/tokens.css';
import styles from './global-not-found.module.css';

/* La mise en page racine vit dans [locale] : une URL inconnue (ou une langue
   inexistante) n'a aucune mise en page à composer. Cette page est donc un
   document complet, avec ses propres polices. */
const bodoni = localFont({
  src: [
    { path: '../fonts/bodoni/bodoni-moda-latin-standard-normal.woff2', weight: '400 900', style: 'normal' },
    { path: '../fonts/bodoni/bodoni-moda-latin-standard-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-bodoni',
});

const interTight = localFont({
  src: '../fonts/inter/inter-tight-latin-wght-normal.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  title: 'Page introuvable — Glwadys Dalleau',
  description: 'Cette page n’existe pas. Revenir au portfolio de Glwadys Dalleau.',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="fr-FR" className={`${bodoni.variable} ${interTight.variable}`}>
      <body className={styles.body}>
        <main className={styles.page}>
          <p className={styles.chrome}>
            <span>Nº 01 — Portfolio 2026</span>
            <span>Erreur 404</span>
          </p>

          <h1 className={styles.title}>
            <span className={styles.numeral} aria-hidden="true">404</span>
            <span className={styles.line}>Page introuvable.</span>
          </h1>
          <p className={styles.lead}>Cette page n’existe pas — ou plus. Le portfolio, lui, est toujours là.</p>

          <Link className={styles.cta} href="/fr">
            Revenir à la couverture <span aria-hidden="true">→</span>
          </Link>

          <nav className={styles.langs} aria-label="Autres langues">
            <Link href="/en" hrefLang="en" lang="en">English</Link>
            <Link href="/ko" hrefLang="ko" lang="ko">한국어</Link>
          </nav>

          <p className={styles.signature} translate="no">Glwadys Dalleau</p>
        </main>
      </body>
    </html>
  );
}
