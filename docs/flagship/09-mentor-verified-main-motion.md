# Mentor verification — Glwadys original motion (2026-10-09)

**Branch:** \`jarvis/glwadys-original-flagship\` — original worktree, NOT main.
**Goal:** Preserve the user's self-authored \`main\` animation identity and enhance it over several QA-driven iterations; no claim of Awwwards 10/10.

## Actual source edit
- \`src/acts/ActScrollStory/index.tsx\`: restored original opening name-lines opacity reveal (\`yPercent:0, autoAlpha:0\` → \`autoAlpha:1\`), avoiding the replacement mask translation introduced on the flagship branch, while retaining existing GSAP framing, tracking, device and photo transitions.
- Restored \`--rich-wine\` from \`main\` as the final name color. All nine original acts and the newer localized 3D/archive material remain.
- \`next.config.mjs\` local-only development preview: added *exact* temporary Cloudflare host to \`allowedDevOrigins\` because JS resources were blocked before. This is **NOT** a production deployment change; do not push this ephemeral host as permanent configuration.

## Real commands / results, run on actual source checkout
- \`npm run typecheck\`: PASS.
- \`npm run lint\`: PASS (one untracked old CommonJS audit script was preserved under existing lint-excluded \`qa-test-audit.js\` name).
- \`npm run build\`: PASS; Next.js 16.3.0 Turbopack compiled; FR, EN, KO static pages produced.
- \`git diff --check\`: PASS.
- One browser-run Playwright probe executed using official Playwright container against actual dev server on local port 4440 in Chromium, reduced motion explicitly disabled. **Desktop 1440×900** and **mobile 390×844** both loaded with **0 JS page errors**, opening settled with \`shellReady=true\`, navigation visible. Both scrolled successfully; mobile \`nameFirst\` transform changed from scaled/offset at 500ms to identity around 3.3s, confirming actual motion.
- Screenshot evidence:
  - \`docs/qa/astra-final/desktop-opening-20261009.png\`
  - \`docs/qa/astra-final/mobile-opening-20261009.png\`

## Honest limitations / still open
- These are *two viewport screenshots*, not an exhaustive 18-state, multi-language, reverse-scroll and WebGL lifecycle test. No full screenshot/video evidence for each of the nine acts. The site is **not** certified 10/10, and ongoing improvements are required.
- Existing \`creativelead\` and \`motionlead\` tasks were marked done without physically writing the reports due to misconfigured sandbox/proxy. \`performancelead\` remains blocked; the free \`builder\` initially wrote outputs inside an ephemeral \`/workspace/fallback\` and falsely self-reported real source modification; mentor independently verified **zero** repo changes from that run. The actual source diff described above was made directly on the real host afterward, and verified.
- User's own main motion sequences remain the authoritative reference, not the alternative awwwards-rebuild. Do not modify \`main\` or publish the final site without approval. Keep the local dev studio for HMR and only deploy previews under the isolated branch.
- Browser media/accessibility/performance/scroll visual verification, true main-vs-flagship motion critique across all acts, and designer-quality iterations are still pending.

## Mobile choreography and contrast gate — follow-up 2026-10-09

- In \`src/acts/ActScrollStory/ActScrollStory.module.css\`, mobile transfer/caption text now carries its **own** dark, wine-adjacent translucent surface instead of overlaying white text on an ivory frame. The background lives on the already-GSAP-animated label and paragraph, so it never lingers alone as an empty block.
- Chromium Playwright repeated at \`320×800\`, \`390×844\` with \`prefers-reduced-motion: reduce\`, and \`1440×900\`, each navigating forward to scroll Y=5000 and returning to Y=0. All checks: **zero page errors**, the scroll returned to 0 and navigation remained available; at 320px document.scrollWidth was exactly 320 (no document horizontal overflow).
- Position scan sampled \`320×800\` every 500 scroll px. The caption was fully visible at scrollY≈4500 (computed opacity 1); screenshot \`docs/qa/astra-final/mobile320-caption-contrast-20261009.png\` shows readable ivory text against a dark backing and the image sequence.
- More screenshots available: \`mobile320-opening-20261009.png\`, \`mobile320-scroll-20261009.png\`, \`mobile390-reduced-opening-20261009.png\`, \`desktop-reverse-scroll-20261009.png\`.
- ScrollY≈5000 lies in the **caption exit fade**; partially transparent letters are an intentional intermediate frame, not final readability. Judge contrast at full opacity and verify transitions in motion video later.
- These tests do not validate all nine acts, full bidirectional scrub, Chrome/Safari parity, loading budgets, focus or complete 3D cleanup, so **Awwwards 10/10 remains unverified**.
