# Storyboard — Greenfield V2

## Opening

**Visual**
- Void dark grain.
- Small uppercase metadata: "PORTFOLIO 2026" and "MARSEILLE".
- "GLWADYS DALLEAU" in small, centered.

**Action**
- Page loads directly, no generic loader.

**Motion**
- Type fades in with slight Y translation.
- After a short hold, one image enters from the left, one from the right.
- Portrait appears center.
- Desktop: subtle mouse parallax via gsap.quickTo.

**Transition Out**
- The media pieces reposition to assemble the Hero cover.
- Name scales up. Type becomes headline.

## Hero (Magazine Cover)

**Visual**
- Fullscreen composition.
- Top: "GLWADYS".
- Center: portrait or editorial image.
- Bottom: "DALLEAU".
- Headline overlaid: "Je transforme les marques en histoires dont on se souvient."
- Tiny metadata: SOCIAL MEDIA / CONTENT / BRAND, MARSEILLE — FR.

**Motion**
- Media and type settle into final cover.
- Bottom nav capsule appears.

**Transition Out — Hero Shrink**
- Pinned ScrollTrigger.
- The whole cover scales down from 100vh to ~60–70% of viewport.
- Background becomes visible around it (slight ivory tint).
- Portrait recrops. Satellites move away.
- Sensation: leaving the cover, entering the magazine.

## Story / Social World

**Visual**
- Hero media survives and becomes a vertical 9:16 Story in the center.
- Other media enter as social posts, stories, reels around it.

**Motion**
- Shared media: portrait crop to 9:16.
- Surrounding media float in, creating an editorial social world.
- Desktop: subtle parallax on Z-layers.

**Transition Out — Phone Birth**
- All other media exit.
- The 9:16 Story stays centered.
- A phone bezel / frame / buttons / island build around the Story.
- It becomes a phone screen.

## Phone Pin

**Visual**
- Phone is pinned and centered.
- It does not scroll physically.

**Motion (scroll-driven timeline)**
- FEED: content scrolls inside phone.
- POST: one post becomes focus.
- STORY / REEL: vertical transition.
- CAMPAIGN: media starts leaving the phone.

**Transition Out — Phone Portal**
- Phone perfectly frontal.
- Screen scales up to 100vw/100vh.
- Bezel exits viewport.
- Traverse the screen into local WebGL.

## Local WebGL Cinematic

**Visual**
- One local Canvas mounts.
- Media planes at different Z depths: portrait foreground, story midground, reel/campaign background.
- Typography plane.
- Second image plane.

**Motion**
- Camera moves primarily in Z.
- Slight X/Y influence on desktop from mouse.
- Close images move fast, far images slow.

**Transition Out — WebGL → DOM**
- Planes slow, depth converges.
- Z differences diminish.
- DOM Contact Sheet matches the final 2D composition.
- Canvas disposes and unmounts.

## Contact Sheet

**Visual**
- Return to 2D.
- Editorial editing table with photos of varying sizes.
- Optional annotations: SELECT, CROP, TONE, MESSAGE only if meaningful.

**Motion**
- Horizontal image track.
- Images settle like a contact sheet.

**Transition Out — Moodboard**
- Images group via GSAP Flip or transform.
- Palette, font, tone, copy, messaging, references appear.

## Moodboard → Brand

**Visual**
- The chaos begins to structure.
- Rotations reduce, spacing becomes intentional, images align.
- Typography becomes a system.

**Motion**
- Tighten and align.

**Transition Out — Strategy**
- Background shifts to ivory.
- Composition becomes frontal.

## Strategy

**Visual**
- Pinned horizontal track.
- Large typography only: AUDIENCE, POSITIONING, TONE, CONTENT, PLANNING, CAMPAIGN.
- Peu de texte.

**Motion**
- Vertical scroll drives X.

**Transition Out**
- Last word exits. Scene opens into Yuna.

## Yuna

**Visual**
- Fashion, jewelry, elegant, social, clean.
- Large images, macro product, vertical content, fine type.

**Motion**
- Mask/crop reveals.
- Shared media transition from Strategy: one image becomes the first Yuna image.

**Transition Out — Yuna → MGC**
- Last Yuna media changes crop, ratio, rotation, position.
- Becomes first MGC image.
- Second and third MGC images enter.
- Composition shifts from elegant to scrapbook.

## MGC

**Visual**
- Community, human, event, energy, scrapbook.
- Paper textures, overlaps, tiny rotations, typography fragments.

**Motion**
- Compact → expansion → overlap → recomposition.
- Optional local Draggable if justified.

**Transition Out — MGC → Comptoir**
- One media becomes fullscreen.
- Palette shifts to cream, brown, chocolate.

## Comptoir

**Visual**
- Calm. Very large images, packaging, texture, product.

**Motion**
- One signature animation only: macro zoom, product parallax, or texture reveal.

**Transition Out — Journey**
- Image recedes. Timeline begins.

## Journey

**Visual**
- Editing-timeline, not corporate.
- Fixed playhead. Years pass underneath: 2021, 2022, 2023, 2024, 2025, 2026.
- When a year hits the playhead, media and role change.

**Motion**
- Years translate horizontally.
- Pinned playhead.

**Transition Out — Expertise**
- Timeline fades. Big typography enters.

## Expertise (Kinetic Type)

**Visual**
- Services listed in large type.
- SOCIAL MEDIA MANAGEMENT, CONTENT CREATION, etc.
- No cards.

**Motion**
- One term active at a time.
- Next pushes / masks / replaces the previous.
- Optional small contextual media.

## Final Nav Callback

**Visual**
- Everything else calms.
- Bottom nav capsule rises.
- It stretches.
- Items recompose into the final CTA:
  "GLWADYS DALLEAU" / "LET'S WORK TOGETHER" (FR equivalent).
- Email, LinkedIn below.

**Motion**
- The nav itself becomes the CTA.
- Full circle: nav was born in Hero, now closes the story.

## Footer

**Visual**
- Very calm, almost static.
- Small legal, credits.

**Motion**
- Minimal.
