/**
 * Authored layout for the immersive gallery and its DOM handoff.
 *
 * The corridor deliberately reuses six decoded images. Several planes can use
 * the same texture, which gives us close passes without multiplying GPU memory.
 * The four planes carrying a `flatSlot` resolve into the exact positions used by
 * `ArchivePlate` at the beginning of the next chapter.
 */

export interface FlatSlotLayout {
  left: number;
  top: number;
  width: number;
  aspect: number;
}

export interface GalleryFlatSlot {
  desktop: FlatSlotLayout;
  mobile: FlatSlotLayout;
}

export interface GalleryPlane {
  id: string;
  src: string;
  /** Width / height in world units before the editorial resolution. */
  w: number;
  h: number;
  x: number;
  y: number;
  /** Optional tighter staging so portrait viewports never lose every plane. */
  mobileX?: number;
  mobileY?: number;
  z: number;
  /** Restrained rotations in degrees. */
  rx: number;
  ry: number;
  /** Slot in the final editorial layout, or -1 when the plane exits. */
  flatSlot: number;
  /** Kept in the lower-cost mobile composition. */
  mobile: boolean;
  /** The first WebGL frame matches the full-viewport DOM portal. */
  portal?: boolean;
  /** Fast-reveal planes cut from the campaign image to establish depth immediately. */
  depthLayer?: boolean;
  /** Focal point used when a plane is a crop of a wider campaign image. */
  focus?: readonly [number, number];
}

/**
 * Desktop values mirror the opening positions of ActProcess' horizontal rail:
 * 42vw lead-in, 5.5vw gaps and the same alternating vertical offsets.
 * Values are viewport fractions, not world units.
 */
export const galleryFlatSlots: GalleryFlatSlot[] = [
  {
    desktop: { left: 0.42, top: 0.37, width: 0.21, aspect: 4 / 5 },
    mobile: { left: 0.08, top: 0.3, width: 0.46, aspect: 4 / 5 },
  },
  {
    desktop: { left: 0.685, top: 0.248, width: 0.14, aspect: 1 },
    mobile: { left: 0.62, top: 0.18, width: 0.28, aspect: 1 },
  },
  {
    desktop: { left: 0.88, top: 0.387, width: 0.25, aspect: 3 / 2 },
    mobile: { left: 0.5, top: 0.62, width: 0.42, aspect: 3 / 2 },
  },
  {
    desktop: { left: 1.185, top: 0.408, width: 0.17, aspect: 9 / 16 },
    mobile: { left: 0.09, top: 0.7, width: 0.25, aspect: 9 / 16 },
  },
];

const M = '/media/generated';

export const galleryPlanes: GalleryPlane[] = [
  {
    id: 'portal',
    src: `${M}/social/social-portal-v2.jpg`,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    flatSlot: -1,
    mobile: true,
    portal: true,
  },

  // The campaign does not simply enlarge: three readings of the same frame
  // separate into silhouette, street and Marseille light before the corridor.
  {
    id: 'campaign-foreground',
    src: `${M}/social/social-portal-v2.jpg`,
    w: 4.7,
    h: 7.4,
    x: -2.75,
    y: -0.45,
    mobileX: -1.45,
    mobileY: -0.55,
    z: -8,
    rx: 0.7,
    ry: 4.8,
    flatSlot: -1,
    mobile: true,
    depthLayer: true,
    focus: [0.32, 0.47],
  },
  {
    id: 'campaign-midground',
    src: `${M}/social/social-portal-v2.jpg`,
    w: 8.8,
    h: 4.9,
    x: 2.45,
    y: -0.7,
    mobileX: 1.3,
    mobileY: -0.72,
    z: -14,
    rx: -0.8,
    ry: -4.2,
    flatSlot: -1,
    mobile: true,
    depthLayer: true,
    focus: [0.58, 0.37],
  },
  {
    id: 'campaign-background',
    src: `${M}/social/social-portal-v2.jpg`,
    w: 10.8,
    h: 5.4,
    x: -0.25,
    y: 1.35,
    z: -19,
    rx: 0.35,
    ry: 1.6,
    flatSlot: -1,
    mobile: false,
    depthLayer: true,
    focus: [0.63, 0.67],
  },

  // Discovery: one large pass and one offset counter-plane.
  {
    id: 'near-community',
    src: `${M}/social/social-community.jpg`,
    w: 6.2,
    h: 7.75,
    x: 3.05,
    y: 0.35,
    z: -21,
    rx: -1.2,
    ry: -5.2,
    flatSlot: -1,
    mobile: true,
  },
  {
    id: 'mid-frame',
    src: `${M}/editorial/hero-frame.jpg`,
    w: 4.8,
    h: 6,
    x: -6.9,
    y: -1.75,
    z: -34,
    rx: 1.5,
    ry: 6.5,
    flatSlot: -1,
    mobile: false,
  },

  // Close passes: their inside edges cross the camera axis as we overtake them.
  {
    id: 'near-moodboard',
    src: `${M}/process/moodboard.jpg`,
    w: 9,
    h: 6,
    x: -3.55,
    y: -0.4,
    z: -47,
    rx: 1.1,
    ry: 4.4,
    flatSlot: -1,
    mobile: true,
  },
  {
    id: 'near-planning',
    src: `${M}/process/planning.jpg`,
    w: 5.4,
    h: 6.75,
    x: 3.15,
    y: 0.55,
    z: -69,
    rx: -1.4,
    ry: -5.4,
    flatSlot: -1,
    mobile: true,
  },
  {
    id: 'echo-portal',
    src: `${M}/social/social-portal-v2.jpg`,
    w: 8.4,
    h: 4.72,
    x: -3.1,
    y: 0.2,
    z: -78,
    rx: 1,
    ry: 3.8,
    flatSlot: -1,
    mobile: false,
  },

  // Resolution: these four planes become the first four contact-sheet cards.
  {
    id: 'resolve-moodboard',
    src: `${M}/process/contact-sheet-editorial-v2.jpg`,
    w: 3.7,
    h: 4.62,
    x: -8.8,
    y: 2.6,
    mobileX: -2.4,
    mobileY: 1.2,
    z: -88,
    rx: 0.8,
    ry: 7.5,
    flatSlot: 0,
    mobile: true,
  },
  {
    id: 'resolve-frame',
    src: `${M}/social/editorial-tools-detail-v2.jpg`,
    w: 3.2,
    h: 3.2,
    x: 7.9,
    y: -2.7,
    mobileX: 2.2,
    mobileY: -1.1,
    z: -94,
    rx: -1,
    ry: -7,
    flatSlot: 1,
    mobile: true,
  },
  {
    id: 'resolve-planning',
    src: `${M}/process/planning.jpg`,
    w: 5.7,
    h: 3.8,
    x: -7.1,
    y: -2.4,
    mobileX: -2,
    mobileY: -1,
    z: -100,
    rx: 1.2,
    ry: 6,
    flatSlot: 2,
    mobile: true,
  },
  {
    id: 'resolve-reel',
    src: `${M}/social/creative-director-studio-v2.jpg`,
    w: 1.75,
    h: 3.12,
    x: 9.8,
    y: 3.1,
    mobileX: 2.35,
    mobileY: 1.25,
    z: -106,
    rx: -0.7,
    ry: -7.5,
    flatSlot: 3,
    mobile: true,
  },
];
