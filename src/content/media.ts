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

function generated(
  path: string,
  alt: Record<Locale, string>,
  focus = '50% 50%',
): Partial<MediaItem> {
  return {
    src: `/media/generated/${path}`,
    alt,
    focus,
  };
}

/**
 * Série photographique conceptuelle générée pour le portfolio.
 * Les mêmes prises de vue réapparaissent volontairement dans le téléphone,
 * l'immersion et le parcours pour assurer la continuité narrative.
 */
const PHOTO = {
  heroVertical: generated(
    'editorial/hero-vertical.jpg',
    {
      fr: 'Nature morte éditoriale avec bague argentée, papiers ivoire et ruban bordeaux.',
      en: 'Editorial still life with a silver ring, ivory papers and a burgundy ribbon.',
      ko: '은색 반지, 아이보리 종이, 버건디 리본으로 구성한 에디토리얼 정물.',
    },
    '50% 56%',
  ),
  heroFrame: generated('editorial/hero-frame.jpg', {
    fr: 'Table de direction créative avec tirage, pince métallique et papiers bordeaux.',
    en: 'Creative direction table with a print, metal clip and burgundy papers.',
    ko: '인화 사진, 금속 클립, 버건디 종이가 놓인 크리에이티브 디렉션 테이블.',
  }),
  socialCampaign: generated('social/social-campaign.jpg', {
    fr: 'Deux mains organisent des tirages pour une production de contenu.',
    en: 'Two hands arrange photographic prints for a content production.',
    ko: '콘텐츠 제작을 위해 두 손이 인화 사진을 정리하는 모습.',
  }),
  socialReel: generated(
    'social/social-reel.jpg',
    {
      fr: 'Femme de dos marchant vers la mer à Marseille, foulard bordeaux au vent.',
      en: 'Woman walking toward the sea in Marseille with a burgundy scarf in the wind.',
      ko: '버건디 스카프를 휘날리며 마르세유 바다를 향해 걷는 여성의 뒷모습.',
    },
    '50% 46%',
  ),
  socialPortal: generated(
    'social/social-portal-v2.jpg',
    {
      fr: 'Femme en manteau sombre et foulard bordeaux marchant vers la mer à Marseille.',
      en: 'Woman in a dark coat and burgundy scarf walking toward the sea in Marseille.',
      ko: '짙은 코트와 버건디 스카프를 두르고 마르세유의 바다를 향해 걷는 여성.',
    },
    '32% 50%',
  ),
  socialObject: generated('social/social-object.jpg', {
    fr: 'Appareil photo noir, planche contact et crayon bordeaux sur papier ivoire.',
    en: 'Black camera, contact sheet and burgundy pencil on ivory paper.',
    ko: '아이보리 종이 위의 검은 카메라, 콘택트 시트, 버건디 연필.',
  }),
  socialCommunity: generated(
    'social/social-community.jpg',
    {
      fr: 'Quatre femmes collaborent autour d’une table de création baignée de lumière.',
      en: 'Four women collaborate around a creative table filled with warm daylight.',
      ko: '따뜻한 햇빛이 드는 작업 테이블에서 협업하는 네 명의 여성.',
    },
    '50% 44%',
  ),
  moodboard: generated('process/moodboard.jpg', {
    fr: 'Moodboard tactile composé de tirages, papiers, nuances bordeaux et règle métallique.',
    en: 'Tactile moodboard of prints, papers, burgundy swatches and a metal ruler.',
    ko: '인화 사진, 종이, 버건디 색상표, 금속 자로 구성한 촉각적인 무드보드.',
  }),
  planning: generated(
    'process/planning.jpg',
    {
      fr: 'Main annotant au crayon une grille de planification éditoriale sur papier.',
      en: 'Hand marking an editorial planning grid in pencil on paper.',
      ko: '종이 편집 일정표를 연필로 표시하는 손.',
    },
    '50% 54%',
  ),
  yunaMacro: generated(
    'yuna/yuna-macro.jpg',
    {
      fr: 'Macro d’une boucle d’oreille argentée sculpturale posée sur du velours graphite.',
      en: 'Macro of a sculptural silver earring resting on graphite velvet.',
      ko: '그래파이트 벨벳 위에 놓인 조각적인 은색 귀걸이 매크로.',
    },
    '50% 53%',
  ),
  yunaProduct: generated('yuna/yuna-product.jpg', {
    fr: 'Pendentif argenté présenté sur un carré de papier ivoire texturé.',
    en: 'Silver pendant displayed on a square of textured ivory paper.',
    ko: '질감 있는 아이보리 종이 위에 놓인 은색 펜던트.',
  }),
  yunaSocial: generated(
    'yuna/yuna-social.jpg',
    {
      fr: 'Main portant une bague argentée sculpturale dans une lumière chaude et discrète.',
      en: 'Hand wearing a sculptural silver ring in warm, restrained light.',
      ko: '따뜻하고 절제된 빛 속에서 조각적인 은색 반지를 낀 손.',
    },
    '50% 57%',
  ),
  mgcCommunity: generated(
    'mgc/mgc-community.jpg',
    {
      fr: 'Cinq femmes échangent et rient autour d’une table dans une cour marseillaise.',
      en: 'Five women talk and laugh around a table in a Marseille courtyard.',
      ko: '마르세유 안뜰의 테이블에 둘러앉아 대화하고 웃는 다섯 명의 여성.',
    },
    '50% 42%',
  ),
  mgcEvent: generated('mgc/mgc-event.jpg', {
    fr: 'Préparation d’une rencontre créative autour d’une longue table à la tombée du jour.',
    en: 'A creative gathering being prepared around a long table at dusk.',
    ko: '해 질 무렵 긴 테이블에서 창작 모임을 준비하는 장면.',
  }),
  mgcUgc: generated(
    'mgc/mgc-ugc.jpg',
    {
      fr: 'Deux femmes assises sur des marches découvrent ensemble des tirages photographiques.',
      en: 'Two women seated on stone steps look through photographic prints together.',
      ko: '돌계단에 앉아 함께 인화 사진을 살펴보는 두 여성.',
    },
    '50% 43%',
  ),
  mgcShared: generated('mgc/mgc-shared.jpg', {
    fr: 'Papiers ivoire et ruban bordeaux traversés par des reflets d’eau.',
    en: 'Ivory papers and burgundy ribbon crossed by moving water reflections.',
    ko: '물결 빛이 스치는 아이보리 종이와 버건디 리본.',
  }),
  comptoirTexture: generated(
    'comptoir/comptoir-texture.jpg',
    {
      fr: 'Macro de chocolat noir, poudre de cacao, papier bordeaux et bois ancien.',
      en: 'Macro of dark chocolate, cocoa powder, burgundy paper and aged wood.',
      ko: '다크 초콜릿, 코코아 가루, 버건디 종이, 오래된 나무의 매크로.',
    },
    '64% 48%',
  ),
  comptoirProduct: generated(
    'comptoir/comptoir-product.jpg',
    {
      fr: 'Tablette de chocolat artisanale emballée de papier ivoire et d’une bande bordeaux.',
      en: 'Artisan chocolate bar wrapped in ivory paper with a burgundy band.',
      ko: '아이보리 종이와 버건디 띠로 포장한 수제 초콜릿 바.',
    },
    '50% 55%',
  ),
  comptoirShop: generated('comptoir/comptoir-shop.jpg', {
    fr: 'Table de merchandising avec chocolats, bocaux et papiers dans une épicerie chaleureuse.',
    en: 'Merchandising table with chocolate, jars and papers in a warm gourmet shop.',
    ko: '따뜻한 식료품점의 초콜릿, 유리병, 종이로 꾸민 상품 진열대.',
  }),
} as const;

/* ---------- ACT 00 — fragments d'ouverture (aucun visage) ----------
   Deux fragments transitoires seulement : ils entrent puis quittent le cadre
   pendant la morphose vers la Hero. Les deux autres fragments visibles à
   l'ouverture sont `heroFrame` et `heroVertical`, qui eux *restent* et
   deviennent la couverture. Desktop : 4 fragments. Mobile : les 2 persistants. */
export const openingMedia: MediaItem[] = [
  item('open-01', 'texture', '1:1', 'graphite', PHOTO.heroFrame),
  item('open-02', 'macro', '3:2', 'blush', PHOTO.mgcShared),
];

/* ---------- ACT 01 — couverture ----------
   `hero-vertical` est l'élément persistant central du site : il traverse
   la Hero, le monde social, et devient l'écran du téléphone. */
export const heroVertical: MediaItem = item('hero-vertical', 'story', '9:16', 'graphite', {
  ...PHOTO.heroVertical,
  priority: true,
});
export const heroFrame: MediaItem = item('hero-frame', 'campaign', '4:5', 'blush', {
  ...PHOTO.heroFrame,
});

/* ---------- ACT 02 — monde social ---------- */
export const socialSatellites: MediaItem[] = [
  item('social-01', 'social', '1:1', 'paper-deep', PHOTO.socialCommunity),
  item('social-02', 'campaign', '4:5', 'blush', PHOTO.socialCampaign),
  item('social-03', 'reel', '9:16', 'graphite', PHOTO.socialReel),
  item('social-04', 'social', '1:1', 'graphite', PHOTO.socialObject),
];

/** Les strates révélées par le Front → Behind. */
export const behindMedia: MediaItem[] = [
  item('behind-moodboard', 'moodboard', '3:2', 'paper-deep', PHOTO.moodboard),
  item('behind-planning', 'planning', '4:5', 'paper', PHOTO.planning),
];

/* ---------- ACT 03 — téléphone ---------- */
export const phoneFeed: MediaItem[] = [
  item('phone-feed-01', 'social', '1:1', 'graphite', PHOTO.socialObject),
  item('phone-feed-02', 'social', '1:1', 'blush', PHOTO.socialCommunity),
  item('phone-feed-03', 'social', '1:1', 'paper-deep', PHOTO.socialCampaign),
  item('phone-feed-04', 'social', '1:1', 'graphite', PHOTO.yunaProduct),
];
export const phoneStory: MediaItem = item('phone-story', 'story', '9:16', 'bordeaux', PHOTO.socialReel);

/** Master paysage haute définition du portail téléphone → immersion. */
export const socialPortal: MediaItem = item(
  'social-portal',
  'campaign',
  '16:9',
  'bordeaux',
  PHOTO.socialPortal,
);

/* ---------- ACT 04 — plans de la scène immersive ----------
   Réutilisent volontairement les médias déjà vus : on retraverse ce que
   l'on vient de voir. Contrainte technique : ≤ 2048 px. */
export const depthMedia: MediaItem[] = [
  socialPortal,
  item('depth-02', 'story', '9:16', 'graphite', PHOTO.heroVertical),
  item('depth-03', 'macro', '1:1', 'bordeaux', PHOTO.yunaProduct),
  item('depth-04', 'texture', '16:9', 'paper-deep', PHOTO.mgcShared),
  item('depth-05', 'social', '4:5', 'graphite', PHOTO.mgcUgc),
  item('depth-06', 'reel', '9:16', 'blush', PHOTO.yunaSocial),
];

/* ---------- ACT 05 — planche contact ---------- */
export const contactSheet: MediaItem[] = [
  item('sheet-01', 'moodboard', '4:5', 'paper-deep', PHOTO.moodboard),
  item('sheet-02', 'note', '1:1', 'paper', PHOTO.heroFrame),
  item('sheet-03', 'planning', '3:2', 'paper-deep', PHOTO.planning),
  item('sheet-04', 'social', '9:16', 'blush', PHOTO.socialReel),
  item('sheet-05', 'macro', '1:1', 'graphite', PHOTO.yunaMacro),
  item('sheet-06', 'note', '4:5', 'paper', PHOTO.planning),
  item('sheet-07', 'campaign', '3:2', 'blush', PHOTO.mgcEvent),
  item('sheet-08', 'texture', '1:1', 'paper-deep', PHOTO.mgcShared),
];

/* ---------- ACT 06 — projets ---------- */
export const yunaMedia: MediaItem[] = [
  item('yuna-macro', 'macro', '4:5', 'graphite', { ...PHOTO.yunaMacro, project: 'yuna' }),
  item('yuna-product', 'product', '1:1', 'blush', { ...PHOTO.yunaProduct, project: 'yuna' }),
  item('yuna-social', 'social', '9:16', 'graphite', { ...PHOTO.yunaSocial, project: 'yuna' }),
];
/** Média du handoff Yuna → MGC : change de ratio et de palette. */
export const yunaShared: MediaItem = item('yuna-shared', 'campaign', '4:5', 'blush', {
  ...PHOTO.yunaMacro,
  project: 'yuna',
});

export const mgcMedia: MediaItem[] = [
  item('mgc-community', 'social', '1:1', 'paper-deep', PHOTO.mgcCommunity),
  item('mgc-event', 'campaign', '3:2', 'blush', PHOTO.mgcEvent),
  item('mgc-ugc-01', 'social', '4:5', 'paper', PHOTO.mgcUgc),
  item('mgc-ugc-02', 'social', '4:5', 'paper-deep', PHOTO.socialCommunity),
].map((m) => ({ ...m, project: 'mgc' as const }));
/** Média du handoff MGC → Comptoir : plein cadre puis glissement vers bordeaux. */
export const mgcShared: MediaItem = item('mgc-shared', 'texture', '16:9', 'paper-deep', {
  ...PHOTO.mgcShared,
  project: 'mgc',
});

export const comptoirMedia: MediaItem[] = [
  item('comptoir-product', 'product', '4:5', 'bordeaux', PHOTO.comptoirProduct),
  item('comptoir-shop', 'campaign', '3:2', 'bordeaux', PHOTO.comptoirShop),
].map((m) => ({ ...m, project: 'comptoir' as const }));
/** Support du seul zoom macro lent de l'acte. */
export const comptoirTexture: MediaItem = item('comptoir-texture', 'texture', '16:9', 'bordeaux', {
  ...PHOTO.comptoirTexture,
  project: 'comptoir',
});

/* ---------- ACT 07 — parcours ---------- */
const journeyPhotos = [
  PHOTO.moodboard,
  PHOTO.yunaMacro,
  PHOTO.yunaSocial,
  PHOTO.comptoirShop,
  PHOTO.mgcCommunity,
  PHOTO.heroVertical,
];

export const journeyMedia: MediaItem[] = [
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026',
].map((year, i) => {
  return item(
    `journey-${year}`,
    'campaign',
    '4:5',
    i % 2 === 0 ? 'graphite' : 'blush',
    journeyPhotos[i] ?? PHOTO.heroVertical,
  );
});

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
