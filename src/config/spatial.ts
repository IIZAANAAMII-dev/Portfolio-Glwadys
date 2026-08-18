/**
 * Spatial Design System
 * Defines strict coordinate layers, camera trajectories, and depth hierarchies (X, Y, Z).
 */

export const DEPTH = {
  // Shared depth lanes: every plane must declare one of these roles.
  foreground: 2.0,
  primary: 0.0,
  midground: -3.0,
  background: -6.0,
  far: -10.0,
  // Z-Axis layers
  heroGlwadysText: 1.5,
  heroDalleauText: -0.5,
  heroPortrait: 0.0,
  heroForegroundCard: 2.2,
  heroFarBackground: -6.0,

  // Identity & Grid deconstruction
  identityPortrait: 0.0,
  identityGridCellFar: -2.5,
  identityGridCellNear: 1.8,

  // Social World
  socialFront: 1.0,
  socialBehind: -2.5,
  socialStoryFocus: 2.0,
  phoneZ: 0.5,
  phoneDiveTargetZ: 5.5,

  // Content Gallery
  galleryNear: 1.5,
  galleryMiddle: 0.0,
  galleryFar: -3.5,
  galleryDeepVoid: -10.0,

  // Selected Work Constellation
  workCenter: 0.0,
  workActiveFocus: 2.4,
  workBackgroundBlur: -4.0,

  // Stacking Experience
  stackOffsetZ: -0.4,
  stackOffsetY: -0.3,

  // Camera parameters
  cameraDefaultZ: 8.0,
  cameraDiveZ: -2.0,
  cameraDefaultFov: 45,
} as const;

export const SPATIAL_LANES = {
  foreground: { z: DEPTH.foreground, contrast: 1, scale: 1 },
  primary: { z: DEPTH.primary, contrast: 0.92, scale: 0.92 },
  midground: { z: DEPTH.midground, contrast: 0.78, scale: 0.78 },
  background: { z: DEPTH.background, contrast: 0.58, scale: 0.64 },
  far: { z: DEPTH.far, contrast: 0.4, scale: 0.5 },
} as const;

export const CAMERA_PRESETS = {
  intro: {
    position: [0, 0, 14] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 48,
  },
  hero: {
    position: [0, 0, 8.5] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 45,
  },
  identity: {
    position: [0, 0, 7.0] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 42,
  },
  social: {
    position: [0, 0, 7.5] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 45,
  },
  phoneDive: {
    position: [0, 0, 1.2] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 55,
  },
  gallery: {
    position: [0, 0, 8.0] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 45,
  },
  brand: {
    position: [0, 0, 7.0] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 40,
  },
  strategy: {
    position: [0, 0, 7.5] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 42,
  },
  constellation: {
    position: [0, 0, 9.0] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 45,
  },
  finalCallback: {
    position: [0, 0, 12.0] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: 50,
  },
} as const;

export const MOTION_TIMINGS = {
  slowScrub: 0.75,
  standardScrub: 0.55,
  fastScrub: 0.4,
  lerpFactorDesktop: 0.16,
  lerpFactorMobile: 0.2,
} as const;
