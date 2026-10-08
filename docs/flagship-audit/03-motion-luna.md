## Verdict

The narrative has a strong causal spine: a finished image becomes a social world, reveals the planning behind it, becomes a phone screen, then resolves into proofs, a system, and selected work. The shared vertical image from Hero through Phone is the clearest expression of that idea.

The supplied frames show a blocking readability problem. At desktop and mobile scroll positions, process images cross essential copy. In both Contact frames, image fragments cover parts of the name and contact composition. Whether those are settled frames or moments between beats, the composition fails: a visitor should be able to read the page while scrolling through it.

The code also drifts from the motion direction. The direction describes nine pins; the supplied implementation has four pinned triggers: Story, Process, Journey, and Expertise. Story alone spans 8.6 viewport heights on desktop; Process spans 6.35. Together with Journey and Expertise, the pinned portions total about 17.55 viewport heights before the unpinned project and contact reading. The page is likely longer than the documented budget.

## Findings

| Area | Audit |
|---|---|
| **Causality and narrative** | The strongest transitions have a reason: the cover leaves one image behind; the Social section exposes strategy; the phone grows around its screen. Several later motions read as scroll-triggered decoration. The repeated arrival of text and images needs a more specific cause in each chapter. |
| **Transitions and handoffs** | The single vertical media node through Hero, Social, and Phone is a sound continuity device. The phone-to-canvas transition is intended to match geometry, but the supplied code only publishes the screen rectangle as a fractional viewport anchor. The screenshots show process imagery persisting over later content; trace its layer ownership before trusting the later handoffs. |
| **Pinning and scroll** | Four pins cover a very long span. That makes the page feel like one extended scene rather than chapters with distinct reading rhythms. The Process pin also drives a horizontal contact rail on mobile, despite the motion direction calling for a vertical stack. |
| **Reverse scroll and interruption** | Most scene timelines are scrubbed, so their main transformations can reverse. The opening is time-based, though: it unlocks at 2.05 seconds while its composition is still moving, and any key press can unlock it earlier. A scroll at that point can compete with the opening timeline over shared elements. |
| **Resize** | Pin refresh and several tween values are viewport-aware. The opening’s `placeAt` offsets are calculated once, so a resize or orientation change can leave the name and copy misplaced. The canvas DPR is also selected once at mount. Test resize while each pinned scene is active. |
| **Reduced motion** | Lenis and the custom cursor are disabled, and the WebGL layer is not mounted. The supplied JSX also renders reduced presentations alongside animated markup in some acts; the unseen CSS must ensure exactly one version is visible and exposed to assistive technology. |
| **Mobile and touch** | The phone and vertical Journey can work well on touch. The Process rail still moves horizontally on mobile, and the attached mobile frames show text being covered by moving image strips. The bottom navigation also needs a safe-area and reading-clearance check. |
| **Camera and DOM handoff** | The storyboard says the camera travels forward. `StageScene` keeps the camera at the origin and moves planes through depth. That can still feel like passage, but the direction should describe the actual plane movement. The canvas mounts on entering Phone and persists after that; `frameloop="demand"` saves idle frames, while textures and the WebGL context remain resident. |
| **Cursor and performance** | The custom cursor is limited to a fine pointer, hidden during the opening, and uses quick transforms. That is a good baseline. The phone sequence animates `left`, `top`, `width`, device sizing variables, and island width. Those layout-affecting changes are a performance risk during a pinned scroll, especially while screen geometry is read repeatedly for the canvas anchor. |

### Generic reveal patterns to remove

The motion direction rejects generic reveals, but the implementation repeatedly uses the same arrival recipe:

- Headings, descriptions, and case rows use `yPercent` plus `autoAlpha`.
- Image groups reuse clip opening, scale, and stagger across Hero, Process, and Work.
- Process contact plates use opacity and scale as their entry.
- Journey adjusts every entry with scale, opacity, and vertical offset on each update.

Those patterns make different content feel like the same preset. Keep crops and masks where they express selection or framing. Give each chapter a distinct physical action.

## Authored motion grammar

Use five verbs drawn from the work of making a brand story:

1. **Réserver** — A measured media frame opens from a crop. Its aspect ratio stays fixed; a rule or caption identifies its role.
2. **Tirer** — Proofs travel along a deliberate editorial axis. One advances; the rest recede. This is selection, not a carousel.
3. **Annoter** — A note, caption, or rule registers beside the specific proof it explains. It stays attached to that proof as it moves.
4. **Caler** — Fragments settle onto a grid. Their offsets resolve into a system; the audience sees the decision become structure.
5. **Transmettre** — One artifact survives a chapter boundary. It keeps its identity while its crop, scale, or material changes. It is never replaced by a similar duplicate.

Apply these rules throughout:

- Every movement has a visible origin and a narrative reason.
- A scroll-linked animation uses one driver per property and remains reversible.
- Opacity accompanies a crop, mask, or transform; it does not carry a reveal by itself.
- Remove the repeated `y + opacity` entrance from ordinary copy.
- Keep rotations specific to collage moments; Yuna stays still and Comptoir gets one macro movement.
- Preserve a quiet hold before and after each major transformation.

## Chapter choreography

| Chapter | Choreography | Handoff |
|---|---|---|
| **00 — Opening** | **Réserver.** The name closes from dispersed tracking into a stable editorial lockup. Two or four fragments establish the notebook’s material. Treat the opening as one authored sequence. | It is already the Hero composition; no second entrance. |
| **01 — Hero** | **Transmettre.** The cover opens into a page; the 9:16 image survives while the name and supporting matter move to their cover positions. Keep the static hero legible and composed. | The same image becomes the Social focal plate. |
| **02 — Social** | **Tirer, Annoter.** Establish one dominant plate, then supporting proofs. Reveal planning and direction only after the finished content has been read. Make the front-to-behind change a crop and layer exchange with an identifiable source. | One vertical plate remains and becomes the phone screen. |
| **03 — Phone** | **Réserver, Transmettre.** Build the frame around the existing image. The media remains geometrically stable as the bezel and corners form. Sequence distinct content beats; the direction specifies five desktop beats and four mobile beats, while the supplied implementation derives the count from content and its comment says four. Settle that count. | Hold the last screen frame, then expand it into the next scene. |
| **04 — Immersion** | **Tirer.** Separate a small number of image planes, pass them once, then flatten them. Keep the movement plane-led, as the code currently implements it. Avoid extra pointer movement or a long 3D corridor. | The flattened image composition becomes the Process proof sheet. |
| **05a — Contact sheet** | **Tirer.** Move proofs past a clear reading edge. Let the viewer see several candidates before one is chosen. On mobile, use a vertical stack with native scrolling. | One selected proof advances. |
| **05b — Moodboard and system** | **Caler.** Let the selected proof and supporting fragments register against the brand grid. This is the chapter for a clear irregular-to-aligned transformation. | The aligned system remains visible as evidence for the method. |
| **05c — Strategy** | **Annoter.** Present the six stages as a paced typographic sequence. Keep the evidence image tied to the active stage and make the final campaign proof the bridge into Yuna. | The campaign proof becomes the first Yuna image. |
| **06 — Selected work** | Give each project its own action. **Yuna:** a careful recrop and quiet hold. **MGC:** a brief collage that registers to its background grid. **Comptoir:** one slow macro move with stable type. Keep case-study copy readable throughout; remove the shared reveal preset. | Pass a selected proof into the Journey sequence. |
| **07 — Journey** | **Tirer.** Keep the playhead fixed. Move years through it and reveal one proof when an entry reaches the marker. Leave nonactive entries stable; avoid making every item continuously scale and fade. | The final entry carries into the Expertise page. |
| **08 — Expertise** | **Caler.** Let one term push the preceding term through a vertical mask. Provide enough dwell time to read all seven entries. Touch users should get the same context without hover. | The index sheet contracts to the Contact page margins. |
| **09 — Contact** | **Transmettre.** Land on a still, clear final page. The name, statement, email, and links must be unobscured. If the navigation becomes the CTA, transform its existing capsule as one element. | End on the page; preserve a direct route back to the opening. |

## Acceptance tests

1. **Frame legibility:** At 1440×900 and 390×844, capture every pinned timeline at 0%, 10%, … 100%, then at every chapter boundary. Essential headings, case copy, email, and CTA must remain unobscured and readable in every frame. No process image may cover Contact content.

2. **Handoff continuity:** At each named handoff, compare the outgoing and incoming frame. The shared artifact must remain the same content and crop; its boundary may shift by at most 2 CSS pixels between the last outgoing and first incoming frame. There must be no blank, black, or duplicate frame.

3. **Reverse-scroll determinism:** At 0%, 25%, 50%, 75%, and 100% of each scrubbed pin, reverse through the same positions. Each position must return to the same composition within 2 CSS pixels. No stale active labels, hidden copy, or stranded layers may remain.

4. **Opening interruption:** Start scrolling, press a navigation key, and tap during the opening at 250 ms, 1 second, and 2 seconds. Input must either skip cleanly to the finished Hero and release scroll, or queue until the opening completes. No input may unlock a still-moving composition. With no input, scroll must be available by 2.4 seconds.

5. **Resize in progress:** At 390×844, 768×1024, and 1440×900, resize or rotate halfway through Story, Process, and the phone-to-canvas handoff. Progress must remain within 1% of its prior value; the shared screen anchor must remain within 2 CSS pixels; there must be no horizontal page overflow or missing media.

6. **Reduced motion:** Load with reduced motion enabled, then enable it halfway through Journey. Lenis, pins, pointer parallax, custom cursor, and WebGL must be absent. All content and links must remain available. Exactly one visible and accessible presentation of each chapter may be present.

7. **Touch navigation:** At 375, 390, and 430 CSS pixels wide, swipe through every chapter using short and long vertical gestures. No chapter may trap touch in a horizontal rail. The Process sequence must stack vertically. The fixed navigation must not cover text or links, including at the bottom safe area.

8. **Performance trace:** On a desktop fine pointer and a current mobile device, record a 10-second scroll through Story and Process. Target at least 55 fps average with no frame longer than 100 ms. After 250 ms without scroll, the demand-driven canvas must render zero frames per second. The trace must show no repeated layout work caused by animating `left`, `top`, or `width`.

9. **WebGL failure and readiness:** Test with WebGL unavailable and with media loading delayed. The DOM composition must carry the complete story. During the handoff, the visitor must never see a blank frame while the canvas initializes or a texture arrives.

10. **Cursor response:** On a fine pointer, move between plain text, a media item, and a link. The cursor must select the intended state and come within 8 pixels of the pointer within 200 ms. On touch and reduced motion, no custom cursor may appear.

The immediate repair is the image and copy overlap at the sampled Process and Contact positions. The Hero framing and the persistent image-to-phone transition are the strongest pieces to retain as the rest of the chapters are brought under one grammar.