'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { mediaSlots } from '@/lib/media';
import { cn } from '@/lib/utils';

const SpatialExperience = dynamic(
  () => import('@/components/three/SpatialExperience').then((m) => m.SpatialExperience),
  { ssr: false, loading: () => null },
);

export function Act04WebGLPortal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const domMediaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [showWebGL, setShowWebGL] = useState(false);
  const showWebGLRef = useRef(false);
  const [skipWebGL, setSkipWebGL] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setSkipWebGL(isTouch || reduced);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * -2,
      };
    };

    if (skipWebGL) return;

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [skipWebGL]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=220%',
            pin: wrapperRef.current,
            scrub: 0.7,
            pinSpacing: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (p > 0.05 && p < 0.95 && !skipWebGL) {
                progressRef.current = (p - 0.05) / 0.9;
                if (!showWebGLRef.current) {
                  showWebGLRef.current = true;
                  setShowWebGL(true);
                }
              } else {
                if (showWebGLRef.current) {
                  showWebGLRef.current = false;
                  setShowWebGL(false);
                }
              }
            },
          },
        });

        tl.fromTo(domMediaRef.current, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.1, ease: 'none' }, 0)
          .fromTo(canvasRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.05)
          .to(canvasRef.current, { opacity: 0, ease: 'none' }, 0.9)
          .fromTo(handoffRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.9);
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [skipWebGL] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div
          ref={domMediaRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <MediaSlot slot={mediaSlots.phoneStory} className="h-full w-full" />
        </div>

        <div
          ref={canvasRef}
          className="absolute inset-0 z-20 opacity-0"
          style={{ willChange: 'opacity' }}
        >
          {showWebGL && !skipWebGL ? (
            <SpatialExperience progressRef={progressRef} mouseRef={mouseRef} />
          ) : null}
        </div>

        <div
          ref={handoffRef}
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center bg-obsidian',
            skipWebGL ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="w-[60vw] max-w-[900px]">
            <MediaSlot slot={mediaSlots.webglForeground} />
          </div>
        </div>
      </div>
    </section>
  );
}
