'use client';

import { useEffect, useState } from 'react';
import { appStore, Chapter } from '../lib/store';
import { X, ArrowRight } from 'lucide-react';

const CHAPTERS: { id: Chapter; num: string; nameFr: string; nameEn: string; nameKo: string; sectionId: string }[] = [
  { id: 'intro', num: '00', nameFr: 'Introduction', nameEn: 'Introduction', nameKo: '인트로', sectionId: 'intro-section' },
  { id: 'hero', num: '01', nameFr: 'Le Récit & Vision', nameEn: 'The Vision & Hero', nameKo: '비전 & 헤로', sectionId: 'hero-section' },
  { id: 'identity', num: '02', nameFr: 'Déconstruction & Présence', nameEn: 'Identity & Grid', nameKo: '아이덴티티 그리드', sectionId: 'identity-section' },
  { id: 'social', num: '03', nameFr: 'Univers Social & Front / Behind', nameEn: 'Social World & Front / Behind', nameKo: '소셜 월드 & 비하인드', sectionId: 'social-section' },
  { id: 'gallery', num: '04', nameFr: 'Galerie Éditoriale 3D', nameEn: '3D Content Gallery', nameKo: '3D 에디토리얼 갤러리', sectionId: 'gallery-section' },
  { id: 'brand', num: '05', nameFr: 'Cohérence de Marque', nameEn: 'Brand Consistency', nameKo: '브랜드 일관성', sectionId: 'brand-section' },
  { id: 'strategy', num: '06', nameFr: 'Méthode & Stratégie', nameEn: 'Strategy & Method', nameKo: '전략 및 방법론', sectionId: 'strategy-section' },
  { id: 'about', num: '07', nameFr: 'À Propos de Glwadys', nameEn: 'About Glwadys', nameKo: '소개', sectionId: 'about-section' },
  { id: 'journey', num: '08', nameFr: 'Parcours Freelance (2021-2026)', nameEn: 'Freelance Journey', nameKo: '프리랜서 여정', sectionId: 'journey-section' },
  { id: 'work', num: '09', nameFr: 'Projets Sélectionnés', nameEn: 'Selected Work', nameKo: '선정 프로젝트', sectionId: 'work-section' },
  { id: 'services', num: '10', nameFr: 'Services & Expertises', nameEn: 'Services & Skills', nameKo: '서비스 & 전문분야', sectionId: 'services-section' },
  { id: 'experience', num: '11', nameFr: 'Expériences & Formation', nameEn: 'Experience & Degrees', nameKo: '경력 & 학력', sectionId: 'experience-section' },
  { id: 'contact', num: '12', nameFr: 'Contact & Collaboration', nameEn: 'Let’s Collaborate', nameKo: '문의 및 협업', sectionId: 'contact-section' },
];

export function ChapterIndexModal({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = appStore.subscribe((state) => {
      setIsOpen(state.isIndexOpen);
    });
    return () => {
      unsub();
    };
  }, []);

  if (!isOpen) return null;

  const navigateTo = (sectionId: string) => {
    appStore.setState({ isIndexOpen: false });
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c0e]/95 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-14 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <span className="font-mono-tag text-accent-gold text-xs">INDEX NAVIGATION</span>
          <h2 className="font-editorial text-2xl md:text-3xl text-foreground-light mt-1">
            SOMMAIRE DE L&apos;EXPÉRIENCE
          </h2>
        </div>
        <button
          onClick={() => appStore.setState({ isIndexOpen: false })}
          className="glass-pill p-3 rounded-full hover:border-accent-gold transition-colors text-foreground-light cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 my-auto overflow-y-auto max-h-[70vh] py-6">
        {CHAPTERS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.sectionId)}
            className="group text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-accent-gold/40 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-accent-gold font-semibold">
                {item.num}
              </span>
              <span className="font-sans text-sm md:text-base text-foreground-light group-hover:text-accent-gold transition-colors">
                {locale === 'ko'
                  ? item.nameKo
                  : locale === 'en'
                  ? item.nameEn
                  : item.nameFr}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-accent-gold group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-foreground-muted gap-2">
        <span>GLWADYS DALLEAU — PORTFOLIO CREATIF</span>
        <span>MARSEILLE, FRANCE · 2026</span>
      </div>
    </div>
  );
}
