# Creative Direction — Greenfield V2

## Big Idea

A cinematic, editorial, one-scroll fashion film for Glwadys Dalleau.
The site reads as a magazine cover that opens into a story, dives into the social world, becomes a phone, crosses through a spatial portal, reveals the creative process, visits three client universes, traces a personal journey, declares expertise, and ends with a calm call to action.

## Visual Language

- Fashion editorial, digital magazine, brand story.
- Asymmetric compositions with heavy display type and fine metadata.
- Layered Front / Behind: the public content and the strategy behind it.
- Generous negative space, no clutter.
- No SaaS, no bento, no glass overload, no random 3D, no purple gradients.

## Typography

- Display: General Sans / Satoshi for giant words.
- Editorial serif (optional): Baskervville / Source Serif 4 for fragments.
- Body: Inter / Plus Jakarta Sans.
- Micro: JetBrains Mono / IBM Plex Mono for years, captions, coordinates.
- Korean: Pretendard / Noto Sans KR with word-break: keep-all.

## Colors

| Name | Value | Usage |
| :-- | :-- | :-- |
| Obsidian | #0B0B0B | Void background |
| Warm Ivory | #F7F2EA | Strategy, Comptoir, light moments |
| Champagne | #DDCBA8 | Accent, lines, active pills |
| Espresso | #1E1812 | Deep panels |
| Muted Clay | #A85D4C | Accent only |

No gradient backgrounds. No neon.

## Materials & Texture

- Subtle film grain overlay.
- Paper texture for MGC scrapbook.
- Restricted glass: nav and tiny metadata only.

## Image Treatment

- Real photography only.
- Glwadys portrait: editorial, central.
- Yuna: clean, macro, elegant.
- MGC: candid, sun-bleached, human.
- Comptoir: creamy, chocolate, tactile.

## Layout Language

- Asymmetric, intentional.
- Negative space is material.
- No centering by default.
- Strict z-layers: background, content, narrative, overlay, nav, modal, cursor.

## Motion Language

### Primary Mechanics

1. Shared media transformation: one image/crop becomes the next scene.
2. Pinned editorial storytelling: major moments stay while scroll drives the timeline.
3. Local WebGL cinematic: one short spatial sequence, then unmount.

### Secondary Mechanics

1. Mask / crop reveals.
2. Horizontal image tracks.
3. Kinetic typography.

### Easing & Timing

- Easing: power3.out, power4.inOut, sine.inOut, expo.out.
- No bounce, elastic, spring.
- Micro 150–300ms, UI 300–500ms, major 500–900ms, stagger 0.03–0.08s.
- Feel: fast, snappy, precise. Not floaty.

## 3D Rules

- No global Canvas.
- No persistent WebGL.
- One main local WebGL sequence: phone portal.
- Optional second: CSS 3D / WebGL spatial gallery.
- Mount, play, exit, dispose.

## Navigation

- Bottom capsule: GD, Work, Journey, Expertise, Contact + language switch.
- Hidden during opening, appears with Hero.
- Becomes the final CTA callback.

## Pacing

| Beat | Feel | Intensity |
| :-- | :-- | :-- |
| Opening | curiosity | medium |
| Hero | identity | high |
| Hero Shrink | surprise | high |
| Phone | immersion | high |
| WebGL | wow | peak |
| Contact Sheet | creativity | medium |
| Strategy | mastery | medium |
| Yuna | elegance | medium-high |
| MGC | energy | high |
| Comptoir | calm | low |
| Journey | progression | medium |
| Expertise | impact | high |
| Contact | calm | low |

## Quality Tiers

- HIGH: desktop / good GPU. Local WebGL, DPR ~1.25.
- MEDIUM: touch / mid GPU. Simplified WebGL, DPR 1.0.
- SAFE: reduced motion / low-end. DOM only, no WebGL, no heavy motion.

## Mobile

- Designed separately.
- Fewer medias in opening.
- No mouse parallax.
- Shorter pins.
- WebGL simplified or replaced.
- Bottom nav thumb-friendly.
