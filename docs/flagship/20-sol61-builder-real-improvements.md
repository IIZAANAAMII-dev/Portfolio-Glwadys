# 20 — Sol 6.1 builder / real source improvements

## Scope and provenance
- Task `t_84813115`; original worktree `/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-original-flagship`, branch `jarvis/glwadys-original-flagship`.
- Starting HEAD `934505b`. Preserve the intro/scroll ownership fix, opaque Behind matte, five readable rows, folio/page-turn, Work→Journey→Expertise handoffs.
- Read director brief 16, real iPhone feedback 18, fix report 19, independent observations 21 and archived creativelead's comments. The upstream audit was deliberately cancelled by the operator, NOT passed.
- Image vision tool returns HTTP 403 OAuth; no invented visual verdict. Evidence is actual browser capture plus DOM geometry, and final independent QA/jury remains mandatory.

## Milestone A1 — mobile rail and Social composition
Actual changed source: `src/acts/ActScrollStory/ActScrollStory.module.css`.
- Raise mobile four-stage phone rail by 2.25rem above its previous navigation clearance; use four equal minmax tracks. The 44px FR control occupies its own protected band.
- Mobile Social now has one dominant persistent photographic plate. Remove the secondary portrait and detail plate on mobile, rather than covering the Portrait caption with another photograph. Desktop editorial collage is retained.
- Give the Social title the full mobile reading width.

Execution:
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` passed on first rail diff. Existing lint warning belongs to untracked `qa/mentor-contrast-probe.mjs`, not application source.
- `qa/sol61-nav-gate.mjs` ran through host-network Playwright Docker (`mcr.microsoft.com/playwright:v1.62.1-noble`) against existing host dev server `http://127.0.0.1:4440`.
- 45 real forward/reverse phone samples over Chromium 1440×900 and WebKit 390×844 / 320×800, FR/EN/KO; 18 locale/viewport/motion contexts including reduced motion. No rail/locale/nav overlap, horizontal overflow or console/page errors in tested contexts. Locale menu opens and closes with Escape.
- Actual screenshots and measured results: `docs/qa/sol61-builder/pass-a/`; data `results.json`. Prior baseline: `docs/qa/sol61-cold-review/webkit-320x800-fr-phone-focus-menu-closed.png`.
- These are engine-emulated viewports, NOT physical iPhone hardware certification.

## Next source passes (not yet claimed complete)
- B: Phone→Immersion source-image continuity; opaque mobile source image instead of three ghosted planes; identical final-image geometry at Immersion→Notebook seam; frame acquires paper/spread identity and resolves into notebook, not a second contact gallery.
- C: separate Behind's editorial intention from the later six-step method; improve notebook system framing; inspect all nine acts, contrast and controls, reduced-motion/no-JS completeness; preserve final case and journey ownership.
- Runtime and art acceptance remain pending independent tasks `t_27e19338` and `t_78ac6e14`. No self-rating, production deploy or main merge.
