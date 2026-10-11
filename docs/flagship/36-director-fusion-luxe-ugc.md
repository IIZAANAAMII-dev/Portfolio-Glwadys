# 36 — MISSION FUSION / GLWADYS, MAGAZINE DE LUXE UGC
Date: 2026-10-11. Creative director: ChatGPT. ONE product, ONE shared working branch jarvis/glwadys-fusion-luxe-ugc. This is a production brief, NOT a request for an audit.

## Non-negotiable facts
Glwadys = Community Manager and UGC Content Creator, with a personal taste for luxury, fashion, jewelry, photography and refined visual moodboards. Show an excellent content creator / social storyteller in a luxury-editorial setting, NOT a filmmaker, not a fictional luxury director, not an invented luxury employer. Preserve existing verified projects and clarify where visuals are conceptual/generated. No invented brand clients, achievements or metrics. Maintain FR/EN/KO.

## Direction: 'a collectible luxury fashion magazine that comes alive'
Keep the GOOD V3 original visual foundations, carefully curated visuals and useful GSAP timeline architecture. Upgrade the actual design and choreography: V3 did NOT feel Awwwards, navigation lacked clarity, text/image contrast and readability were weak, and some motion felt basic. Outcome must be significantly more striking, editorial and elegant at 1440, 390 and 320. Not an agency template or a generic black-on-black tech site. Think French jewelry lookbook meets independent fashion editorial meets social-creator identity.

Art system: gallery ivory #F2EDE5, ink #171411, oxblood #57232D, refined silver #B9B8B4 and small champagne #D6C3A1. Contrast ALWAYS high enough to read. Giant controlled Didone/serif for one memorable editorial word/title per scene; precise grotesque and meaningful whitespace for other text; no blurry settled text; mobile long-form 16px or more, captions 11–13px minimum; no horizontal clipping.
High-style visuals: close-up jewelry, precious material, skin/light, elegant still life; if stock/generated, transparent labeling. Reuse existing media first. Avoid CGI jewelry that looks fake. No heavy WebGL unless necessary.

## Signature interactions, carefully crafted
1. COVER: in under 2 seconds identify GLWADYS and 'Community Manager · Créatrice UGC'. A striking fashion/jewelry portrait/still-life image, huge masthead and confident negative space, meaningful editorial issue label. On scroll, photography becomes material/print, not arbitrary particle effects.
2. MOODBOARD: tactile table/book layout, carefully aligned photographic prints, jewelry detail, ink annotations and contact sheet. One ACTUAL photo moves from its moodboard location to the SAME photograph in the next Yuna project. Crop, image identity, geometry and direction remain continuous. Preserve existing ActProcess/Work geometry mechanism when useful, don't fake with generic crossfade.
3. PROJECTS: Yuna/MGC/Comptoir as three different, stunning magazine double spreads, not repeated hero+caption templates. UGC / social content storytelling clear: purpose, creative choice, role, outcomes only if factual. Photographic project-to-project handoff preferred over fades.
4. EXPERTISE: not a list of seven giant menu links. One selected giant readable term + materially relevant photo study on right + compact seven-item index + short clear explanation. Include 'Création UGC' and 'Community Management' as prominent verified disciplines. Strong on 320px.
5. CONTACT: magazine's back cover, refined invite to collaborate, direct accessible contact. Preserve the sophisticated Existing contact architecture but strengthen visual closure.
6. NAVIGATION: this is a critical repair. Desktop thin, extremely precise editorial issue index (Home, Univers, Projets, Expertise, Contact) and a clear active chapter, high-contrast labels, no clutter. Mobile: ONE readable Index trigger opening an elegant structured sommaire with >=44px targets, escape/focus handling, no five illegible items squeezed into a pill. Nav doesn't collide with locale control or paper captions. A delicate image counterpoint in an index can be used if performance remains smooth.
7. MOTION: GSAP ScrollTrigger with correct cleanup and reverse scrolling, subtle precious highlight, tactile flip/reveal of print, occasional large original morph/typographic mask, not endless fades or flashy spinning 3D. Under reduced motion, design remains impeccable. No text blur at settled frames.

## Allowed dev skills
Read and selectively apply in-repo: .agents/skills/awwwards-animations/SKILL.md; better-typography; modern-web-design; GSAP refs. Also installed Hermes skills awwwards-godmode, editorial-art-direction, jarvis-fusion. DO NOT blindly install frameworks or run generic audit scripts. Only implementation work.

## Workflow / quota discipline
One fusion process orchestrates two connected subscription CLIs: Claude Opus (design & first implementation) THEN Codex GPT-6 Astra (integrate + navigation/expertise + technical fix) operating ON THE SAME worktree. Share diff and a handoff file. No parallel independent branches, mini agents or MoA Anthropic direct API. Direct Claude Code authenticated to claude.ai Pro and Codex authenticated to ChatGPT; no externally billed API keys or openrouter billing.
Do not spend tokens on repeated benchmarking, scoring or auditing. Director ChatGPT does all visual review and corrections after initial output. Every model MUST WRITE CODE, not an essay, without waiting on further direction.
Safety: preserve source branch and original QA WIP; no git reset/clean, no changes to main, no pushing/deploying without explicit go-ahead, no deleting media, no credentials. No new paid services. Do not claim Awwwards award.

## First fusion cycle: scope
Claude: improve opening cover + tactile ActProcess moodboard and its exact handoff to Yuna; improve overall fashion visual hierarchy / critical contrast within owned files. Keep main timeline robust. Briefly write docs/fusion-claude-handoff.md with actual changed files and integration details.
Codex: continue SAME implementation on top of Claude's edits; rebuild BottomNav + responsive mobile Index; strengthen Expertise as editorial hero plus image and relevant UGC/CM copy, refine global text contrast; run typecheck/build once and fix failures. Briefly write docs/fusion-codex-handoff.md. No repeated self-reviews. Favor final visual design and working interactions over commentary.
After both: ChatGPT visually inspects screenshots at 1440/390/320, documents defects, issues targeted correction. This is NOT a release approval.
