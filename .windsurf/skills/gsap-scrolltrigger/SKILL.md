# GSAP & ScrollTrigger Skill

## Overview
GSAP (GreenSock Animation Platform) and ScrollTrigger provide industrial-grade, frame-accurate animation orchestration. In creative portfolios, GSAP acts as the Director/Conductor: orchestrating scroll progress, timeline pinning, multi-axis spatial translations, scrubbed camera coordinates, text reveals, and cross-chapter transitions.

## Key Rules & Principles
1. **Single Source of Scroll Progression**: ScrollTrigger drives master timelines that mutate spatial coordinates and DOM classes. Avoid scattered separate ScrollTriggers with conflicting scrub values.
2. **Scrubbing & Smoothing**: Use quantified scrub values (`scrub: 1` or `scrub: 1.5` for cinematic inertia, `scrub: true` for direct 1:1 mapping when Lenis smooth-scroll is active).
3. **React Lifecycle & Cleanup**: Always wrap animations in `gsap.context()` or `useGSAP()` with proper container scopes. Never leave rogue RAF triggers or unkilled timelines across page switches or window resizes.
4. **Invalidate On Refresh**: Set `invalidateOnRefresh: true` on pinned dynamic timelines to recalculate responsive bounds during viewport height/width shifts.
5. **GPU Acceleration & Will-Change**: Promote transforming elements with `will-change: transform, opacity` while active, and clear `will-change` on complete to avoid memory bloat.
6. **No Elastic/Bounce Clichés**: Awwwards editorial work relies on `power2.out`, `power3.inOut`, `expo.out`, `quart.out`, and `sine.inOut` for natural, calm, luxury deceleration.

## Critical Patterns
### 1. Pinned Master Timeline
```typescript
const ctx = gsap.context(() => {
  const master = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top top',
      end: '+=400%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  master
    .to('.hero-headline', { yPercent: -40, opacity: 0, duration: 1 })
    .to(cameraRigState, { z: 4, y: 1.2, duration: 2 }, '<')
    .to('.portrait-media', { scale: 1.4, duration: 2 }, '<0.5');
}, containerRef);
```

### 2. Velocity-Aware Skew and Inertia
```typescript
ScrollTrigger.create({
  onUpdate: (self) => {
    const velocity = self.getVelocity();
    const clampedSkew = gsap.utils.clamp(-5, 5, velocity / 300);
    gsap.to('.skew-target', {
      skewY: clampedSkew,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }
});
```
