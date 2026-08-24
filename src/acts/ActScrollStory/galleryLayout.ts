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
    src: `${M}/process/moodboard.jpg`,
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
    src: `${M}/editorial/hero-frame.jpg`,
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
    src: `${M}/social/social-reel.jpg`,
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
