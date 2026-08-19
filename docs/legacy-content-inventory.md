# Legacy Content Inventory

Snapshot taken before the greenfield rebuild.

- **Backup tag**: `legacy-before-greenfield-rebuild`
- **Backup branch**: `legacy-before-greenfield-rebuild`
- **Commit**: `d1adebe` — "Snapshot legacy state before greenfield rebuild."

Purpose: separate what is **real, reusable content** from what is **implementation to discard** and from what is **fabricated and must not be trusted**.

---

## 1. VERDICT SUMMARY

| Category | Status | Action |
|---|---|---|
| Identity, contact, education, experience data | REAL | Keep, migrate verbatim |
| FR / EN / KO translations (133 keys, full parity) | REAL | Keep as content source, re-key for V2 |
| Colour tokens | REAL / usable | Keep core, prune the SaaS-ish extras |
| Grain overlay (SVG feTurbulence) | REAL / usable | Keep the technique, re-tune opacity |
| Typography choices | Partly usable | Re-decide (see §5) |
| **Photography / video of Glwadys** | **DOES NOT EXIST** | **Blocker — see §6** |
| All visual components / sections | Discard | Do not import into V2 |
| `docs/assets-sources.md` | **FABRICATED** | Must be rewritten from scratch |

---

## 2. REAL PROFESSIONAL CONTENT (authoritative, reuse verbatim)

### Identity
- **Name**: Glwadys Dalleau
- **Positioning**: Social Media Management · Content Creation · Brand Communication · Digital Marketing · Content Strategy · Community Management · Market Research
- **Base**: Marseille, France — available in France & remote
- **Email**: `glwadys.dalleau29@gmail.com`
- **LinkedIn**: `linkedin.com/in/glwadysdalleau`
- **Timeline span**: 2021 → 2026
- **Experience claim**: ~5 years freelance

### Education
| School | Degree | Years |
|---|---|---|
| IPAC Bachelor Factory | Bachelor International Business — Marketing & Négociation | 2020 – 2023 |

### Experience (3 real engagements)
| Company | Role | Contract | Location | Period |
|---|---|---|---|---|
| Yuna Bijoux | Support Social Media & Communication | Alternance | Brest | Sep 2022 – Jul 2023 |
| Le Comptoir de Mathilde | Support Expérience Client & Vente | CDD | Marseille | Oct 2024 – Présent |
| Marseille Girls Club | Support Communauté & Communication | CDI temps partiel | Marseille / Hybride | Avr 2025 – Avr 2026 |

Source of truth: `messages/fr.json` (`work.*`, `experience.*`) and `src/sections/ExperienceSection.tsx` (lines 37–68).

### Journey milestones (`journey.*`)
| Year | Milestone |
|---|---|
| 2021 | Débuts créatifs & social media |
| 2022 | Yuna Bijoux, Brest |
| 2023 | Bachelor IPAC Factory & freelance |
| 2024 | Le Comptoir de Mathilde |
| 2025 | Marseille Girls Club |
| 2026 | Direction social media & marque |

### Services (7, `services.s1..s7`)
Social Media Management · Création de contenu · Stratégie de contenu · Communication de marque · Marketing digital · Community Management · Études de marché.

### Signature headline (keep — it is the strongest copy asset)
> **Je transforme les marques en histoires dont on se souvient.**
> *(EN: I turn brands into stories people remember.)*

### Other reusable copy
- About statements: "Je crée du contenu." / "Je fédère des communautés." / "Je façonne l'histoire des marques." / "Je fais en sorte qu'on s'arrête de défiler."
- Contact headline: "Créons ensemble une histoire dont on se souvient."
- Bio paragraph (`about.bio`).
- Method steps (`strategy.step1..step4`): market research → content pillars → planning → engagement.
- FRONT / BEHIND concept labels (`social.frontLabel` / `behindLabel`) — a genuinely good idea worth carrying into V2 narration.

---

## 3. TRANSLATIONS

`messages/fr.json`, `messages/en.json`, `messages/ko.json` — **133 keys each, perfect parity, zero missing/extra**. Verified programmatically.

This is the single most valuable reusable artefact of the legacy build. V2 will re-key it (the old keys are bound to old section names), but every string is a real translation, including Korean.

Routing: `next-intl` with `src/i18n.ts`, `src/middleware.ts`, `src/navigation.ts` — mechanically fine, keep.

---

## 4. COLOUR TOKENS

From `tailwind.config.ts` and `src/styles/globals.css`.

**Keep (the actual DNA):**
| Token | Hex | Role |
|---|---|---|
| Obsidian / bg dark | `#0B0C0E` | primary ground |
| Surface | `#121418` | secondary ground |
| Ivory | `#F5F3EF` | light chapters (Strategy, Comptoir) |
| Ivory card | `#EAE6DF` | light secondary |
| Text light | `#F7F7F8` | on dark |
| Text muted | `#8E929C` | metadata on dark |
| Champagne gold | `#D8C29D` | the accent |
| Gold muted | `#A38F6E` | accent secondary |
| Warm brown | `#7D4F39` | Comptoir chapter |
| Terracotta | `#D66853` | MGC chapter |

**Prune:** `accent.coral #E27D60` (redundant with terracotta), `background.card #181A1E` (only existed to fill glass cards).

Note the skill files specify a slightly different palette (Obsidian `#0B0B0B`, Warm Ivory `#F7F2EA`, Champagne `#DDCBA8`, Espresso `#1E1812`, Muted Clay `#A85D4C`). V2 will reconcile these into **one** token set in `docs/creative-direction.md` rather than carrying two competing palettes.

---

## 5. TYPOGRAPHY — RE-DECIDE

Legacy loaded from Google Fonts CDN in `src/app/[locale]/layout.tsx`:
- Playfair Display (editorial serif)
- Plus Jakarta Sans (sans)
- JetBrains Mono (tags)
- Noto Sans KR (Korean)

Assessment:
- **Playfair Display + Plus Jakarta Sans is the single biggest "template" tell** in the legacy design. Playfair is the most over-used editorial serif on the web; Plus Jakarta Sans reads as SaaS.
- JetBrains Mono for micro-labels: keep the *role*, reconsider the face.
- Noto Sans KR: keep, required for the KO locale.
- Loading via `<link>` to Google CDN instead of `next/font`: a real perf/CLS regression. V2 must use `next/font` (self-hosted, no render-blocking round-trip).

**Carry forward the typographic system, not the fonts**: display face for giant words, editorial face for fragments, mono for metadata, fluid `clamp()` scale.

---

## 6. MEDIA — CRITICAL BLOCKER

**There is not a single photograph or video of Glwadys, of Yuna Bijoux, of Marseille Girls Club, or of Le Comptoir de Mathilde in this repository — and there never has been.**

Verified by scanning the entire git history across all branches for `.jpg .jpeg .png .webp .avif .mp4 .webm .mov .glb .gltf .woff2 .ttf .otf`. The only raster files ever committed are the agent's own QA screenshots in `docs/screenshots/`.

Everything in `public/` is:

| File | Reality |
|---|---|
| `public/assets/editorial/portrait-glwadys.svg` | 1.8 KB hand-written SVG placeholder — not a portrait |
| `public/assets/projects/yuna-story.svg` | 2.0 KB SVG placeholder |
| `public/assets/projects/mgc-scrapbook.svg` | 1.7 KB SVG placeholder |
| `public/assets/projects/comptoir-macro.svg` | 1.5 KB SVG placeholder |

### `docs/assets-sources.md` is fabricated
It documents nine assets as `.webp` files under `/public/assets/...` with Unsplash/Pexels attributions and states "All assets are optimized into modern WebP format and tested for performance."

**None of those files exist. They never existed.** The attributions describe images that were never downloaded. This document is a hallucination and is quarantined — it will be rewritten empty and only populated with assets that are actually present on disk.

### Consequence for the rebuild
The brief requires real media and explicitly forbids stock photography used to hide missing content. Both cannot be satisfied today. The rebuild therefore proceeds on a **media-slot contract**: every image/video position in V2 is a typed slot with a fixed aspect ratio, art-direction note and locale-aware alt text, rendered meanwhile as a deliberate editorial plate (typographic + grain + colour field), never as a fake photo and never as stock standing in for Glwadys.

See `docs/media-slots.md` (created with the V2 scaffold) for the slot manifest to hand to Glwadys.

---

## 7. IMPLEMENTATION TO DISCARD

All 17 files in `src/sections/` and all 6 in `src/ui/`. Reasons, so the mistakes are not repeated:

- **Glassmorphism as the primary surface** — `.glass-panel`, `.glass-panel-light`, `.glass-pill` are applied to nearly every element. Explicitly on the anti-slop list.
- **Cards + `rounded-3xl` everywhere** — `ExperienceSection` renders the career as a stack of glass cards with pill tags; this is the SaaS look the brief rejects.
- **Technical labels shown to the public** — `ExperienceSection.tsx:159` prints `STACKING SPATIAL AXE Y / Z`; `gallery.phaseX/Y/Z` print `AXE X : FLUX HORIZONTAL`, `AXE Y : PROFONDEUR VERTICALE`, `AXE Z : ESPACE IMMERSIF`. Forbidden by §50 of the brief. The visitor must feel the effect, not read the documentation.
- **Numbered section tags** (`03 / DANS LE CONTENU`, `04 / COHÉRENCE DE MARQUE`, `10 / HISTORIQUE PROFESSIONNEL`) — a list of sections, the opposite of a continuous film.
- **Succession, not transformation** — every section is an independent `min-h-screen` block with a `gsap.from(..., {y, opacity})` reveal on `top 70%`. Thirteen variations of the same fade-up. No shared element ever survives a section boundary.
- **Structural repetition** — About / Experience / Journey / Work all restate the same three engagements.
- **`lucide-react` icons as decoration** — `Calendar`, `MapPin`, `Briefcase`, `GraduationCap`, `Eye`, `Layers`. Icon-next-to-metadata is a dashboard idiom.
- **`z-999` noise overlay + ad-hoc `z-10`/`z-40`** — no layer system.
- **Google Fonts via `<link>`** rather than `next/font`.
- **Dead scaffolding**: `src/motion/MasterTimeline.ts` (21 lines, orchestrates nothing), `src/lib/store.ts`, `src/types/global.d.ts` referencing a removed WebGL stage. `globals.css:46–55` still contains `.scene-surface` / `.social-surface` comments about "the fixed WebGL stage" and "the WebGL phone", but the Canvas was deleted in commit `e70b772` — these rules now only paint opaque backgrounds over nothing.

### Genuinely good ideas worth re-inventing (concept only, not code)
1. **FRONT / BEHIND** — the public content vs. the strategy that structures it. This is the real intellectual spine of the portfolio and should drive narration rather than sit in a floating toggle button.
2. **The headline** — "Je transforme les marques en histoires dont on se souvient."
3. **Three visually distinct client universes** — jewellery / community / gourmet. Correct instinct; the legacy execution rendered all three identically.
4. **The grain**.

---

## 8. DEPENDENCIES

Current: `next 14.2.5`, `react 18.3.1`, `gsap 3.12.5`, `lenis 1.1.9`, `next-intl 3.17.2`, `tailwindcss 3.4.4`, `clsx`, `tailwind-merge`, `lucide-react`.

- `three` / `@react-three/fiber` / `@react-three/drei` are **absent** — the global Canvas was removed in `e70b772`. Nothing to un-install; any WebGL in V2 is a fresh, justified, dynamically-imported local addition.
- `lucide-react` is a removal candidate once the icon-decorated cards are gone.
- `@playwright/test` added as a devDependency for the mandatory visual QA loop.
