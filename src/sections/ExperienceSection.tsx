'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { GraduationCap, Briefcase, Calendar, MapPin } from 'lucide-react';

export function ExperienceSection() {
  const t = useTranslations('experience');
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = stackRef.current?.querySelectorAll('.stack-card');

      if (cards && cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const experiences = [
    {
      company: 'Le Comptoir de Mathilde',
      role: 'Support Expérience Client & Vente (CDD)',
      period: 'Oct 2024 – Présent',
      location: 'Marseille',
      desc: 'Accueil client, conseil personnalisé, valorisation scénographique des gammes gourmandes et storytelling de marque.',
      skills: ['Expérience Client', 'Merchandising', 'Storytelling Produit'],
      tag: '01 / EN COURS',
      accentColor: '#c5a880',
    },
    {
      company: 'Marseille Girls Club',
      role: 'Support Communauté & Communication (CDI Temps Partiel)',
      period: 'Avr 2025 – Avr 2026',
      location: 'Marseille / Hybride',
      desc: 'Création de formats digitaux, relais des événements féminins, animation de communauté et cohérence de marque.',
      skills: ['Community Care', 'Événementiel', 'Scrapbook Social'],
      tag: '02 / COMMUNAUTÉ',
      accentColor: '#e27d60',
    },
    {
      company: 'Yuna Bijoux',
      role: 'Support Social Media & Communication (Alternance)',
      period: 'Sep 2022 – Jul 2023',
      location: 'Brest',
      desc: 'Stratégie et production de contenus visuels pour joaillerie, planning éditorial, Reels et reach organique.',
      skills: ['Social Media', 'Content Creation', 'Reach'],
      tag: '03 / JOAILLERIE',
      accentColor: '#d8c29d',
    },
  ];

  return (
    <section
      id="experience-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 my-12"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-accent-gold text-xs font-semibold">{t('tag')}</span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-foreground-light mt-2">
            {t('title')}
          </h2>
          <p className="font-sans text-xs text-foreground-muted mt-1">
            {t('subtitle')}
          </p>
        </div>
        <div className="glass-pill px-4 py-2 rounded-full hidden sm:flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-accent-gold" />
          <span className="text-[10px] font-mono text-accent-gold">PARCOURS QUALIFIÉ</span>
        </div>
      </div>

      {/* Experience Stacking Cards */}
      <div ref={stackRef} className="my-auto py-8 space-y-6 max-w-5xl mx-auto w-full">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="stack-card glass-panel p-8 rounded-3xl border border-white/10 hover:border-accent-gold/40 transition-all duration-500 relative overflow-hidden"
            style={{
              boxShadow: `0 10px 30px -10px rgba(0,0,0,0.5)`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-white/5 pb-3">
              <span className="font-mono-tag text-xs" style={{ color: exp.accentColor }}>
                {exp.tag}
              </span>
              <div className="flex items-center gap-4 text-xs font-mono text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {exp.location}
                </span>
              </div>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl text-foreground-light">
              {exp.company}
            </h3>
            <p className="font-mono text-xs text-accent-gold mt-1">
              {exp.role}
            </p>
            <p className="font-sans text-sm text-foreground-muted mt-3 leading-relaxed">
              {exp.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
              {exp.skills.map((sk) => (
                <span key={sk} className="font-mono text-[10px] px-3 py-1 rounded-full bg-white/5 text-foreground-light border border-white/5">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Education Discrete Section */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-5 h-5 text-accent-gold" />
            <span className="font-mono-tag text-xs text-accent-gold">{t('educationTitle')}</span>
          </div>
          <h4 className="font-editorial text-2xl text-foreground-light">
            {t('educationSchool')}
          </h4>
          <p className="font-sans text-xs sm:text-sm text-foreground-muted mt-1">
            {t('educationDegree')}
          </p>
          <span className="font-mono text-[10px] text-foreground-muted block mt-2">
            2020 – 2023 · NÉGOCIATION INTERNATIONALE & MARKETING
          </span>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>STACKING SPATIAL AXE Y / Z</span>
        <span>10 / HISTORIQUE PROFESSIONNEL</span>
      </div>
    </section>
  );
}
