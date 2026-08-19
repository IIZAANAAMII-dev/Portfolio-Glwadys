'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Calendar, MapPin, Coffee } from 'lucide-react';

export function ComptoirCaseStudy() {
  const t = useTranslations('work.comptoir');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll('.comptoir-element');
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'bottom 20%', toggleActions: 'play none none reverse' } });
      tl.fromTo(elements || [], { y: 48, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.9, ease: 'power4.out' })
        .to(elements || [], { y: -14, duration: 0.7, ease: 'none' }, '<0.35');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="comptoir-case-study"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 my-12 bg-background-dark"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-[#c5a880] text-xs font-semibold">CASE STUDY 03 / ART DE VIVRE & ÉPICERIE FINE</span>
          <h2 className="font-editorial text-4xl sm:text-6xl text-foreground-light mt-2">
            {t('title')}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
          <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-[#c5a880]">
            <Calendar className="w-3.5 h-3.5" />
            {t('period')}
          </span>
          <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-foreground-light">
            <MapPin className="w-3.5 h-3.5" />
            {t('location')}
          </span>
        </div>
      </div>

      {/* Case Details in Warm Luxury Tone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 items-center">
        {/* Left Col: Role & Summary */}
        <div className="lg:col-span-6 space-y-6">
          <div className="comptoir-element glass-panel p-8 rounded-3xl border border-[#c5a880]/30 bg-[#3e271d]/20">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono-tag text-xs text-[#c5a880]">SUPPORT EXPÉRIENCE CLIENT & VENTE</span>
              <ShoppingBag className="w-4 h-4 text-[#c5a880]" />
            </div>
            <h3 className="font-editorial text-2xl text-foreground-light">
              {t('role')}
            </h3>
            <p className="font-sans text-sm text-foreground-muted mt-4 leading-relaxed">
              {t('summary')}
            </p>
          </div>

          <div className="comptoir-element glass-panel p-6 rounded-3xl border border-white/5">
            <span className="font-mono-tag text-xs text-[#c5a880] block mb-3">SAVOIR-FAIRE EN ACTION</span>
            <div className="flex flex-wrap gap-2">
              {['Expérience Client', 'Conseil Produit', 'Merchandising Visuel', 'Storytelling de Marque', 'Opérations'].map((sk) => (
                <span
                  key={sk}
                  className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 text-foreground-light border border-[#c5a880]/20"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Macro Product Focus */}
        <div className="lg:col-span-6 comptoir-element glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between h-[380px] bg-[#1f140e]/40">
          <div className="flex justify-between items-center font-mono-tag text-xs text-[#c5a880]">
            <span>MERCHANDISING & CONSEIL</span>
            <Coffee className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div className="my-auto text-center">
            <span className="font-editorial text-3xl sm:text-4xl text-foreground-light block italic">
              « Le goût du détail & l&apos;artisanat gourmand. »
            </span>
            <p className="font-sans text-xs text-foreground-muted mt-3 max-w-md mx-auto">
              Optimisation de l&apos;accueil, mise en valeur scénographique des gammes et transmission de l&apos;histoire de chaque produit.
            </p>
          </div>
          <div className="border-t border-white/10 pt-3 text-[10px] font-mono text-foreground-muted flex justify-between">
            <span>MARSEILLE</span>
            <span className="text-[#c5a880]">OCT 2024 – PRÉSENT</span>
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>LE COMPTOIR DE MATHILDE · MARSEILLE</span>
        <span>CAS ÉTUDE EXPÉRIENCE & MERCHANDISING</span>
      </div>
    </section>
  );
}
