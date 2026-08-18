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
          end: () => `+=${Math.max(track.scrollWidth * 0.82, window.innerHeight * 2.4)}`,
          pin: true,
          scrub: 0.55,
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
        duration: 2.1,
      }).to(
        {},
        {
          duration: 2.1,
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
      className="scene-surface relative min-h-screen w-full flex flex-col justify-between overflow-hidden z-10 select-none py-8"
    >
      <div className="px-6 md:px-14 flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>
      </div>

      {/* Horizontal Editorial Hint Track */}
      <div className="my-auto w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex items-end gap-12 md:gap-24 px-6 md:px-14 w-max"
        >
          <div className="w-[80vw] md:w-[40vw] pb-4 border-b border-white/10">
            <span className="font-editorial text-5xl md:text-7xl text-foreground-light/90 italic">
              Rythme & Flow
            </span>
            <p className="font-sans text-xs text-foreground-muted mt-2 max-w-xs">
              Montage dynamique, typographie animée et engagement direct.
            </p>
          </div>
          <div className="w-[80vw] md:w-[40vw] pb-4 border-b border-white/10">
            <span className="font-editorial text-5xl md:text-7xl text-foreground-light/90">
              Pureté Visuelle
            </span>
            <p className="font-sans text-xs text-foreground-muted mt-2 max-w-xs">
              Direction artistique soignée et mise en valeur des matières nobles.
            </p>
          </div>
          <div className="w-[80vw] md:w-[40vw] pb-4 border-b border-white/10">
            <span className="font-editorial text-5xl md:text-7xl text-foreground-light/90">
              Moments Réels
            </span>
            <p className="font-sans text-xs text-foreground-muted mt-2 max-w-xs">
              Fédérer des personnes autour de valeurs communes.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-14 flex justify-end items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>{t('title')}</span>
      </div>
    </section>
  );
}