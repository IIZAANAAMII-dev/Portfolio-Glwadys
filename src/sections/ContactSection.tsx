'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Linkedin, Copy, Check, ArrowUpRight } from 'lucide-react';

export function ContactSection() {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);
  const email = 'glwadys.dalleau29@gmail.com';
  const linkedinUrl = 'https://linkedin.com/in/glwadysdalleau';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact-section"
      className="relative min-h-[120vh] w-full flex flex-col justify-between p-6 md:p-14 -mt-[20vh] pt-[24vh] overflow-hidden z-20 bg-gradient-to-b from-background-dark/95 via-background-dark to-background-dark"
    >
      <div className="flex justify-between items-start font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-accent-gold text-xs font-semibold">{t('tag')}</span>
          <p className="font-mono text-xs text-foreground-muted mt-1">{t('locationNote')}</p>
        </div>
      </div>

      <div className="my-auto max-w-6xl mx-auto w-full text-center py-16 flex flex-col items-center justify-center">
        <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground-light tracking-tight leading-[0.9]">
          {t('headline')}
        </h2>
        <p className="font-sans text-sm sm:text-base md:text-lg text-foreground-muted max-w-2xl mx-auto mt-8 leading-relaxed">
          {t('sub')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <div className="glass-panel p-2 rounded-full flex items-center gap-3 pr-4 border border-accent-gold/40">
            <a
              href={`mailto:${email}`}
              className="bg-accent-gold text-background-dark font-mono font-bold px-6 py-3 rounded-full text-xs hover:bg-[#e6d3b3] transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </a>
            <button
              onClick={copyEmail}
              className="text-foreground-muted hover:text-accent-gold transition-colors p-2 cursor-pointer"
              aria-label={t('copyEmail')}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill px-6 py-3.5 rounded-full flex items-center gap-2 text-xs font-mono text-foreground-light hover:border-accent-gold transition-all"
          >
            <Linkedin className="w-4 h-4 text-accent-gold" />
            <span>LINKEDIN</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted" />
          </a>
        </div>

        {copied && (
          <span className="font-mono text-xs text-green-400 mt-4 animate-fadeIn">
            ✓ {t('emailCopied')}
          </span>
        )}
      </div>

      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>{t('locationNote')}</span>
      </div>
    </section>
  );
}
