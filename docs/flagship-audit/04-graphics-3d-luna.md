## Verdict

**The current 3D does not earn its cost.** It reads as a fixed canvas of moving photo planes: the camera stays at the origin, while each plane’s size is recalculated in proportion to its distance. Depth comes mostly from overlap, rotation and haze. The shader handles image crop, vignette and brown haze; the scene has no modeled paper or meaningful lighting.

The screenshots show the bigger problem: at desktop scroll positions 500 and 1000, and mobile 500 and 1000, canvas images cross over method copy, project titles, the email and footer details. The opening compositions are strong; the later ones lose their reading order. A single, tightly scoped 3D moment could earn its cost if it makes the transition from social content to editorial strategy legible.

## KEEP

- **The story arc and visual language:** the phone, contact sheets, selection and Yuna case study suit Glwadys’s work. The dark palette, typography and tactile imagery make a clear editorial identity.
- **The DOM-first structure:** keep headlines, captions, navigation and contact details in HTML.
- **The continuous phone image handoff:** the phone’s final image and the `screen` plane use the same source. Keep the shared progress value, demand rendering, shared plane geometry, sRGB texture handling, and crop/focus uniforms. These are good foundations for a precise transition.
- **The reduced-motion path:** keep WebGL out of that experience and show a finished composition.

## REMOVE

- **The fixed canvas spanning the experience.** [StageLayer.tsx](/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/StageLayer.tsx) mounts one full-screen canvas and keeps it mounted; [StageLayer.module.css](/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/StageLayer.module.css) fixes it to the viewport. That arrangement allows the screenshot collisions.
- **The flying photo corridor and cross-page planes.** Remove the broad gallery sequence and any plane that continues over unrelated copy or sections. Their movement adds activity without clarifying the work.
- **The eager loading of every scene tier.** [StageCanvas.client.tsx](/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/stage/StageCanvas.client.tsx) preloads tiers 0 and 1; [StageScene.tsx](/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/stage/StageScene.tsx) then loads tiers 0, 1 and 2 in sequence. Load only the media needed for the single transition.

## REBUILD

Scope WebGL to **the phone-to-process handoff** in an ACT 04 container, clipped inside that act. Keep its canvas sticky only while that short scene is active, then unmount it and dispose its resources. Keep text and labels in the DOM above the canvas.

Use a perspective camera with a short, real dolly. Keep plane dimensions stable in world space as depth changes; the current depth-proportional sizing makes the planes retain nearly the same screen size as they move. Limit the scene to four image planes at a time: the phone image, two proofs, and the selected Yuna image. Keep the planes flat and mostly square to camera. A shared, unlit shader is appropriate for photographs; add only subtle paper-edge shading and crop/registration marks.

### Signature payoff: the edit mark

As the phone image fills the view, let it separate into three proof images: the contact sheet, planning grid and a Yuna jewelry image. An **oxblood selection line** travels from crop mark to crop mark, settles on the jewelry frame, and that exact image becomes the Yuna case-study cover. The payoff shows Glwadys’s method: selecting and shaping a story. It can end on the Yuna title rule. Keep the line restrained and graphic, with no particles or glow.

For the handoff, preserve the same source image and crop at both ends, then switch to the DOM cover on the exact matching frame. In the supplied [film.ts](/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/stage/film.ts), the selected raw frame uses the contact-sheet image while the cover uses the Yuna campaign image; matching their rectangles alone can produce an image jump. The excerpt publishes the `screen` anchor, while the `cover` key requests a `cover` anchor with no publisher shown. Confirm that anchor is published by the case-study act.

## Risks to address

- **GPU cost:** the film defines 15 planes and 15 distinct image sources. At 2048 × 2048, one decoded RGBA texture with mipmaps can use roughly 21 MB of GPU memory; 15 square images would approach 320 MB. Actual sizes vary, but the upper bound is material. The desktop DPR cap of 1.75 also means about 3× the pixel fill of DPR 1. Transparent overlapping planes add more fill cost. The demand loop avoids idle rendering; it still renders as scroll invalidates the canvas.
- **Loading and fallback:** the current tier sequence can leave later images waiting behind earlier ones. The capability check covers basic WebGL availability, but the supplied code shows no context-loss recovery or visual error boundary. Keep the DOM/poster visible until the matching texture is ready; swap only on a confirmed frame. Provide the same finished handoff image when WebGL is unavailable, since the phone DOM content currently fades during the transition.
- **Texture lifecycle:** the canvas and its textures remain alive after the scene ends. The texture cleanup also runs on unmount, so a texture resolving after cleanup could escape disposal. A short-lived, act-scoped scene gives disposal a clear boundary.
- **Asset credibility:** the images are cohesive, but the source identifies them as generated and reuses several across acts. Treat them as concept imagery unless they are replaced with Glwadys’s actual project assets; repeated generated imagery weakens case-study evidence.
- **Mobile:** skip WebGL below the desktop breakpoint. Build the same selection beat from static or scroll-driven DOM proofs, with mobile crops and no images crossing text. The supplied mobile screenshots show that fewer planes alone have not solved the overlap.

**Decision:** keep the visual story and the pixel-registered phone handoff; remove the global photo-plane layer; rebuild one local, short WebGL scene around the act of selecting a Yuna image.