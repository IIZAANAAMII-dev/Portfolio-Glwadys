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
  creativeDirector: generated(
    'social/creative-director-studio-v2.jpg',
    {
      fr: 'Directrice créative composant un mur d’images dans un atelier marseillais.',
      en: 'Creative director composing an image wall in a Marseille studio.',
      ko: '마르세유 스튜디오에서 이미지 월을 구성하는 크리에이티브 디렉터.',
    },
    '52% 50%',
  ),
  editorialTools: generated(
    'social/editorial-tools-detail-v2.jpg',
    {
      fr: 'Crayon bordeaux, règle de cadrage, fil et papiers ivoire sur une table sombre.',
      en: 'Oxblood pencil, crop ruler, thread and ivory papers on a dark table.',
      ko: '어두운 테이블 위의 버건디 연필, 크롭 자, 실과 아이보리 종이.',
    },
    '50% 52%',
  ),
  contactEditorial: generated(
    'process/contact-sheet-editorial-v2.jpg',
    {
      fr: 'Deux mains sélectionnent une planche-contact et des épreuves translucides.',
      en: 'Two hands select a contact sheet and translucent layout proofs.',
      ko: '두 손이 콘택트 시트와 반투명 레이아웃 교정본을 고르는 모습.',
    },
    '50% 50%',
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
  yunaCampaign: generated(
    'yuna/yuna-campaign-v2.jpg',
    {
      fr: 'Geste éditorial autour d’une bague et d’un pendentif argentés sculpturaux.',
      en: 'Editorial gesture featuring a sculptural silver ring and pendant.',
      ko: '조각적인 실버 반지와 펜던트를 담은 에디토리얼 제스처.',
    },
    '50% 46%',
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
  mgcEditorialWall: generated(
    'mgc/mgc-editorial-wall-v2.jpg',
    {
      fr: 'Cinq femmes composent ensemble un mur photographique dans une cour marseillaise.',
      en: 'Five women build a photographic wall together in a Marseille courtyard.',
      ko: '마르세유 안뜰에서 다섯 여성이 함께 포토 월을 만드는 모습.',
    },
    '58% 48%',
  ),
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
  comptoirCraft: generated(
    'comptoir/comptoir-craft-v2.jpg',
    {
      fr: 'Mains enveloppant une tablette de chocolat artisanal de papier ivoire et bordeaux.',
      en: 'Hands wrapping an artisan chocolate bar in ivory and oxblood paper.',
      ko: '수제 초콜릿 바를 아이보리와 버건디 종이로 포장하는 손.',
    },
    '61% 50%',
  ),
  portfolioThread: generated(
    'finale/portfolio-thread-v2.jpg',
    {
      fr: 'Folio d’archives reliant trois tirages photographiques par un fil bordeaux.',
      en: 'Archive folio connecting three photographic prints with an oxblood thread.',
      ko: '버건디 실로 세 장의 사진을 잇는 아카이브 폴리오.',
    },
    '50% 50%',
  ),
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
export const heroVertical: MediaItem = item('hero-vertical', 'story', '9:16', 'bordeaux', {
  ...PHOTO.heroVertical,
  priority: true,
});
export const heroFrame: MediaItem = item('hero-frame', 'campaign', '4:5', 'blush', {
  ...PHOTO.heroFrame,
});

/* ---------- ACT 02 — monde social ---------- */
export const socialSatellites: MediaItem[] = [
  item('social-01', 'portrait', '4:5', 'paper-deep', PHOTO.creativeDirector),
  item('social-02', 'campaign', '3:2', 'blush', PHOTO.contactEditorial),
  item('social-03', 'note', '1:1', 'graphite', PHOTO.editorialTools),
  item('social-04', 'social', '3:2', 'paper', PHOTO.mgcEditorialWall),
  item('social-05', 'campaign', '4:5', 'blush', PHOTO.socialCampaign),
];

/** Les strates révélées par le Front → Behind. */
export const behindMedia: MediaItem[] = [
  item('behind-moodboard', 'moodboard', '3:2', 'paper-deep', PHOTO.contactEditorial),
  item('behind-planning', 'planning', '4:5', 'paper', PHOTO.planning),
];

/* ---------- ACT 03 — téléphone ---------- */
export const phoneFeed: MediaItem[] = [
  item('phone-feed-01', 'note', '1:1', 'graphite', PHOTO.editorialTools),
  item('phone-feed-02', 'portrait', '1:1', 'blush', PHOTO.creativeDirector),
  item('phone-feed-03', 'social', '1:1', 'paper-deep', PHOTO.contactEditorial),
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
  item('sheet-01', 'moodboard', '4:5', 'paper-deep', PHOTO.contactEditorial),
  item('sheet-02', 'note', '1:1', 'paper', PHOTO.editorialTools),
  item('sheet-03', 'planning', '3:2', 'paper-deep', PHOTO.planning),
  item('sheet-04', 'portrait', '9:16', 'blush', PHOTO.creativeDirector),
  item('sheet-05', 'macro', '1:1', 'graphite', PHOTO.yunaMacro),
  item('sheet-06', 'note', '4:5', 'paper', PHOTO.moodboard),
  item('sheet-07', 'campaign', '3:2', 'blush', PHOTO.mgcEditorialWall),
  item('sheet-08', 'note', '1:1', 'paper-deep', PHOTO.portfolioThread),
];

/* ---------- ACT 06 — projets ---------- */
export const yunaMedia: MediaItem[] = [
  item('yuna-campaign', 'campaign', '4:5', 'bordeaux', { ...PHOTO.yunaCampaign, project: 'yuna' }),
  item('yuna-macro', 'macro', '1:1', 'blush', { ...PHOTO.yunaMacro, project: 'yuna' }),
  item('yuna-product', 'product', '1:1', 'graphite', { ...PHOTO.yunaProduct, project: 'yuna' }),
];
/** Média du handoff Yuna → MGC : change de ratio et de palette. */
export const yunaShared: MediaItem = item('yuna-shared', 'campaign', '4:5', 'blush', {
  ...PHOTO.yunaSocial,
  project: 'yuna',
});

export const mgcMedia: MediaItem[] = [
  item('mgc-community', 'social', '1:1', 'paper-deep', PHOTO.mgcCommunity),
  item('mgc-event', 'campaign', '3:2', 'blush', PHOTO.mgcEditorialWall),
  item('mgc-ugc-01', 'social', '4:5', 'paper', PHOTO.mgcEvent),
  item('mgc-ugc-02', 'social', '4:5', 'paper-deep', PHOTO.mgcUgc),
].map((m) => ({ ...m, project: 'mgc' as const }));
/** Média du handoff MGC → Comptoir : plein cadre puis glissement vers bordeaux. */
export const mgcShared: MediaItem = item('mgc-shared', 'texture', '16:9', 'paper-deep', {
  ...PHOTO.mgcShared,
  project: 'mgc',
});

export const comptoirMedia: MediaItem[] = [
  item('comptoir-product', 'product', '4:5', 'bordeaux', PHOTO.comptoirProduct),
  item('comptoir-shop', 'campaign', '3:2', 'bordeaux', PHOTO.comptoirCraft),
].map((m) => ({ ...m, project: 'comptoir' as const }));
/** Support du seul zoom macro lent de l'acte. */
export const comptoirTexture: MediaItem = item('comptoir-texture', 'texture', '16:9', 'bordeaux', {
  ...PHOTO.comptoirTexture,
  project: 'comptoir',
});

/* ---------- ACT 07 — parcours ---------- */
export const portfolioThread: MediaItem = item(
  'portfolio-thread',
  'note',
  '4:5',
  'paper-deep',
  PHOTO.portfolioThread,
);

const journeyPhotos = [
  PHOTO.contactEditorial,
  PHOTO.yunaCampaign,
  PHOTO.editorialTools,
  PHOTO.comptoirCraft,
  PHOTO.mgcEditorialWall,
  PHOTO.creativeDirector,
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
  portfolioThread,
  ...journeyMedia,
];

export function mediaProgress() {
  const provided = allMedia.filter((m) => Boolean(m.src)).length;
  return { provided, total: allMedia.length };
}
