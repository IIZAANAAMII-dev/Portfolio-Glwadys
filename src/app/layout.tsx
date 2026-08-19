import type { Metadata } from 'next';
import { Inter, Baskervville, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const baskervville = Baskervville({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-serif',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Glwadys Dalleau — Social Media & Brand Strategy',
  description:
    'Portfolio créatif et direction de contenu de Glwadys Dalleau. Social Media Management, Création de contenu, Communication de marque et Stratégie digitale.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${baskervville.variable} ${jetbrains.variable}`}>
      <body className="bg-obsidian text-ivory font-sans antialiased">{children}</body>
    </html>
  );
}
