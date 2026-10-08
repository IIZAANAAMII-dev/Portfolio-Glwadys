# Builder log — THE EDIT

## Implementation

- Rebuilt the opening as a direct editorial cover. Glwadys Dalleau’s full name, a localized service descriptor, tagline, work link, and language switch are visible without waiting for an animation.
- Replaced the pinned story and process rail with ordinary vertical reading. The method uses one dominant image beside six readable decisions on desktop and stacks those regions on mobile.
- Added the THE EDIT interaction: finished Yuna direction study → contact sheet → oxblood crop selection → handoff to the Yuna case cover. Previous-step control reverses the interaction. The selected and cover views use the same Yuna media item and crop.
- Rebuilt the three work cases as separate image and copy zones. They identify role, challenge, direction, and areas of practice. Unverified outcome and evidence claims are not presented as facts.
- Labeled every displayed generated image as a direction study, including the hero, edit interaction, and case images.
- Rebuilt journey, expertise, and contact as static semantic sections. Contact contains no imagery and keeps the name, statement, email CTA, LinkedIn, availability, services, languages, and work axis in readable text.
- Rebuilt the fixed navigation with all five destinations, full labels, 44px minimum targets, and an observed active state. Language links live in the opening; section spacing accounts for the fixed navigation and safe area.
- Removed the global WebGL layer, photo corridor, smooth-scroll and custom-cursor shell, old pinned interactions, and their unused GSAP/Lenis/Three dependencies. The edit is DOM-only on desktop and mobile and has reduced-motion CSS behavior.
- Added localized copy for the hero descriptor, edit controls, direction-study label, work labels, and contact metadata labels. Retained the skip link, semantic headings, keyboard-operable controls, and native document scrolling.
- Changed `scripts/qa-shots.js` to dynamic imports so the repository lint command can process the existing helper.

## Exact changed files

### Added

- `docs/flagship-audit/07-builder-log.md`
- `src/acts/ActProcess/EditMark.module.css`
- `src/acts/ActProcess/EditMark.tsx`

### Modified

- `package-lock.json`
- `package.json`
- `scripts/qa-shots.js`
- `src/acts/ActContact/ActContact.module.css`
- `src/acts/ActContact/index.tsx`
- `src/acts/ActExpertise/ActExpertise.module.css`
- `src/acts/ActExpertise/index.tsx`
- `src/acts/ActJourney/ActJourney.module.css`
- `src/acts/ActJourney/index.tsx`
- `src/acts/ActProcess/ActProcess.module.css`
- `src/acts/ActProcess/index.tsx`
- `src/acts/ActScrollStory/ActScrollStory.module.css`
- `src/acts/ActScrollStory/index.tsx`
- `src/acts/ActWork/ActWork.module.css`
- `src/acts/ActWork/index.tsx`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `src/content/index.ts`
- `src/content/media.ts`
- `src/shell/BottomNav.module.css`
- `src/shell/BottomNav.tsx`

### Removed

- `src/acts/ActScrollStory/galleryLayout.ts`
- `src/acts/ActWork/WorkJourneyBridge.module.css`
- `src/acts/ActWork/WorkJourneyBridge.tsx`
- `src/lib/gsap.ts`
- `src/lib/motion.ts`
- `src/lib/scrollControl.ts`
- `src/lib/stage.ts`
- `src/lib/useReducedMotion.ts`
- `src/shell/CustomCursor.module.css`
- `src/shell/CustomCursor.tsx`
- `src/shell/SmoothScroll.tsx`
- `src/shell/StageLayer.module.css`
- `src/shell/StageLayer.tsx`
- `src/shell/stage/StageCanvas.client.tsx`
- `src/shell/stage/StageScene.tsx`
- `src/shell/stage/film.ts`
- `src/ui/ArchivePlate.module.css`
- `src/ui/ArchivePlate.tsx`
- `src/ui/EditorialZoom.module.css`
- `src/ui/EditorialZoom.tsx`

The supplied audit files `00-synthesis.md` through `05-engineering-qa-luna.md` were present as untracked worktree inputs at the start and were not modified.

## Validation

- `npm run typecheck` — passed.
- `npm run lint` — passed. The first run identified two `require()` violations in `scripts/qa-shots.js`; the helper now uses dynamic imports.
- `npm run build` — passed with Next.js 16.3.0; `/fr`, `/en`, and `/ko` prerendered.
- `git diff --check` — passed again after adding this log.
- No browser capture or visual review was run. This implementation is ready for the requested mentor/browser review, not a visual acceptance claim.

## Remaining review items and risks

- Review at 1440×900 and 390×844, including document width, five-target navigation, safe-area clearance, active navigation state, and the Yuna handoff. The CSS creates separate mobile zones, but rendered wrapping and device safe areas still need browser confirmation.
- The supplied project imagery is generated. It is labeled as concept direction throughout; it does not establish authentic client deliverables or measured outcomes. Replace it with approved project artifacts when available.
- Confirm that the selected Yuna image and cover feel continuous in the browser, including reverse interaction, keyboard operation, delayed image loading, and reduced motion.
