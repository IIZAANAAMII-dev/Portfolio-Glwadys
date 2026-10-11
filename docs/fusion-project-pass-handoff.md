# Project composition pass — 2026-10-11

Implemented on `jarvis/glwadys-fusion-luxe-ugc` in the requested worktree, following director brief 38.

- MGC and Comptoir now enter as readable spreads: the decision leaf starts open, closes while the same photograph lifts, then reopens. This addresses the empty lower page during chapter arrival.
- Mobile spread opening advances from beat .66 to .60; decision-copy reveal advances from .72 to .64. MGC/Comptoir reserve more height for the printed page, with a compact masthead and extra copy room below 680px viewport height.
- MGC uses a numbered paper masthead and asymmetric dossier photographs. Comptoir uses a wine decision page with champagne masthead, followed by a desktop material plate alongside the existing retail case study. Ruled dossier headings shorten the uncomposed gap after the pinned spread.
- Work → Journey keeps its imprint until .40, clearing at .54 as archive copy starts. A fine rule anchors the imprint. Shared Journey frame and final aperture geometry remain intact.

Preserved `coverToSlot`, the traveling photograph, ScrollTrigger pins, reverse/refresh from-values, Yuna's desktop spread treatment, existing localized claims and generated-image disclosures. No new imagery, clients or results. Comptoir remains retail experience. Reduced-motion/no-script flow remains supported.

Changed code: `ProjectFeature.tsx`, `ProjectFeature.module.css`, `WorkJourneyBridge.tsx`, `WorkJourneyBridge.module.css`, all under `src/acts/ActWork/`. `ActWork.module.css` needed no change.

Validation: `npm run typecheck` passed once; `NEXT_TELEMETRY_DISABLED=1 npm run build -- --webpack` passed once (FR/EN/KO static routes); `git diff --check` passed. No network tools, external APIs, dependency changes, commits, push or deployment.

Visual QA remains director-owned and is **not verified** here. Review 390px p050/p060, 320px short-screen decision-page fit, desktop p055/p068, reverse chapter entry, and bridge .40–.76. Source timing/layout changes are implemented; no visual quality verdict is claimed.
