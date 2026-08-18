export type QualityTier = 'HIGH' | 'MEDIUM' | 'SAFE';

export interface QualityConfig {
  tier: QualityTier;
  dpr: number;
  enableWebGL: boolean;
  enableShaders: boolean;
  enablePostprocessing: boolean;
  enableCustomCursor: boolean;
  maxPlaneCount: number;
  textureQuality: 'high' | 'medium' | 'low';
}

export function detectQuality(): QualityConfig {
  if (typeof window === 'undefined') {
    return {
      tier: 'HIGH',
      dpr: 1,
      enableWebGL: true,
      enableShaders: true,
      enablePostprocessing: true,
      enableCustomCursor: true,
      maxPlaneCount: 40,
      textureQuality: 'high',
    };
  }

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return {
      tier: 'SAFE',
      dpr: 1,
      enableWebGL: false,
      enableShaders: false,
      enablePostprocessing: false,
      enableCustomCursor: false,
      maxPlaneCount: 0,
      textureQuality: 'low',
    };
  }

  // Check WebGL support
  let hasWebGL = false;
  let isLowEndGPU = false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (gl) {
      hasWebGL = true;
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        if (/swiftshader|llvmpipe|software|intel hd graphics 3000|mali-400/i.test(renderer)) {
          isLowEndGPU = true;
        }
      }
    }
  } catch {
    hasWebGL = false;
  }

  if (!hasWebGL) {
    return {
      tier: 'SAFE',
      dpr: 1,
      enableWebGL: false,
      enableShaders: false,
      enablePostprocessing: false,
      enableCustomCursor: false,
      maxPlaneCount: 0,
      textureQuality: 'low',
    };
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isConstrainedDevice = isMobile || isLowEndGPU || hardwareConcurrency < 4;

  if (isConstrainedDevice) {
    return {
      tier: 'MEDIUM',
      dpr: Math.min(window.devicePixelRatio || 1, 1.25),
      enableWebGL: true,
      enableShaders: false,
      enablePostprocessing: false,
      enableCustomCursor: false,
      maxPlaneCount: 16,
      textureQuality: 'medium',
    };
  }

  return {
    tier: 'HIGH',
    dpr: Math.min(window.devicePixelRatio || 1, 1.75),
    enableWebGL: true,
    enableShaders: true,
    enablePostprocessing: true,
    enableCustomCursor: true,
    maxPlaneCount: 40,
    textureQuality: 'high',
  };
}
