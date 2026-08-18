'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';

export function GallerySection() {
  const t = useTranslations('gallery');
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${track.scrollWidth * 1.2}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.85) {
              MasterTimelineManager.setChapter('brand');
            } else {
              MasterTimelineManager.setChapter('gallery');
            }
          },
        },
      });

      // Horizontal track progression (Phase X) coupled with 3D camera travel (Phase Y/Z)
      tl.to(track, {
        x: -totalWidth,
        ease: 'none',
        duration: 3,
      }).to(
        {},
        {
          duration: 3,
          onUpdate: function () {
            const prog = this.progress();
            MasterTimelineManager.updateCamera({
              x: gsap.utils.interpolate(0, 4.0, prog),
              y: gsap.utils.interpolate(-6.5, -12.0, prog),
              z: gsap.utils.interpolate(1.4, 7.5, prog),
              fov: gsap.utils.interpolate(54, 45, prog),
            });
          },
        },
        '<'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden z-10 select-none py-8"
    >
      {/* Top Header */}
      <div className="px-6 md:px-14 flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-foreground-muted">
          <span>{t('phaseX')}</span>
          <span>•</span>
          <span>{t('phaseY')}</span>
          <span>•</span>
          <span>{t('phaseZ')}</span>
        </div>
      </div>

      {/* Horizontal Spatial Editorial Strip */}
      <div className="my-auto w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex items-center gap-8 md:gap-14 px-6 md:px-14 w-max"
        >
          {/* Gallery Card 1: Vertical Reel */}
          <div className="w-[280px] sm:w-[340px] md:w-[400px] aspect-[9/16] glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden group">
            <div className="flex justify-between items-center font-mono-tag text-[10px]">
              <span className="text-accent-gold">01. REEL FORMAT</span>
              <span className="text-foreground-muted">9:16 VERTICAL</span>
            </div>
            <div className="my-auto text-center">
              <span className="font-editorial text-4xl text-foreground-light block italic">
                Rythme & Flow
              </span>
              <p className="text-xs text-foreground-muted mt-2">
                Montage dynamique, typographie animée et engagement direct.
              </p>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] font-mono text-foreground-muted">
              <span>REACH ORGANIQUE</span>
              <span className="text-accent-gold font-bold">100% SOCIAL</span>
            </div>
          </div>

          {/* Gallery Card 2: Editorial Portrait Still */}
          <div className="w-[320px] sm:w-[420px] md:w-[480px] aspect-[4/5] glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center font-mono-tag text-[10px]">
              <span className="text-accent-gold">02. EDITORIAL STILL</span>
              <span className="text-foreground-muted">4:5 PORTRAIT</span>
            </div>
            <div className="my-auto text-center">
              <span className="font-editorial text-5xl text-foreground-light block">
                Pureté Visuelle
              </span>
              <p className="text-xs text-foreground-muted mt-2">
                Direction artistique soignée et mise en valeur des matières nobles.
              </p>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] font-mono text-foreground-muted">
              <span>DIRECTION ARTISTIQUE</span>
              <span className="text-accent-gold font-bold">PREMIUM CRAFT</span>
            </div>
          </div>

          {/* Gallery Card 3: Brand Messaging Typography */}
          <div className="w-[300px] sm:w-[380px] md:w-[440px] aspect-square glass-panel rounded-3xl p-8 flex flex-col justify-between border border-accent-gold/30">
            <span className="font-mono-tag text-[10px] text-accent-gold">03. MANIFESTE</span>
            <blockquote className="font-editorial text-2xl sm:text-3xl text-foreground-light leading-snug my-auto">
              « Créer du contenu qui ne s&apos;oublie pas au scroll suivant. »
            </blockquote>
            <span className="font-mono text-[10px] text-foreground-muted">
              GLWADYS DALLEAU · MARSEILLE
            </span>
          </div>

          {/* Gallery Card 4: Community & Events */}
          <div className="w-[280px] sm:w-[360px] md:w-[420px] aspect-[9/16] glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10">
            <div className="flex justify-between items-center font-mono-tag text-[10px]">
              <span className="text-accent-gold">04. COMMUNITY</span>
              <span className="text-foreground-muted">ÉVÉNEMENTIEL</span>
            </div>
            <div className="my-auto text-center">
              <span className="font-editorial text-4xl text-foreground-light block">
                Moments Réels
              </span>
              <p className="text-xs text-foreground-muted mt-2">
                Fédérer des personnes autour de valeurs communes et d&apos;expériences partagées.
              </p>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] font-mono text-foreground-muted">
              <span>ENGAGEMENT</span>
              <span className="text-accent-gold font-bold">AUTHENTIQUE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Status */}
      <div className="px-6 md:px-14 flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>AXES MULTIPLES : TRAVELLING SPATIAL</span>
        <span>03 / DANS LE CONTENU</span>
      </div>
    </section>
  );
}
