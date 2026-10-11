# Fusion Codex handoff — 2026-10-11

Implemented in the existing shared worktree. No dependencies added, API calls, subagents, commits, pushes or deployments.

## Changed files

- `src/shell/BottomNav.tsx`, `BottomNav.module.css`: ivory editorial desktop index; five chapters (Accueil / Univers / Projets / Expertise / Contact), numbered active state, integrated locale control. Mobile has one Index trigger, a native modal contents panel, five generous chapter links, language links, Escape, focus containment/restoration, outside dismissal and safe-area spacing. GSAP entry uses transform/opacity with cleanup and reduced-motion support. Navigation remains available in Contact.
- `src/acts/ActExpertise/ExpertiseOpeningFrame.tsx`, `ActExpertise.module.css`: one dominant serif discipline, short description, cropped existing content-production print, explicit generated-image credit, compact seven-item index. Reduced motion prints every description. Mobile composition reserves space for the bottom navigation.
- `src/acts/ActExpertise/expertisePainter.ts`: deterministic forward/reverse hero selection from the existing held scroll scalar; fixed index geometry, no text scaling or blur, no transform on held text. Same painter serves Journey's decorative clone.
- `src/acts/ActExpertise/index.tsx`: locale propagation; existing pin, QA hooks and Contact manifesto handoff retained.
- `src/content/index.ts`: localized Expertise captions and descriptions; Community Management and Création UGC / UGC Creation / UGC 콘텐츠 lead the seven disciplines. Preserved incoming cover and process content changes.
- `src/acts/ActJourney/index.tsx`, `src/app/[locale]/page.tsx`: locale passed to the shared Expertise frame/act only.
- `src/styles/base.css`: stable scrollbar gutter to prevent modal-induced layout movement.

## Verification and remaining work

- `npm run typecheck` — passed (run once).
- `npm run build -- --webpack` — passed (run once), including FR/EN/KO static generation.
- No compilation blockers. Screenshot, keyboard and device QA were not run; director owns visual QA at 1440 / 390 / 320, including reverse-scroll seams, menu focus, and iOS safe areas.
- `docs/fusion-claude-handoff.md` was absent. Incoming changes in `ActScrollStory/*` and the shared content dictionary were preserved; no changes to project/contact content or process geometry.
