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
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 my-12"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-accent-gold text-xs font-semibold">{t('tag')}</span>
          <p className="font-mono text-xs text-foreground-muted mt-1">{t('locationNote')}</p>
        </div>
        <span className="text-xs text-foreground-muted hidden sm:inline">
          COLLABORATION & MISSIONS
        </span>
      </div>

      {/* Center Giant CTA Statement */}
      <div className="my-auto max-w-5xl mx-auto w-full text-center py-12 flex flex-col items-center justify-center">
        <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground-light tracking-tight leading-[0.95]">
          {t('headline')}
        </h2>
        <p className="font-sans text-sm sm:text-base md:text-lg text-foreground-muted max-w-xl mx-auto mt-6 leading-relaxed">
          {t('sub')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          {/* Direct Email Action with Copy button */}
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

          {/* LinkedIn Profile */}
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

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>MARSEILLE · FRANCE</span>
        <span>11 / COLLABORATION & CONTACT</span>
      </div>
    </section>
  );
}
