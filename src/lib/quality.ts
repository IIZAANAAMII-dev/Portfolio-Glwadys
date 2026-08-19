export type MotionTier = 'FULL' | 'REDUCED';

export interface QualityConfig {
  tier: MotionTier;
  enableCustomCursor: boolean;
}

export function detectQuality(): QualityConfig {
  if (typeof window === 'undefined') {
    return { tier: 'FULL', enableCustomCursor: true };
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return { tier: 'REDUCED', enableCustomCursor: false };
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  return {
    tier: 'FULL',
    enableCustomCursor: !isMobile,
  };
}
