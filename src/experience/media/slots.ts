/**
 * Media slot manifest — the contract between the motion architecture and the
 * photography.
 *
 * Every image position in the experience is a slot declared here. Components
 * reference slots by id and never hardcode a file path, so real media can be
 * dropped in without touching a single animation. Adding `src` to a slot is the
 * only change required.
 *
 * Until `src` is set, <MediaSlot> renders a designed editorial plate carrying
 * the slot id, ratio, art-direction note and motion role — an art-direction
 * board, never a grey skeleton, and never stock passed off as Glwadys's work.
 *
 * See docs/storyboard.md for the manifest overview and media-source/README.md
 * for the drop instructions.
 */

export type SlotChapter =
  | 'hero'
  | 'phone'
  | 'sheet'
  | 'behind'
  | 'yuna'
  | 'mgc'
  | 'comptoir'
  | 'journey';

export type Slot = {
  /** Stable identifier, also printed on the placeholder plate. */
  id: string;
  /** CSS aspect-ratio value, e.g. '4 / 5'. The slot reserves this space always. */
  ratio: string;
  chapter: SlotChapter;
  /** What the photograph needs to be. Shown on the plate; briefs the shoot. */
  note: string;
  /** How the slot behaves in motion. Shown on the plate. */
  role: string;
  /** Set once real media exists. Path under /public. */
  src?: string;
  /**
   * True only for temporary licensed stock used to judge a composition.
   * Must be logged in docs/assets-sources.md and cleared before production.
   */
  temporary?: boolean;
  /** Descriptive alt text. Localised when real media lands. */
  alt: string;
};

const series = (
  prefix: string,
  count: number,
  base: Omit<Slot, 'id'>,
  perIndex?: (i: number) => Partial<Slot>,
): Slot[] =>
  Array.from({ length: count }, (_, i) => ({
    ...base,
    ...perIndex?.(i + 1),
    id: `${prefix}_${String(i + 1).padStart(2, '0')}`,
  }));

export const SLOTS: Slot[] = [
  {
    id: 'HERO_PORTRAIT_01',
    ratio: '4 / 5',
    chapter: 'hero',
    note: 'The single most important asset. Must survive an aggressive re-crop to 9:16: subject off-centre, generous headroom, calm uncluttered background.',
    role: 'Survives Opening → Hero → Story → Phone. Re-crops, never cross-fades.',
    alt: 'Portrait de Glwadys Dalleau',
  },

  ...series('PHONE_STORY', 3, {
    ratio: '9 / 16',
    chapter: 'phone',
    note: 'A real Story or Reel she produced. Vertical, full-bleed, legible at small scale.',
    role: 'Phone screen content. Crops inside the bezel.',
    alt: 'Story vertical produite par Glwadys Dalleau',
  }),

  ...series('PHONE_FEED', 9, {
    ratio: '4 / 5',
    chapter: 'phone',
    note: 'Feed tile from real published work. Variety across the nine matters more than individual perfection.',
    role: 'Scrolls inside the pinned phone screen.',
    alt: 'Publication social media',
  }),

  {
    id: 'CAMPAIGN_WIDE_01',
    ratio: '16 / 9',
    chapter: 'phone',
    note: 'Must survive going fullscreen — supply the highest resolution available.',
    role: 'Breaks out of the bezel, then becomes the Portal frame.',
    alt: 'Visuel de campagne',
  },

  ...series('SHEET', 24, {
    ratio: '3 / 2',
    chapter: 'sheet',
    note: 'The contact sheet needs volume. Outtakes and near-misses are ideal — they make the act of selection read as real.',
    role: 'Contact sheet frame. Regroups via Flip into the moodboard.',
    alt: 'Planche contact — image de sélection',
  }, (i) => ({
    ratio: i % 3 === 0 ? '4 / 5' : i % 4 === 0 ? '1 / 1' : '3 / 2',
  })),

  ...series('BEHIND', 4, {
    ratio: '4 / 3',
    chapter: 'behind',
    note: 'Real moodboard, editorial calendar or planning document. Screenshots are fine. No stock image can substitute for this — it is the evidence of the strategy.',
    role: 'Appears among the frames as the moodboard forms.',
    alt: 'Moodboard et planning éditorial',
  }),

  ...series('YUNA_PRODUCT_MACRO', 4, {
    ratio: '4 / 5',
    chapter: 'yuna',
    note: 'Jewellery. Tight macro, fine detail, precious materials, controlled light.',
    role: 'Very large, held still. Crop reveals only.',
    alt: 'Bijou Yuna — détail macro',
  }),

  ...series('YUNA_STORY', 2, {
    ratio: '9 / 16',
    chapter: 'yuna',
    note: 'Vertical product content for Yuna Bijoux.',
    role: 'Last one survives and becomes an MGC photograph.',
    alt: 'Contenu vertical Yuna Bijoux',
  }),

  ...series('MGC_EVENT_WIDE', 8, {
    ratio: '3 / 2',
    chapter: 'mgc',
    note: 'Events, community, candid moments. Imperfect and warm is better than polished here.',
    role: 'Scrapbook overlap with slight rotation and angled parallax entry.',
    alt: 'Événement Marseille Girls Club',
  }),

  ...series('COMPTOIR_PRODUCT', 4, {
    ratio: '3 / 2',
    chapter: 'comptoir',
    note: 'Packaging, product, texture, boutique. One frame at very high resolution for the macro zoom.',
    role: 'Shown very large, almost still. One macro zoom only.',
    alt: 'Produit Le Comptoir de Mathilde',
  }),

  ...series('JOURNEY', 6, {
    ratio: '4 / 5',
    chapter: 'journey',
    note: 'One image per year, 2021 → 2026. Can be work, workspace or portrait.',
    role: 'Resolves as its year meets the playhead.',
    alt: 'Étape du parcours',
  }, (i) => ({ id: `JOURNEY_${2020 + i}` })),
];

const BY_ID = new Map(SLOTS.map((slot) => [slot.id, slot]));

export function getSlot(id: string): Slot {
  const slot = BY_ID.get(id);
  if (!slot) throw new Error(`Unknown media slot "${id}". Declare it in slots.ts.`);
  return slot;
}

export function slotsByChapter(chapter: SlotChapter): Slot[] {
  return SLOTS.filter((slot) => slot.chapter === chapter);
}

/** Ship gate: slots still standing in with temporary licensed stock. */
export function temporaryStock(): Slot[] {
  return SLOTS.filter((slot) => slot.temporary);
}

/** Slots still awaiting Glwadys's real media. */
export function awaitingMedia(): Slot[] {
  return SLOTS.filter((slot) => !slot.src);
}
