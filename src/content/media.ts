import type { Locale } from './locales';

/**
 * Catalogue média.
 *
 * Aucune image n'est codée en dur dans un composant. Tant qu'un `src` est
 * absent, l'emplacement est rendu comme une **réservation éditoriale cotée**
 * (voir docs/creative-notebook-direction.md). Renseigner `src` suffit à basculer sur
 * l'image réelle : même ratio, même place, aucun recalage d'animation.
 *
 * Procédure de livraison : docs/asset-manifest.md
 */

export type MediaRatio = '4:5' | '9:16' | '1:1' | '16:9' | '3:2';

export type MediaRole =
  | 'campaign'
  | 'social'
  | 'story'
  | 'reel'
  | 'product'
  | 'macro'
  | 'texture'
  | 'moodboard'
  | 'planning'
  | 'note'
  | 'portrait';

export type MediaTone = 'paper' | 'paper-deep' | 'graphite' | 'blush' | 'bordeaux';

export interface MediaItem {
  id: string;
  role: MediaRole;
  ratio: MediaRatio;
  /** Absent = réservation cotée. Présent = image réelle. */
  src?: string;
  mobileSrc?: string;
  poster?: string;
  /** Requis dès qu'un `src` existe : une image réelle n'est jamais décorative. */
  alt?: Record<Locale, string>;
  project?: 'yuna' | 'mgc' | 'comptoir';
  priority?: boolean;
  tone?: MediaTone;
  /** Recadrage de l'image réelle, ex. '50% 30%'. */
  focus?: string;
}

/** Valeur CSS `aspect-ratio` correspondante. */
export const ratioValue: Record<MediaRatio, string> = {
  '4:5': '4 / 5',
  '9:16': '9 / 16',
  '1:1': '1 / 1',
  '16:9': '16 / 9',
  '3:2': '3 / 2',
};

function item(
  id: string,
  role: MediaRole,
  ratio: MediaRatio,
  tone: MediaTone,
  extra: Partial<MediaItem> = {},
): MediaItem {
  return { id, role, ratio, tone, ...extra };
}

/* ---------- ACT 00 — fragments d'ouverture (aucun visage) ----------
   Deux fragments transitoires seulement : ils entrent puis quittent le cadre
   pendant la morphose vers la Hero. Les deux autres fragments visibles à
   l'ouverture sont `heroFrame` et `heroVertical`, qui eux *restent* et
   deviennent la couverture. Desktop : 4 fragments. Mobile : les 2 persistants. */
export const openingMedia: MediaItem[] = [
  item('open-01', 'texture', '1:1', 'graphite'),
  item('open-02', 'macro', '3:2', 'blush'),
];

/* ---------- ACT 01 — couverture ----------
   `hero-vertical` est l'élément persistant central du site : il traverse
   la Hero, le monde social, et devient l'écran du téléphone. */
export const heroVertical: MediaItem = item('hero-vertical', 'story', '9:16', 'graphite', {
  priority: true,
});
export const heroFrame: MediaItem = item('hero-frame', 'campaign', '4:5', 'blush', {
  priority: true,
});

/* ---------- ACT 02 — monde social ---------- */
export const socialSatellites: MediaItem[] = [
  item('social-01', 'social', '1:1', 'paper-deep'),
  item('social-02', 'campaign', '4:5', 'blush'),
  item('social-03', 'reel', '9:16', 'graphite'),
  item('social-04', 'social', '1:1', 'graphite'),
];

/** Les strates révélées par le Front → Behind. */
export const behindMedia: MediaItem[] = [
  item('behind-moodboard', 'moodboard', '3:2', 'paper-deep'),
  item('behind-planning', 'planning', '4:5', 'paper'),
];

/* ---------- ACT 03 — téléphone ---------- */
export const phoneFeed: MediaItem[] = [
  item('phone-feed-01', 'social', '1:1', 'graphite'),
  item('phone-feed-02', 'social', '1:1', 'blush'),
  item('phone-feed-03', 'social', '1:1', 'paper-deep'),
  item('phone-feed-04', 'social', '1:1', 'graphite'),
];
export const phoneStory: MediaItem = item('phone-story', 'story', '9:16', 'bordeaux');

/* ---------- ACT 04 — plans de la scène immersive ----------
   Réutilisent volontairement les médias déjà vus : on retraverse ce que
   l'on vient de voir. Contrainte technique : ≤ 2048 px. */
export const depthMedia: MediaItem[] = [
  item('depth-01', 'campaign', '4:5', 'blush'),
  item('depth-02', 'story', '9:16', 'graphite'),
  item('depth-03', 'macro', '1:1', 'bordeaux'),
  item('depth-04', 'texture', '16:9', 'paper-deep'),
  item('depth-05', 'social', '4:5', 'graphite'),
  item('depth-06', 'reel', '9:16', 'blush'),
];

/* ---------- ACT 05 — planche contact ---------- */
export const contactSheet: MediaItem[] = [
  item('sheet-01', 'moodboard', '4:5', 'paper-deep'),
  item('sheet-02', 'note', '1:1', 'paper'),
  item('sheet-03', 'planning', '3:2', 'paper-deep'),
  item('sheet-04', 'social', '9:16', 'blush'),
  item('sheet-05', 'macro', '1:1', 'graphite'),
  item('sheet-06', 'note', '4:5', 'paper'),
  item('sheet-07', 'campaign', '3:2', 'blush'),
  item('sheet-08', 'texture', '1:1', 'paper-deep'),
];

/* ---------- ACT 06 — projets ---------- */
export const yunaMedia: MediaItem[] = [
  item('yuna-macro', 'macro', '4:5', 'graphite', { project: 'yuna' }),
  item('yuna-product', 'product', '1:1', 'blush', { project: 'yuna' }),
  item('yuna-social', 'social', '9:16', 'graphite', { project: 'yuna' }),
];
/** Média du handoff Yuna → MGC : change de ratio et de palette. */
export const yunaShared: MediaItem = item('yuna-shared', 'campaign', '4:5', 'blush', {
  project: 'yuna',
});

export const mgcMedia: MediaItem[] = [
  item('mgc-community', 'social', '1:1', 'paper-deep'),
  item('mgc-event', 'campaign', '3:2', 'blush'),
  item('mgc-ugc-01', 'social', '4:5', 'paper'),
  item('mgc-ugc-02', 'social', '4:5', 'paper-deep'),
].map((m) => ({ ...m, project: 'mgc' as const }));
/** Média du handoff MGC → Comptoir : plein cadre puis glissement vers bordeaux. */
export const mgcShared: MediaItem = item('mgc-shared', 'texture', '16:9', 'paper-deep', {
  project: 'mgc',
});

export const comptoirMedia: MediaItem[] = [
  item('comptoir-product', 'product', '4:5', 'bordeaux'),
  item('comptoir-shop', 'campaign', '3:2', 'bordeaux'),
].map((m) => ({ ...m, project: 'comptoir' as const }));
/** Support du seul zoom macro lent de l'acte. */
export const comptoirTexture: MediaItem = item('comptoir-texture', 'texture', '16:9', 'bordeaux', {
  project: 'comptoir',
});

/* ---------- ACT 07 — parcours ---------- */
export const journeyMedia: MediaItem[] = [
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
].map((year, i) =>
  item(`journey-${year}`, 'campaign', '4:5', i % 2 === 0 ? 'graphite' : 'blush'),
);

/** Index de tous les emplacements, pour l'état d'avancement des assets. */
export const allMedia: MediaItem[] = [
  ...openingMedia,
  heroVertical,
  heroFrame,
  ...socialSatellites,
  ...behindMedia,
  ...phoneFeed,
  phoneStory,
  ...depthMedia,
  ...contactSheet,
  ...yunaMedia,
  yunaShared,
  ...mgcMedia,
  mgcShared,
  ...comptoirMedia,
  comptoirTexture,
  ...journeyMedia,
];

export function mediaProgress() {
  const provided = allMedia.filter((m) => Boolean(m.src)).length;
  return { provided, total: allMedia.length };
}
