# External Assets & Licences Registry

Every asset in this project that did **not** come from Glwadys must be listed here before it is
committed. One row per file. No row, no asset.

> ### Integrity note — this file was reset on purpose
>
> The previous version of this document listed nine `.webp` files under `public/assets/…` with
> Unsplash/Pexels attributions, and asserted: *"All assets are optimized into modern WebP format and
> tested for performance."*
>
> **None of those files existed.** They are absent from the working tree and from every commit in
> git history (verified by scanning all branches for `.jpg .jpeg .png .webp .avif .mp4 .webm .mov
> .glb .gltf`). The attributions described images that were never downloaded, and no author or
> licence was ever actually identified.
>
> That content was fabricated, so it has been removed rather than corrected. Nothing may be added
> back to the table below unless the file is present on disk and its licence has been verified at
> source.

---

## 1. Glwadys's own media

Assets created by or belonging to Glwadys Dalleau. Not third-party licensed; no attribution needed.

Originals are dropped in `media-source/` (git-ignored) and optimised derivatives are committed to
`public/media/`.

| Slot ID | File | Subject | Provided | Notes |
|---|---|---|---|---|
| _(none yet)_ | | | | Awaiting the media drop — see `media-source/README.md` |

---

## 2. Temporary licensed stock — REPLACE BEFORE PRODUCTION

Used only where a real photographic subject is genuinely required to judge a composition, crop
transition, image scale, phone/story framing, scrapbook density or motion timing. Never presented as
Glwadys's work. Every entry is tagged `temporary: true` in the media manifest and appears in
§4 below.

| Slot ID | File | Source URL | Author | Licence | Why a real photo was needed | Verified |
|---|---|---|---|---|---|---|
| _(none yet)_ | | | | | | |

---

## 3. Textures, fonts and non-photographic assets

| Asset | File | Source | Author | Licence | Usage |
|---|---|---|---|---|---|
| Film grain | inline SVG `feTurbulence` | generated in-repo | — | n/a (procedural, no third-party code) | global grain overlay |
| Fonts | see `docs/creative-direction.md` | to be confirmed | — | to be confirmed | display / editorial / mono / Hangul |

Font licences must be recorded here once the typefaces are chosen, including whether self-hosting is
permitted by the licence.

---

## 4. "Replace before production" checklist

Ship blocker. This list must be **empty** before the site goes live.

| # | Slot ID | Currently | Must become |
|---|---|---|---|
| _(none yet)_ | | | |

---

## 5. Retired placeholders

The four hand-written SVG placeholders from the legacy build. Authored in-repo, no third-party
licence. Superseded by the editorial-plate system and removed when the legacy sections are deleted.

| File | Size |
|---|---|
| `public/assets/editorial/portrait-glwadys.svg` | 1.8 KB |
| `public/assets/projects/yuna-story.svg` | 2.0 KB |
| `public/assets/projects/mgc-scrapbook.svg` | 1.7 KB |
| `public/assets/projects/comptoir-macro.svg` | 1.5 KB |
