import { depthMedia } from '@/content/media';
import { galleryFlatSlots } from '@/acts/ActScrollStory/galleryLayout';

/**
 * LA PARTITION DU CANVAS PERSISTANT.
 *
 * ─── ESPACE D'ÉCRITURE ────────────────────────────────────────────────────
 * Chaque keyframe décrit un **rectangle à l'écran** :
 *   u, v : centre, en fractions du viewport (0,0 = coin haut gauche)
 *   w, h : largeur et hauteur, en fractions du viewport
 *   d    : distance à la caméra, en unités monde
 *
 * Écrire en fractions d'écran et non en unités monde a une raison précise :
 * un plan peut alors être posé *exactement* sur un rectangle DOM (`anchor`),
 * quelle que soit sa profondeur. C'est ce qui supprime les fondus de raccord.
 * La profondeur reste réelle : `d` pilote la perspective (rx/ry), la
 * désaturation atmosphérique, et le passage de la caméra à travers un plan
 * (quand `d` tend vers 0, le plan sort du champ en balayant l'écran).
 *
 * ─── RÈGLE DE LECTURE ─────────────────────────────────────────────────────
 * `t` est en numéros de chapitre (voir src/lib/stage.ts). `t = 3.5` = milieu
 * du chapitre 03 « Matière brute ». Les keyframes sont triées par `t` ; la
 * lecture est une interpolation, donc réversible par construction.
 *
 * ─── ÉCONOMIE ─────────────────────────────────────────────────────────────
 * Dix textures pour seize plans : les mêmes photographies reviennent, ce qui
 * est le propos (« on retraverse ce que l'on vient de voir ») et divise par
 * deux la mémoire GPU.
 */

const M = '/media/generated';

export const SRC = {
  campaign: `${M}/social/social-portal-v2.jpg`,
  sheet: `${M}/process/contact-sheet-editorial-v2.jpg`,
  tools: `${M}/social/editorial-tools-detail-v2.jpg`,
  planning: `${M}/process/planning.jpg`,
  director: `${M}/social/creative-director-studio-v2.jpg`,
  moodboard: `${M}/process/moodboard.jpg`,
  macro: `${M}/yuna/yuna-macro.jpg`,
  yuna: `${M}/yuna/yuna-campaign-v2.jpg`,
  mgc: `${M}/mgc/mgc-editorial-wall-v2.jpg`,
  comptoir: `${M}/comptoir/comptoir-craft-v2.jpg`,
} as const;

const GALLERY_IMAGES = depthMedia.slice(1);

function aspectOf(ratio: string) {
  const [w, h] = ratio.split(':').map(Number);
  return w! / h!;
}

const galleryFrame = (index: number): Plane => {
  const media = GALLERY_IMAGES[index]!;
  const side = index % 2 === 0 ? 'left' : 'right';
  const baseU = side === 'left' ? 0.11 : 0.89;
  const endU = side === 'left' ? -0.46 : 1.46;
  const baseR = side === 'left' ? -22 : 22;
  const endR = side === 'left' ? -70 : 70;
  const tStart = 1.05 + index * 0.13;
  const tEnd = tStart + 0.78;
  const v = 0.36 + (index % 3) * 0.16;
  const frameW = 0.3;
  const h = Math.min(0.46, Math.max(0.14, frameW / aspectOf(media.ratio)));

  return {
    id: `gallery-${index}`,
    src: media.src!,
    tier: 0,
    keys: [
      { t: tStart, u: baseU, v, w: frameW * 0.5, h: h * 0.5, d: 26, a: 0, ry: baseR },
      { t: tStart + 0.14, u: baseU, v: v + 0.03, w: frameW * 0.9, h: h * 0.9, d: 18, a: 1, ry: baseR * 1.15 },
      { t: (tStart + tEnd) / 2, u: baseU + (side === 'left' ? -0.09 : 0.09), v: v + 0.07, w: frameW * 1.35, h: h * 1.35, d: 8, a: 1, ry: baseR * 1.7 },
      { t: tEnd - 0.15, u: endU * 0.55, v: v + 0.11, w: frameW * 3, h: h * 3, d: 1.8, a: 0.75, ry: endR * 0.75 },
      { t: tEnd, u: endU, v: v + 0.16, w: frameW * 5.2, h: h * 5.2, d: 0.65, a: 0, ry: endR },
    ],
  };
};

const GALLERY: Plane[] = GALLERY_IMAGES.map((_, i) => galleryFrame(i));

export interface Key {
  t: number;
  u: number;
  v: number;
  w: number;
  h: number;
  d: number;
  /** Degrés. Volontairement faibles : une planche contact n'est pas un chaos. */
  rx?: number;
  ry?: number;
  rz?: number;
  a?: number;
  /** Point de recadrage `cover` de la texture, en UV. */
  fx?: number;
  fy?: number;
  /** Nom d'ancre DOM. S'il est publié, il remplace u/v/w/h. */
  anchor?: string;
  /** Interpolation linéaire au lieu de l'adoucissement par défaut. */
  linear?: boolean;
}

export interface Plane {
  id: string;
  src: string;
  /** Palier de chargement : 0 = immédiat, 1 = processus, 2 = projets. */
  tier: 0 | 1 | 2;
  /** Retiré des compositions mobiles pour tenir le budget de frames. */
  desktopOnly?: boolean;
  keys: Key[];
}

/* ── Fabriques ────────────────────────────────────────────────────────────
   Les positions de la planche contact sont écrites une seule fois et
   réutilisées par les chapitres 03 → 05 : c'est ce qui fait qu'une étape
   *remplace* la précédente dans la même composition au lieu d'ouvrir une
   nouvelle scène.                                                          */

/** Planche contact « Matière brute » — asymétrique, respirante. */
const SHEET_SLOTS = [
  { u: 0.566, v: 0.4, w: 0.2, h: 0.3, rz: -1.4 },
  { u: 0.735, v: 0.276, w: 0.088, h: 0.132, rz: 1.1 },
  { u: 0.762, v: 0.556, w: 0.176, h: 0.147, rz: -0.7 },
  { u: 0.896, v: 0.352, w: 0.086, h: 0.212, rz: 1.6 },
  { u: 0.9, v: 0.63, w: 0.1, h: 0.15, rz: -1.2 },
  { u: 0.626, v: 0.68, w: 0.076, h: 0.095, rz: 2.1 },
] as const;

/** Grille stricte du chapitre « Système » : la preuve visuelle d'un ordre. */
const SYSTEM_SLOTS = [
  { u: 0.6, v: 0.4, w: 0.108, h: 0.148 },
  { u: 0.735, v: 0.4, w: 0.108, h: 0.148 },
  { u: 0.87, v: 0.4, w: 0.108, h: 0.148 },
  { u: 0.6, v: 0.61, w: 0.108, h: 0.148 },
  { u: 0.735, v: 0.61, w: 0.108, h: 0.148 },
  { u: 0.87, v: 0.61, w: 0.108, h: 0.148 },
] as const;

const RAW_SRC = [
  SRC.sheet,
  SRC.tools,
  SRC.planning,
  SRC.director,
  SRC.moodboard,
  SRC.macro,
] as const;

/** L'image retenue par la « Sélection » : celle qui deviendra Yuna. */
const CHOSEN = 0;

function rawPlane(index: number): Plane {
  const slot = SHEET_SLOTS[index]!;
  const grid = SYSTEM_SLOTS[index]!;
  const chosen = index === CHOSEN;

  /* Arrivée depuis le fond pendant la traversée : chaque tirage entre déjà
     à sa place, seulement plus loin et plus petit. Aucun réarrangement
     visible ne vient donc parasiter la résolution de la planche. */
  const approach: Key[] = [
    { t: 2.1, u: slot.u, v: slot.v, w: slot.w * 0.42, h: slot.h * 0.42, d: 74 + index * 5, a: 0 },
    { t: 2.42, u: slot.u, v: slot.v, w: slot.w * 0.6, h: slot.h * 0.6, d: 46 + index * 4, a: 1 },
  ];

  const flat = galleryFlatSlots[index]?.desktop;
  const sheet: Key = flat
    ? { t: 3, u: flat.left + flat.width / 2, v: flat.top + (flat.width * 1.6 / flat.aspect) / 2, w: flat.width, h: flat.width * 1.6 / flat.aspect, d: 17, a: 1, rz: 0, anchor: `flat-${index}` }
    : { t: 3, ...slot, d: 17 + index * 0.7, a: 1 };

  /* 02 — Sélection : le tirage retenu avance et grandit, les autres reculent
     sans disparaître. Ils restent lisibles, mais secondaires. */
  const select: Key = chosen
    ? { t: 4, u: 0.6, v: 0.468, w: 0.268, h: 0.362, d: 13, rz: 0, a: 1 }
    : { t: 4, ...slot, w: slot.w * 0.84, h: slot.h * 0.84, d: 23 + index * 0.9, a: 0.42 };

  /* 03 — Intention : un recadrage. Le tirage retenu se resserre, un seul
     contrepoint reste allumé (le planning, index 2). */
  const counterpoint = index === 2;
  const intent: Key = chosen
    ? { t: 5, u: 0.575, v: 0.462, w: 0.216, h: 0.33, d: 12, fx: 0.44, fy: 0.42, a: 1 }
    : counterpoint
      ? { t: 5, u: 0.855, v: 0.6, w: 0.178, h: 0.148, d: 16, a: 0.94 }
      : { t: 5, ...slot, w: slot.w * 0.7, h: slot.h * 0.7, d: 27 + index, a: 0.16 };

  /* 04 — Système : tout s'aligne. Les rotations tombent à zéro : c'est le
     geste qui dit « un système », sans aucun texte pour l'expliquer. */
  const system: Key = { t: 6, ...grid, d: 15, rz: 0, a: chosen ? 1 : 0.82 };

  /* 05 — Résultat : la grille s'efface au profit d'un seul tirage. */
  const result: Key = chosen
    ? { t: 7, u: 0.6, v: 0.478, w: 0.26, h: 0.34, d: 12, a: 1 }
    : { t: 7, ...grid, w: grid.w * 0.7, h: grid.h * 0.7, d: 21, a: 0 };

  const after: Key[] = chosen
    ? [{ t: 7.6, u: 0.6, v: 0.478, w: 0.26, h: 0.34, d: 12, a: 0 }]
    : [];

  return {
    id: `raw-${index}`,
    src: RAW_SRC[index]!,
    tier: 1,
    desktopOnly: index > 3,
    keys: [...approach, sheet, select, intent, system, result, ...after],
  };
}

/* ── Le film ──────────────────────────────────────────────────────────── */

export const PLANES: Plane[] = [
  /* L'ÉCRAN. Naît sur le rectangle exact de `[data-phone-screen]`, devient la
     surface plein cadre, puis recule et finit par être traversée. */
  {
    id: 'screen',
    src: SRC.campaign,
    tier: 0,
    keys: [
      { t: 0, u: 0.5, v: 0.5, w: 0.18, h: 0.62, d: 8, a: 1, fx: 0.32, anchor: 'screen', linear: true },
      { t: 0.22, u: 0.5, v: 0.5, w: 0.18, h: 0.62, d: 8, a: 1, fx: 0.32, anchor: 'screen', linear: true },
      { t: 0.44, u: 0.5, v: 0.5, w: 0.55, h: 0.78, d: 8, a: 1, fx: 0.32 },
      { t: 0.7, u: 0.5, v: 0.5, w: 1, h: 1, d: 8, a: 1, fx: 0.32 },
      { t: 0.9, u: 0.5, v: 0.5, w: 0.82, h: 0.82, d: 10, a: 0.8 },
      { t: 1.15, u: 0.5, v: 0.5, w: 0.2, h: 0.24, d: 18, a: 0 },
    ],
  },

  /* LA GALERIE 3D. Cadres disposés comme dans un corridor ; on avance entre
     les photographies d'environnement, de macro, de marque. */
  ...GALLERY,

  rawPlane(0),
  rawPlane(1),
  rawPlane(2),
  rawPlane(3),
  rawPlane(4),
  rawPlane(5),

  /* LA COUVERTURE. Naît exactement dans le cadre du tirage retenu, puis
     s'agrandit jusqu'à devenir la première page de Yuna. */
  {
    id: 'cover',
    src: SRC.yuna,
    tier: 2,
    keys: [
      { t: 6.7, u: 0.6, v: 0.478, w: 0.26, h: 0.34, d: 12, a: 0 },
      { t: 7, u: 0.6, v: 0.478, w: 0.26, h: 0.34, d: 12, a: 1 },
      { t: 8, u: 0.616, v: 0.5, w: 0.4, h: 0.62, d: 10, a: 1, anchor: 'cover' },
      { t: 8.5, u: 0.36, v: 0.46, w: 0.2, h: 0.28, d: 12, rz: -3.2, a: 1 },
      { t: 9, u: 0.28, v: 0.455, w: 0.163, h: 0.225, d: 12, rz: -3.2, a: 1 },
      { t: 9.6, u: 0.3, v: 0.71, w: 0.072, h: 0.1, d: 14, rz: 0, a: 0.6 },
      { t: 9.86, u: 0.3, v: 0.73, w: 0.06, h: 0.083, d: 15, a: 0 },
    ],
  },
  {
    id: 'folio-mgc',
    src: SRC.mgc,
    tier: 2,
    keys: [
      { t: 8.16, u: 0.5, v: 0.48, w: 0.14, h: 0.19, d: 12, rz: 1.6, a: 0 },
      { t: 8.5, u: 0.53, v: 0.47, w: 0.18, h: 0.245, d: 12, rz: 1.6, a: 1 },
      { t: 9, u: 0.5, v: 0.455, w: 0.163, h: 0.225, d: 12, rz: 1.6, a: 1 },
      { t: 9.6, u: 0.5, v: 0.71, w: 0.072, h: 0.1, d: 14, rz: 0, a: 0.6 },
      { t: 9.86, u: 0.5, v: 0.73, w: 0.06, h: 0.083, d: 15, a: 0 },
    ],
  },
  {
    id: 'folio-comptoir',
    src: SRC.comptoir,
    tier: 2,
    keys: [
      { t: 8.24, u: 0.66, v: 0.5, w: 0.14, h: 0.19, d: 12, rz: -2.4, a: 0 },
      { t: 8.5, u: 0.71, v: 0.49, w: 0.18, h: 0.245, d: 12, rz: -2.4, a: 1 },
      { t: 9, u: 0.72, v: 0.455, w: 0.163, h: 0.225, d: 12, rz: -2.4, a: 1 },
      { t: 9.6, u: 0.7, v: 0.71, w: 0.072, h: 0.1, d: 14, rz: 0, a: 0.6 },
      { t: 9.86, u: 0.7, v: 0.73, w: 0.06, h: 0.083, d: 15, a: 0 },
    ],
  },
];

/** Bornes utiles : un plan hors de sa fenêtre n'est jamais évalué. */
export const PLANE_RANGE = new Map(
  PLANES.map((plane) => [
    plane.id,
    { from: plane.keys[0]!.t, to: plane.keys[plane.keys.length - 1]!.t },
  ]),
);

/** Sources par palier, pour un chargement progressif. */
export function sourcesForTier(tier: 0 | 1 | 2, mobile: boolean): string[] {
  return Array.from(
    new Set(
      PLANES.filter((p) => p.tier === tier && !/^raw-[45]$/.test(p.id) && !(mobile && p.desktopOnly)).map((p) => p.src),
    ),
  );
}
