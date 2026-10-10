# Mentor QA — 2026-10-10 02:17 CEST

Actual tracked source edits verified in ActJourney, ActExpertise and motion helpers. New JourneyArchive.tsx and expertisePainter.ts exist. However WorkJourneyBridge.tsx, WorkJourneyBridge.module.css and JourneyOpeningFrame.tsx are absent while the original code imports them. This is a blocking source-level issue. Complete and restore these files before claiming a working V3 or trying Playwright.

Work remains mostly unchanged: src/acts/ActWork/index.tsx has only a 4-line diff. The user explicitly prioritizes real luxe editorial project redesign and Work-to-Journey continuity. Build this, not another audit. Journey archive should be image-led and semantically truthful to Glwadys's community management work, not movie production.

After code is complete, run typecheck, lint, webpack production build; inspect real screenshots desktop 1440x900 and iPhone 390x844, 320x568 in FR/EN/KO. Compare exact forward/reverse Work-to-Journey and Journey-to-Expertise seams, nav/locale overlap, reduced motion, console and performance. Save screenshots under docs/qa/glwadys-v3. Keep main and production untouched until proven working. Current VPS has exhausted swap; avoid multiple concurrent build/dev servers.
