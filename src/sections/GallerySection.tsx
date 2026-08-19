'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '@/motion/MasterTimeline';

const MEDIA = [
  { id: 'g1', src: '/assets/projects/yuna-story.svg', w: '28vw', x: 0, z: 60, r: -1 },
  { id: 'g2', src: '/assets/projects/mgc-scrapbook.svg', w: '22vw', x: 32, z: 0, r: 1 },
  { id: 'g3', src: '/assets/projects/comptoir-macro.svg', w: '34vw', x: 68, z: -40, r: 0 },
  { id: 'g4', src: '/assets/projects/yuna-story.svg', w: '24vw', x: 110, z: 80, r: -2 },
  { id: 'g5', src: '/assets/projects/mgc-scrapbook.svg', w: '30vw', x: 140, z: -20, r: 2 },
];

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
          end: () =>
            `+=${Math.max(track.scrollWidth * 0.75, window.innerHeight * 2.2)}`,
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

      tl.to(track, {
        x: -totalWidth,
        ease: 'none',
        duration: 2.0,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gallery-section"
      className="scene-surface relative min-h-screen w-full flex flex-col justify-between overflow-hidden z-10 select-none py-8"
      style={{ perspective: '1600px' }}
      ref={sectionRef}
    >
      <div className="px-6 md:px-14 flex justify-between items-start font-mono-tag z-20">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>
      </div>

      <div className="my-auto w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex items-end gap-8 md:gap-16 px-6 md:px-14 w-max will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {MEDIA.map((m) => (
            <div
              key={m.id}
              className="gallery-item relative will-change-transform flex-shrink-0"
              style={{
                width: m.w,
                transform: `translateZ(${m.z}px) rotateY(${m.r}deg)`,
              }}
            >
              <img
                src={m.src}
                alt=""
                className="w-full h-auto object-cover rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>
          ))}

          {/* Closing collage */}
          <div className="gallery-item flex-shrink-0 w-[60vw] max-w-[700px] aspect-square grid grid-cols-3 gap-3 p-4 bg-background-surface/50 rounded-3xl border border-white/10">
            {MEDIA.slice(0, 3).map((m) => (
              <img
                key={m.id}
                src={m.src}
                alt=""
                className="w-full h-full object-cover rounded-xl opacity-80"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-14 flex justify-end items-end font-mono-tag text-foreground-muted text-[10px] z-20">
        <span>{t('title')}</span>
      </div>
    </section>
  );
}
